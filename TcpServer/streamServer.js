'use strict';

let child_process = require('child_process');
let net = require('net');
let config = require('../Common/config');
let PORT_FOR_STREAM = config.TCP_SERVER_FOR_STREAM.PORT;
let IP_FOR_STREAM = config.TCP_SERVER_FOR_STREAM.IP;
//let addDB = require('./mongoService/op').addDB;
let PROTOCOL_PARTITION = config.PROTOCOL_PARTITION;
//协议分割字符串长度
let PROTOCOL_LEN = PROTOCOL_PARTITION.length;

function makeChild() {
    let child = child_process.fork('streamChild.js', [], { encoding: 'utf8' });
    return child;
}

let child_1 = makeChild();
let child_2 = makeChild();
let child_3 = makeChild();

let index = 0;
function selectChild() {
    index++;

    if (index % 3 == 0) {
        return child_1;
    }
    if (index % 3 == 1) {
        return child_2;
    }
    if (index % 3 == 2) {
        return child_3;
    }
}

function createStreamServer() {
    let server_for_stream = net.createServer(function (socket) {
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
                if (PROTOCOL_LEN == data.length) {
                    return;
                }

                if (id_buf.length > 0) {
                    let child = selectChild();
                    child.send(id_buf);
                }

                let tmp_buf = [];
                tmp_buf.push(data.substring(PROTOCOL_LEN));
                buf[identify] = tmp_buf;
            } else {
                buf[identify].push(data);
            }
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

