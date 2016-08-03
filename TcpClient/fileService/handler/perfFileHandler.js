'use strict';

let MIN_LIMIT=require('../../../config').MIN_LIMIT; 

function perfFileHandler(str){
  var result=[],rtn,i=0;
  var date=new Date(),
    dateStr=date.toLocaleDateString(),
    h=date.getHours(),m=date.getMinutes(),s=date.getSeconds(),  
    timeStr=h+":"+m+":"+s,
    timeS=m+":"+s+"_";

  //正则表达式
  var reg=/\|Y\|(\d+)\|(GET|POST)\|\/(\w+)(\/\w+\/\w+)/mg;
  while((rtn=reg.exec(str))!=null){
    if (rtn[1]>=MIN_LIMIT){
      
      result.push({
        "x":timeStr,
        'y':rtn[1],
        'z':'perf_'+rtn[3],
        'l':'ms',
        'r':'date',
        't':rtn[2]+rtn[4]
      });
      
      if (i!=0){
        timeStr=timeS+i;
      }
      i++;
    }
  }
  
  return JSON.stringify(result);
}

module.exports=perfFileHandler;
