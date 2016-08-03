'use strict';

let config = require('../../../../config');
let BASE_URL = 'http://127.0.0.1:' + config.HTTP_PORT + '/info/loadinfo?type=userInfo&';

let commonUtils = require('../commonUtils');
let httpReq2Json = commonUtils.httpReq2Json;
//sb('express/service/rpc/account.js',14)
function findUserByPwd(query) {
    let userId = query.userId;
    let password = query.password;
    let url =BASE_URL +`action=find&field=userId&cond="userId":"${userId}","password":"${password}"`;
    
    return httpReq2Json(url);
}

module.exports={
  "findUserByPwd":findUserByPwd
};
