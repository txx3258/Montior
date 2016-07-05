'use strict';

let co=require('co');

/*
 *封装业务处理
 */
function wrapAPI(req,res,handleResult){
  //状态机执行
  co(handleResult(req))
  .then(function(result){ 
    res.json(result);
  }).catch(onerror);

  //错误捕捉
  function onerror(err){
    if (!err.stack){
      res.status(500).send(err);
    }else{
      res.status(500).send(err.stack);
    }
  }
}

module.exports=wrapAPI;
