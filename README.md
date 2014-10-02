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

There are 5 possible keys for a command, 2 of which are mandatory:

- name (mandatory) : this is the name of the command. Use this name to invoke the command.

example:
```shell
app complex
```

- options (optional) : you can specify options if you have them, these will be parsed and set either as true/false or with their values and passed to the run function

example:
```shell
app complex -f value --bar  
```

- description (optional) : this is printed with the command when `--help` is called.
- root (optional) : this is used to indicate that this command does not need to be called explicitly - `--help` and `--version` are examples of root commands. They are essentially option-only commands. In normal cases, you would not specify this at all, as it defaults to false.
- run (mandatory) : this is a method that will be called when a command is run. The options hash will be passed to this function.

Notes
---

Bugs/PRs are welcome, file them here in the github issues.


- made at [Prix Fixe](http://prixfixeapp.com) by [@jesseditson](http://twitter.com/jesseditson) -
