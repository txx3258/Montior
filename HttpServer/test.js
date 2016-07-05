'use strict';

let request = require('request');

// var r = request.post('http://service.com/upload')
// var form = r.form()
// form.append('my_field', 'my_value');

// apikey、content、op、phone、templateId、ts

// var params={
//     "apiKey":"6d2c470901a2114fc03cc3973ef1d889",
//     "content":"888888",
//     "op":"Sms.send",
//     "phone":"18200113292",
//     "templateId":"1194",
//     "ts":new Date().getTime()
// }

// var signs=[];
// Object.keys(params).forEach((key)=>{
//     signs.push(key+"="+params[key]);
// });
// console.log(JSON.stringify(signs.join('')));

// var signKey=JSON.stringify(signs.join(''))+'D5087D563F582AFB';

// var crypto = require('crypto');
// var content = signKey;
// var md5 = crypto.createHash('md5');
// md5.update(content);
// var signVal = md5.digest('hex');

// params["sig"] = signVal;

// console.log(JSON.stringify(params));
// request.post({url:'http://api.sms.testin.cn/sms',form:params},function(err, response, body) {
//     console.log(err);
//     console.log(JSON.stringify(response));
//     console.log(body+'body');
// })
let url='https://koudaitong.com/v2/statcenter/dashboard';
request(url,(err,res,body)=>{
    console.log(body);
})


