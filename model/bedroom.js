'use strict';

const mongoose = require('mongoose');
const createError = require('http-errors');
const Photo = require('../model/photo.js');
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

Bedroom.findByIdAndRemovePhoto = function(id, photoID){
  debug('findByIdAndRemovePhoto');
  return Photo.findById(photoID).remove()
  .catch(err => Promise.reject(createError(404, err.message)))
  .then(() => {
    return Bedroom.findById(id);
  })
  .then(bedroom => {
    console.log('bedroom', bedroom);
    bedroom.photos.pull({id:photoID});
    return bedroom.save();
  });
};
