'use strict';

const debug = require('debug')('abba:clean-up-mock');

const User = require('../../model/user.js');
const Photo = require('../../model/photo.js');
const Profile = require('../../model/profile.js');

module.exports = function(done) {
  debug('cleaning up database');
  Promise.all([
    User.remove({}),
    Photo.remove({}),
    Profile.remove({}),
  ])
  .then(() => done())
  .catch(done);
};
