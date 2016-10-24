'use strict';

require('./lib/test-env.js');
require('../lib/aws-mocks.js');

const mongoose = require('mongoose');
const request = require('superagent');
const expect = require('chai').expect;
const Promise = require('bluebird');

const server = require('../server.js');
const userMock = require('./lib/user-mock.js');
const serverControl = require('./lib/server-control.js');
const cleanUpDatabase = require('./lib/clean-up-mock.js');

mongoose.Promise = Promise;

const url = `http://localhost:${process.env.PORT}`;

describe('testing auth routes', function() {
  before(done => serverControl.serverUp(server, done));
  after(done => serverControl.serverDown(server, done));
  afterEach(done => cleanUpDatabase(done));
  describe('testing POST /api/signup', function() {
    describe('with valid body', function() {
      it('should return a token', (done) => {
        request.post(`${url}/api/signup`)
        .send({
          email: 'test@test.com',
          password: 'badpass',
        })
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(!!res.text).to.equal(true);
          done();
        });
      });
    }); //end of valid body
    describe('with invalid body', function() {
      it('should return a 400 bad request', (done) => {
        request.post(`${url}/api/signup`)
        .send('nope')
        .set('Character-Type', 'application/json')
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    }); //end of invalid body
    describe('with no body', function() {
      it('should return a 400 bad request', (done) => {
        request.post(`${url}/api/signup`)
        .send()
        .set('Character-Type', 'application/json')
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    }); //end of no body

    describe('with duplicate email', function() {
      before(done => userMock.call(this, done));
      it('should return a 409 error', (done) => {
        request.post(`${url}/api/signup`)
        .send({
          email: this.tempUser.email,
          password: this.tempUser.password,
        })
      .end((err, res) => {
        expect(res.status).to.equal(409);
        expect(res.text).to.equal('ConflictError');
        done();
      });
      });
    }); //end of duplicate email

    describe('with no email', function(){
      before(done => userMock.call(this, done));

      it ('should return a 400 error', (done) => {
        request.post(`${url}/api/signup`)
        .send({
          password: this.tempUser.password,
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    }); //end of with no email

    describe('with no password', function() {
      before(done => userMock.call(this, done));
      it ('should return a 400 error', (done) => {
        request.post(`${url}/api/signup`)
        .send({
          email: this.tempUser.email,
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    }); // end of with no password
  }); //end of POST tests

  describe('testing GET /api/login', function() {
    //with valid password and auth?
    describe('with valid ID and auth', function() {
      before(done => userMock.call(this, done));
      it('should return a token', (done) => {
        request.get(`${url}/api/login`)
        .auth(this.tempUser.email, this.tempPassword)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(!!res.text).to.equal(true);
          done();
        });
      });
    }); //end of with valid ID and auth
    describe('with an invalid password and valid email', function() {
      before(done => userMock.call(this, done));
      it('should return a 401 not authorized', (done) => {
        request.get(`${url}/api/login`)
        .auth(this.tempUser.email, 'wrongpass')
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
      });
    });//end of with invalid password and valid email
    describe('with a valid password and invalid email', function() {
      before(done => userMock.call(this,done));
      it('should return a 401 bad request', (done) => {
        request.get(`${url}/api/login`)
        .auth('wrong@test.com', this.tempPassword)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
      });
    });
  }); //end of GET tests
});
