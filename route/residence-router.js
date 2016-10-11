'use strict';

//npm modules
const Router = require('express').Router;
const createError = require('http-errors');
const jsonParser = require('body-parser').json();
const debug = require('debug')('abba:residence-router');

//app modules
const Residence = require('../model/residence.js');
const Profile = require('../model/profile.js');
const bearerAuth = require('../lib/bearer-auth-middleware.js');

const residenceRouter = module.exports = Router();

residenceRouter.post('/api/profile/:profileID/residence', bearerAuth, jsonParser, function(req, res, next) {
  debug('POST /api/residence');
  console.log('req.body', req.body);
  if(!req.body) return next(createError(400, 'no body'));
  Profile.findById(req.params.profileID)
  .catch( err => Promise.reject(createError(404, err.message)))
  .then(() => {
    let residence = req.body;
    residence.profileID = req.params.profileID;
    residence.userID = req.user._id;
    return new Residence(residence).save()
    .then(result => res.json(result));
  })
  .catch(next);
});

residenceRouter.get('/api/profile/:profileID/residence/:resID', bearerAuth, function(req, res, next){
  debug('GET /api/residence/:resID');

  Residence.findById(req.params.resID)
  .catch(err => Promise.reject(createError(400, err.message)))
  .then(residence => {
    if (residence.userID.toString() !== req.user._id.toString())
      return next(createError(401, 'invalid userID'));
    res.json(residence);
  })
  .catch(next);
});

// residenceRouter.delete('/api/profile/:profileID/residence/:resID', bearerAuth, function(req, res, next) {
//   debug('DELETE /api/residence/:resID');
//
//   Residence.findById(req.params.id)
//   .catch(err => Promise.reject(createError(400, err.message)))
//   .then(residence => {
//     if (residence.userID.toString() !== req.user._id.toString())
//       return next(createError(401, 'invalid userID'));
//     let oldResidence = residence;
//     return oldResidence;
//   });
//   Residence.remove(oldResidence)
//   .then(() => res.sendStatus(204))
//   .catch(err => next(createError(404, err.message)));
// });
