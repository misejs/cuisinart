
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
    if(self.description) console.log('       ' + self._description);
    console.log();
    var commands = self._commands;
    var printedRoot = false;
    commands.sort(function(a,b){
      return a.root ? b.root ? 0 : -1 : 1;
    }).forEach(function(command){
      if(!command.root){
        console.log();
        console.log('Commands:');
        printedRoot = true;
      }
      self.printUsage(command);
    });
  }
};
