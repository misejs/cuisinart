var cuisinart = require('../../cuisinart.js');

var async2 = {
  name : 'async2',
  description : 'another async command.',
  run : function(options,callback){
    setTimeout(function(){
      callback.apply(null,['something','anotherarg'])
    },200);
  }
};

(function(){
  var program = cuisinart.program('app');

  program
    .usage('[command]')
    .description('an app with an async command and no base args')
    .command(async2)
    .parse(process.argv,function(){
      console.log('Command completed');
    });
})();
