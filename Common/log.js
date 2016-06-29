'use strict';

let log4js=require('log4js');

let config={
  "appenders":[
    {
      "type":"console",
      "layout":{
        "type":"pattern",
        "pattern":"%[%r (%x{pid} %p %c -%)] %m%n",
        "tokens":{
          "pid":function(){return process.pid;}
        }
      },
      "category":"console"
    },
    {
      "type":"file",
      "filename":"./logs/server.log",
      "maxLogSize":204800,
      "backups":2,
      "category":"index"
    },{
      "type":"file",
      "filename":"./logs/sys.log",
      "maxLogSize":204800,
      "backups":2,
      "category":"sys"
    },{
      "type":"file",
      "filename":"./logs/biz.log",
      "maxLogSize":2048000,
      "backups":2,
      
      "category":"biz"
    }
  ]
};

log4js.configure(config,{});

let logBiz=log4js.getLogger('biz');
let logIndex=log4js.getLogger('index')
let logSys=log4js.getLogger('sys');

module.exports={
  logBiz:logBiz,
  logIndex:logIndex,
  logSys:logSys
};
