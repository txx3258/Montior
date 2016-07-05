'use strict';

let connect = require('./connect');

function* mongoHandler(query, model) {
    let isCon = yield connect();
    if (!isCon) {
        throw new Error('cannot connect mongodb!');
    }

    let fn = undefined;
    switch (query.action) {
        case 'add': fn = model.add(query); break;
        case 'del': fn = model.del(query); break;
        case 'update': fn = model.update(query); break;
        case 'find': fn = model.find(query); break;
        case 'page': fn = model.page(query); break;
        case 'next': fn = model.getNextSeq(query); break;
        case 'popu': fn = model.popu(query); break;
    }

    return yield fn;
}

module.exports = mongoHandler;