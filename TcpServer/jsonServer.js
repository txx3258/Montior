'use strict';

let net = require('net');
let PORT_FOR_JSON = require('../Common/config').TCP_SERVER_FOR_JSON.PORT;
let IP_FOR_JSON = require('../Common/config').TCP_SERVER_FOR_JSON.IP;
let mongoWrap = require('./handler/mongoWrap');

function createJsonServer() {
  let server_for_json = net.createServer(function (socket) {
    socket.setEncoding('utf8');

    //暂存Buffer
    let buf = [];

    //接受数据
    socket.on('data', function (buffer) {
      buf.push(buffer);
      console.log(buffer);

      //事件机制，写入数据库同时接收数据
      socket.emit('done');
    });

    //处理数据
    socket.on('done', function () {
      if (buf.length == 0) {
        return;
      }

      //添加到数据库
     mongoWrap(buf.join('').toString());
     
      // 单线程能确保安全性
      buf = [];
    });

    //结束
    socket.on('end', function () {
      console.log('connect is end');
    });

    //错误处理,2秒后重启
    socket.on('error', function () {
      setTimeout(function () {
        createJsonServer();
      }, 2000);
    });

  });

  server_for_json.listen(PORT_FOR_JSON, IP_FOR_JSON);
}

createJsonServer();