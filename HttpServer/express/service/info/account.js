'use strict';

let account = require('../rpc/account');

let res2render = require('../commonUtils').res2render;

/*
 *处理用户下单  sb('express/service/info/account.js',39)
 */
function handleResult(req) {
    let query = req.query;
    let type = query.type;

    let fn = undefined;
    switch (type) {
        case 'login': fn = login(query); break;
        case 'loginOut': fn = loginOut(query); break;
        default: fn = undefined;
    }

    if (!fn) {
        throw new Error('type is wrong.type=' + type);
    }

    return fn;
}

function* login(query) {
    if (!/^\d{11}$/.test(query.userId)) {
        return res2render('redirect', null, null, '/manage/login?message=账号为电话号码！');
    }

    let password=query.password;
    if (!password || password.length < 6) {
        return res2render('redirect', null, null, '/manage/login?message=密码长度至少为6位！');
    }

    let users = yield account.findUserByPwd(query);
    if (Array.isArray(users) && users.length == 1) {
        return res2render('redirect', users[0], null, '/manage/index');
    } else {
        return res2render('redirect', null, null, '/manage/login?message=账号或密码错误！');
    }
}

function* loginOut(query) {

}

module.exports = handleResult;

