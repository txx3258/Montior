'use strict';

let fs = require('fs');
let BUFSIZE = require('../../config').BUF_SIZE;

let gcFileHandler = require('./handler/gcFileHandler');
let perfFileHandler = require('./handler/perfFileHandler');
let dalFileHandler = require('./handler/dalFileHandler');
let memcachedHandler = require('./handler/memcachedHandler');
let redisFileHandler = require('./handler/redisFileHandler');

let sendJson = require('../tcpService/sendJson');
let sendStream = require('../tcpService/sendStream');

//读取文件增加文件  sb('fileService/readFileContent.js',13)
function readIntrFileStr(fd, len, preOffset, bufSize, timeOut) {
  return new Promise((resolve, reject) =>{
    var buf = new Buffer(bufSize);

    setTimeout(()=> {
      fs.read(fd, buf, 0, len, preOffset, (err, bytesRead, buffer)=> {
        if (err) {
          reject(new Error("readIntrFileStr is wrong.fd=" + fd + ",len=" + len + ",preOffset=" + preOffset));
        } else {
          let result = buffer.slice(0, len);
          resolve(result);
        }
      });
    }, timeOut);
  });
}

/**
 * 读取文件内容
*/
function* sendFileContent(info) {
  //从文件中读取新增字符串  sb('fileService/readFileContent.js',13)
  let intrFileStr = '';
  let bufSize = info.bufSize;

  if (info.len <= bufSize) {
    intrFileStr = yield readIntrFileStr(info.fd, info.len, info.preOffset, bufSize, info.timeOut);
  } else {
    //向上取整
    let len = Math.ceil(info.len / bufSize);
    for (let i = 0; i < len - 1; i++) {
      intrFileStr += yield readIntrFileStr(info.fd, bufSize, info.preOffset + (i * bufSize), bufSize, info.timeOut);
    }

    let lastLen = info.len - (len - 1) * bufSize;
    let lastOffset = info.preOffset + (len - 1) * bufSize;
    intrFileStr += yield readIntrFileStr(info.fd, lastLen, lastOffset, bufSize, info.timeOut);
  }

//  console.log(intrFileStr);

  //发送不同类别服务器
  let sendServer = info.sendBy === 'stream' ? sendStream : sendJson;

  let fn = undefined;
  //处理字符串
  switch (info.type) {
    case 'perf': return sendServer(perfFileHandler(intrFileStr));
    case 'memcached': return sendServer(memcachedHandler(intrFileStr.toString(), info));
    case 'dal': return sendServer(dalFileHandler(intrFileStr.toString(), info));
    case 'gc': return sendServer(gcFileHandler(intrFileStr.toString(), info));
    case 'redis': return sendServer(redisFileHandler(intrFileStr.toString(), info));
    case 'rpc': fn = dalFileHandler; break;
  }
}

module.exports = sendFileContent;
