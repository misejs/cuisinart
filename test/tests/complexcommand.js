var utils = require('../utils/utils');
var assert = require('assert');

var assertUsage = function(stdout,done){
  assert.ok(/Usage: app \[command\] \[options\]/.test(stdout));
  assert.ok(/Commands:/.test(stdout));
  assert.ok(/app complex/.test(stdout));
  assert.ok(/-f\s/.test(stdout));
  assert.ok(/^\s+--bar/m.test(stdout));
  done();
};

describe('app with a complex command', function () {
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
      utils.createEnvironment('app_complexcommand.js',function (err, newDir, binPath) {
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

  describe('app complexcommand', function () {

    describe('(no options)',function(){
      var dir;
      var bin;

      before(function (done) {
        utils.createEnvironment('app_complexcommand.js',function (err, newDir, binPath) {
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

      it('should execute the complex without foo or bar', function (done) {
        utils.run(dir, bin, ['complex'], function (err, stdout) {
          if (err) return done(err);
          assert.ok(!/foo/.test(stdout));
          assert.ok(/bar enabled : no/.test(stdout));
          done();
        });
      });
    });
    describe('-f baz',function(){
      var dir;
      var bin;

      before(function (done) {
        utils.createEnvironment('app_complexcommand.js',function (err, newDir, binPath) {
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

      it('should set the correct value for foo', function (done) {
        utils.run(dir, bin, ['complex','-f','baz'], function (err, stdout) {
          if (err) return done(err);
          assert.ok(/foo is baz/.test(stdout));
          assert.ok(/bar enabled : no/.test(stdout));
          done();
        });
      });
    });

    describe('--bar',function(){
      var dir;
      var bin;

      before(function (done) {
        utils.createEnvironment('app_complexcommand.js',function (err, newDir, binPath) {
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

      it('should set bar to enabled', function (done) {
        utils.run(dir, bin, ['complex','--bar'], function (err, stdout) {
          if (err) return done(err);
          assert.ok(!/foo/.test(stdout));
          assert.ok(/bar enabled : yes/.test(stdout));
          done();
        });
      });
    });

    describe('-f dickbutt --bar',function(){
      var dir;
      var bin;

      before(function (done) {
        utils.createEnvironment('app_complexcommand.js',function (err, newDir, binPath) {
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

      it('should set the correct value for foo', function (done) {
        utils.run(dir, bin, ['complex','-f','dickbutt','--bar'], function (err, stdout) {
          if (err) return done(err);
          assert.ok(/foo is dickbutt/.test(stdout));
          assert.ok(/bar enabled : yes/.test(stdout));
          done();
        });
      });

    });

  });

});
