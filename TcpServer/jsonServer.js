'use strict';

let net = require('net');
let config = require('../Common/config');
let PORT_FOR_JSON = config.TCP_SERVER_FOR_JSON.PORT;
let IP_FOR_JSON = config.TCP_SERVER_FOR_JSON.IP;
let PROTOCOL_PARTITION = config.PROTOCOL_PARTITION;

function makeChild() {
    let child = child_process.fork('jsonChild.js',[],{encoding: 'utf8'});
    return child;
}

let child_1 = makeChild();

let index = 0;
function selectChild() {
   return child_1;
}

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

      let data = buffer.toString('utf8');
      if (data.startsWith(PROTOCOL_PARTITION)) {
        let tmpData = buf[identify];
        let child = selectChild();
        child.send(tmpData);

        let tmp_buf = [];
        tmp_buf.push(data);
        buf[identify] = tmp_buf;
      } else {
        buf[identify].push(data);
      }
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
      console.log(socket.remoteAddress + ':' + socket.remotePort + ',connect is end');
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