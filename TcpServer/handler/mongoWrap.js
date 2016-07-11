'use strict';

let co = require('co');
let addMongo = require('../../Common/mongodb/mongoAddHandler');
let logBiz = require('../../Common/log').logBiz;

function mongoWrap(data) {
    console.log(data);
    
    let datas = undefined;
    try{
       datas = JSON.parse(data);
    }catch(e){
        logBiz('data is json.data='+data);
    }

    datas.forEach((item)=>{
        let model = fetchModel(item);   
        if (model){
            add(model,item); 
        }else{
            logBiz.info("no model:"+JSON.stringify(item));
        }      
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
            logBiz.error('add error,data='+data+',err='+err);
        } else {
            logBiz.error('add error,data='+data+',err='+err.stack);
        }
    }
}

/**
 * 根据不同类型，选择不同model
 */
let YoungGCModel=require('../../Common/mongodb/logModel/YoungGCModel');
let NoSqlModel = require('../../Common/mongodb/logModel/NoSqlModel');

function fetchModel(item) {
   switch (item.type){
       case 'YGC':return YoungGCModel;
       case 'redis':
       case 'memcached':return NoSqlModel;
       
       default:return undefined;
   } 
}

module.exports = mongoWrap;