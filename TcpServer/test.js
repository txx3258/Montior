'use strict';

let child_process = require('child_process');

let child = require('child_process');
child_process.fork('./server.js', ['json'], {encoding:'utf8' });
child_process.fork('./server.js', ['stream'], {encoding:'utf8'});

process.on('message', function(m) {
  console.log('child message:', m);
});