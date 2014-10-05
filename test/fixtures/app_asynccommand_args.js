var cuisinart = require('../../cuisinart.js');

var async1 = {
  name : 'async1',
  description : 'an async command.',
  run : function(options,arg1,arg2,callback){
    console.log('arg1 :',arg1);
    console.log('arg2 :',arg2);
    setTimeout(function(){
      callback();
    },200);
  }
};

(function(){
  var program = cuisinart.program('app');

  program
    .usage('[command]')
    .description('an app with an async command')
    .command(async1)
    .baseArgs('fizzle','bazzle')
    .parse(process.argv);
})();
