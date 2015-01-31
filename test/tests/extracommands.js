var utils = require('../utils/utils');
var assert = require('assert');

describe('when called with unmatched arguments', function () {

  var dir;
  var bin;

  before(function (done) {
    utils.createEnvironment('app_unmatchedargs.js',function (err, newDir, binPath) {
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

  it('should properly return the unmatched arguments',function(done){
    utils.run(dir,bin,['command','-f','foo','--bar','bar','extra','arguments'],function(err,stdout){
      if (err) return done(err);
      assert.ok(/unmatched arguments: extra,arguments/.test(stdout));
      done();
    });
  });
});
