'use strict';

const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  findHash: {type: String, unique: true},
});

module.exports = mongoose.model('user', userSchema);
