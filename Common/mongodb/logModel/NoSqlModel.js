'use strict';

var mongoose = require('mongoose');
let Schema = mongoose.Schema;

let op = require('../op');
let COLLECTION_NAME = require('../keyUtils').NO_SQL;
/*
 *基本信息
 */
let NoSqlModel = new Schema({
    type: {
        type: String,
        index: true
    },
    startTime: {
        type: Number,
        index: true
    },
    endTime: Number,
    moduleCode: String,
    systemCode: String,
    envCode: String,
    roleName: String,
    methName: String,
    serverHost: {
        type: String,
        index: true
    },
    totalCount: Number,
    totalCost: Number,
    maxCost: Number,
    avgCost: Number,
    successCount: Number,
    successCost: Number,
    successMaxCost: Number,
    successAvgCost: Number,
    failCount: Number,
    failCost: Number,
    failMaxCost: Number,
    failAvgCost: Number,
    costGroup: Object
});

/*
 *写入数据库
 */
function add(info) {
    //构建基本信息
    var buildNoSql = function (info) {
        //赋值
        return {
            type: info.type,
            startTime: parseInt(info.startTime),
            endTime: parseInt(info.endTime),
            moduleCode: info.moduleCode,
            systemCode: info.systemCode,
            envCode: info.envCode,
            roleName: info.roleName,
            methName: info.methName,
            serverHost: info.serverHost,
            totalCount: parseInt(info.totalCount),
            totalCost: parseInt(info.totalCost),
            maxCost: parseInt(info.maxCost),
            avgCost: parseInt(info.avgCost),
            successCount: parseInt(info.successCount),
            successCost: parseInt(info.successCost),
            successMaxCost: parseInt(info.successMaxCost),
            successAvgCost: parseInt(info.successAvgCost),
            failCount: parseInt(info.failCount),
            failCost: parseInt(info.failCost),
            failMaxCost: parseInt(info.failMaxCost),
            failAvgCost: parseInt(info.failAvgCost),
            costGroup: info.costGroup
        };
    };

    return op.add(COLLECTION_NAME, NoSqlModel, buildNoSql(info));
}

/*
 *删除City
 */
function del(query) {

    return op.del(COLLECTION_NAME, NoSqlModel, query.cond);
}

/*
/*
 *更新City
 */
function update(query) {

    return op.update(COLLECTION_NAME, NoSqlModel, query.cond, query.update, { upsert: true });
}

/*
 * 查找City
 */
function find(query) {
    let fields = query.fields ? query.fields : null;

    return op.find(COLLECTION_NAME, NoSqlModel, query.cond, fields, { sort: [{ 'orderNum': 1 }] });
}

/**
 *分页
 */
function page(query) {
    let conditions = query.cond;
    let si = query.si;
    let count = query.count;
    let pattern = query.pattern;

    return op.page(COLLECTION_NAME, NoSqlModel, conditions, si, count, pattern);
}

function distinct(query) {
    return op.distinct(COLLECTION_NAME, NoSqlModel, query.cond, query.field);
}

module.exports = {
    "add": add,
    "find": find,
    "update": update,
    "del": del,
    "page": page,
    "distinct": distinct
};
