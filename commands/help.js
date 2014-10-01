
module.exports = {
  flag : 'h',
  longFlag : 'help',
  description : 'prints this help.',
  run : function(){
    var self = this;
    if(self._usage){
      console.log('Usage: ' + self._usage);
      console.log();
    }
    var commands = self._commands;
    commands.forEach(function(command){
      self.printUsage(command);
    });
  }
};
