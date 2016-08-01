#!/bin/bash
#define shell script before do start action

#Get package directory
SCRIPT_PATH=`which $0`
ROOT_DIR=`dirname $(which $0)`

PID_JSON `ps -ef|grep node|grep jsonServer.js|awk '{print $2}'`
PID_STREAM `ps -ef|grep node|grep streamServer.js|awk '{print $2}'`

echo -e "Kill PID_JSON=$PID_JSON,PID_STREAM=$PID_STREAM"
if [[ "$PID_JSON" !=  ""]]||[["$PID_STREAM" !=  "" ]] ;then
  kill ${PID_JSON}
  kill ${PID_STREAM}

  for ((i=1;i<=20;i++))
	do
	  sleep 1;
	  echo -e "Wait for Exit (${i}s)."
	
	  if [[ $(ps -fp ${PID_JSON} 2>/dev/null | grep -c 'jsonServer') -eq 0 ]]&&[[ $(ps -fp ${PID_STREAM} 2>/dev/null | grep -c 'streamServer') -eq 0 ]];then
		echo -e "Success Kill PID_JSON=$PID_JSON,PID_STREAM=$PID_STREAM Done."
		break;
	  fi	
  done
fi
