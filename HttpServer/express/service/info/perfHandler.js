'use strict';

let commonUtils = require('../commonUtils');
let res2ok = commonUtils.res2ok;
let avg = commonUtils.avg;
let sort = commonUtils.sort;
let times = commonUtils.times;

let mongodb = require('../rpc/mongodb');
let fetchMongoData = mongodb.fetchMongoData;

function handleResult(req) {
    let query = req.query;
    let biz = query.biz;

    let fn = undefined;
    switch (biz) {
        case 'c': fn = loadLine(query, 'c'); break;
        case 'en': fn = loadLine(query, 'en'); break;
        case 'cs': fn = loadLine(query, 'cs'); break;
        default: fn = undefined;
    }

    if (!fn) {
        throw new Error('biz is wrong.biz=' + biz);
    }

    return fn;
}
var arr=['`','1','2','3','4','5','6','7','8','9','0','-','+','q','w','e','r','t','y','u','i','o','p','[',']','a','s','d','f','g','h','j','k','l','z','x','c','v','b','n','m',',','.','/','!','@','#','$','%','^','&','*','(',')','-','+','Q','W','E','R','T','Y','U','I','O','P','{','}','A','S','D','F','G','H','J','K','L','Z','X','C','V','B','N','M','<','>','?'];

function* loadLine(query, factor) {
    let datas = yield fetchMongoData(query);
    let strategy = undefined;

    return perfHandler(datas, factor);
}

function perfHandler(datas, factor) {
    if (!Array.isArray(datas)){
        return [];
    }

    datas = sort(datas, "ts");
	
    let comput= undefined;
    if (factor=='cs'){
	comput = avg;
    }else{
	comput = sum;
    }	

  
    let result = [];
    let data = datas[0];
    let ts =new Date(parseInt(data.ts)).toLocaleTimeString();

    result.push({date:ts,val:data[factor],sps:data.sps,cs:data.cs})
    let len = datas.length;
    let index = 0,pSecond = new Date(parseInt(data.ts)).getMinutes();
    for(let i=1;i<len;i++){
        data = datas[i];
         let date =new Date(parseInt(data.ts));
         let second = date.getMinutes();
	console.log(second);
         /*ts = date.getMinutes()+':'+(second>=10?second:'0'+second)*/;
	if (pSecond!=second){
		index++;
	 	let mod = parseInt(i/87);
		let date = undefined;
		if (mod==0){
			date = arr[i];
		}else{
			date=mod+arr[i];
		}
        	result.push({date:date,val:data[factor],sps:data.sps,cs:data.cs});
		pSecond = second;

	}else{
		
		let tmp = result[index];
		tmp.sps = tmp.sps.concat(data.sps); 	
		tmp.cs = (tmp.cs + data.cs)/2;
		tmp.val = comput(tmp.val,data[factor]);
	}

    }

    return result;

    function avg(v1,v2){
	return (v1+v2)/2;
    }

   function sum(v1,v2){
	return v1+v2;
   }
}

module.exports = handleResult;
