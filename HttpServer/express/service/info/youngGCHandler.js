'use strict';

let commonUtils = require('../commonUtils');
let res2ok = commonUtils.res2ok;
let buildObj2key = commonUtils.buildObj2key;
let avg = commonUtils.avg;
let sort = commonUtils.sort;

let mongodb = require('../rpc/mongodb');
let fetchMongoData = mongodb.fetchMongoData;
let fetchMemDistField = mongodb.fetchMemDistField;

function handleResult(req) {
    let query = req.query;
    let bizCode = query.bizCode;

    let fn = undefined;
    switch (bizCode) {
        case 'pauseTime': fn = loadLine(query, 'pauseTime'); break;
        case 'yongSize': fn = loadLine(query, 'yongSize'); break;
        case 'heapSize': fn = loadMutiLine(query, 'totalCount'); break;
        default: fn = undefined;
    }

    if (!fn) {
        throw new Error('bizCode is wrong.bizCode=' + bizCode);
    }

    return fn;
}

function* memDistinct(query) {
    let keys = JSON.parse(query.key);
    let fields = keys.map((key) => {
        return fetchMemDistField(key);
    });

    let fieldVals = yield fields;

    let result = {};
    for (let i = 0, len = keys.length; i < len; i++) {
        result[keys[i]] = fieldVals[i];
    }

    return result;
}

function* loadLine(query, factor) {
    let datas = yield fetchMongoData(query);

    return youngGCHandler(datas, factor);
}

function youngGCHandler(datas, factor) {
    let maps = {};
    datas.forEach((item) => {
        let time = new Date(item.time).toISOString().substring(0, 16);
        let ip = item.ip;
        let key = time + '_' + ip;
        let tmp = maps[key];
        if (!tmp) {
            tmp = [];
            maps[key] = tmp;
            tmp.push({ "time": item.time});
        }

        let flag = false;
        for (let i = 1, len = tmp.length; i < len; i++) {
            let it = tmp[i];
            let key = Object.getOwnPropertyNames(it)[0];
            if (key == ip) {
                it[key].push(item[factor]);
                flag = true;
            }
        }

        if (!flag) {
            var obj = {};
            let tmptmp = [];
            tmptmp.push(item[factor]);

            obj[ip] = tmptmp;
            tmp.push(obj);
        }
    });

    let factorKeys = {};
    let result = Object.keys(maps).map((key) => {
        let arrays = maps[key];
        let timeObj = arrays[0];
        let obj = {
            "time": timeObj["time"]
        };

        let methodObj = arrays[1];
        let keyKey = Object.getOwnPropertyNames(methodObj)[0];
        if (!factorKeys[keyKey]){
            factorKeys[keyKey] = true;
        }

        obj[keyKey] = parseFloat(avg(methodObj[keyKey]));
        return obj;
    });

    //排序
    result = sort(result, "time");

    let resultResult = [];
    let resultIndex = 0;
    let resultMap = {};
    result.forEach((item) => {
        let time = item.time;
        let timeCur = resultMap[time];

        if (!timeCur) {
            resultMap[time] = resultIndex;

            let obj = {};
            obj["date"] = time;
            let key = Object.getOwnPropertyNames(item)[1];
            obj[key] = item[key];

            resultResult[resultIndex] = obj;
            resultIndex++;
        } else {
            let obj = resultResult[timeCur];
            let key = Object.getOwnPropertyNames(item)[1];
            obj[key] = item[key];

            resultResult[key] = obj;
        }
    });

    return { "key": Object.keys(factorKeys), "value": resultResult };
}

function youngGCMutiHandler(params) {

}

module.exports = handleResult;