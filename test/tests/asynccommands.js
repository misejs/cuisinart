var utils = require('../utils/utils');
var assert = require('assert');

var assertUsage = function(stdout,done){
  assert.ok(/Usage: app \[command\]/.test(stdout));
  assert.ok(/Commands:/.test(stdout));
  assert.ok(/app async/.test(stdout));
  done();
};

describe('an app with an async command and arguments', function () {
  before(function (done) {
    this.timeout(30000);
    utils.cleanup(done);
  });

  after(function (done) {
    this.timeout(30000);
    utils.cleanup(done);
  });

  describe('(no args)', function () {
    var dir;
    var bin;

    before(function (done) {
      utils.createEnvironment('app_asynccommand_args.js',function (err, newDir, binPath) {
        if (err) return done(err);
        dir = newDir;
        bin = binPath;
        done();
      });
    });

    it('should print options and exit',function(done){
      utils.run(dir,bin,[],function(err,stdout){
        if(err) return done(err);
        assertUsage(stdout,done);
      });
    });
  });

  describe('app async1', function () {

    describe('(default base args)',function(){
      var dir;
      var bin;

      before(function (done) {
        utils.createEnvironment('app_asynccommand_args.js',function (err, newDir, binPath) {
          if (err) return done(err);
          dir = newDir;
          bin = binPath;
          done();
        });
      });

      after(function (done) {
        this.timeout(30000);
        utils.cleanup(dir, done);
      });

      it('should properly pass the base args to the subcommand', function (done) {
        utils.run(dir, bin, ['async1'], function (err, stdout) {
          if (err) return done(err);
          assert.ok(/arg1 : fizzle/.test(stdout));
          assert.ok(/arg2 : bazzle/.test(stdout));
          done();
        });
      });

      it('should wait for the callback before completing',function(done){
        var async;
        setTimeout(function(){
          async = true;
        },150);
        utils.run(dir,bin,['async1'], function(err,stdout){
          if(err) return done(err);
          assert.ok(async);
          done();
        });
      })
    });

  });

});

describe('an app with an async command and arguments', function () {
  before(function (done) {
    this.timeout(30000);
    utils.cleanup(done);
  });

  after(function (done) {
    this.timeout(30000);
    utils.cleanup(done);
  });

  describe('(no args)', function () {
    var dir;
    var bin;

    before(function (done) {
      utils.createEnvironment('app_asynccommand.js',function (err, newDir, binPath) {
        if (err) return done(err);
        dir = newDir;
        bin = binPath;
        done();
      });
    });

    it('should print options and exit',function(done){
      utils.run(dir,bin,[],function(err,stdout){
        if(err) return done(err);
        assertUsage(stdout,done);
      });
    });
  });

  describe('app async2', function () {

    describe('(no args)',function(){
      var dir;
      var bin;

      before(function (done) {
        utils.createEnvironment('app_asynccommand.js',function (err, newDir, binPath) {
          if (err) return done(err);
          dir = newDir;
          bin = binPath;
          done();
        });
      });

      after(function (done) {
        this.timeout(30000);
        utils.cleanup(dir, done);
      });

      it('should wait for the callback before completing',function(done){
        var async;
        setTimeout(function(){
          async = true;
        },150);
        utils.run(dir,bin,['async2'], function(err,stdout){
          if(err) return done(err);
          assert.ok(async);
          done();
        });
      });

      it('should call the final callback that was passed to parse when complete',function(done){
        utils.run(dir,bin,['async2'], function(err,stdout){
          assert.ok(/Command completed/.test(stdout));
          done();
        });
      });
    });

  });

});
