var processor = require('../../processor.js');

var command = {
  name : 'simplecommand',
  description : 'performs a very simple command.',
  run : function(){
    console.log('ran command with simple parameters.');
  }
};

(function(){
  var program = processor.program('app');

  program
    .version('0.0.0')
    .usage('[command]')
    .description('an app with a simple command')
    .command(command)
    .parse(process.argv);
})();
