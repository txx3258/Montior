'use strict';

let fs = require('fs');

let config = require('../config');
let templates = config.templates;
let templateLen = templates.length;
let ipFrom = config.ipfile;

function handeFilePaths(contexts) {
    let result = [];

    for (let i = 0; i < contexts.length; i++) {
        let context = contexts[i];
        let ipFile = ipFrom.replace(/%s/, context);
        if (!fs.existsSync(ipFile)){
            continue;   
        }

        let ipFileContent = fs.readFileSync(ipFile).toString();
        let ipRegs = /BIND_IP="(.*?)"/.exec(ipFileContent);
        if (!Array.isArray(ipRegs)){
            continue;
        }

        let ip = ipRegs[1];

        for (let j = 0; j < templateLen; j++) {
            let tempPath = templates[j];
            let path = tempPath.path.replace(/%s/, context);

            let isExists = fs.existsSync(path);
            if (!isExists) {
                continue;
            }

            result.push(PathInfo(path,tempPath.type,ip,context,tempPath.offset,tempPath.bufSize,tempPath.sendBy));
        }
    }

    console.log(JSON.stringify(result));
    
    return result;
}



function PathInfo(path, type, ip, bizCode, offset, bufSize, sendBy) {
    return {
        "path": path,
        "type": type,
        "ip": ip,
        "bizCode": bizCode,
        "offset": 0,
        "bufSize": 2097152,
        "sendBy": sendBy
    }
}

module.exports = handeFilePaths;

