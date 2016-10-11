'use strict';

// Profile
// -  residenceID - array pop - need to add
// -  UserID - reference

const mongoose = require('mongoose');
const Promise = require('bluebird');
const createError = require('http-errors');
const debug = require('debug')('abba:profile');

const profileSchema = mongoose.Schema({
  firstName: {type: String, required: true},
  lastName: {type: String, required: true},
  phone: {type: String, required: true},
  email: {type: String, required: true, unique: true},
  status: {type: String, required: true},
  userID: {type: mongoose.Schema.Types.ObjectId, required: true},
  photo: {type: mongoose.Schema.Types.ObjectId, ref:'photo'},
});

const Profile = module.exports = mongoose.model('profile', profileSchema);

Profile.findByIdAndAddPhoto = function(id, photo){
  debug('findByIdAndAddPhoto');
  return Profile.findById(id)
  .catch(err => Promise.reject(createError(404, err.message)))
  .then(profile => {
    profile.photo = photo._id;
    return profile.save();
  })
  .then(profile => {
    return profile;
  });
};

Profile.findByIdAndRemovePhoto = function(id, photo){
  debug('findByIdAndRemovePhoto');
  return Profile.findById(id)
  .catch(err => Promise.reject(createError(404, err.message)))
  .then(profile => {
    profile.photo = photo._id;
    return profile.save();
  })
  .then(profile => {
    return profile;
  });
};
