var cuisinart = require('../../cuisinart.js');

var command = {
  options : [
    {
      name : 'foo',
      flag : 'f',
      description : 'foo'
    },{
      name : 'bar',
      longFlag : 'bar',
      description : 'bar'
    }
  ],
  name : 'command',
  run : function(options){
    console.log('unmatched arguments:',this.unmatchedArgs.join(','));
  }
};

(function(){

  var program = cuisinart.program('app');

  program
  .usage('[command]')
  .description('an app with extra args')
  .command(command)
  .parse(process.argv)

})();
