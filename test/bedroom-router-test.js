'use strict';

require('./lib.test-env.js');

const mongoose = require('mongoose');
const request = require('superagent');
const expect = require('chai').expect;

const server = require('../server.js');
const serverControl = require('./lib/server-control,js');

const userMock = require('./lib/user-mock.js');
const cleanUpDatabase = require('./lib/clean-up-mock.js');

mongoose.Promise = Promise;

const url = `http://localhost:${process.env.PORT}`;

describe('testing bedroom router', function() {

}); //end of bedroom router tests
