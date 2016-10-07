'use strict';

const mongoose = require('mongoose');
const request = require('superagent');
const expect = require('chai').expect;

const server = require('../server.js');
const User = require('../model/user.js');
const serverControl = require('./lib/server-control.js');

mongoose.Promise = Promise;

const url = `http://localhost:${process.env.PORT}`;
const exampleUser = {
  email: 'test@test.com',
  password: 'baddpass',
};

describe('testing auth routes', function() {
  before(done => serverControl.serverUp(server, done));
  after(done => serverControl.serverDown(server, done));
  describe('testing POST /api/signup', function() {
    describe('with valid body', function() {
      after(done => {
        User.remove()
        .then(() => done())
        .catch(done);
      });
      it('should return a token', (done) => {
        request.post(`${url}/api/signup`)
        .send(exampleUser)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(!!res.text).to.equal(true);
          done();
        });
      });
    });
  });
});
