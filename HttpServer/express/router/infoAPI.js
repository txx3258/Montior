'use strict';

let express=require('express');
let router=express.Router();
let loadInfo=require('../service/loadInfo');
let wrapAPI = require('../service/wrapAPI');
let accountInfo= require('../service/info/account');
let noSqlDataHandler = require('../service/info/noSqlDataHandler');

router.get('/loadInfo',function(req,res,next){
  let query=req.query;
  
  if (req.ip.indexOf('127.0.0.1')==-1){
    res.status(401).send('you do not have permission');
    return;
  }
  //参数验证
  let type=query.type;
  let action=query.action;

  if (!type||!action){
    res.status(400).send("type="+type+",action="+action);
    return;
  }

  wrapAPI(req,res,loadInfo);
});

router.post('/account',function(req,res,next){
  req.query=req.body;
  
  if (!req.query.type){
    res.status(400).send("type="+type);
    return;
  }

  wrapAPI(req,res,accountInfo);
});

router.get('/chart/line',function(req,res,next){

  wrapAPI(req,res,noSqlDataHandler);
});

module.exports=router;