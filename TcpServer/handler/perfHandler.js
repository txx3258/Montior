'use strict';

function perfHandler(data) {
    let datas = data.split('\n');

    let container = {};
    datas.forEach((item)=>{
        let api=/qwqw/.exec(item);
        let apiJson = JSON.parse(api);

        let url = apiJson.url;
        let urlMap = container[url];
        if (!urlMap){
            urlMap = [];
            container[url] =urlMap;
        }
        urlMap.push(apiJson);   
    });

    Object.keys(container).forEach((key)=>{
        let chains = container[key];
        let len = chains.length;

        let tmpChain = chains[0];
        tmpChain['ec'] = 0;
        tmpChain['c'] = len;
        for(let i=1;i<len;i++){
            var chain = chains[i];
            tmpChain['cs'] += chain.cs;
            if (!chain.ok){
                tmpChain['ce'] += 1;
            }
            
            let sps = chain.sps;
            if (!Array.isArray(sps)){
                return;
            }

            let tmpSps = tmpChain['spc'];
            if (!Array.isArray(tmpSps)){
                tmpSps = [];
                tmpChain['spc']=tmpSps;
            }else{
                tmpSps.forEach((item)=>{
                    item["cnt"] = 1;
                })
            }

            let len_0 = tmpSps.length;
            let len_1 = sps.length;
            let isExist = true;
            for(let j=0;j<len_1;j++){
                for(let k=0;k<len_0;k++){
                    if (sps[j].sp==tmpSps[k].sp){
                        tmpSps[k].cs += sps[j].cs;
                        tmpSps[k].cnt +=1;
                        continue;
                    }
                    isExist = false;
                }

                if (!isExist){
                    sps[j]['cnt'] = 1;
                    tmpSps.push(sps[j]);
                }
            }
        }

        //计算平均数
        tmpChain['cs'] = tmpChain['cs']/len;
        tmpChain['sps'].forEach((item)=>{
            item.cs = item.cs /item.cnt;
        }); 

        console.log(JSON.stringify(tmpChain));
    });
}

module.exports = perfHandler;