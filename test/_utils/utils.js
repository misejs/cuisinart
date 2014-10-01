var assert = require('assert');
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
var fork = require('child_process').fork;
var mkdirp = require('mkdirp');
var path = require('path');
var rimraf = require('rimraf');
var async = require('async');
var fs = require('fs');

var utils = module.exports = {
  tempDir : path.resolve(__dirname, '../../temp'),
  cleanup : function(dir, callback) {
    if (typeof dir === 'function') {
      callback = dir;
      dir = utils.tempDir;
    }

    rimraf(utils.tempDir, function (err) {
      callback(err);
    });
  },
  copyFile : function(src,dest,callback){
    var isDone;
    var done = function(err){
      if(!isDone){
        isDone = true;
        callback(err);
      }
    };
    var read = fs.createReadStream(src);
    read.on('error',callback);
    var write = fs.createWriteStream(dest);
    write.on('error',callback);
    write.on('close',function(){ callback(); });
    read.pipe(write);
  },
  createEnvironment : function(app,callback) {
    var num = process.pid + Math.random();
    var dir = path.join(utils.tempDir, ('app-' + num));
    var templatePath = path.join(__dirname, '../_fixtures/',app);
    var appPath = path.join(dir,'app.js');
    mkdirp(dir, function ondir(err) {
      if (err) return callback(err);
      utils.copyFile(templatePath,appPath,function(err){
        callback(err, dir, appPath);
      });
    });
  },
  npmInstall : function(dir, callback) {
    var npm_lazy = fork('./node_modules/npm_lazy/bin/npm_lazy',['--config',path.join(__dirname,'npm_lazy_config.js')],function(){});
    exec('npm install --registry http://localhost:5656', {cwd: dir},function(){
      npm_lazy.kill('SIGKILL');
      callback();
    });
  },
  run : function(dir, binPath, args, callback) {
    var argv = [binPath].concat(args);
    var chunks = [];
    var exec = process.argv[0];
    var stderr = [];

    var child = spawn(exec, argv, {
      cwd: dir
    });

    child.stdout.on('data', function ondata(chunk) {
      chunks.push(chunk);
    });
    child.stderr.on('data', function ondata(chunk) {
      stderr.push(chunk);
    });

    child.on('error', callback);
    child.on('exit', function onexit() {
      var err = null;
      var stdout = Buffer.concat(chunks)
        .toString('utf8')
        .replace(/\x1b\[(\d+)m/g, '_color_$1_');

      try {
        assert.equal(Buffer.concat(stderr).toString('utf8'), '');
      } catch (e) {
        err = e;
      }

      callback(err, stdout);
    });
  }
};
