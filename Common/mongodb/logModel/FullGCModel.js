'use strict';

var mongoose = require('mongoose');
let Schema = mongoose.Schema;

let op = require('../op');
let COLLECTION_NAME = require('../keyUtils').FULL_GC;
/*
 *基本信息
 */
let FullGC = new Schema({
    bizCode:String,
    ip: String,
    type: String,
    time: Number,
    heapSize: Number,
    oldSize: Number,
    "CMS-concurrent-mark_size": Number,
    "CMS-initial-mark_pauseTime": Number,
    "CMS-concurrent-mark": Number,
    "CMS-concurrent-preclean":Number,
    "CMS-concurrent-abortable-preclean":Number
});

/*
 *写入数据库
 */
function add(info) {
    //构建基本信息
    var buildFullGC = function (info) {
        //赋值
        return {
            bizCode:info.bizCode,
            ip: info.ip,
            name: info.name,
            type: info.type,
            phase: info.phase,
            time: info.time,
            beforeGC: info.beforeGC,
            afterGC: info.afterGC,
            youngSize: info.youngSize,
            pauseTime: info.pauseTime,
            heapSize: info.heapSize
        };
    };

    return op.add(COLLECTION_NAME, FullGC, buildFullGC(info));
}

/*
 *删除City
 */
function del(query) {

    return op.del(COLLECTION_NAME, FullGC, query.cond);
}

/*
/*
 *更新City
 */
function update(query) {

    return op.update(COLLECTION_NAME, FullGC, query.cond, query.update, { upsert: true });
}

/*
 * 查找City
 */
function find(query) {
    let fields = query.fields ? query.fields : null;

    return op.find(COLLECTION_NAME, FullGC, query.cond, fields, { sort: [{ 'orderNum': 1 }] });
}

/**
 *分页
 */
function page(query) {
    let conditions = query.cond;
    let si = query.si;
    let count = query.count;
    let pattern = query.pattern;

    return op.page(COLLECTION_NAME, FullGC, conditions, si, count, pattern);
}

module.exports = {
    "add": add,
    "find": find,
    "update": update,
    "del": del,
    "page": page
};
