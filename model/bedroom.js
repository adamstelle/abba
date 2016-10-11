'use strict';

const mongoose = require('mongoose');
const createError = require('http-errors');
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
  .catch(err => Promise.reject(createError(404, err.message)))
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
  return Bedroom.findById(id)
  .catch(err => Promise.reject(createError(404, err.message)))
  .then(profile => {
    profile.photo = photo._id;
    return profile.save();
  })
  .then(profile => {
    return profile;
  });
};
