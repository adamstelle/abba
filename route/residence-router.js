'use strict';

//npm modules
const Router = require('express').Router;
const createError = require('http-errors');
const jsonParser = require('body-parser').json();
const debug = require('debug')('abba:residence-router');

//app modules
const Residence = require('../model/residence.js');
const bearerAuth = require('../lib/bearer-auth-middleware.js');

const residenceRouter = module.exports = Router();

//post a new residence
//after it's sent through the model, will have a user id and bedroom ID
residenceRouter.post('/api/residence', bearerAuth, jsonParser, function(req, res, next) {
  debug('POST /api/residence');
  new Residence(req.body).save()
  .then(residence => res.json(residence))
  .catch(next);
});

//fetch a residence
residenceRouter.get('/api/profile/:userID/residence/:resID', bearerAuth, function(req, res, next){
  debug('GET /api/residence/:resID');

//are we finding the residence by the residence ID? or by the profile ID?
  Residence.findById(req.params.id)
  .then(residence => {
    if (residence.userID.toString() !== req.user._id.toString())
      return next(createError(401, 'invalid userID'));
    res.json(residence);
  })
  .catch(next);
});

//delete a residence
residenceRouter.delete('/api/profile/:userID/residence/:resID', bearerAuth, function(req, res, next) {
  debug('DELETE /api/residence/:resID');

  Residence.findById(req.params.id)
  .then(residence => {
    if (residence.userID.toString() !== req.user._id.toString())
      return next(createError(401, 'invalid userID'));
    Residence.remove();
  });
});
