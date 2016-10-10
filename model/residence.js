'use strict';

const mongoose = require('mongoose');

const residenceSchema = mongoose.Schema({
  dateBuilt: {type: Date, default: Date.now, required: true},
  sqft: {type: Number, required: true},
  type: {type: String, required: true},
  street: {type: String, required: true},
  city: {type: String, requried: true},
  state: {type: String, required: true},
  zip: {type: String, required: true},
  address: {type: String},
  userID: {type: mongoose.Schema.Types.ObjectId, required: true},
});

module.exports = mongoose.model('photo', residenceSchema);
