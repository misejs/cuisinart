var utils = require('../utils/utils');
var assert = require('assert');

var assertUsage = function(stdout,done){
  assert.ok(/Usage: app \[command\] \[options\] \.\.\./.test(stdout));
  assert.ok(/Commands:/.test(stdout));
  assert.ok(/app command1[\s\S]+--o1/.test(stdout));
  assert.ok(/app command2[\s\S]+--o2/.test(stdout));
  assert.ok(!/app command2[\s\S]+--o1/.test(stdout));
  done();
};

describe('app with multiple commands', function () {
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
      utils.createEnvironment('app_multicommand.js',function (err, newDir, binPath) {
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

  describe('app command1 --o1', function () {
    var dir;
    var bin;

    before(function (done) {
      utils.createEnvironment('app_multicommand.js',function (err, newDir, binPath) {
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

    it('should run command1 with option o1', function (done) {
      utils.run(dir, bin, ['command1','--o1'], function (err, stdout) {
        if (err) return done(err);
        assert.ok(!/(command2|o2)/.test(stdout));
        assert.ok(/command1/.test(stdout));
        assert.ok(/opt1 enabled/.test(stdout));
        done();
      });
    });
  });

  describe('app command2 --o2', function () {
    var dir;
    var bin;

    before(function (done) {
      utils.createEnvironment('app_multicommand.js',function (err, newDir, binPath) {
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

    it('should run command2 with option o2', function (done) {
      utils.run(dir, bin, ['command2','--o2'], function (err, stdout) {
        if (err) return done(err);
        assert.ok(!/(command1|o1)/.test(stdout));
        assert.ok(/command2/.test(stdout));
        assert.ok(/opt2 enabled/.test(stdout));
        done();
      });
    });
  });

  describe('app command1 --o1 command2 --o2', function () {
    var dir;
    var bin;

    before(function (done) {
      utils.createEnvironment('app_multicommand.js',function (err, newDir, binPath) {
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

    it('should run command1 with option o1 and command2 with o2', function (done) {
      utils.run(dir, bin, ['command1','--o1','command2','--o2'], function (err, stdout) {
        if (err) return done(err);
        assert.ok(/command1/.test(stdout));
        assert.ok(/opt1 enabled/.test(stdout));
        assert.ok(/command2/.test(stdout));
        assert.ok(/opt2 enabled/.test(stdout));
        done();
      });
    });
  });

});
