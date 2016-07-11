'use strict';

function memcachedHandler(str,type){
  var result=[],rtn;
  //正则表达式memcached.log=>
  var reg=/dump_stats:({.*?})/g;

  result.push('');
  while((rtn=reg.exec(str))!=null){ 
      result.push(rtn[1]+",'type':'memcached'}");
  }
  
  return result.join(',');
}

module.exports=memcachedHandler;
