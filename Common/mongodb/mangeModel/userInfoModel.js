'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let op = require('../op');
let COLLECTION_NAME = require('../keyUtils').USER_INFO;
let SUB_COLLECTION_NAME = require('../keyUtils').ROLE_INFO
/*
 *基本信息
 */
let userInfo = new Schema({
    userId: {
        type: String,
        index: { unique: true }
    },
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: SUB_COLLECTION_NAME
    },
    userType: Number,
    password: String,
    lastLoginTime: Number,
    registerTime: Number,
    loginNum: Number
});

/*
 *写入数据库
 */
function add(info) {
    var builduserInfo = function (info) {
        //赋值
        return {
            userId: info.userId,
            role: info.role,
            userType: info.userType,
            password: info.password,
            registerTime: new Date().getTime(),
            lastLoginTime: new Date().getTime(),
            loginNum: 1
        };
    };

    return op.add(COLLECTION_NAME, userInfo, builduserInfo(info));
}

/*
 *删除
 */
function del(query) {

    return op.del(COLLECTION_NAME, userInfo, query.cond);
}

/*
/*
 *更新
 */
function update(query) {

    return op.update(COLLECTION_NAME, userInfo, query.cond, query.update, { upsert: false });
}

/*
 * 查找
 */
function find(query) {
    let fields = query.fields ? query.fields : null;

    return op.find(COLLECTION_NAME, userInfo, query.cond, fields, query.options);
}

/**
 *分页
 */
function page(query) {
    let conditions = query.cond;
    let si = query.si;
    let count = query.count;
    let pattern = query.pattern;

    return op.page(COLLECTION_NAME, userInfo, conditions, si, count, pattern);
}

module.exports = {
    "add": add,
    "find": find,
    "update": update,
    "del": del,
    "page": page
};