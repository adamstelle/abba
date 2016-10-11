'use strict';

// Profile
// -  residenceID - array pop - need to add
// -  UserID - reference

const mongoose = require('mongoose');

const profileSchema = mongoose.Schema({
  firstName: {type: String, required: true},
  lastName: {type: String, required: true},
  phone: {type: Number, required: true},
  email: {type: String, required: true, unique: true},
  status: {type: String, required: true},
  userID: {type: mongoose.Schema.Types.ObjectId, required: true},
  photo: { type:mongoose.Schema.Types.ObjectId, ref:'photo'},
});

module.exports = mongoose.model('profile', profileSchema);
