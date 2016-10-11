'use strict';

require('./lib/test-env.js');

const mongoose = require('mongoose');
const request = require('superagent');
const expect = require('chai').expect;

const server = require('../server.js');
const serverControl = require('./lib/server-control.js');
const Residence = require('../model/residence.js');

const bedroomMock = require('./lib/bedroom-mock.js');
const userMock = require('./lib/user-mock.js');
const residenceMock = require('./lib/residence-mock.js');
const cleanUpDatabase = require('./lib/clean-up-mock.js');

mongoose.Promise = Promise;

const url = `http://localhost:${process.env.PORT}`;

const exampleBedroom = {
  type: 'Private bedroom',
  bedSize: 'Queen',
  bedType: 'Air mattress',
  sleepNum: 2,
  privateBath: true,
};

describe('testing bedroom router', function() {
  before(done => serverControl.serverUp(server, done));
  after(done => serverControl.serverDown(server, done));
  afterEach(done => cleanUpDatabase(done));

  describe('testing POST /api/residence/:resID/bedroom ', function() {
    describe('with valid body', function() {
      beforeEach(done => residenceMock.call(this, done));
      afterEach(done => cleanUpDatabase(done));
      it('should return a bedroom', (done) => {
        request.post(`${url}/api/residence/${this.tempResidence._id}/bedroom`)
        .send(exampleBedroom)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .end((err, res) => {
          expect(res.status).to.equal(200);
          for (var i in exampleBedroom) {
            expect(res.body[i]).to.equal(exampleBedroom[i]);
          }
          Residence.findById(this.tempResidence._id)
          .then(residence => {
            expect(residence.photos.length).to.equal(1);
          });
          expect(err).to.be.null;
          done();
        });
      });
    });

    describe('with invalid body', function() {
      before(done => residenceMock.call(this, done));

      it('should return a 400 bad request', (done) => {
        request.post(`${url}/api/residence/${this.tempResidence._id}/bedroom`)
        .send({name:'abba', family:'team'})
        .set('Content-Type', 'application/json')
        .set({Authorization: `Bearer ${this.tempToken}`})
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(err).to.not.be.null;
          done();
        });
      }); 
    }); 

    describe('with missing body', function() {
      before(done => residenceMock.call(this, done));

      it('should return a 400 bad request', (done) => {
        request.post(`${url}/api/residence/${this.tempResidence._id}/bedroom`)
        .send({})
        .set('Content-Type', 'application/json')
        .set({Authorization: `Bearer ${this.tempToken}`})
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(err).to.not.be.null;
          done();
        });
      }); 
    }); 

    describe('with invalid token', function() {
      before(done => residenceMock.call(this, done));

      it('should return a 401 not authorized', (done) => {
        request.post(`${url}/api/residence/${this.tempResidence._id}/bedroom`)
        .send(exampleBedroom)
        .set({Authorization: `Bearer ${this.tempToken + '1'}`})
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(err).to.not.be.null;
          done();
        });
      });
    }); 

    describe('with invalid residence id', function() {
      before(done => userMock.call(this, done));
      before(done => residenceMock.call(this, done));

      it('should return a 404 not found', (done) => {
        request.post(`${url}/api/residence/${7787755}/bedroom`)
        .send(exampleBedroom)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    });
  });

  describe('testing GET requests to /api/residence/:resID/bedroom', function() {
    describe('with valid residence and bedroom id', function() {
      before(done => bedroomMock.call(this, done));

      it('should return a bedroom', (done) => {
        request.get(`${url}/api/residence/${this.tempResidence._id}/bedroom/${this.tempBedroom._id}`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(err).to.be.null;
          done();
        });
      });
    });

    describe('with Invalid bedroom_id', function() {
      before(done => bedroomMock.call(this, done));

      it('should return a 404 error', (done) => {
        request.get(`${url}/api/residence/${this.tempResidence._id}/bedroom/${112233}`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(err).to.not.be.null;
          done();
        });
      });
    });

    describe('with Invalid Token', function() {
      before(done => bedroomMock.call(this, done));

      it('should return a 404 error', (done) => {
        request.get(`${url}/api/residence/${this.tempResidence._id}/bedroom/${this.tempBedroom._id}`)
        .set({Authorization: `Bearer ${this.tempToken + ' '}`})
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body).to.not.have.property('type');
          expect(res.body).to.not.have.property('bedSize');
          expect(res.body).to.not.have.property('bedType');
          expect(res.body).to.not.have.property('sleepNum');
          expect(err).to.not.be.null;
          done();
        });
      });
    });
  });
});