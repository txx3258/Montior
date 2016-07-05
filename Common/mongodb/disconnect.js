'use strict';

function disConnect(model){
  if (model&&global.db){
    model.remove(function(){
      db.disconnect();
    });
  }
}

module.exports=disConnect;