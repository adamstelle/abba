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

residenceRouter.post('/api/residence', bearerAuth, jsonParser, function(req, res, next) {
  debug('POST /api/residence');
  if(!req.body) return Promise.reject(createError(400, 'no body'));
  let residence = req.body;
  residence.userID = req.user._id;
  return new Residence(residence).save()
  .then(result => res.json(result))
  .catch(next);
});

residenceRouter.get('/api/residence/:resID', bearerAuth, function(req, res, next){
  debug('GET /api/residence/:resID');

  Residence.findById(req.params.resID)
  .catch(() => Promise.reject(createError(404, 'Invalid resID')))
  .then(residence => {
    if (residence.userID.toString() !== req.user._id.toString())
      return Promise.reject(createError(401, 'invalid userID'));
    res.json(residence);
  })
  .catch(next);
});

residenceRouter.delete('/api/residence/:resID', bearerAuth, function(req, res, next) {
  debug('DELETE /api/residence/:resID');

  Residence.findById(req.params.resID)
  .then(residence => {
    if (residence.userID.toString() !== req.user._id.toString())
      return Promise.reject(createError(401, 'invalid userID'));
    return Residence.findByIdAndRemove(residence._id);
  })
  .catch(err => {
    return err.status ? Promise.reject(err) : Promise.reject(createError(404, err.message));
  })
  .then(() => res.status(204).send())
  .catch(next);
});
