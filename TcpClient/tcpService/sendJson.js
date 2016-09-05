'use strict';

//let zlib=require('zlib');
let net = require('net');
let client = undefined;
let logSys = require('../../Common/log').logSys;

let config = require('../../config.json');
let SERVER_CONFIG = config.TCP_SERVER_FOR_JSON;
let S_PROTOCOL_PARTITION = '~!@#$%^&*()_+';
let IP = undefined;
let PORT = undefined;

//随机选择机器
function randomIP() {
  let hostIPLen = SERVER_CONFIG.length;
  let random = Math.floor(Math.random(47)*hostIPLen);

  let times = 10,_ip,_port;
  while((times--)>=0){
    _ip = SERVER_CONFIG[random].IP;
    _port = SERVER_CONFIG[random].PORT;

    if (_ip!=IP){
      break;
    }
  }

  IP = _ip;
  PORT = _port;
}
// let IP = config.TCP_SERVER_FOR_JSON.IP;
// let PORT = config.TCP_SERVER_FOR_JSON.PORT;

//连接次数记录
let connectTimes = 0;

/*
 *创建TCP客户端，连接IP和PORT
 */
function connectJSONServer() {
  randomIP();
  //connectServer start
  logSys.info('connectJsonServer is starting');

  client = new net.Socket();
  client.setEncoding('utf8');

  //立即发送
  client.setNoDelay(true);

  //连接服务器，如果多次失败则程序终止
  client.connect(PORT, IP, () => {
    //连接置0
    connectTimes = 0;
    logSys.info('client is connect,port=' + PORT + ',ip=' + IP);
  });

  //连接次数记录
  if (connectTimes++ >4 ) {
    logSys.warn('connect timeS beyond 3 times,process is exit');
    //process.exit(0);
  }

  //连接结束
  client.on('end', () => {
    client = undefined;
    logSys.warn('connect is end');
  });

  //连接关闭
  client.on('close', () => {
    client = undefined;
    logSys.warn('connect is close');
  });

  //处理错误
  client.on('error', function (err) {
    client = undefined;
    connectTimes++;
    logSys.warn('error:' + err);

    //出现错误，下次重启时间
    setTimeout(connectJSONServer, 60000 * (connectTimes << 3))
  });
}

/**
 *发送数据
 */
function sendJson(data) {
  if (!client) {
    connectJSONServer();
    logSys.info('missing data:' + data);
    return;
  }

  client.write(S_PROTOCOL_PARTITION);
  //发送
  client.write(data);
}

/**
 *启动时连接
*/
connectJSONServer();

module.exports = sendJson;

