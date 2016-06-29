'use strict';

function dalFileHandler(str,type){
  var result=[],rtn;

  //正则表达式
  var reg=/(\d\d\d\d-\d\d-\d\d)T(\d\d:\d\d:\d\d).*?\[(ParNew: .*?\),(.*?)secs)\]/g;
  while((rtn=reg.exec(str))!=null){ 
      result.push({
        "x":rtn[1],
        'y':rtn[6],
        'z':rtn[2]+rtn[3]+rtn[5],
        'l':'ms',
        'r':'date',
        't':rtn[4]
      }); 
  }
  
  return JSON.stringify(result);
}

module.exports=dalFileHandler;
