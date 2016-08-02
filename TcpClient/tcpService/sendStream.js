'use strict';

let zlib = require('zlib');

let net = require('net');
let config = require('../../Common/config.json');
let SERVER_CONFIG = config.TCP_SERVER_FOR_STREAM;
let PROTOCOL_PARTITION = config.PROTOCOL_PARTITION;

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

let logSys = require('../../Common/log').logSys;
//连接次数记录
let connectTimes = 0;
let client = undefined;

/*
 *创建TCP客户端，连接IP和PORT
 */
function connectStreamServer() {
  randomIP();

  //connectServer start
  logSys.info('connectStreamServer is starting');

  client = new net.Socket();
  client.setEncoding('utf8');

  //立即发送
  client.setNoDelay(true);

  //连接服务器，如果多次失败则程序终止
  client.connect(PORT, IP, () => {
    //连接置0
    connectTimes = 0;
    logSys.info('stream client is connect,port=' + PORT + ',ip=' + IP);
  });

  //连接次数记录
  if (connectTimes++ > 4) {
    logSys.warn('stream client connect timeS beyond 3 times,process is exit');
    //process.exit(0);
  }

  //连接结束
  client.on('end', () => {
    client = undefined;
    logSys.warn('stream client connect is end');
  });

  //连接关闭
  client.on('close', () => {
    client = undefined;
    logSys.warn('stream client connect is close');
  });

  //处理错误
  client.on('error', function (err) {
    connectTimes++;
    logSys.warn('error:' + err);

    //下一次重试时间
    setTimeout(connectStreamServer, 60000 * (connectTimes << 3))
  });
}

/**
 *发送数据
 */
function sendStream(data) {
  if (!client) {
    connectStreamServer();
    logSys.info('stream client missing data:' + data);
    return;
  }

  // //数据压缩
  // zlib.deflate(data, function (err, buffer) {
  //   if (!err) {
  //     console.log(buffer.toString('base64'));
  //   }

  //   //发送
  //   client.write(buffer);
  // });
  client.write(PROTOCOL_PARTITION);
  client.write(data);
}

/**
 *启动时连接
*/
connectStreamServer();

module.exports = sendStream;

