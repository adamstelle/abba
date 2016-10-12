'use strict';

//npm modules
const Router = require('express').Router;
const createError = require('http-errors');
const debug = require('debug')('abba:residence-router');

//app modules
const Estimate = require('../model/estimate.js');
const bearerAuth = require('../lib/bearer-auth-middleware.js');

const estimateRouter = module.exports = Router();

estimateRouter.get('/api/residence/:resID/bedroom/:bedID/estimate/:id', bearerAuth, function(req, res, next){
  debug('GET /api/estimate');
  Estimate.findById(req.params.id)
  .catch(err => Promise.reject(createError(400, err.message)))
  .then(estimate => {
    if( estimate.userID.toString() !== req.user._id.toString())
      return next(createError(401, 'invalid userID'));
    if( estimate.bedID.toString() !== req.params.bedID.toString())
      return next(createError(404, 'invalid bedroom ID'));
    res.json(estimate);
  })
  .catch(err => next(createError(404, err.message)));
});
