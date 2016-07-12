'use strict';

let fs = require("fs");

 //读取文件信息
let readFileStat = function (fd) {
    return new Promise(function (resolve, reject) {
        fs.fstat(fd, function (err, stats) {
            if (err) {
                reject(new Error('readFileStat is wrong.path=' + fd));
            } else {
                resolve(stats);
            }
        });
    });
};

//读取文件fd
let readFileFd = function (path) {
    return new Promise(function (resolve, reject) {
        fs.open(path, 'r', function (err, fd) {
            if (err) {
                reject(new Error('readFileFd is wrong.path=' + path));
            } else {
                resolve(fd);
            }
        });
    });
};

//返回处理结果
function rtnOpFile(len, offset, preOffset, fd, item,index) {
    return {
        "len": len,
        "offset": offset,
        "preOffset": preOffset,
        "type": item.type,
        "fd": fd,
        "bizCode": item.bizCode,
        "index": index,
        "bufSize":item.bufSize,
        "ip":item.ip
    };
}

/**
 * 读取文件内容
 */
function* readFileInfo(item, index) {
    //读取路径的文件fd sb('./fileService/readFileInfo.js',51)
    let fd = yield readFileFd(item.path);

    //读取文件信息 sb('./fileService/readFileInfo.js',53)
    let stats = yield readFileStat(fd);

    //读取新增长度
    let offset = stats.size;
    let preOffset = item.offset;
    let len = offset - preOffset;

    if (preOffset == 0 || len <= 0) {
        //第一次读或正常文件未变化或日期新文件
        return rtnOpFile(0, offset, preOffset, fd, item,index);
    }

    // //防止超过BUFSIZE
    // if (len > BUFSIZE) {
    //     len = BUFSIZE;
    //     preOffset = offset - len;
    // }

    return rtnOpFile(len, offset, preOffset, fd, item, index);
}

module.exports = readFileInfo;
