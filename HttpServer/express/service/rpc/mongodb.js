'use strict';

let config = require('../../../../Common/config');
let BASE_URL = 'http://127.0.0.1:' + config.HTTP_PORT + '/info/loadinfo?';

let commonUtils = require('../commonUtils');
let httpReq2Json = commonUtils.httpReq2Json;
let buildObj2key = commonUtils.buildObj2key;

function fetchMongoData(query) {
    let params = buildObj2key(query);
    let url = BASE_URL + params;

    return httpReq2Json(url);
}

function fetchDistinctField(type,field) {
  let url = BASE_URL+`type=${type}&action=distinct&cond=&field=${field}`;

  return httpReq2Json(url);
}

module.exports={
  "fetchMongoData":fetchMongoData,
  "fetchDistinctField":fetchDistinctField
};