'use strict';

let zlib = require('zlib');

let net = require('net');
let IP = require('../../Common/config.json').TCP_SERVER_FOR_STREAM.IP;
let PORT = require('../../Common/config.json').TCP_SERVER_FOR_STREAM.PORT;

let logSys = require('../../Common/log').logSys;
//连接次数记录
let connectTimes = 0;
let client = undefined;

/*
 *创建TCP客户端，连接IP和PORT
 */
function connectStreamServer() {
  //connectServer start
  logSys.info('connectStreamServer is starting');

  client = new net.Socket();
  client.setEncoding('utf8');

  //连接服务器，如果多次失败则程序终止
  client.connect(PORT, IP, () => {
    //连接置0
    connectTimes = 0;
    logSys.info('stream client is connect,port=' + PORT + ',ip=' + IP);
  });

  //连接次数记录
  if (connectTimes++ == 4) {
    logSys.info('stream client connect timeS beyond 3 times,process is exit');
    process.exit(0);
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
  client.write('~!@#$%^&*()_+');
  client.write(data);
}

/**
 *启动时连接
*/
connectStreamServer();

module.exports = sendStream;

