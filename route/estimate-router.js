'use strict';

const mongoose = require('mongoose');

const estimateSchema = mongoose.Schema({
  nightlyEst: {type: Number, required: true},
  monthlyEst: {type: Number, required: true},
  occupancyRate: {type: Number, required: true, min: 0, max: 1},
  userID: {type: mongoose.Schema.Types.ObjectID, required: true},
  bedroomID: {type: mongoose.Schema.Types.ObjectID, required: true},
  residenceID: {type: mongoose.Schema.Types.ObjectID, required: true},
});

module.exports = mongoose.model('estimate', estimateSchema);
