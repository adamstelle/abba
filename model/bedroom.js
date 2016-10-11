'use strict';

const mongoose = require('mongoose');

const bedroomSchema = mongoose.Schema({
  type: {type: String, required: true },
  bedSize: {type: String, required: true},
  bedType: {type: String, required: true},
  sleepNum: {type: Number, required: true},
  privateBath: {type: Boolean, required: true},
  userID: {type: mongoose.Schema.Types.ObjectId, required: true},
  residenceID: {type: mongoose.Schema.Types.ObjectId, required: true},
  photoArray: [{type: mongoose.Schema.Types.ObjectId}],
  estimateID: {type: mongoose.Schema.Types.ObjectId},
});

module.exports = mongoose.model('bedroom', bedroomSchema);
