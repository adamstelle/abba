'use strict';

require('./lib/test-env.js');
require('../lib/aws-mocks.js');

const mongoose = require('mongoose');
const request = require('superagent');
const expect = require('chai').expect;

const server = require('../server.js');
const serverControl = require('./lib/server-control.js');

const userMock = require('./lib/user-mock.js');
const estimateMock = require('./lib/estimate-mock.js');
const cleanUpDatabase = require('./lib/clean-up-mock.js');

mongoose.Promise = Promise;

const url = `http://localhost:${process.env.PORT}`;


describe('testing estimate routes', function(){
  before(done => serverControl.serverUp(server, done));
  after(done => serverControl.serverDown(server, done));
  afterEach(done => cleanUpDatabase(done));

  describe('testing GET /api/residence/:resID/bedroom/:bedID/estimate/:id', function() {

    describe('with valid estimate ID and user ID', function() {

      before(done => estimateMock.call(this, done));

      it('should return an estimate', (done) => {
        request.get(`${url}/api/residence/${this.tempResidence._id}/bedroom/${this.tempBedroom._id}/estimate/${this.tempEstimate._id}`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          done();
        });
      });
    }); //end of GET with valid estimateID

    describe('with an invalid estimateID', function() {
      before(done => estimateMock.call(this, done));
      it('should return a 404 not found', (done) => {
        request.get(`${url}/api/residence/${this.tempResidence._id}/bedroom/${this.tempBedroom._id}/estimate/:badID`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });//end of GET with invalid residenceID

    describe('with invalid header', function(){
      before(done => estimateMock.call(this, done));
      it('should return a 401 error with invalid Bearer', done => {
        request.get(`${url}/api/residence/${this.tempResidence._id}/bedroom/${this.tempBedroom._id}/estimate/${this.tempEstimate._id}`)
        .set({ Authorization: 'bad request' })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.text).to.equal('BadRequestError');
          done();
        });
      });
    });

    describe('with no Authorization header', function(){
      before(done => estimateMock.call(this, done));
      it('should return a 401 error with no Authorization header', done => {
        request.get(`${url}/api/residence/${this.tempResidence._id}/bedroom/${this.tempBedroom._id}/estimate/${this.tempEstimate._id}`)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
      });
    });

    describe('with invalid bedroom id', function(){
      before(done => estimateMock.call(this, done));
      it('should return a 404 error not found', done => {
        request.get(`${url}/api/residence/${this.tempResidence._id}/bedroom/badBedroomID/estimate/${this.tempEstimate._id}`)
        .set({
          Authorization: `Bearer ${this.tempToken}`,
        })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.text).to.equal('NotFoundError');
          done();
        });
      });
    });

    describe('with unathorized user', function() {
      before(done => estimateMock.call(this, done));
      before(done => userMock.call(this,done));

      it('should return a 401 unauthorized user', (done) => {
        request.get(`${url}/api/residence/${this.tempResidence._id}/bedroom/${this.tempBedroom._id}/estimate/${this.tempEstimate._id}`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(err.message).to.equal('Unauthorized');
          done();
        });
      });
    });

  });
});
