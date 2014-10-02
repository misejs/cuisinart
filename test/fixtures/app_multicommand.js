var processor = require('../../processor.js');

var commandOne = {
  options : [
    {
      name : 'opt1',
      longFlag : 'o1',
      description : 'sets option one.'
    }
  ],
  name : 'command1',
  description : 'first command.',
  run : function(options){
    console.log('running command1');
    if(options.opt1){
      console.log('opt1 enabled.');
    }
  }
};

var commandTwo = {
  options : [
    {
      name : 'opt2',
      longFlag : 'o2',
      description : 'sets option two.'
    }
  ],
  name : 'command2',
  description : 'second command.',
  run : function(options){
    console.log('running command2');
    if(options.opt2){
      console.log('opt2 enabled.');
    }
  }
};

(function(){
  var program = processor.program('app');

  program
    .version('0.0.0')
    .usage('[command] [options] ...')
    .description('an app with some options')
    .command(commandOne)
    .command(commandTwo)
    .parse(process.argv);
})();
