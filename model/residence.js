'use strict';

const mongoose = require('mongoose');

const residenceSchema = mongoose.Schema({
  dateBuilt: {type: Date, default: Date.now},
  sqft: {type: Number, required: true},
  type: {type: String, required: true},
  street: {type: String, required: true},
  city: {type: String, requried: true},
  state: {type: String, required: true},
  zip: {type: String, required: true},
  address: {type: String},
  // profileID: {type: mongoose.Schema.Types.ObjectID, required: true},
  // bedroomID: {type: mongoose.Schema.Types.ObjectID, required: true},
  //are we having a residence id on the residence model
});

module.exports = mongoose.model('residence', residenceSchema);
