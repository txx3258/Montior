'use strict';

let net = require('net');
let config = require('../config');
let strategy = require('./strategy');

let conf = require('./config');

//协议分割
let PROTOCOL_PARTITION = conf.PROTOCOL_PARTITION;
//协议分割字符串长度
let PROTOCOL_LEN = PROTOCOL_PARTITION.length;

let times=0;
/**
 * 
 */
function createServer(type) {
    let server = strategy.selectIp(type);
    if (!server){
        console.warn('server ip config is wrong!type='+type);
        return;
    }

    strategy.makeChild(server,type);
    net.createServer(function (socket) {
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

            let data = buffer.slice(0,PROTOCOL_LEN).toString('utf8');
            if (data.startsWith(PROTOCOL_PARTITION)) {

                if (id_buf.length > 0) {
                    let child = strategy.selectChild(identify,type);
                    let result = {
                        "ipPort":identify,
                        "data":id_buf
                    }
                    child.send(result);

                    //计数
                    process.send({type:type,times:++times,action:'count'});
                }

                let tmp_buf = [];
                tmp_buf.push(buffer);
                buf[identify] = tmp_buf;
            } else {
                buf[identify].push(buffer);
            }
        });

        //结束
        socket.on('end', function () {
            console.log('connect is end');
        });

        //错误处理,2秒后重启
        socket.on('error', function () {
            process.send({type:type,action:'error'});
        });
    }).listen(server.PORT, server.IP);
}

createServer(process.argv[2]);

//父子进程通信出路
process.on('message', function(m) {
    if (m.action=='heart'){
        process.send(m);
    }
});
