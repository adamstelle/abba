'use strict';
// npm modules
const debug = require('debug')('abba:profile-mock');

// app modules
const Profile = require('../../model/profile.js');
const userMock = require('./user-mock.js');
const lorem = require('lorem-ipsum');

module.exports = function(done){
  debug('creating mock profile');
  let email = lorem({count: 2, units: 'word'}).split(' ').join('-');
  let exampleProfileData = {
    firstName: 'abba',
    lastName: 'team',
    phone: 4255555555,
    email: email,
    status: 'owner',
  };
  userMock.call(this, err => {
    if (err) return done(err);
    exampleProfileData.userID = this.tempUser._id.toString();
    new Profile(exampleProfileData).save()
    .then(profile => {
      this.tempProfile = profile;
      done();
    })
    .catch(done);
  });
};
