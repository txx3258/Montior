'use strict';

var mongoose = require('mongoose');
let Schema = mongoose.Schema;

let op = require('../op');
let COLLECTION_NAME = require('../keyUtils').YOUNG_GC;
/*
 *基本信息
 */
let YoungGC = new Schema({
    bizCode:String,
    ip: String,
    name: String,
    type: String,
    phase: String,
    time: Number,
    beforeGC: Number,
    afterGC: Number,
    youngSize: Number,
    pauseTime: Number,
    heapSize: Number
});

/*
 *写入数据库
 */
function add(info) {
    //构建基本信息
    var buildYoungGC = function (info) {
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

    return op.add(COLLECTION_NAME, YoungGC, buildYoungGC(info));
}

/*
 *删除City
 */
function del(query) {

    return op.del(COLLECTION_NAME, YoungGC, query.cond);
}

/*
/*
 *更新City
 */
function update(query) {

    return op.update(COLLECTION_NAME, YoungGC, query.cond, query.update, { upsert: true });
}

/*
 * 查找City
 */
function find(query) {
    let fields = query.fields ? query.fields : null;

    return op.find(COLLECTION_NAME, YoungGC, query.cond, fields, { sort: [{ 'orderNum': 1 }] });
}

/**
 *分页
 */
function page(query) {
    let conditions = query.cond;
    let si = query.si;
    let count = query.count;
    let pattern = query.pattern;

    return op.page(COLLECTION_NAME, YoungGC, conditions, si, count, pattern);
}

module.exports = {
    "add": add,
    "find": find,
    "update": update,
    "del": del,
    "page": page
};
