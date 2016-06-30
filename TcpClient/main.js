'use strict';

let co = require('co');

let config = require('../Common/config.json');
let myLog4js = require('../Common/log');
let logIndex = myLog4js.logIndex;
let logBiz = myLog4js.logBiz;
let logSys = myLog4js.logSys;

/*
 *引入异步代码处理块 
 */
let readFileInfo = require('./fileService/readFileInfo');
let sendFileContent = require('./fileService/sendFileContent');
let paths = config.PATHS;

/*
 *业务处理
 */
function doBiz() {
  logIndex.info('doBiz is starting');

  //代码执行
  co(bizCode).catch(onError);

  logIndex.info('doBiz is finishing');
}

function* bizCode() {
  //装配，读取新增文件信息  sb('main.js',33)
  let readFileInfos = paths.map(function (item, index) {
    logBiz.info('fd offset=' + item.offset);
    return readFileInfo(item, index);
  });

  if (readFileInfos.length == 0) {
    logBiz.info('readFileInfos is null');
    return;
  }

  //执行,读取文件信息  sb('main.js',44)
  let infos = yield readFileInfos;

  if (!Array.isArray(infos)) {
    logBiz.info('config is wrong!');
    return;
  }

  //过滤不需要读取的文件 sb('main.js',47)
  let handleInfos = infos.filter(function (info) {
    logIndex.info(JSON.stringify(info));

    //全局变量，记录上一次处理的位置  sb('main.js',65)
    paths[info.index].offset = info.offset;

    if (info.len == 0) {
      logBiz.info('file no change or file has rename' + JSON.stringify(info));
      return false;
    }

    return true;
  });

  if (handleInfos.length == 0) {
    return;
  }
  //读取新增文件字符串  sb('main.js',75)
  let sendFileContents = handleInfos.map(function (info) {
    return readFileContent(info);
  });

  //发送文件内容
  yield sendFileContents;
}

/*
 *错误处理
 */
function onError(err) {
  logIndex.error("error:" + err.stack);
}

/*
 * 代码执行入口
 */
function main() {
  //没有配置文件，程序结束
  if (!paths || paths.length == 0) {
    logIndex.info('paths is null.');
    process.exit(0);
  }

  doBiz();
}

//执行
main();

/*
 *定期处理
*/
setInterval(doBiz, config.TCP_CLIENT_INTERVAL);
