'use strict';

const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const Promise = require('bluebird');
const mongoose = require('mongoose');
const createError = require('http-errors');
const debug = require('debug')('abba:user');

const userSchema = mongoose.Schema({
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  findHash: {type: String, unique: true},
  // profile: TBD
});

module.exports = mongoose.model('user', userSchema);

userSchema.methods.generatePasswordHash = function(password){
  debug('generatePasswordHash');
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, (err, hash) => {
      // return 400 error if bcrypt rejects user info
      if (err) reject(createError(400, 'Invalid user information'));
      this.password = hash;
      resolve(this);
    });
  });
};

// for signin - compare plaintext pw against stored hash
userSchema.methods.comparePasswordHash = function(password){
  debug('comparePasswordHash');
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, this.password, (err, valid) => {
      if (err) return reject(err); // 500 error
      if (!valid) return reject(createError(401, 'Incorrect password'));
      resolve(this);
    });
  });
};

userSchema.methods.generateFindHash = function(){
  debug('generateFindHash');
  return new Promise((resolve, reject) => {
    let tries = 0;
    _generateFindHash.call(this);
    function _generateFindHash(){
      this.findHash = crypto.randomBytes(32).toString('hex');
      this.save()
      .then(() => resolve(this.findHash))
      .catch(err => {
        if(tries > 3) return reject(err); // 500 error
        tries++;
        _generateFindHash.call(this);
      });
    }
  });
};

// for signup & signin
userSchema.methods.generateToken = function(){
  debug('generateToken');
  return new Promise((resolve, reject) => {
    this.generateFindHash()
    .then(findHash => resolve(jwt.sign({token: findHash}, process.env.APP_SECRET)))
    .catch(err => reject(err)); // 500 error from find hash
  });
};

module.exports = mongoose.model('user', userSchema);
