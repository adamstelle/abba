'use strict';

const mongoose = require('mongoose');
const Bedroom = require('./bedroom.js');
const Estimate = require('./estimate.js');
const Photo = require('./photo.js');
const createError = require('http-errors');
const debug = require('debug')('bedroom:model');

const bedroomSchema = mongoose.Schema({
  type: {type: String, required: true },
  bedSize: {type: String, required: true},
  bedType: {type: String, required: true},
  sleepNum: {type: Number, required: true},
  privateBath: {type: Boolean, required: true},
  userID: {type: mongoose.Schema.Types.ObjectId, required: true},
  residenceID: {type: mongoose.Schema.Types.ObjectId, required: true},
  photoArray: [{type: mongoose.Schema.Types.ObjectId}],
  estimateID: {type: mongoose.Schema.Types.ObjectId},
});

module.exports = mongoose.model('bedroom', bedroomSchema);

Bedroom.removeBedroom = function(bedroomID) {
  debug('Bedroom: removeBedroom');

  return Bedroom.findById(bedroomID)
    .catch(err => Promise.reject(createError(404, err.message)))
    .then(bed => {
      let removeChildren = [];
      if(bed.estimateID.length){
        removeChildren.push(Estimate.remove({bedID: bed._id}));
      }
      if(bed.photoArray.length){
        bed.photoArray.forEach(photoId => {
          removeChildren.push(Photo.remove({_id: photoId}));
        });
      }
      return Promise.all(removeChildren);
    })
    .then(() => {
      return Bedroom.remove({_id: bedroomID});
    });
};