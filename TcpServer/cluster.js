 'use strict';

 let child_process = require('child_process');
 let options = {
     encoding: 'utf8'
 };

 function makeChild() {
     let child = child_process.fork('child.js',[],options);
     return child;
 }


let child_1 = makeChild();
let child_2 = makeChild();
let child_3 = makeChild();

setInterval(()=>{
    child_1.send('child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1child_1');
    child_2.send('child_2');
    child_3.send('child_3');
},5000);


// const cluster = require('cluster');

// if (cluster.isMaster) {
//     var worker1 = cluster.fork();
//     worker1.on('listening', (address) => {
//         console.log('worker1');
//         worker1.send('shutdown1');
//     });
//     worker1.on('disconnect', () => {
//     });

//     var worker2 = cluster.fork();
//     worker2.on('listening', (address) => {
//         console.log('worker2');
//         worker2.send('shutdown2');
//     });
//     worker2.on('disconnect', () => {
//     });

// } else if (cluster.isWorker) {
//     const net = require('net');
//     var server = net.createServer((socket) => {
//         // connections never end
//         socket.on('data', function (buffer) {
//             console.log(process.pid+"<===>"+buffer.toString('utf8'));
//         });
//     });

//     server.listen(8000);

//     if (process.getegid) {
//         console.log(`Current gid: ${process.pid}`);
//     }

//     process.on('message', (msg) => {
//         if (msg === 'shutdown') {
//             // initiate graceful close of any connections to server
//         }
//     });
// }