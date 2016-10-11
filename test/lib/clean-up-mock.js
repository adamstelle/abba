'use strict';

const debug = require('debug')('abba:clean-up-mock');

const User = require('../../model/user.js');
const Photo = require('../../model/photo.js');
const Profile = require('../../model/profile.js');
const Residence = require('../../model/residence.js');

module.exports = function(done) {
  debug('cleaning up database');
  Promise.all([
    User.remove({}),
    Photo.remove({}),
    Profile.remove({}),
    Residence.remove({}),
  ])
  .then(() => done())
  .catch(done);
};
