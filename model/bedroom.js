'use strict';

const mongoose = require('mongoose');

const Photo = require('./photo.js');
const Estimate = require('./estimate.js');
const debug = require('debug')('abba:bedroom');

const bedroomSchema = mongoose.Schema({
  type: {type: String, required: true },
  bedSize: {type: String, required: true},
  bedType: {type: String, required: true},
  sleepNum: {type: Number, required: true},
  privateBath: {type: Boolean, required: true},
  userID: {type: mongoose.Schema.Types.ObjectId, required: true},
  residenceID: {type: mongoose.Schema.Types.ObjectId, required: true},
  photos: [{type: mongoose.Schema.Types.ObjectId, ref: 'photos'}],
  estimateID: {type: mongoose.Schema.Types.ObjectId},
});

const Bedroom = module.exports = mongoose.model('bedroom', bedroomSchema);

Bedroom.findByIdAndAddPhotos = function(id, photos){
  debug('findByIdAndAddPhotos');
  return Bedroom.findById(id)
  .then(bedroom => {
    photos.forEach(i => {
      bedroom.photos.push(i);
    });
    return bedroom.save();
  })
  .then(bedroom => {
    return bedroom;
  });
};

Bedroom.findByIdAndRemovePhoto = function(id, photo){
  debug('findByIdAndRemovePhoto');
  return Photo.findById(photo._id).remove()
  .then(() => {
    return Bedroom.findById(id);
  })
  .then(bedroom => {
    bedroom.photos.pull({_id:photo._id});
    return bedroom.save();
  });
};

Bedroom.removeBedroom = function(bedroomID) {
  debug('removeBedroom');
  let tempBed = null;
  return Bedroom.findById(bedroomID)
    .then(bed => {
      tempBed = bed;
      return Estimate.remove({bedID: bedroomID});
    })
    .then(() =>{
      let removeChildren = [];
      tempBed.photos.forEach( photo => {
        removeChildren.push(Photo.findByIdAndRemove(photo._id));
      });
      return Promise.all(removeChildren);
    })
    .then(() => {
      return Bedroom.findByIdAndRemove(bedroomID);
    });
};
