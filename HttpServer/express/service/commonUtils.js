'use strict';

let request=require('request');

function httpReq2Json(url){
  return new Promise(function(resolve,reject){ 
    request(encodeURI(url),function (error, res, body) {
      if (!error && res.statusCode == 200) {
        resolve(JSON.parse(body));
      }else{
        reject("httpReq2Json error="+error+"\n,status="+(res?res.statusCode:null)+"\n,url="+url);
      }
    });
  });
}

function httpReq2Str(url){
  return new Promise(function(resolve,reject){ 
    request(encodeURI(url),function (error, res, body) {
      if (!error && res.statusCode == 200) {
        resolve(body);
      }else{
        reject("httpGetReq error="+error+"\n,status="+(res?res.statusCode:null)+"\n,url="+url);
      }
    });
  });
}

function res2ok(data){
  return {
    "code":200,
    "msg":"",
    "biz":"success",
    "data":data
  };
}

function res2msg(biz,msg){
  return {
    "code":500,
    "biz":biz,
    "msg":msg,
    "data":{}
  };
}

function res2render(action, data, roleLeve, path, mClass, title, template){
    return {
        "action": action,
        "data": data,
        "roleLeve": '111111111111111111111111111111',
        "path": path,
        "mClass": mClass,
        "title": title,
        "template": template
    };
}

function isNotFloat(val){
  return isNaN(parseFloat(val));
}

function isNotInt(val){
  return isNaN(parseInt(val));
}

function isCollEmpty(coll){
  if (Array.isArray(coll)&&coll.length>0){
    return false;
  }else{
    return true;
  }
}

function isEmpty(val){
  if (val){
    return true;
  }else{
    return false;
  }
}

function sort(collections,item){
  if (!Array.isArray(collections)){
    return [];
  }

  return collections.sort(function(a,b){
    return b[item]-a[item];
  });
}

function buildObj2key(query){
  let result = [];
  Object.keys(query).forEach((key)=>{
      result.push(key+'='+query[key]);
  });

  return result.join('&');
}

function avg(arrays) {
  let len = arrays.length;
  let result = 0;
  for (let i = 0; i < len; i++) {
    result += parseFloat(arrays[i]);
  }

  return (result / len).toFixed(2);
}

module.exports={
  "isCollEmpty":isCollEmpty,
  "isNotFloat":isNotFloat,
  "isNotInt":isNotInt,
  "httpReq2Json":httpReq2Json,
  "httpReq2Str":httpReq2Str,
  "sort":sort,
  "avg":avg,
  "res2ok":res2ok,
  "res2msg":res2msg,
  "res2render":res2render,
  "buildObj2key":buildObj2key
};