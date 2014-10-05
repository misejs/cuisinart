cuisinart
=========

[![Build Status](https://travis-ci.org/misejs/cuisinart.svg)](https://travis-ci.org/misejs/cuisinart)

A node js command line parser, built for mise.js

cuisinart is used for parsing command line arguments with modular subcommands. It will auto generate help based on the subcommands available.

Programs
---

You can create a program by calling `cuisinart.program()`:

```javascript
var cuisinart = require('cuisinart');
// you must give your program a name
var program = cuisinart.program('app');

program
  .description('Does nothing.')
// after setting up your app, process arguments to run the program.
  .parse(process.argv);
```

You can add commands to cuisinart by calling `.command()` on your program. You can also add usage by calling `.usage()`.
You can add any number of commands, they will be executed and listed in order.

```javascript
var cuisinart = require('cuisinart');
var program = cuisinart.program('app');

program
  .version('0.0.0')
  .usage('[command] [options] ...')
  .description('an app with some commands and options')
  .command(commandOne)
  .command(commandTwo)
  .parse(process.argv);
```

This will automatically generate the `--version` and `--help` commands, and print the following when running without args or with `--help`:

```shell
Usage: app [command] [options] ...
       an app with some commands and options

  -h, --help  prints this help.
  -v, --version  prints the version.

Commands:

  app command1 - first command.

    --o1  sets option one.

  app command2 - second command.

    --o2  sets option two.
```


You can also add default arguments that will be passed through after the options hash to command `run` methods:

```javascript
var cuisinart = require('cuisinart');
var program = cuisinart.program('app');

program
  .version('0.0.0')
  .usage('[command]')
  .description('an app with default arguments')
  .command(commandOne)
  .baseArgs('one','two')
  .parse(process.argv);
```

The arguments will then be added to the arguments of the run call, and can be received like so:

```javascript
var commandOne = {
  name : 'commandOne',
  run : function(options,arg1,arg2){
    // arg1 is 'one',arg2 is 'two'
  }
}
```

All of the default commands are synchronous, but if you have async commands, you can pass a callback to the `.parse` call:

```javascript
program
// setup program...
  .parse(process.argv,function(err){
    // this will be executed after all commands have run, and will return any errors they call back with
  });
```

Commands
---

A command is just an object with some mandatory keys. cuisinart asserts the keys, so it'll throw errors if you don't specify something mandatory.

```javascript
var command = {
  options : [
    {
      name : 'foo',
      flag : 'f',
      description : 'sets foo value'
    },{
      name : 'bar',
      longFlag : 'bar',
      description : 'if called with bar flag, bar will be true.'
    }
  ],
  root : false,
  name : 'complex',
  description : 'a complex command.',
  run : function(options){
    if(options.foo){
      console.log('foo is ' + options.foo);
    }
    console.log('bar enabled : '+(options.bar ? 'yes' : 'no'));
  }
};
```

Commands can be synchronous or async. Cuisinart expects that if a command is async, the callback will be called, invoked, or applied by the same name that it is passed to the `run` method of the command.

Examples

```javascript
var command = {
  name : 'async',
  run : function(options,baseArg,callback){
    setTimeout(function(){
      callback();
      // note that this can be called with any arguments, and can also be:
      // callback.call()
      // or
      // callback.apply()
    },1000);
  }
}
```

However, cuisinart is unable to detect that a command is async if you rename the callback or access it directly from the arguments list. So this example would be run *synchronously*, even though it is supposed to be async:

```javascript
var command = {
  name : 'bad-async',
  run : function(options,baseArg,callback){
    var args = Array.prototype.slice.call(arguments);
    var done = args.pop();
    setTimeout(function(){
      done();
      // because we're calling our callback by a different name, cuisinart is not able to detect that it should wait for this command.
      // as a result, this would accidentally call the next command before this one completes.
    },1000);
  }
}
```

There are 6 possible keys for a command, 2 of which are mandatory:

- name (mandatory) : this is the name of the command. Use this name to invoke the command.

example:
```shell
app complex
```

- run (mandatory) : this is a method that will be called when a command is run. The options hash will be passed to this function.

- options (optional) : you can specify options if you have them, these will be parsed and set either as true/false or with their values and passed to the run function

example:
```shell
app complex -f value --bar
```

- description (optional) : this is printed with the command when `--help` is called.

- root (optional) : this is used to indicate that this command does not need to be called explicitly - `--help` and `--version` are examples of root commands. They are essentially option-only commands. In normal cases, you would not specify this at all, as it defaults to false.

- stop (optional) : if this is set to true, it will prevent other commands from running after this command.

Notes
---

Bugs/PRs are welcome, file them here in the github issues.


- made at [Prix Fixe](http://prixfixeapp.com) by [@jesseditson](http://twitter.com/jesseditson) -
