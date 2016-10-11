'use strict';

// npm
const multer = require('multer');
const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const debug = require('debug')('abba:profile-route');
const upload = multer({dest: `${__dirname}/../data`});

// app
const Profile = require('../model/profile.js');
const photoMiddleware = require('../lib/photo-aws-middleware.js');
const bearerAuth = require('../lib/bearer-auth-middleware.js');

// constants
const photoRouter = module.exports = Router();

photoRouter.post('/api/profile/:profID/photo', jsonParser, bearerAuth, upload.single('image'), photoMiddleware.photoUpload, function(req, res, next) {
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

// TO DO: Add photo routes for BEDROOM
