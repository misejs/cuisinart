var cuisinart = require('../../cuisinart.js');

var command = {
  options : [
    {
      name : 'foo',
      flag : 'f',
      description : 'sets foo value'
    },{
      name : 'bar',
      longFlag : 'bar',
      description : 'if called with bar flag, bar will be true.'
    }
  ],
  name : 'complex',
  description : 'a complex command.',
  run : function(options,arg1,arg2){
    if(options.foo){
      console.log('foo is ' + options.foo);
    }
    console.log('bar enabled : '+(options.bar ? 'yes' : 'no'));
    console.log('arg1 :',arg1);
    console.log('arg2 :',arg2);
  }
};

(function(){
  var program = cuisinart.program('app');

  program
    .version('0.0.0')
    .usage('[command] [options]')
    .description('an app with some options')
    .command(command)
    .baseArgs('fizzle','bazzle')
    .parse(process.argv);
})();
