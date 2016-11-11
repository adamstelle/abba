'use strict';

require('./lib/test-env.js');

const mongoose = require('mongoose');
const request = require('superagent');
const expect = require('chai').expect;

const server = require('../server.js');
const serverControl = require('./lib/server-control.js');
const Residence = require('../model/residence.js');
const Estimate = require('../model/estimate.js');

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

      it('should return a bedroom and add residence to bedroom array', (done) => {
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
            expect(err).to.be.null;
            expect(res.status).to.equal(200);
            expect(res.body._id).to.be.oneOf(residence.bedrooms);
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
        .set({Authorization: `Bearer ${this.tempToken + ' '}`})
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(err).to.not.be.null;
          done();
        });
      });
    });

    describe('with invalid header', function() {
      before(done => residenceMock.call(this, done));

      it('should return a 401 not authorized', (done) => {
        request.post(`${url}/api/residence/${this.tempResidence._id}/bedroom`)
        .send(exampleBedroom)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.unauthorized).to.be.true;
          expect(err).to.not.be.null;
          done();
        });
      });
    });

    describe('with invalid residence id', function() {
      before(done => residenceMock.call(this, done));
      before(done => userMock.call(this, done));
      it('should return a 404 not found', (done) => {
        request.post(`${url}/api/residence/FAKEID/bedroom`)
        .send(exampleBedroom)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });

    describe('with unathorized user', function() {
      before(done => residenceMock.call(this, done));
      before(done => userMock.call(this,done));

      it('should return a 401 unauthorized user', (done) => {
        request.post(`${url}/api/residence/${this.tempResidence._id}/bedroom`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(err.message).to.equal('Unauthorized');
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
          for (var i in this.tempBedroom) {
            expect(res.body).hasOwnProperty(i);
          }
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
          expect(res.body).not.have.property('type');
          expect(err).to.not.be.null;
          done();
        });
      });
    });

    describe('with unathorized user', function() {
      before(done => bedroomMock.call(this, done));
      before(done => userMock.call(this,done));

      it('should return a 401 unauthorized user', (done) => {
        request.get(`${url}/api/residence/${this.tempResidence._id}/bedroom/${this.tempBedroom._id}`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(err.message).to.equal('Unauthorized');
          done();
        });
      });
    });

    describe('with Invalid Token', function() {
      before(done => bedroomMock.call(this, done));
      it('should return a 401 error', (done) => {
        request.get(`${url}/api/residence/${this.tempResidence._id}/bedroom/${this.tempBedroom._id}`)
        .set({Authorization: `Bearer ${this.tempToken + ' '}`})
        .end((err, res) => {
          expect(res.status).to.equal(401);
          for (var i in exampleBedroom) {
            expect(res.body).to.not.have.property(exampleBedroom[i]);
          }
          expect(err).to.not.be.null;
          done();
        });
      });
    });

    describe('with Invalid residence_Id', function() {
      before(done => bedroomMock.call(this, done));

      it('should return a 404 error', (done) => {
        request.get(`${url}/api/residence/${666565}/bedroom/${this.tempBedroom._id}`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .end((err, res) => {
          Residence.findById(666565)
          .catch((err) =>{
            expect(err).to.not.be.null;
            expect(res.status).to.equal(404);
          });
          done();
        });
      });
    });

    describe('with unathorized user', function() {
      before(done => bedroomMock.call(this, done));
      before(done => userMock.call(this,done));
      it('should return a 401 unauthorized user', (done) => {
        request.get(`${url}/api/residence/${this.tempResidence._id}/bedroom/${this.tempBedroom._id}`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(err.message).to.equal('Unauthorized');
          done();
        });
      });
    });
  });

  describe('testing DELETE requests to /api/residence/:resID/bedroom', function() {
    describe('with valid BedroomId', function(){
      before(done => bedroomMock.call(this, done));
      it('should remove all dependinces {photos and estimate}', (done) => {
        request.delete(`${url}/api/residence/${this.tempResidence._id}/bedroom/${this.tempBedroom._id}`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .end((err, res) => {
          if(err) return done(err);
          Estimate.findById({bedID: this.tempBedroom._id})
          .catch(err => expect(err.name).to.equal('CastError'));
          expect(res.status).to.equal(204);
          expect(err).to.be.null;
          done();
        });
      });
    });

    describe('with Invalid bedroom id', function() {
      before(done => bedroomMock.call(this, done));
      it('should return an 404 error', (done) => {
        request.delete(`${url}/api/residence/${this.tempResidence._id}/bedroom/999`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.text).to.equal('NotFoundError');
          expect(err).to.not.be.null;
          done();
        });
      });
    });

    describe('with Invalid Token', function() {
      before(done => bedroomMock.call(this, done));
      it('should return an 401 error', (done) => {
        request.delete(`${url}/api/residence/${this.tempResidence._id}/bedroom/${this.tempBedroom._id}`)
        .set({Authorization: `Bearer ${this.tempToken + ' '}`})
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.text).to.equal('UnauthorizedError');
          expect(err).to.not.be.null;
          done();
        });
      });
    });

    describe('with Invalid residence_Id', function() {
      before(done => bedroomMock.call(this, done));
      it('should return a 404 error', (done) => {
        request.delete(`${url}/api/residence/${112992}/bedroom/${this.tempBedroom._id}`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .end((err, res) => {
          Residence.findById(112992)
          .catch((err) =>{
            expect(err).to.not.be.null;
            expect(res.status).to.equal(404);
          });
          done();
        });
      });
    });

    describe('no auth header', function(){
      before(done => bedroomMock.call(this, done));
      it('should respond with status 401', done => {
        request.delete(`${url}/api/residence/${this.tempResidence._id}/bedroom/${this.tempBedroom._id}`)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.text).to.equal('UnauthorizedError');
          done();
        });
      });
    });

    describe('with invalid header auth', function(){
      before(done => bedroomMock.call(this, done));
      it('should respond with status 400', done => {
        request.delete(`${url}/api/residence/${this.tempBedroom._id}`)
        .set({Authorization: 'lul this is bad}'})
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.text).to.equal('BadRequestError');
          done();
        });
      });
    });
  });

  describe('testing PUT requests to /api/residence/:resID/bedroom', function() {
    let updatedBedroom = {
      sleepNum: 5,
      privateBath: false,
    };

    describe('with valid bedroom id / body', function() {
      before(done => bedroomMock.call(this, done));
      it('should update a bedroom with valid id / body', done => {
        request.put(`${url}/api/residence/${this.tempResidence._id}/bedroom/${this.tempBedroom._id}`)
        .set({
          Authorization: `Bearer ${this.tempToken}`,
        })
        .send(updatedBedroom)
        .end((err, res) => {
          if(err) done(err);
          expect(res.status).to.equal(200);
          expect(res.body.sleepNum).to.equal(5);
          expect(res.body.privateBath).to.be.false;
          for (var i in updatedBedroom) {
            expect(res.body).hasOwnProperty(i);
          }
          expect(err).to.be.null;
          done();
        });
      });
    });

    describe('with unauthorized user', function() {
      before(done => bedroomMock.call(this, done));
      before(done => userMock.call(this, done));
      it('should return a 401', done => {
        request.put(`${url}/api/residence/${this.tempResidence._id}/bedroom/${this.tempBedroom._id}`)
        .set({
          Authorization: `Bearer ${this.tempToken}`,
        })
        .send(updatedBedroom)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
      });
    });

    describe('with Invalid body', function() {
      before(done => bedroomMock.call(this, done));
      it('should return 400 error', done => {
        request.put(`${url}/api/residence/${this.tempResidence._id}/bedroom/${this.tempBedroom._id}`)
        .set('Content-Type','application/json')
        .set({
          Authorization: `Bearer ${this.tempToken}`,
        })
        .send('/')
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).not.have.property('sleepNum');
          expect(res.body).not.have.property('privateBath');
          expect(err).to.not.be.null;
          done();
        });
      });
    });

    describe('with Invalid bedroom id', function() {
      before(done => bedroomMock.call(this, done));
      it('should return 404 error', done => {
        request.put(`${url}/api/residence/${this.tempResidence._id}/bedroom/${77787}`)
          .set({
            Authorization: `Bearer ${this.tempToken}`,
          })
          .send(updatedBedroom)
          .end((err, res) => {
            expect(res.status).to.equal(404);
            expect(err).to.not.be.null;
            done();
          });
      });
    });

    describe('with Invalid residence_id', function() {
      before(done => bedroomMock.call(this, done));
      it('should return a 404 error', (done) => {
        request.put(`${url}/api/residence/${112992}/bedroom/${this.tempBedroom._id}`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .end((err, res) => {
          Residence.findById(112992)
          .catch((err) =>{
            expect(err).to.not.be.null;
            expect(res.status).to.equal(404);
          });
          done();
        });
      });
    });

    describe('with Invalid Token', function() {
      before(done => bedroomMock.call(this, done));
      it('should return 401 error', done => {
        request.put(`${url}/api/residence/${this.tempResidence._id}/bedroom/${this.tempBedroom._id}`)
        .set({
          Authorization: `Bearer ${this.tempToken + ' '}`,
        })
        .send(updatedBedroom)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(err).to.not.be.null;
          done();
        });
      });
    });

    describe('with missing body', function() {
      before(done => bedroomMock.call(this, done));
      it('should return a 400 bad request', (done) => {
        request.put(`${url}/api/residence/${this.tempResidence._id}/bedroom/${this.tempBedroom._id}`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .set('Content-Type', 'application/json')
        .send('}')
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(err).to.not.be.null;
          done();
        });
      });
    });
  });
});
