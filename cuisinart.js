var assert = require('assert');
var helpCommand = require('./commands/help');

var defaultCommands = [
  helpCommand,
  require('./commands/version')
];

var cuisinart = module.exports = {};

var matchOption = function(args,option){
  var bothFlags = option.flag && option.longFlag;
  var pattern = bothFlags ? '(?:' : '';
  if(option.flag){
    pattern += ('\\s-' + option.flag);
  }
  if(option.longFlag){
    if(bothFlags) pattern += '|'
    pattern += ('\\s--' + option.longFlag);
  }
  if(bothFlags){
    pattern += ')';
  }
  pattern += '(?:\\s|$)([^-]+)?';
  var regex = new RegExp(pattern);
  var matches = args.join(' ').match(regex);
  if(matches){
    return matches[1] ? matches[1].trim() : true;
  } else {
    return false;
  }
}

var matchCommand = function(args,command){
  if(command.name){
    var regex = new RegExp('(\\s|^)' + command.name + '(\\s|$)');
    return regex.test(args.join(' '));
  } else {
    return false;
  }
}

var usageLength = function(option){
  // check the length of these arguments, so we know how much to indent the options.
  var length = (option.flag ? option.flag.length + 1 : 0)
             + (option.longFlag ? option.longFlag.length + 2 : 0)
             + (option.flag && option.longFlag ? 2 : 0) + 2;
  return length;
}

var optionMaxLength = function(command){
  return (command.options || []).reduce(function(p,option){ return Math.max(p,usageLength(option)); },0);
}

var printUsage = function(command){
  var commandPadding = '  ';
  var optionPadding = '    ';
  var commandString = command.usage;
  var maxLength = optionMaxLength(command);
  if (!command.root) {
    console.log();
    var description = command.description ? ' - ' + command.description : '';
    console.log(commandPadding + this._name + ' ' + command.name + description);
    console.log();
  } else {
    optionPadding = commandPadding;
  }
  (command.options || []).forEach(function(option){
    var string = '';
    if(option.flag) string += ('-' + option.flag);
    if(option.flag && option.longFlag) string += ', ';
    if(option.longFlag) string += ('--' + option.longFlag);
    var numSpaces = maxLength - string.length;
    var spaces = new Array(numSpaces + 1).join(' ');
    console.log(optionPadding + string + spaces + (option.description || ''));
  });
}

cuisinart.program = function(name){
  assert(name,'programs must have names.');
  var self = this;

  // properties
  self._name = name;
  self._version;
  self._usage;
  self._description;
  self._commands = defaultCommands;
  self._baseArgs = [];

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
  self.command = function(command){
    assert(command.root || command.name,'Non-root commands must have a name');
    assert(!command.options || Array.isArray(command.options),'Command options must be an array');
    if(command.options){
      command.options.forEach(function(option){
        assert(!option.flag || (typeof option.flag == 'string' && option.flag.length == 1),'Option flags must be single letter strings.');
        assert(!option.longFlag || (typeof option.longFlag == 'string' && option.longFlag.length > 1),'Option long flags must be multiple letter strings.');
        assert(!option.description || (typeof option.description == 'string'),'Option description must be a string.');
      });
    }
    // TODO: fully validate this command.
    // add the command to our commands
    self._commands.push(command);
    return self;
  }
  self.baseArgs = function(){
    self._baseArgs = self._baseArgs.concat(Array.prototype.slice.call(arguments));
    return self;
  };

  // methods
  self.printUsage = printUsage;

  self.parse = function(args){
    var matchedCommands = 0;
    for(var i in self._commands){
      var command = self._commands[i];
      var matched = matchCommand(args,command);
      if(matched){
        matchedCommands++;
        var optionMap = (command.options || []).reduce(function(o,option){
          var value = matchOption(args,option);
          if(value){
            o[option.name] = value;
          }
          return o;
        },{});
        command.run.apply(self,[optionMap].concat(self._baseArgs));
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