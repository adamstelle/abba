'use strict';

const Router = require('express').Router;
const Bedroom = require('../model/bedroom.js');
const jsonParser = require('body-parser').json();
const createError = require('http-errors');
const debug = require('debug')('abba:bedroom-router');

const bearerAuth = require('../lib/bearer-auth-middleware.js');
const Residence = require('../model/residence.js');

const bedroomRouter = module.exports = Router();

bedroomRouter.post('/api/residence/:resID/bedroom', bearerAuth, jsonParser, function(req, res, next) {
  debug('POST /api/residence/:resID/bedroom');
  req.body.userID = req.user._id;
  req.body.residenceID = req.params.resID;
  Residence.findById(req.params.resID)
  .then((residence) => {
    if (residence.userID.toString() !== req.user._id.toString())
      return next(createError(401, 'invalid userID'));
    new Bedroom(req.body).save()
    .then(bedroom => {
      Residence.findByIdAndAddBedroom(req.params.resID, bedroom)
      .then(residence => {
        req.residence = residence;
        res.json(bedroom);
      });
    })
    .catch(err => next(err));
  })
  .catch(err => next(createError(404, err.message)));
});

bedroomRouter.get('/api/residence/:resID/bedroom/:id', bearerAuth, function(req, res, next) {
  debug('GET /api/residence/:resID/bedroom/:id');

  Bedroom.findById(req.params.id)
  .then(bedroom => {
    if (bedroom.userID.toString() !== req.user._id.toString())
      return next(createError(401, 'invalid userid'));
    res.json(bedroom);
  })
  .catch(err => next(createError(404, err.message)));
});

bedroomRouter.put('/api/residence/:resID/bedroom/:id', bearerAuth, jsonParser, function(req, res, next) {
  debug('PUT /api/residence/:resID/bedroom/:bedID');

  Bedroom.findById(req.params.id)
  .then( bedroom => {
    if(bedroom.userID.toString() !== req.user._id.toString())
      return next(createError(401, 'invalid userid'));
    return Bedroom.findByIdAndUpdate( bedroom._id, req.body, { new:true});
  })
  .then(bedroom => res.json(bedroom))
  .catch(err => {
    if(err.name === 'validationError') return next(err);
    if(err.status) return next(err);
    next(createError(404, 'not found'));
  });
});

bedroomRouter.delete('/api/residence/:resID/bedroom/:id', bearerAuth, function(req, res, next) {
  debug('DELETE /api/residence/:resID/bedroom/:id');

  Bedroom.findById(req.params.id)
  .catch(err => {
    return err.status ? Promise.reject(err) : Promise.reject(createError(404, err.message));
  })
  .then( bedroom => {
    if(bedroom.userID.toString() !== req.user._id.toString())
      return next(createError(401, 'invalid userID'));
    return Bedroom.findByIdAndRemove(bedroom._id);
  })
  .then( () => {
    return  Residence.findByIdAndRemoveBedroom(req.params.resID, req.params.id);
  })
  .then(() => res.status(204).send())
  .catch(next);
});
