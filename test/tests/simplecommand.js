var utils = require('../utils/utils');
var assert = require('assert');

var assertUsage = function(stdout,done){
  assert.ok(/Usage: app \[command\]/.test(stdout));
  assert.ok(/Commands:/.test(stdout));
  assert.ok(/app simplecommand/.test(stdout));
  done();
};

describe('app with a simple command', function () {
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
      utils.createEnvironment('app_simplecommand.js',function (err, newDir, binPath) {
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

  describe('app simplecommand', function () {
    var dir;
    var bin;

    before(function (done) {
      utils.createEnvironment('app_simplecommand.js',function (err, newDir, binPath) {
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

    it('should execute the simple command', function (done) {
      utils.run(dir, bin, ['simplecommand'], function (err, stdout) {
        if (err) return done(err);
        assert.ok(/ran command with simple parameters/.test(stdout));
        done();
      });
    });
  });

});
