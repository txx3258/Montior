'use strict';
var http=require('http');
var express=require('express');
var app=express();
var morgan=require('morgan');
var path = require('path');
var config=require('../Common/config');
var bodyParser = require('body-parser');
var logSys=require('../Common/log').logSys;
//var session=require("express-session");


app.set('views', path.join(__dirname, 'express/views'));
var ejs=require('ejs');
app.engine('html',ejs.__express);
app.set('view engine', 'html');
app.use(express.static(path.join(__dirname,'./public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//接口日志
app.use(morgan('combined'));
//接口
app.get('/',function(req,res){
  res.send('hello world!!!');
});

//let filter=require('./express/service/conf/fiterHandler').authFilterHandler;
let manage=require('./express/router/manage');
let infoAPI = require('./express/router/infoAPI');

//管理后台
//app.use(session(config["SESSION"]));
//app.use(filter);
app.use('/info',infoAPI);
app.use('/manage',manage);

//catch 404
app.use(function(req,res,next){
  var err=new Error('Not Found');
  err.status=404;

  next(err);
});

//catch 500
app.use(function(err,req,res,next){
  res.status(err.status||500);

  res.send(err.stack?err.stack:err);
});

//创建服务
var server=http.createServer(app);

app.set('port',config.HTTP_PORT);
server.listen(config.HTTP_PORT);//config.WEB_PORT);
server.on('error',function(){
  logSys.log('web express is error');
});

server.on('listening',function(){
  logSys.info('web:express is listening');
});

module.exports=app;
