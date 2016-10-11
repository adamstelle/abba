'use strict';

const Router = require('express').Router;
const createError = require('http-errors');
const jsonParser = require('body-parser').json();

const debug = require('debug')('abba:bedroom-router');

const bearerAuth = require('../lib/bearer-auth-middleware.js');
const Residence = require('../model/residence.js');

const bedroomRouter = module.exports = Router();

bedroomRouter.post('/api/residence/:resID/bedroom', bearerAuth, jsonParser, function(req, res, next) {
  debug('POST /api/residence/:resID/bedroom');
  
  req.body.userID = req.user._id;
  Residence.findByIdAndAddBedroom(req.params.resID, req.body)
  .then(bedroom => {
    req.json(bedroom);
  })
  .catch(next);
});

// bedroomRouter.get('/api/residence/:resID/bedroom/:bedID', bearerAuth, function(req, res, next) {
//   debug('GET /api/residence/:resID/bedroom/:bedID');
// });

// bedroomRouter.put('/api/residence/:resID/bedroom/:bedID', bearerAuth, jsonParser, function(req, res, next) {
//   debug('PUT /api/residence/:resID/bedroom/:bedID');
// });

// bedroomRouter.delete('/api/residence/:resID/bedroom/:bedID', bearerAuth, function(req, res, next) {
//   debug('DELETE /api/residence/:resID/bedroom/:bedID');
// });
