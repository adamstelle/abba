'use strict';

const mongoose = require('mongoose');
const debug = require('debug')('abba:residence');
const createError = require('http-errors');

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
  bedrooms: [{type: mongoose.Schema.Types.ObjectId, ref: 'bedroom'}],
});

const Residence = module.exports = mongoose.model('residence', residenceSchema);

Residence.findByIdAndAddBedroom = function(id, bedroom) {
  debug('Residence: findByIdAndAddBedroom');

  return Residence.findById(id)
    .catch(err => Promise.reject(createError(404, err.message)))
    .then(residence => {
      residence.bedrooms.push(bedroom._id);
      return residence.save();
    });
};
