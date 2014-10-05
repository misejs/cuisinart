var utils = require('../utils/utils');
var assert = require('assert');

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
    console.log('command ran');
  }
};

describe('when called with unmatched arguments', function () {

  it('should properly return the unmatched arguments',function(){
    var program = cuisinart.program('app');

    program
      .usage('[command]')
      .description('an app with an async command and no base args')
      .command(command)

    var unmatched = program.unmatchedArgs(['command','-f','--bar','barargument','extra']);

    assert.deepEqual(unmatched,['extra']);
  });
});
