'use strict';

let MIN_LIMIT=require('../../../config').MIN_LIMIT; 

let addon = require('../../build/Release/addon.node');

function perfFileHandler(str){

  let result = addon.compute(str);
  return ','+result.join(',');
}

module.exports=perfFileHandler;
