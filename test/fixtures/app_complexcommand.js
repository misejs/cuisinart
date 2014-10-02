var processor = require('../../processor.js');

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
  run : function(options){
    if(options.foo){
      console.log('foo is ' + options.foo);
    }
    console.log('bar enabled : '+(options.bar ? 'yes' : 'no'));
  }
};

(function(){
  var program = processor.program('app');

  program
    .version('0.0.0')
    .usage('[command] [options]')
    .description('an app with some options')
    .command(command)
    .parse(process.argv);
})();
