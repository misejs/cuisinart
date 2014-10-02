var cuisinart = require('../../cuisinart.js');

(function(){
  var program = cuisinart.program('app');

  program
    .description('Does nothing.')
    .parse(process.argv);
})();
