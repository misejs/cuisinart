var utils = require('./_utils/utils');
var assert = require('assert');

var assertUsage = function(stdout,done){
  assert.ok(/Usage: app/.test(stdout));
  assert.ok(/--help/.test(stdout));
  assert.ok(/--version/.test(stdout));
  done();
};

describe('app with no options', function () {
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
      utils.createEnvironment('app_empty.js',function (err, newDir, binPath) {
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

  describe('-h', function () {
    var dir;
    var bin;

    before(function (done) {
      utils.createEnvironment('app_empty.js',function (err, newDir, binPath) {
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

    it('should print usage', function (done) {
      utils.run(dir, bin, ['-h'], function (err, stdout) {
        if (err) return done(err);
        assertUsage(stdout,done);
      });
    });
  });

  describe('--help', function () {
    var dir;
    var bin;

    before(function (done) {
      utils.createEnvironment('app_empty.js',function (err, newDir, binPath) {
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

    it('should print usage', function (done) {
      utils.run(dir, bin, ['--help'], function (err, stdout) {
        if (err) return done(err);
        assertUsage(stdout,done);
      });
    });
  });
});
