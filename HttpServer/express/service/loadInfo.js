'use strict';

let loadInfoHandler=require('../../../Common/mongodb/mongoHandler');

let userInfoModel=require('../../../Common/mongodb/mangeModel/userInfoModel');
let roleInfoModel= require('../../../Common/mongodb/mangeModel/roleInfoModel');

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
    default:fn=undefined;
  }

  if (!fn){
    throw new Error('type is wrong.type='+type);
  }

  return fn;
}

module.exports=handleResult;