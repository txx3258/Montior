'use strict';

let perfHandler = require('./handler/perfHandler');

process.on('message',(msg)=>{
    perfHandler(msg);
});