'use strict';

let fs=require('fs');

let gcFileHandler=require('./handler/gcFileHandler');
let perfFileHandler=require('./handler/perfFileHandler');
let dalFileHandler=require('./handler/dalFileHandler');
let memcachedHandler=require('./handler/memcachedHandler');
let redisFileHandler=require('./handler/redisFileHandler');

let sendJson=require('../tcpService/sendJson');
let sendStream=require('../tcpService/sendStream');

//读取文件增加文件  sb('fileService/readFileContent.js',13)
function readIntrFileStr(fd,len,preOffset,bufSize){
  return new Promise(function(resolve,reject){
    var buf=new Buffer(bufSize);

    fs.read(fd,buf,0,len,preOffset,function(err,bytesRead,buffer){
      if (err){
        reject(new Error("readIntrFileStr is wrong.fd="+fd+",len="+len+",preOffset="+preOffset));
      }else{
        let result=buffer.slice(0,len);
        resolve(result.toString('utf8'));
      }
    });
  });
}

/**
 * 读取文件内容
*/
function* sendFileContent(info){               
  //从文件中读取新增字符串  sb('fileService/readFileContent.js',13)
  let intrFileStr=yield readIntrFileStr(info.fd,info.len,info.preOffset,info.bufSize);

  console.log(intrFileStr);
  
  //发送不同类别服务器
  let sendServer=info.sendBy==='stream'?sendStream:sendJson;
  
  let fn=undefined;
  //处理字符串
  switch (info.type){
    case 'perf':return sendServer(intrFileStr);
    case 'memcached':return sendServer(memcachedHandler(intrFileStr,info));
    case 'dal': return sendServer(dalFileHandler(intrFileStr,info));
    case 'gc': return sendServer(gcFileHandler(intrFileStr,info));
    case 'redis': return sendServer(redisFileHandler(intrFileStr,info));
    case 'rpc':fn=dalFileHandler;break;
  }
}

module.exports=sendFileContent;
