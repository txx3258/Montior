'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let op = require('../op');
let COLLECTION_NAME=require('../keyUtils').ROLE_INFO;

/*
 *基本信息
 */
let roleInfo=new Schema({
  roleName:String,
  roleCode:String,
  roleLeve:String
});

/*
 *写入数据库
 */
function add(info){
  var buildroleInfo=function(info){
    //赋值
    return {
      roleName:info.roleName,
      roleLeve:info.roleLeve,
      roleCode:info.roleCode
    };
  };

  return op.add(COLLECTION_NAME,roleInfo,buildroleInfo(info));
}

/*
 *删除
 */
function del(query){

  return op.del(COLLECTION_NAME,roleInfo,query.cond);
}

/*
/*
 *更新
 */
function update(query){

  return op.update(COLLECTION_NAME,roleInfo,query.cond,query.update,{upsert:false});
}

/*
 * 查找
 */
function find(query){
  let fields=query.fields?query.fields:null;

  return op.find(COLLECTION_NAME,roleInfo,query.cond,fields,query.options);
}

/**
 *分页
 */
function page(query){
  let conditions=query.cond;
  let si=query.si;
  let count=query.count;
  let pattern=query.pattern;

  return op.page(COLLECTION_NAME,roleInfo,conditions,si,count,pattern);
}

module.exports={
  "add":add,
  "find":find,
  "update":update,
  "del":del,
  "page":page 
};