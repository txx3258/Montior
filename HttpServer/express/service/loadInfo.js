'use strict';

let loadInfoHandler=require('../../../Common/mongodb/mongoHandler');

let userInfoModel=require('../../../Common/mongodb/mangeModel/userInfoModel');
let roleInfoModel= require('../../../Common/mongodb/mangeModel/roleInfoModel');
let apiApplistModel= require('../../../Common/mongodb/mangeModel/ApiApplistModel');
let noSqlModel= require('../../../Common/mongodb/mangeModel/NoSqlModel');
let youngGCModel= require('../../../Common/mongodb/mangeModel/YoungGCModel');

/*
 *处理用户下单
 */
function handleResult(req){
  let query=req.query;
  let type=query.type;
  let action=query.action;

  let fn=undefined;
  switch (type){
    case 'userInfo':fn=loadInfoHandler(query,userInfoModel);break;
    case 'userRole':fn=loadInfoHandler(query,roleInfoModel);break;
    case 'apiApplist':fn=loadInfoHandler(query,apiApplistModel);break;
    case 'noSql':fn=loadInfoHandler(query,noSqlModel);break;
    case 'youngGC':fn=loadInfoHandler(query,youngGCModel);break;
    default:fn=undefined;
  }

  if (!fn){
    throw new Error('type is wrong.type='+type);
  }

  return fn;
}

module.exports=handleResult;