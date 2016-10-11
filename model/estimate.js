'use strict';

const mongoose = require('mongoose');

const estimateSchema = mongoose.Schema({
  nightlyEst: {type: Number, required: true},
  monthlyEst: {type: Number, required: true},
  occupancyRate: {type: Number, required: true, min: 0, max: 1},
  userID: {type: mongoose.Schema.Types.ObjectId, required: true},
  bedID: {type: mongoose.Schema.Types.ObjectId, required: true},
});

module.exports = mongoose.model('estimate', estimateSchema);
