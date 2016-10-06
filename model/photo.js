'use strict';

// Photo
// -  imageURI - passed back from AWS
// -  Key - created by multer
// -  UserID - reference

const mongoose = require('mongoose');

const photoSchema = mongoose.Schema({
  imageURI: {type: String, required: true},
  Key: {type: String, required true},
  userID: {type: mongoose.Schema.Types.ObjectId, required: true},
});

module.exports = mongoose.model('photo', photoSchema);
