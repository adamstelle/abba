'use strict';

const mongoose = require('mongoose');

const residenceSchema = mongoose.Schema({
  dateBuilt: {type: Date},
  sqft: {type: String, required: true},
  type: {type: String, required: true},
  street: {type: String, required: true},
  city: {type: String, required: true},
  state: {type: String, required: true},
  zip: {type: String, required: true},
  address: {type: String, unique: true},
  userID: {type: mongoose.Schema.Types.ObjectId, required: true},
  profileID: {type: mongoose.Schema.Types.ObjectId, required: true},
  // bedrooms: [{type: mongoose.Schema.Types.ObjectID, required: true, ref: 'bedroom'}],
});

module.exports = mongoose.model('residence', residenceSchema);
