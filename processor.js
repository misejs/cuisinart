var helpCommand = require('./commands/help');

var defaultCommands = [
  helpCommand,
  require('./commands/version')
];

var processor = module.exports = {};

var matchCommand = function(args,command){
  var bothFlags = command.flag && command.longFlag;
  var pattern = bothFlags ? '(' : '';
  if(command.flag){
    pattern += ('\\s-' + command.flag);
  }
  if(command.longFlag){
    if(bothFlags) pattern += '|'
    pattern += ('\\s--' + command.longFlag);
  }
  if(bothFlags){
    pattern += ')';
  }
  pattern += '\\s([^-]+)?';
  var regex = new RegExp(pattern);
  var matches = args.join(' ').match(regex);
  if(matches){
    matches = matches.slice(1).map(String.prototype.trim.call);
  }
  return matches;
}

var printUsage = function(command){
  var padding = Array(4).join(' ');
  var string = '';
  if(command.flag) string += ('-' + command.flag);
  if(command.flag && command.longFlag) string += ', ';
  if(command.longFlag) string += ('--' + command.longFlag);
  var numSpaces = this._commandInfo.maxLength - string.length;
  var spaces = new Array(numSpaces + 1).join(' ');
  console.log(padding + string + spaces + command.description);
}

var commandUsageLength = function(command){
  // check the length of these arguments, so we know how much to indent the options.
  var length = (command.flag ? command.flag.length + 1 : 0)
             + (command.longFlag ? command.longFlag.length + 2 : 0)
             + (command.flag && command.longFlag ? 2 : 0) + 2;
  return length;
}

processor.program = function(){
  var self = this;

  // properties
  self._version;
  self._usage;
  self._description;
  self._commands = defaultCommands;
  self._commandInfo = {
    maxLength : defaultCommands.reduce(function(p,command){ return Math.max(p,commandUsageLength(command)); },0)
  };

  // setters
  self.version = function(version){
    self._version = version;
    return self;
  };
  self.usage = function(usage){
    self._usage = usage;
    return self;
  };
  self.description = function(description){
    self._description = description;
    return self;
  };
  self.command = function(){
    // TODO: validate this command.
    self._commandInfo.maxLength = Math.max(self._commandInfo.maxLength,length);
    // add the command to our commands
    self._commands.push(command);
    return self;
  }

  // methods
  self.printUsage = printUsage;

  self.parse = function(arguments){
    var matchedCommands = 0;
    for(var i in self._commands){
      var command = self._commands[i];
      var matches = matchCommand(arguments,command);
      if(matches){
        matchedCommands++;
        command.run.apply(self,matches);
        if(command.stop) return;
      }
    }
    if(!matchedCommands){
      // print the help if nothing matches
      helpCommand.run.apply(self);
    }
  };
  return self;
};
