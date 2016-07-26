'use strict';

let logBiz = require('../../Common/log').logBiz;
let add = require('./mongoUtils').add;
let perfModel = require('../../Common/mongodb/logModel/PerfModel');

function perfHandler(data) {
    let datas = data.join('').split('\n');
    let container = {};
    let len = datas.length;

    //通过url接口
    for (let i = 0; i < len; i++) {
        let item = datas[i];
        let pos = item.indexOf('{"ts":');

        if (pos == -1) {
            logBiz.warn('missing perf data for pos:'+item);
            continue;
        }

        let perfApi = item.substring(pos);
        if (!perfApi.endsWith('}')) {
            continue;
        }

        let apiJson = undefined;
        try{
            apiJson = JSON.parse(perfApi);
        }catch(e){
            logBiz.warn('missing perf data for JSON:'+item);
        }
        let url = apiJson.url.split('?')[0];
        let urlMap = container[url];
        if (!urlMap) {
            urlMap = [];
            container[url] = urlMap;
        }
        urlMap.push(apiJson);
    }

    Object.keys(container).forEach((key) => {
        let chains = container[key];
        let len = chains.length;

        let tmpChain = chains[0];
        tmpChain['url'] = key;
        tmpChain['ec'] = 0;
        tmpChain['c'] = len;

        let tmpSps = tmpChain['sps'];
        if (!Array.isArray(tmpSps)) {
            tmpSps = [];
            tmpChain['sps'] = tmpSps;
        } else {
            tmpSps.forEach((item) => {
                item["cnt"] = 1;
            })
        }

        for (let i = 1; i < len; i++) {
            let chain = chains[i];
            tmpChain['cs'] += chain.cs;
            if (!chain.ok) {
                tmpChain['ce'] += 1;
            }

            let sps = chain.sps;
            if (!Array.isArray(sps)) {
                continue;
            }

            let len_0 = tmpSps.length;
            let len_1 = sps.length;
            for (let j = 0; j < len_1; j++) {
                let isExist = false;
                for (let k = 0; k < len_0; k++) {
                    if (sps[j].sp == tmpSps[k].sp) {
                        tmpSps[k].cs += sps[j].cs;
                        tmpSps[k]["cnt"] += 1;
                        isExist = true;
                        continue;
                    }
                }

                if (!isExist) {
                    sps[j]['cnt'] = 1;
                    tmpSps.push(sps[j]);
                }
            }
        }
        //计算平均数
        tmpChain['cs'] = tmpChain['cs'] / len;
        tmpChain['sps'].forEach((item) => {
            item.cs = item.cs / item.cnt;
            delete item.cnt;
        });

        console.log(JSON.stringify(tmpChain));

        add(perfModel,tmpChain);
    });
}

module.exports = perfHandler;