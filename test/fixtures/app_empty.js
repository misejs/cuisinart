var processor = require('../../processor.js');

(function(){
  var program = processor.program('app');

  program
    .description('Does nothing.')
    .parse(process.argv);
})();
