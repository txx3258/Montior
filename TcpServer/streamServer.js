'use strict';

let net = require('net');
let PORT_FOR_STREAM = require('../Common/config').TCP_SERVER_FOR_STREAM.PORT;
let IP_FOR_STREAM = require('../Common/config').TCP_SERVER_FOR_STREAM.IP;
//let addDB = require('./mongoService/op').addDB;
let zlib = require('zlib');

function createStreamServer() {
    let server_for_stream = net.createServer(function (socket) {
        socket.setEncoding('utf8');

        //暂存Buffer
        let buf = [];

        //接受数据
        socket.on('data', function (buffer) {
            buf.push(buffer);

            socket.emit('done');
        });

        //处理数据
        socket.on('done', function () {
            if (buf.length == 0) {
                return;
            }

             zlib.unzip(buf.join(''), function (err, data) {
                if (!err) {
                    console.log(data.toString());
                }
                
                //console.log(buffer);
                //事件机制，写入数据库同时接收数据    
            });   
            //添加到数据库
            //addDB(buf);

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
                createStreamServer();
            }, 2000);
        });
    });

    server_for_stream.listen(PORT_FOR_STREAM, IP_FOR_STREAM);
}

createStreamServer();

