'use strict';

let account = require('./info/account');
/*
 *处理用户下单sb('src/express/service/manage.js',9)
 */
function handleResult(req) {
  let bizCode = req.query.bizCode;

  let fn = undefined;
  switch (bizCode) {
    case 'index': fn = index; break;  
    case 'roleLeveList': fn=roleLeveList; break; 
    case 'login':fn = login;break;
    case 'checklogin': fn = account; break;
    default: fn = undefined;
  }

  if (!fn) {
    throw new Error('type is wrong.type=' + type);
  }

  return fn(req);
}

function result(action, data, roleLeve, path, mClass, title, template) {
  return {
    "action": action,
    "data": data,
    "roleLeve": '111111111111111111111111111111',
    "path": path,
    "mClass": mClass,
    "title": title,
    "template": template
  };
}

function* index(query){
   return result('render', null, null, null, 'index', '管理后台', 'info/index');   
} 

function* login(query) {
  return result('render', null, null, null, 'login', '用户登录', 'info/login');
}

function* roleLeveList(req){;
  
  return result('render', null, null, null, 'roleLeveList', '权限列表', 'info/roleLeveList');
}

function* schedulelist(req) {
  let query = req.query;
  let list = yield getSchedule(query);

  let time = new Date();
  let year = time.getFullYear();
  let month = time.getMonth() + 1;
  month = month >= 10 ? month : '0' + month;
  let day = time.getDate();
  day = day >= 10 ? day : '0' + day;
  let dataStr = year + "-" + month + "-" + day + " ";
  let times = time.getTime();

  let firstScheudles = list.map(function (item) {
    let newTimes = new Date(dataStr + item.time).getTime();
    item['newTime'] = newTimes;
    return item;
  });

  let data = firstScheudles.sort(function (a, b) {
    return a.newTime - b.newTime;
  });
  return result('render', data, null, null, 'schedulelist', '时刻列表', 'info/schedulelist');
}

function* mongodb(req) {
  let roleLeve=req.roleLeve;
  let query=req.query;
  query["channel"]=roleLeve.channel;

  let data = yield redoLoad(query);
  return result('string', data);
}

module.exports = handleResult;
