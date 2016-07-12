'use strict';

let co = require('co');
let addMongo = require('../../Common/mongodb/mongoAddHandler');
let logBiz = require('../../Common/log').logBiz;

let tmpData = {};
function mongoWrap(data) {
    let datas = Object.keys(data).map((key) => {
        let curData = data[key].join('');
        let preData = tmpData[key];
        let isDirty = false;
        if (preData) {
            if (preData.length > 2097152) {
                console.log('miss data:' + preData);
                tmpData[key]=null;
                delete tmpData[key];
                return {};
            }else{
                curData = preData + curData;
            }
        } else {
            curData = '[{}' + curData;
        }

        try {
            return JSON.parse(curData + ']');
        } catch (e) {
            if (!tmpData[key]) {
                tmpData[key] = '';
            }
            tmpData[key] += curData;
        }
    });

    datas.forEach((items) => {
        if (!Array.isArray(items)) {
            return;
        }
        items.forEach((item) => {
            let model = fetchModel(item);
            if (model) {
                add(model, item);
            } else {
                logBiz.warn("no model:" + JSON.stringify(item));
            }
        });
    });
}

/**
 * 添加数据到mongodb
 */
function add(model, data) {
    co(addMongo(model, data))
        .then((result) => {
            logBiz.info(result);
        }).catch(onerror);

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

/**
 * 根据不同类型，选择不同model
 */
let YoungGCModel = require('../../Common/mongodb/logModel/YoungGCModel');
let NoSqlModel = require('../../Common/mongodb/logModel/NoSqlModel');

function fetchModel(item) {
    if (!item) {
        return null;
    }
    switch (item.type) {
        case 'YGC': return YoungGCModel;
        case 'redis':
        case 'memcached': return NoSqlModel;

        default: return null;
    }
}

module.exports = mongoWrap;