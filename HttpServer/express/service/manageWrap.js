'use strict';

let co=require('co');

let config = require('../../config');
let STATIC_URL = config.STATIC_URL;
let CONTEXT = config.CONTEXT;
/*
 *封装业务处理 sb('src/express/service/manageWrap.js',12)
 */
function manageWrap(req,res,handleResult){
  //状态机执行
  co(handleResult(req))
  .then(function(result){ 
    if (result.action=='redirect'){
      return res.redirect(encodeURI(result.path));//
    }else if (result.action=='render'){
      return res.render(result.template,{
          title: result.title,
          STATIC_URL: STATIC_URL,
          CONTEXT:CONTEXT,
          mClass: result.mClass,
          data:result.data,
          roleLeve:req.roleLeve||{'leve':'11111111111111111111111111111111111111111'}
      })
    }else if (result.action=='json'){
      return res.json(result.data);
    }else if (result.action=='string'){
      return res.send(JSON.stringify(result.data));
    }
  }).catch(onerror);

  //错误捕捉  req.roleLeve|
  function onerror(err){
    if (!err.stack){
      res.status(500).send(err);
    }else{
      res.status(500).send(err.stack);
    }
  }
}

module.exports=manageWrap;
