
module.exports = {
  options : [{
    name : 'version',
    flag : 'v',
    longFlag : 'version',
    description : 'prints the version.'
  }],
  root : true,
  run : function(){
    var self = this;
    console.log((self.name ? self.name + ' ' : '') + 'version ' + (self._version ? self._version : 'unknown'));
  }
};
