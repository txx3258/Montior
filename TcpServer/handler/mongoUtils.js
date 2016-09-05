'use strict';

let co = require('co');
let addMongo = require('../../Common/mongodb/mongoAddHandler');
let logBiz = require('../../Common/log').logBiz;
/**
 * 添加数据到mongodb
 */
function add(model, data) {
    co(addMongo(model, data))
        .then((result) => {
            logBiz.info(result);
        }).catch((err)=>{
            onerror(err);
        });

    /**
    *错误日志如理
    */
    function onerror(err) {
        if (!err.stack) {
            logBiz.error('add error,data=' + data + ',err=' + err);
        } else {
            logBiz.error('add error,data=' + data + ',err=' + err.stack);
        }
    }
}

module.exports = {
    add:add
};