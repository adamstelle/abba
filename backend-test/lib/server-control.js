'use strict';

const debug = require('debug');

module.exports = exports = {};

exports.serverUp = function(server, done){
  if (!server.isRunning){
    debug('turning on server');
    server.listen(process.env.PORT, () => {
      server.isRunning = true;
      done();
    });
    return;
  }
  done();
};

exports.serverDown = function(server, done){
  if(server.isRunning){
    debug('turning off server');
    server.close(err => {
      if(err) return done(err);
      server.isRunning = false;
      debug('turned off server');
      done();
    });
    return;
  }
  done();
};
