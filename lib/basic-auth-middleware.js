'use strict';

const createError = require('http-errors');
const debug = require('debug')('stellegram:basic-auth-middleware');

module.exports = function(req, res, next){
  debug();

  var authHeader = req.headers.authorization;
  if(!authHeader) return next(createError(401, 'require authorization header'));

  let base64String = authHeader.split('Basic ')[1];
  if (!base64String) return next(createError(401, 'require email and password'));

  let utf8String = new Buffer(base64String, 'base64').toString();
  let authArray = utf8String.split(':');
  req.auth = {
    email: authArray[0],
    password: authArray[1],
  };

  if(!req.auth.email) return next(createError(401, 'basic auth requires email'));
  if(!req.auth.password) return next(createError(401, 'basue auth requires password'));
  next();
};
