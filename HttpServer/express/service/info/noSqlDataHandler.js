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
        case 'avgCost': fn = loadLine(query,'avgCost'); break;
        case 'maxCost': fn = loadLine(query,'maxCost'); break;
        case 'totalCount': fn = loadLine(query,'totalCount'); break;
        case 'failCount': fn = loadLine(query,'failCount'); break;
        case 'memDistinct': fn = memDistinct(query); break;
        default: fn = undefined;
    }

    if (!fn) {
        throw new Error('bizCode is wrong.bizCode=' + bizCode);
    }

    return fn;
}

function* memDistinct(query) {
    let keys =JSON.parse(query.key);
    let fields = keys.map((key)=>{
        return fetchMemDistField(key);
    });

    let fieldVals = yield fields;

    let result = {};
    for(let i=0,len = keys.length;i<len;i++){
        result[keys[i]] = fields[i];
    }

    return result;
}

function* loadLine(query,factor) {
    let datas = yield fetchMongoData(query);

    return noSqlDataHandler(datas,factor);
}

function noSqlDataHandler(datas,factor) {
    let maps = {};
    datas.forEach((item) => {
        let startTime = item.startTime;
        if (startTime) {
            let methName = item.methName;
            let key = startTime + '_' + methName;
            let tmp = maps[key];
            if (!tmp) {
                tmp = [];
                maps[key] = tmp;
                tmp.push({ "startTime": startTime });
            }

            let flag = false;
            for (let i = 1, len = tmp.length; i < len; i++) {
                let it = tmp[i];
                let key = Object.getOwnPropertyNames(it)[0];
                if (key == item.methName) {
                    it[key].push(item[factor]);
                    flag = true;
                }
            }

            if (!flag) {
                var obj = {};
                let avgCostArray = [];
                avgCostArray.push(item[factor]);

                let keyKey = item["methName"];
                obj[keyKey] = avgCostArray;
                tmp.push(obj);
            }
        }
    });

    let factorKeys = {};
    let result = Object.keys(maps).map((key) => {
        let arrays = maps[key];
        let startTimeObj = arrays[0];
        let methodObj = arrays[1];

        let keyKey = Object.getOwnPropertyNames(methodObj)[0];
        let obj = {
            "startTime": startTimeObj["startTime"]
        };

        if (!factorKeys[keyKey]){
            factorKeys[keyKey] = true;
        }

        obj[keyKey] = parseFloat(avg(methodObj[keyKey]));
        return obj;
    });

    //排序
    result = sort(result,"startTime");

    let resultResult = [];
    let resultIndex = 0;
    let resultMap = {};
    result.forEach((item) => {
        let startTime = item.startTime;
        let starTimeCur = resultMap[startTime];

        if (!starTimeCur) {
            resultMap[startTime] = resultIndex;

            let obj = {};
            obj["startTime"] = startTime;
            let key = Object.getOwnPropertyNames(item)[1];
            obj[key] = item[key];

            resultResult[resultIndex] = obj;
            resultIndex++;
        } else {
            let obj = resultResult[starTimeCur];
            let key = Object.getOwnPropertyNames(item)[1];
            obj[key] = item[key];

            resultResult[starTimeCur] = obj;
        }
    });

    return {"key":Object.keys(factorKeys),"value":resultResult}; 
}

module.exports = handleResult;
