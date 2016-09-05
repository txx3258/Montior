'use strict';

let MIN_LIMIT=require('../../../config').MIN_LIMIT; 

let addon = require('../../build/Release/addon.node');

function perfFileHandler(str,info){

  let result = addon.compute(str);
  result.forEach((item)=>{
    item["ip"] = info.ip;
  });

  let retStr = JSON.stringify(result);
  let len = retStr.length -1
  let rtn = retStr.substring(1,len);

  return ','+rtn;
}

module.exports=perfFileHandler;
//sb('TcpClient/fileService/handler/perfFileHandler.js',9);