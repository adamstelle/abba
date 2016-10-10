'use strict';

// npm
const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const createError = require('http-errors');
const debug = require('debug')('abba:profile-route');

// app
const Profile = require('../model/profile.js');
const photoMiddleware = require('../lib/photo-aws-middleware.js');
const bearerAuth = require('../lib/bearer-auth-middleware.js');

// constants
const profileRouter = module.exports = Router();

profileRouter.post('/api/profile', jsonParser, bearerAuth,  function(req, res, next) {
  debug('POST /api/profile');

  req.body.userID = req.user._id;
  new Profile(req.body).save()
  .then( profile => res.json(profile))
  .catch(next);
});

profileRouter.post('/api/profile/:profID/photo', jsonParser, bearerAuth, photoMiddleware.photoUpload, function(req, res, next) {
  debug('POST /api/profile/:profID/photo');
  res.json(res.photo);
  next();
});

profileRouter.get('/api/profile/:id', bearerAuth, function(req, res, next) {
  debug('GET /api/profile/:id');

  Profile.findById(req.params.id)
  .then(profile => {
    if (profile.userID.toString() !== req.user._id.toString())
      return next(createError(401, 'invalid userid'));
    res.json(profile);
  })
  .catch(err => next(createError(404, err.message)));
});

profileRouter.delete('/api/profile/:id', bearerAuth, function(req, res, next){
  debug('DELETE /api/profile/:id');

  Profile.findById(req.params.id)
  .then( profile => {
    if(profile.userID.toString() !== req.user._id.toString())
      return next(createError(401, 'invalid userid'));
    return Profile.findByIdAndRemove(profile._id);
  })
  .then(next(res.status(204).send()))
  .catch(next(createError(404, 'invalid id')));
});
