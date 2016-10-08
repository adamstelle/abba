'use strict';

//what's going to happen in the bedroom router?

//POST -- post new bedroom as that user. requires bearer auth and json parser

const Router = require('express').Router;
const createError = require('http-errors');
const jsonParser = require('body-parser').json();

const debug = require('debug')('abba:bedroom-router');

const basicAuth = require('../lib/basic-auth-middleware.js');
const bearerAuth = require('../lib/bearer-auth-middleware.js');

const bedroomRouter = module.exports = Router();

bedroomRouter.post('/api/residence/:resID/bedroom', bearerAuth, jsonParser, function(req, res, next) {
  debug('POST /api/residence/:resID/bedroom');
});

bedroomRouter.get('/api/residence/:resID/bedroom/:bedID', bearerAuth, function(req, res, next) {
  debug('GET /api/residence/:resID/bedroom/:bedID');
});

bedroomRouter.put('/api/residence/:resID/bedroom/:bedID', bearerAuth, jsonParser, function(req, res, next) {
  debug('PUT /api/residence/:resID/bedroom/:bedID');
});

bedroomRouter.delete('/api/residence/:resID/bedroom/:bedID', bearerAuth, function(req, res, next) {
  debug('DELETE /api/residence/:resID/bedroom/:bedID');
})
