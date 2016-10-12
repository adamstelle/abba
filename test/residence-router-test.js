'use strict';

require('./lib/test-env.js');
require('../lib/aws-mocks.js');

const mongoose = require('mongoose');
const request = require('superagent');
const expect = require('chai').expect;

const server = require('../server.js');
const serverControl = require('./lib/server-control.js');

const Residence = require('../model/residence.js');
const profileMock = require('./lib/profile-mock.js');
const residenceMock = require('./lib/residence-mock.js');
const cleanUpDatabase = require('./lib/clean-up-mock.js');

mongoose.Promise = Promise;

const url = `http://localhost:${process.env.PORT}`;

const exampleResidenceData = {
  dateBuilt: new Date(),
  sqft: '300',
  type: 'apartment',
  street: '100 first street',
  city: 'seattle',
  state: 'WA',
  zip: '12345',
  address: '100 first street, seattle, WA 12345',
};

describe('testing residence routes', function() {
  before(done => serverControl.serverUp(server, done));
  after(done => serverControl.serverDown(server, done));
  afterEach(done => cleanUpDatabase(done));
  describe('testing POST /api/residence', function() {
    describe('with valid body', function() {
      before(done => profileMock.call(this, done));

      it('should return a residence', (done) => {
        request.post(`${url}/api/residence`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .send(exampleResidenceData)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          done();
        });
      });
    }); //end of valid body

    describe('with invalid body', function() {
      before(done => profileMock.call(this, done));

      it('should return a 400 bad request', (done) => {
        request.post(`${url}/api/residence`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .send('nope')
        .set('Character-Type', 'application/json')
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    }); //end of invalid body

    describe('with no body', function() {
      before(done => profileMock.call(this, done));

      it('should return a 400 bad request', (done) => {
        request.post(`${url}/api/residence`)
        .send()
        .set('Character-Type', 'application/json')
        .set({Authorization: `Bearer ${this.tempToken}`})
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    }); //end of no body

    describe('with duplicate address', function() {
      before(done => residenceMock.call(this, done));

      it('should return a 409 error', (done) => {
        request.post(`${url}/api/residence`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .send({
          dateBuilt: this.tempResidence.dateBuilt,
          sqft: this.tempResidence.sqft,
          type: this.tempResidence.type,
          street: this.tempResidence.street,
          city: this.tempResidence.city,
          state: this.tempResidence.state,
          zip: this.tempResidence.zip,
          address: this.tempResidence.address,
        })
        .end((err, res) => {
          expect(res.status).to.equal(409);
          expect(res.text).to.equal('ConflictError');
          done();
        });
      });
    }); //end of duplicate email

    describe('with no street', function(){
      before(done => residenceMock.call(this, done));

      it ('should return a 400 error', (done) => {
        request.post(`${url}/api/residence`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .send({
          dateBuilt: this.tempResidence.dateBuilt,
          sqft: this.tempResidence.sqft,
          type: this.tempResidence.type,
          city: this.tempResidence.city,
          state: this.tempResidence.state,
          zip: this.tempResidence.zip,
          address: this.tempResidence.address,
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    }); //end of with no street

    describe('with no type', function(){
      before(done => residenceMock.call(this, done));

      it ('should return a 400 error', (done) => {
        request.post(`${url}/api/residence`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .send({
          dateBuilt: this.tempResidence.dateBuilt,
          sqft: this.tempResidence.sqft,
          street: this.tempResidence.street,
          city: this.tempResidence.city,
          state: this.tempResidence.state,
          zip: this.tempResidence.zip,
          address: this.tempResidence.address,
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    }); //end of with no type

    describe('with no city', function(){
      before(done => residenceMock.call(this, done));

      it ('should return a 400 error', (done) => {
        request.post(`${url}/api/residence`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .send({
          dateBuilt: this.tempResidence.dateBuilt,
          sqft: this.tempResidence.sqft,
          type: this.tempResidence.type,
          street: this.tempResidence.street,
          state: this.tempResidence.state,
          zip: this.tempResidence.zip,
          address: this.tempResidence.address,
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    }); //end of with no city

    describe('with no state', function(){
      before(done => residenceMock.call(this, done));

      it ('should return a 400 error', (done) => {
        request.post(`${url}/api/residence`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .send({
          dateBuilt: this.tempResidence.dateBuilt,
          sqft: this.tempResidence.sqft,
          type: this.tempResidence.type,
          street: this.tempResidence.street,
          city: this.tempResidence.city,
          zip: this.tempResidence.zip,
          address: this.tempResidence.address,
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    }); //end of with no state

    describe('with no zip', function(){
      before(done => residenceMock.call(this, done));

      it ('should return a 400 error', (done) => {
        request.post(`${url}/api/residence`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .send({
          dateBuilt: this.tempResidence.dateBuilt,
          sqft: this.tempResidence.sqft,
          type: this.tempResidence.type,
          street: this.tempResidence.street,
          city: this.tempResidence.city,
          state: this.tempResidence.state,
          address: this.tempResidence.address,
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    }); //end of with no zip

    describe('with no sqft', function(){
      before(done => residenceMock.call(this, done));

      it ('should return a 400 error', (done) => {
        request.post(`${url}/api/residence`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .send({
          dateBuilt: this.tempResidence.dateBuilt,
          type: this.tempResidence.type,
          street: this.tempResidence.street,
          city: this.tempResidence.city,
          state: this.tempResidence.state,
          zip: this.tempResidence.zip,
          address: this.tempResidence.address,
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    }); //end of with no sqft
  }); //end of POST tests

  describe('testing GET /api/:id/residence/:id', function() {
    //with valid password and auth?
    describe('with valid ID', function() {
      before(done => residenceMock.call(this, done));
      it('should return a residenceID', (done) => {
        request.get(`${url}/api/residence/${this.tempResidence._id}`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          let date = new Date(res.body.dateBuilt).toString();
          expect(date).to.not.equal('Invalid Date');
          expect(res.body.sqft).to.equal(this.tempResidence.sqft);
          expect(res.body.type).to.equal(this.tempResidence.type);
          expect(res.body.street).to.equal(this.tempResidence.street);
          expect(res.body.city).to.equal(this.tempResidence.city);
          expect(res.body.state).to.equal(this.tempResidence.state);
          expect(res.body.zip).to.equal(this.tempResidence.zip);
          expect(res.body.address).to.equal(this.tempResidence.address);
          done();
        });
      });
    }); //end of GET with valid residenceID

    describe('with an invalid residenceID', function() {
      before(done => residenceMock.call(this, done));
      it('should return a 400 not found', (done) => {
        request.get(`${url}/api/residence/:wrongid`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .end((err, res) => {
          //may be a false positive. Error handling in residence get router sends 400 error if anything goes wrong with Residence.findById
          expect(res.status).to.equal(400);
          done();
        });
      });
    });//end of GET with invalid residenceID

    describe('with valid token and id', function(){
      before(done => residenceMock.call(this, done));
      it('should return a residence', done => {
        request.get(`${url}/api/residence/${this.tempResidence._id}`)
        .set({
          Authorization: `Bearer ${this.tempToken}`,
        })
        .end((err, res) => {
          if (err) return done(err);
          let date = new Date(res.body.dateBuilt).toString();
          expect(date).to.not.equal('Invalid Date');
          expect(res.body.sqft).to.equal(this.tempResidence.sqft);
          expect(res.body.type).to.equal(this.tempResidence.type);
          expect(res.body.street).to.equal(this.tempResidence.street);
          expect(res.body.city).to.equal(this.tempResidence.city);
          expect(res.body.state).to.equal(this.tempResidence.state);
          expect(res.body.zip).to.equal(this.tempResidence.zip);
          expect(res.body.address).to.equal(this.tempResidence.address);
          expect(res.body.userID).to.equal(this.tempUser._id.toString());

          expect(res.status).to.equal(200);
          done();
        });
      });
    });

    describe('with invalid token', function(){
      before(done => residenceMock.call(this, done));
      it('should return a 401 with bad token', done => {
        request.get(`${url}/api/residence/${this.tempResidence._id}`)
        .set({
          Authorization: 'Bearer ',
        })
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.text).to.equal('UnauthorizedError');
          done();
        });
      });
    });

    describe('with invalid Bearer auth', function(){
      before(done => residenceMock.call(this, done));
      it('should return a 401 error with invalid Bearer', done => {
        request.get(`${url}/api/residence/${this.tempResidence._id}`)
        .set({ Authorization: 'bad request' })
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.text).to.equal('UnauthorizedError');
          done();
        });
      });
    });

    describe('with no Authorization header', function(){
      before(done => residenceMock.call(this, done));
      it('should return a 401 error with no Authorization header', done => {
        request.get(`${url}/api/residence/${this.tempResidence._id}`)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
      });
    });

    describe('with invalid id', function(){
      before(done => residenceMock.call(this, done));
      it('should return a 400 error with invalid ID', done => {
        request.get(`${url}/api/residence/invalid`)
        .set({
          Authorization: `Bearer ${this.tempToken}`,
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.text).to.equal('BadRequestError');
          done();
        });
      });
    });
  });

  describe('testing DELETE /api/residence/:resID', function(){

    describe('with valid token and ids', function(){
      before(done => residenceMock.call(this, done));

      it('should respond with status 204', done => {
        request.delete(`${url}/api/residence/${this.tempResidence._id}`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .end((err, res) => {
          console.log('getting back to test file!');
          if (err) return done(err);
          expect(res.status).to.equal(204);
          done();
        });
      });
    });
    describe('with invalid token', function(){
      before(done => residenceMock.call(this, done));
      it('should respond with status 401', done => {
        request.delete(`${url}/api/residence/${this.tempResidence._id}`)
        .set({Authorization: `Bearer ${this.tempToken}bad`})
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.text).to.equal('UnauthorizedError');
          done();
        });
      });
    });

    describe('no auth header', function(){
      before(done => residenceMock.call(this, done));
      it('should respond with status 401', done => {
        request.delete(`${url}/api/residence/${this.tempResidence._id}`)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.text).to.equal('UnauthorizedError');
          done();
        });
      });
    });

    describe('with invalid bearer auth', function(){
      before(done => residenceMock.call(this, done));
      it('should respond with status 401', done => {
        request.delete(`${url}/api/residence/${this.tempResidence._id}`)
        .set({Authorization: 'lul this is bad}'})
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.text).to.equal('UnauthorizedError');
          done();
        });
      });
    });

    describe('with invalid residenceID', function(){
      before(done => residenceMock.call(this, done));
      it('should respond with status 404', done => {
        request.delete(`${url}/api/residence/badID`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.text).to.equal('NotFoundError');
          done();
        });
      });
    });


    describe('with valid residenceID', function(){
      before(done => residenceMock.call(this, done));
      it('should remove all dependinces', done => {
              console.log(this.tempResidence);

        request.delete(`${url}/api/residence/${this.tempResidence._id}`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .end((err, res) => {
          Residence.findById(this.tempResidence._id)
          .catch(err => {
            expect(res.status).to.equal(204);
            expect(err).to.be.null;
          });
          done();
        });
      });
    });
  });
});
