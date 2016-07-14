'use strict';

let net = require('net');
let PORT_FOR_JSON = require('../Common/config').TCP_SERVER_FOR_JSON.PORT;
let IP_FOR_JSON = require('../Common/config').TCP_SERVER_FOR_JSON.IP;
let mongoWrap = require('./handler/mongoWrap');

function createJsonServer() {
  let server_for_json = net.createServer(function (socket) {
    socket.setEncoding('utf8');

    //暂存Buffer
    let buf = {};

    //接受数据
    socket.on('data', function (buffer) {
      let identify = socket.remoteAddress + '_' + socket.remotePort;

      let id_buf = buf[identify];
      if (!id_buf) {
        id_buf = [];
        buf[identify] = id_buf;
      }

      id_buf.push(buffer);
      // console.log(buffer);

      //事件机制，写入数据库同时接收数据
      socket.emit('done');
    });

    //处理数据
    socket.on('done', function () {

      //添加到数据库
      //mongoWrap(buf);
      console.log(JSON.stringify(buf));

      // 单线程能确保安全性
      buf = {};
    });

    //结束
    socket.on('end', function () {
      console.log(socket.remoteAddress + ':' + socket.remotePort+',connect is end');
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