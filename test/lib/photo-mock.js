'use strict';
// npm modules
const debug = require('debug')('abba:photo-mock');

// app modules
const Photo = require('../../model/photo.js');
const awsMocks = require('./aws-mocks.js');
const userMock = require('./user-mock.js');

module.exports = function(done){
  debug('creating mock photo');
  let examplePhotoData = {
    name: 'whidbey',
    caption: 'beautiful property with a view',
    created: new Date(),
    imageURI: awsMocks.uploadMock.Location,
    objectKey: awsMocks.uploadMock.Key,
  };

  userMock.call(this, err => {
    if (err) return done(err);
    examplePhotoData.userID = this._id.toString();
    new Photo(examplePhotoData).save()
    .then(photo => {
      this.tempPhoto = photo;
      done();
    })
    .catch(done);
  });
};
