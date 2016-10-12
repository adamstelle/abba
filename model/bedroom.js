'use strict';

const mongoose = require('mongoose');
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

const Bedroom = module.exports = mongoose.model('bedroom', bedroomSchema);

Bedroom.removeBedroom = function(bedroomID) {
  debug('Bedroom: removeBedroom');
  let tempBed = null;
  return Bedroom.findById(bedroomID)
    .catch(err => Promise.reject(createError(404, err.message)))
    .then(bed => {
      tempBed = bed;  
      return Estimate.remove({bedID: bedroomID});
    })
    .then(() =>{
      let removeChildren = [];
      tempBed.photoArray.forEach( photo => {
        removeChildren.push(Photo.findByIdAndRemove(photo._id));
      });
      return Promise.all(removeChildren);
    })
    .then(() => {
      return Bedroom.findByIdAndRemove(bedroomID);
    });
};