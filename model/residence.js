'use strict';

const mongoose = require('mongoose');2
const debug = require('debug')('abba:residence');

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
  .then(residence => {
    residence.bedrooms.push(bedroom._id);
    return residence.save();
  });
};

Residence.findByIdAndRemoveBedroom = function(resId, bedId) {
  debug('Residence: findByIdAndRemoveBedroom');
  return Residence.findById(resId)
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

  return Residence.findById(residenceID)
  .then(residence => {
    let removeChildren = [];
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
