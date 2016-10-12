'use strict';

const mongoose = require('mongoose');
const debug = require('debug')('abba:residence');
const createError = require('http-errors');

const Estimate = require('./estimate.js');
const Bedroom = require('./bedroom.js');
const Photo = require('./photo.js');

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

Residence.findByIdAndRemoveBedroom = function(resId, bedId) {
  debug('Residence: findByIdAndRemoveBedroom');

  return Residence.findById(resId)
    .catch(err => Promise.reject(createError(404, err.message)))
    .then(residence => {
      if(residence.bedrooms.length) {
        residence.bedrooms.pull({_id:bedId});
        //let index = residence.bedrooms.indexOf(bedId);
        //residence.bedrooms.splice(index,1);
        return residence.save();
      }
    });
};

Residence.findByIdAndRemoveResidence = function(residenceID) {
  debug('Residence: findByIdAndRemoveResidence');

  // start Promise chanin: find residence
  // catch: if not found 404
  // then: delete photos and status for each bedroom in the residence
  // then: delete the bedrooms for the residence
  // then: delete the residence
  return Residence.findById(residenceID)
    .catch(err => Promise.reject(createError(404, err.message)))
    .then(residence => {
      let removeChildren= [];
      residence.bedrooms.forEach(bed => {
        removeChildren.push(Estimate.remove({bedID: bed._id}));
        bed.photoArray.forEach( photoId => {
          removeChildren.push(Photo.remove({_id: photoId}));
        });
      });
      return Promise.all(removeChildren);
    })
    .then(() => {
      return Bedroom.remove({residenceID: residenceID});
    })
      .then(() => {
        return Residence.findByIdAndRemove(residenceID);
      });
};

