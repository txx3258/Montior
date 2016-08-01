'use strict';

var mongoose = require('mongoose');
let Schema = mongoose.Schema;

let op = require('../op');
let COLLECTION_NAME = require('../keyUtils').PERF;

let step = new Schema({
    sp: String,
    cs: Number
});
/*
 *基本信息
 */
let Perf = new Schema({
    ts:Number,//timespan
    c:Number,//count
    ce:Number,//countError
    cs:Number,//cost
    ip:String,
    url: String,
    sps:[
        step
    ]
});

/*
 *写入数据库
 */
function add(info) {
    //构建基本信息
    var buildPerf = function (info) {        
        //赋值
        return {
            ts:info.ts,
            c:info.c,
            cs:info.cs,
            ce:info.ce,
            url:info.url,
            ip:info.ip,
            sps:info.sps
        };
    };

    return op.add(COLLECTION_NAME, Perf, buildPerf(info));
}

/*
 *删除City
 */
function del(query) {

    return op.del(COLLECTION_NAME, Perf, query.cond);
}

/*
/*
 *更新City
 */
function update(query) {

    return op.update(COLLECTION_NAME, Perf, query.cond, query.update, { upsert: true });
}

/*
 * 查找City
 */
function find(query) {
    let fields = query.fields ? query.fields : null;

    return op.find(COLLECTION_NAME, Perf, query.cond, fields, { sort: [{ 'orderNum': 1 }] });
}

/**
 *分页
 */
function page(query) {
    let conditions = query.cond;
    let si = query.si;
    let count = query.count;
    let pattern = query.pattern;

    return op.page(COLLECTION_NAME, Perf, conditions, si, count, pattern);
}

function distinct(query) {
    return op.distinct(COLLECTION_NAME, Perf, query.cond, query.field);
}

module.exports = {
    "add": add,
    "find": find,
    "update": update,
    "del": del,
    "page": page,
    "distinct": distinct
};


