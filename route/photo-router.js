'use strict';

// npm
const multer = require('multer');
const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const debug = require('debug')('abba:photo-route');
const upload = multer({dest: `${__dirname}/../data`});

// app
const Profile = require('../model/profile.js');
const Bedroom = require('../model/bedroom.js');
const photoMiddleware = require('../lib/photo-aws-middleware.js');
const bearerAuth = require('../lib/bearer-auth-middleware.js');

// constants
const photoRouter = module.exports = Router();

photoRouter.post('/api/profile/:profID/photo', jsonParser, bearerAuth, upload.single('image'), photoMiddleware.profilePhotoUpload, function(req, res, next) {
  debug('POST /api/profile/:profID/photo');
  Profile.findByIdAndAddPhoto(req.params.profID, res.photo)
  .then(() => res.json(res.photo))
  .catch(next);
});

photoRouter.delete('/api/profile/:profID/photo/:id', bearerAuth, photoMiddleware.photoDelete, function(req, res, next) {
  debug('DELETE /api/profile/:profID/photo/:id');
  Profile.findByIdAndRemovePhoto(req.params.profID, req.photo)
  .then(() => res.sendStatus(204))
  .catch(next);
});

photoRouter.post('/api/bedroom/:bedroomID/photo', jsonParser, bearerAuth, upload.array('image'), photoMiddleware.bedroomPhotoUpload, function(req, res, next) {
  debug('POST /api/bedroom/:bedroomID/photo');
  Bedroom.findByIdAndAddPhotos(req.params.bedroomID, req.photos)
  .then(() => res.json(req.photos))
  .catch(next);
});

photoRouter.delete('/api/bedroom/:bedroomID/photo/:id', bearerAuth, photoMiddleware.photoDelete, function(req, res, next) {
  debug('DELETE /api/bedroom/:bedroomID/photo/:id');
  Bedroom.findByIdAndRemovePhoto(req.params.bedroomID, req.params.id)
  .then(() => res.sendStatus(204))
  .catch(next);
});
