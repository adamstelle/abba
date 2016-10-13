'use strict';
// npm modules
const debug = require('debug')('abba:bedroom-photo-mock');

// app modules
const Photo = require('../../model/photo.js');
const Bedroom = require('../../model/bedroom.js');
const awsMocks = require('../../lib/aws-mocks.js');
const bedroomMock = require('./bedroom-mock.js');

module.exports = function(done){
  debug('creating mock photo');
  let examplePhotoData = {
    name: 'whidbey',
    caption: 'beautiful property with a view',
    created: new Date(),
    imageURI: awsMocks.uploadMock.Location,
    objectKey: awsMocks.uploadMock.Key,
  };

  bedroomMock.call(this, err => {
    if (err) return done(err);
    examplePhotoData.userID = this.tempBedroom.userID.toString();
    new Photo(examplePhotoData).save()
    .then(photo => {
      let photoArray = [];
      photoArray.push(photo);
      Bedroom.findByIdAndAddPhotos(this.tempBedroom._id, photoArray)
      .then(() => {
        this.tempPhoto = photo;
        done();
      })
      .catch(done);
    })
    .catch(done);
  });
};
