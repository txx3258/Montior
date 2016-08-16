'use strict';

let logBiz = require('../../Common/log').logBiz;
let add = require('./mongoUtils').add;

let PROTOCOL_PARTITION = require('../config').PROTOCOL_PARTITION
let PROTOCOL_PARTITION_LEN = PROTOCOL_PARTITION.length;

function mongoWrap(result) {
    let rawDate = result.data.join().toString('utf8');
    let data = rawDate.substring(PROTOCOL_PARTITION_LEN);
    let datas = undefined;

    console.log(data);
    // let curData = '[{}' + data.join('') + ']';
    // try {
    //     datas = JSON.parse(curData);
    // } catch (e) {
    //     logBiz.warn('missing data:' + JSON.stringify(data));
    //     return;
    // }

    // datas.forEach((item) => {
    //     let model = fetchModel(item);
    //     if (model) {
    //         add(model, item);
    //     } 
    // });
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