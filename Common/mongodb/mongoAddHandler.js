'use strict';

let connect = require('./connect');

yield connect();

function* mongoAddHandler(model,data) {
    let isCon = yield connect();
    if (!isCon) {
        throw new Error('cannot connect mongodb!');
    }
    
    return yield model.add(data);
}

module.exports = mongoAddHandler;