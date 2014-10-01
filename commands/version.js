
module.exports = {
  flag : 'v',
  longFlag : 'version',
  description : 'prints the version.',
  run : function(){
    var self = this;
    console.log((self.name ? self.name + ' ' : '') + 'version ' + (self._version ? self._version : 'unknown'));
  }
};
