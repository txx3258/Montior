'use strict';
let co = require('co');

/**
 * 处理新生代与老年代
*/
//let newReg=/(\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d\.\d\d\d)+.*?\[ParNew: (\d+)K->(\d+)K\((\d+)K\), (.*?) secs\].*?\((\d+)K\)/;
let newReg = /(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3})+.*?\[ParNew: (\d+)K->(\d+)K\((\d+)K\), (.*?) secs\].*?\((\d+)K\)/g;

let oldTmps = [], timeCallBack = undefined, isTimeBack=false;

function gcFileHandler(str, info,sendTcpServer) {
  let result = [], rtn = undefined, isOld = 0;
  if (!str || str.length < 20) {
    return;
  }

  let contents = str.split('\n');
  contents.forEach((content) => {
    let con = newReg.exec(content);
    if (con) {
      result.push(buildYongGC(con,info));
      return;
    }

    //老年代,假设老年代一分钟执行一次
    if (isOld == 1 || content.indexOf('CMS-initial-mark') !== -1) {
      //设置时间超时1分钟
      if (!timeCallBack) {
        oldTmps.push({ "ip": info.ip, "type": info.type, "name": info.name });

        timeCallBack = setTimeout(function () {
          isTimeBack = true;
        }, 12000);
      }

      oldTmps.push(content);

      if (content.indexOf('CMS-concurrent-reset:') !== -1) {
        isOld = 2;
      } else {
        isOld = 1;
      }
    }
  });

  if (isOld == 2||isTimeBack) {
    //清理时间戳
    clearTimeout(timeCallBack);
    isOld = 0;

    result.push(buildOldGC(oldTmps[0], oldTmps.join('')));

    oldTmps = [];
    isTimeBack=false;
  }

  return JSON.stringify(result);
}


//
function buildOldGC(head, content) {
  let result = {};

  let oldReg = /(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3})+.*?\[GC \[1 CMS-initial-mark: (\d+)K\((\d+)K\)\].*?K\((\d+)K\), (.*?) secs\]/;
  let initial_mark = oldReg.exec(content);
  if (initial_mark) {
    result["time"] = initial_mark[1];
    result["heapSize"] = initial_mark[4];
    result["oldSize"] = initial_mark[3];
    result["CMS-concurrent-mark_size"] = initial_mark[2];
    result["CMS-initial-mark_pauseTime"] = initial_mark[5];
  }

  let concurrent_mark = /\[CMS-concurrent-mark: (.*?)\//.exec(content);
  if (concurrent_mark) {
    result["CMS-concurrent-mark"] = concurrent_mark[1];
  }

  let concurrent_preclean = /\[CMS-concurrent-preclean: (.*?)\//.exec(content);
  if (concurrent_preclean) {
    result['CMS-concurrent-preclean'] = concurrent_preclean[1];
  }

  let concurrent_abortable_preclean = /\[CMS-concurrent-abortable-preclean: (.*?)\//.exec(content);
  if (concurrent_abortable_preclean) {
    result['CMS-concurrent-abortable-preclean'] = concurrent_abortable_preclean[1];
  }

  let concurrent_sweep = /\[CMS-concurrent-sweep: (.*?)\//.exec(content);
  if (concurrent_sweep) {
    result['CMS-concurrent-sweep'] = concurrent_sweep[1];
  }

  let concurrent_reset = /\[CMS-concurrent-reset: (.*?)\//.exec(content);
  if (concurrent_reset) {
    result['CMS-concurrent-reset'] = concurrent_reset[1];
  }


  let remark = /\[1 CMS-remark: (\d+)K.*?K\), (.*?) secs\]/.exec(content);
  if (remark) {
    result['CMS-remark_size'] = remark[1];
    result['CMS-remark_pauseTime'] = remark[2];
  }

  result["ip"] = head.ip;
  result["type"] = "FGC";
  result["name"] = head.name;

  return result;
}


function buildYongGC(contents, ip, name) {
  var result = {
    "ip": ip,
    "name": name,
    "type": "YGC",
    "phase": "ParNew",
    "time": contents[1], //时间
    "beforeGC": contents[2],
    "youngSize": contents[3],
    "afterGC": contents[4],
    "pauseTime": contents[5],
    "heapSize": contents[6]//heap大小   
  };

  return result;
}

module.exports = gcFileHandler;
