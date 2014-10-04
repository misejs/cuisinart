
module.exports = {
  options : [
    {
      name : 'help',
      flag : 'h',
      longFlag : 'help',
      description : 'prints this help.'
    }
  ],
  root : true,
  run : function(){
    var self = this;
    var usage = self._usage ? ' ' + self._usage : '';
    console.log('Usage: ' + self._name + usage);
    if(self._description) console.log('       ' + self._description);
    console.log();
    var commands = self._commands;
    var printedRoot = false;
    commands.sort(function(a,b){
      return a.root && !b.root ? -1 : b.root && !a.root ? 1 : 0;
    }).forEach(function(command){
      if(!command.root && !printedRoot){
        console.log();
        console.log('Commands:');
        printedRoot = true;
      }
      self.printUsage(command);
    });
  }
};
