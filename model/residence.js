'use strict';

const mongoose = require('mongoose');
const debug = require('debug')('abba:residence');
const createError = require('http-errors');
const Bedroom = require('../model/bedroom.js');

const residenceSchema = mongoose.Schema({
  dateBuilt: {type: Date, default: Date.now},
  sqft: {type: Number, required: true},
  type: {type: String, required: true},
  street: {type: String, required: true},
  city: {type: String, requried: true},
  state: {type: String, required: true},
  zip: {type: String, required: true},
  address: {type: String},
  userID: {type: mongoose.Schema.Types.ObjectId, required: true},
  bedrooms: [{type: mongoose.Schema.Types.ObjectId, ref: 'bedroom'}],
});

const Residence = module.exports = mongoose.model('residence', residenceSchema);

Residence.findByIdAndAddBedroom = function(id, bedroom) {
  debug('Residence: findByIdAndAddBedroom');

  return Residence.findById(id)
    .catch(err => Promise.reject(createError(404, err.message)))
    .then(residence => {
      bedroom.residenceID = residence._id;
      this.tempResidence = residence;
      return new Bedroom(bedroom).save();
    })
    .then( bed => {
      this.tempResidence.bedrooms.push(bed._id);
      console.log('residence', this.tempResidence);
      this.tempBedroom = bed;
      return this.tempResidence.save();
    })
    .then(() => {
      return this.tempBedroom;
    });
};