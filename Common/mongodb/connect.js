'use strict';

let mongoose=require('mongoose');
let config=require("../config");
let uri=config.MONGO_URI;
let connectTimes=0;
let logSys=require('../log').logSys;

/*
 *连接mongodb
 */
function connect(){
  return new Promise(function(resolve,reject){
    if (global.db){
      resolve(true);
      return;
    }
    
    mongoose.connect(uri,function(err){
    if (connectTimes++==3){
      process.exit(0);
    }
    
    if (err){
      logSys.warn('mongodb cannot connect!'+err);  
      reject(false);
      return;
    }
  
    logSys.info('mongodb is connected,uri='+uri);
    //赋值为全局访问
    global.db=mongoose;
    connectTimes=0;
    
    logSys.info('mongodb connect success');  

    resolve(true);
  });
  });
}
connect();
module.exports=connect;
