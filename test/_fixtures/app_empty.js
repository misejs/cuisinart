var processor = require('../../processor.js');

var run = function(){
  var program = processor.program();

  program
    .version()
    .usage('app')
    .description('Does nothing.')
    .parse(process.argv);
}

run();
