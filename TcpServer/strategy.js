'use strict';

let config = require('../config');
let child_process = require('child_process');
let STREAM_CHILED_NUM = 1;
let JSON_CHILED_NUM = 1;

/**
 * 选择配置文件中IP与机器IP一致
 */
function selectIp(type) {
    let os = require('os');
    let ips = os.networkInterfaces();
    let servers = undefined;
    if (type=='stream'){
        servers = config.TCP_SERVER_FOR_STREAM;
        servers.map((item)=>{
            item["SRC"]="./TcpServer/streamChild.js";
            item["CHILD_NUM"]= STREAM_CHILED_NUM;
            return item;
        })
    }else{
        servers = config.TCP_SERVER_FOR_JSON;
        servers = servers.map((item)=>{
            item["SRC"]="./TcpServer/jsonChild.js";
            item["CHILD_NUM"]= JSON_CHILED_NUM;
            return item;
        })
    }
   

    let result = undefined;
    Object.keys(os.networkInterfaces()).forEach((key) => {
        ips[key].forEach((item) => {
            servers.forEach(it=>{
                if (it.IP==item.address){
                    result = it;
                }
            })
        })
    })

    return result;
}
/**
 * 创建子进程处理
 */
let children = {};
function makeChild(server,type) {
    if (children[type]){
        return;
    }

    children[type]=[];

    for(let i=0;i<server.CHILD_NUM;i++){
        let child = child_process.fork(server.SRC, [], { encoding: 'utf8' });
        children[type].push(child);
    }
}

function selectChild(identify,type) {
    let childs = children[type];
    let char = 0;
    for (let i = 0; i < identify.length; i++) {
        char += identify.charCodeAt(i);
    }

    let len = childs.length;
    for(let i=0;i<len;i++){
        if (char%len==i){
            return childs[i];
        }
    }

    return null;
} 


module.exports = {
    selectIp: selectIp,
    selectChild:selectChild,
    makeChild:makeChild
};