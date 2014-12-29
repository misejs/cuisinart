var assert = require('assert');
var helpCommand = require('./commands/help');
var async = require('async');

var defaultCommands = [
  helpCommand,
  require('./commands/version')
];

var cuisinart = module.exports = {};

var optionMatches = function(args,option){
  var bothFlags = option.flag && option.longFlag;
  var pattern = '(';
  if(option.flag){
    pattern += ('\\s-' + option.flag);
  }
  if(option.longFlag){
    if(bothFlags) pattern += '|'
    pattern += ('\\s--' + option.longFlag);
  }
  pattern += ')';
  pattern += '(?:\\s|$)([^-\\s]+)?';
  var regex = new RegExp(pattern);
  var matches = args.join(' ').match(regex);
  return matches && matches[0] ? matches.splice(1) : matches;
}

var matchOption = function(args,option){
  var matches = optionMatches(args,option);
  if(matches){
    return matches[1] ? matches[1].trim() : true;
  } else {
    return false;
  }
}

var matchCommand = function(args,command){
  if(command.name){
    var regex = new RegExp('(?:\\s|^)(' + command.name + ')(?:\\s|$)');
    var matches = args.join(' ').match(regex);
    return matches && matches[1] ? matches[1].trim() : false;
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

var hasCallback = function(fn){
  // check if the following are true:
  // 1. we have a named argument
  // 2. we call, apply, or invoke a variable by that name in the method body
  // This gives us a good estimate if the function is async or not.
  var fnString = fn.toString();
  var argMatches = fnString.match(/^function \((?:.*[,\s]+)?([\w]+)\){/);
  if(!argMatches) return false;
  var lastArg = argMatches[1];
  var cbPattern = new RegExp(';?[\\s\\S]*' + lastArg + '\\.?(call|apply)?\\([^\\)]*\\)[\\s\\S]*;?');
  return cbPattern.test(fnString);
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
  self._args = [];

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
  self.unmatchedArgs = function(args){
    var argsString = Array.prototype.slice.call(args,2).join('##');
    this._commands.forEach(function(command){
      var match = matchCommand(args,command);
      if(match){
        argsString = argsString.replace(match,'');
        (command.options || []).forEach(function(option){
          var optionMatch = optionMatches(args,option);
          if(optionMatch){
            argsString = argsString.replace(optionMatch.join('##').trim(),'');
          }
        });
      }
    });
    return argsString.split('##').filter(function(v){return v;});
  }

  // methods
  self.printUsage = printUsage;

  self.run = function(command,args,done){
    var optionMap = (command.options || []).reduce(function(o,option){
      var value = matchOption(args,option);
      if(value){
        o[option.name] = value;
      }
      return o;
    },{});
    var calledBack;
    var complete = function(err){
      if(calledBack) return;
      calledBack = true;
      if(err) return done(err);
      if(command.stop) return done(new Error('complete'));
      done();
    };
    command.run.apply(self,[optionMap].concat(self._baseArgs,complete));
    // if we don't detect a callback, assume that this is synchronous.
    if(!hasCallback(command.run)) complete();
  }

  self.parse = function(args,callback){
    args = Array.prototype.slice.call(args,2);
    self.args = args;
    var matchedCommands = 0;
    async.forEachSeries(self._commands,function(command,done){
      var matched = matchCommand(args,command);
      if(matched){
        matchedCommands++;
        self.run(command,args,done);
      } else {
        done();
      }
    },function(err){
      if(!matchedCommands){
        // print the help if nothing matches
        helpCommand.run.apply(self);
      }
      if(callback) callback(err);
    });
  };
  return self;
};
