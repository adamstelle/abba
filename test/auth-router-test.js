'use strict';

const mongoose = require('mongoose');
const request = require('superagent');
const expect = require('chai').expect;

const server = require('../server.js');
const User = require('../model/user.js');
const serverControl = require('./lib/server-control.js');

mongoose.Promise = Promise;

const exampleUser = {

  
}

describe('testing auth routes', function() {
  before(done => serverControl.serverUp(server, done));
  after(done => serverControl.serverDown(server, done));
})
