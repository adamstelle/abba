'use strict';
// npm modules
const debug = require('debug')('abba:profile-photo-mock');

// app modules
const Photo = require('../../model/photo.js');
const Profile = require('../../model/profile.js');
const awsMocks = require('../../lib/aws-mocks.js');
const profileMock = require('./profile-mock.js');

module.exports = function(done){
  debug('creating mock photo');
  let examplePhotoData = {
    name: 'whidbey',
    caption: 'beautiful property with a view',
    created: new Date(),
    imageURI: awsMocks.uploadMock.Location,
    objectKey: awsMocks.uploadMock.Key,
  };

  profileMock.call(this, err => {
    if (err) return done(err);
    examplePhotoData.userID = this.tempProfile.userID.toString();
    new Photo(examplePhotoData).save()
    .then(photo => {
      Profile.findByIdAndAddPhoto(this.tempProfile._id, photo)
      .then(() => {
        this.tempPhoto = photo;
        done();
      })
      .catch(done);
    })
    .catch(done);
  });
};
