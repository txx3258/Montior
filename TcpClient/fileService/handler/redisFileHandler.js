'use strict';

function redisFileHandler(str,type){
  var result=[],rtn;
  //正则表达式memcached.log=>
  var reg=/dump_stats:({.*?})/g;

  result.push('');
  while((rtn=reg.exec(str))!=null){ 
      result.push(rtn[1]+",'type':'redis'}");
  }
  
  return result.join(',');
}

module.exports=redisFileHandler