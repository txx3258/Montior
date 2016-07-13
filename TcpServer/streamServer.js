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
        let buf = {};
        //接受数据
        let identifyMap = {};
        socket.on('data', function (buffer) {
            let identify = socket.remoteAddress + '_' + socket.remotePort;
            identifyMap[identify]=new Date().getTime();

            let id_buf = buf[identify];
            if (!id_buf) {
                id_buf = [];
                buf[identify] = id_buf;
            }

            id_buf.push(buffer);
            socket.emit('done');
        });

        //处理数据
        socket.on('done', function () {
            //console.log(JSON.stringify(buf));
            let now = new Date().getTime();
            Object.keys(identifyMap).forEach((key)=>{
                if (now-identifyMap[key]>2000){
                    console.log(buf[key].join('').toString('utf8'));
                    buf[key]=[];
                }
            });
            console.log('\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n');

            // 单线程能确保安全性
            //buf = {};
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

