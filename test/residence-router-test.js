'use strict';

require('./lib/test-env.js');

const mongoose = require('mongoose');
const request = require('superagent');
const expect = require('chai').expect;

const server = require('../server.js');
const serverControl = require('./lib/server-control.js');

const residenceMock = require('./lib/residence-mock.js');
const cleanUpDatabase = require('./lib/clean-up-mock.js');

mongoose.Promise = Promise;

const url = `http://localhost:${process.env.PORT}`;

describe('testing residence routes', function() {
  before(done => serverControl.serverUp(server, done));
  after(done => serverControl.serverDown(server, done));
  describe('testing POST /api/profile/:id/residence', function() {
    describe('with valid body', function() {
      after(done => {
        cleanUpDatabase();
        done();
      });
      it('should return a token', (done) => {
        request.post(`${url}/api/profile/${this.tempProfile._id}/residence`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .send({
          dateBuilt: new Date(),
          sqft: 300,
          type: 'apartment',
          street: '100 first street',
          city: 'seattle',
          state: 'WA',
          zip: '12345',
          address: '100 first street, seattle, WA 12345',
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
        request.post(`${url}/api/profile/${this.tempProfile._id}/residence`)
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
      it('should return a 400 bad request', (done) => {
        request.post(`${url}/api/profile/${this.tempProfile._id}/residence`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .send()
        .set('Character-Type', 'application/json')
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    }); //end of no body

    describe('with duplicate address', function() {
      before(done => residenceMock.call(this, done));
      after(done => {
        cleanUpDatabase();
        done();
      });
      it('should return a 409 error', (done) => {
        request.post(`${url}/api/profile/${this.tempProfile._id}/residence`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .send({
          dateBuilt: this.exampleResidence.dateBuilt,
          sqft: this.exampleResidence.sqft,
          type: this.exampleResidence.type,
          street: this.exampleResidence.street,
          city: this.exampleResidence.city,
          state: this.exampleResidence.state,
          zip: this.exampleResidence.zip,
          address: this.exampleResidence.address,
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
      after(done => {
        cleanUpDatabase();
        done();
      });
      it ('should return a 400 error', (done) => {
        request.post(`${url}/api/profile/${this.tempProfile._id}/residence`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .send({
          dateBuilt: this.exampleResidence.dateBuilt,
          sqft: this.exampleResidence.sqft,
          type: this.exampleResidence.type,
          city: this.exampleResidence.city,
          state: this.exampleResidence.state,
          zip: this.exampleResidence.zip,
          address: this.exampleResidence.address,
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    }); //end of with no street

    describe('with no type', function(){
      before(done => residenceMock.call(this, done));
      after(done => {
        cleanUpDatabase();
        done();
      });
      it ('should return a 400 error', (done) => {
        request.post(`${url}/api/profile/${this.tempProfile._id}/residence`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .send({
          dateBuilt: this.exampleResidence.dateBuilt,
          sqft: this.exampleResidence.sqft,
          street: this.exampleResidence.street,
          city: this.exampleResidence.city,
          state: this.exampleResidence.state,
          zip: this.exampleResidence.zip,
          address: this.exampleResidence.address,
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    }); //end of with no type

    describe('with no city', function(){
      before(done => residenceMock.call(this, done));
      after(done => {
        cleanUpDatabase();
        done();
      });
      it ('should return a 400 error', (done) => {
        request.post(`${url}/api/profile/${this.tempProfile._id}/residence`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .send({
          dateBuilt: this.exampleResidence.dateBuilt,
          sqft: this.exampleResidence.sqft,
          type: this.exampleResidence.type,
          street: this.exampleResidence.street,
          state: this.exampleResidence.state,
          zip: this.exampleResidence.zip,
          address: this.exampleResidence.address,
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    }); //end of with no city

    describe('with no state', function(){
      before(done => residenceMock.call(this, done));
      after(done => {
        cleanUpDatabase();
        done();
      });
      it ('should return a 400 error', (done) => {
        request.post(`${url}/api/profile/${this.tempProfile._id}/residence`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .send({
          dateBuilt: this.exampleResidence.dateBuilt,
          sqft: this.exampleResidence.sqft,
          type: this.exampleResidence.type,
          street: this.exampleResidence.street,
          city: this.exampleResidence.city,
          zip: this.exampleResidence.zip,
          address: this.exampleResidence.address,
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    }); //end of with no state

    describe('with no zip', function(){
      before(done => residenceMock.call(this, done));
      after(done => {
        cleanUpDatabase();
        done();
      });
      it ('should return a 400 error', (done) => {
        request.post(`${url}/api/profile/${this.tempProfile._id}/residence`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .send({
          dateBuilt: this.exampleResidence.dateBuilt,
          sqft: this.exampleResidence.sqft,
          type: this.exampleResidence.type,
          street: this.exampleResidence.street,
          city: this.exampleResidence.city,
          state: this.exampleResidence.state,
          address: this.exampleResidence.address,
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    }); //end of with no zip

    describe('with no sqft', function(){
      before(done => residenceMock.call(this, done));
      after(done => {
        cleanUpDatabase();
        done();
      });
      it ('should return a 400 error', (done) => {
        request.post(`${url}/api/profile/${this.tempProfile._id}/residence`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .send({
          dateBuilt: this.exampleResidence.dateBuilt,
          type: this.exampleResidence.type,
          street: this.exampleResidence.street,
          city: this.exampleResidence.city,
          state: this.exampleResidence.state,
          zip: this.exampleResidence.zip,
          address: this.exampleResidence.address,
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    }); //end of with no sqft
  }); //end of POST tests

  describe('testing GET /api/profile/:id/residence/:id', function() {
    //with valid password and auth?
    describe('with valid ID', function() {
      before(done => residenceMock.call(this, done));
      after(done => {
        cleanUpDatabase();
        delete this.tempResidence.residenceID;
        done();
      });
      it('should return a residenceID', (done) => {
        request.get(`${url}/api/profile/${this.tempProfile._id}/residence/${this.tempResidence._id}`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.dateBuilt).to.equal(this.tempResidence.dateBuilt);
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
      after(done => {
        cleanUpDatabase();
        done();
      });
      it('should return a 400 bad request', (done) => {
        request.get(`${url}/api/profile/${this.tempProfile._id}/residence/:wrongid`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    });//end of GET with invalid residenceID
  }); //end of GET tests

  describe('testing DELETE /api/profile/:id/residence/:id', function(){

    describe('testing DELETE /api/gallery/:gallryID/pic/:picID', function(){
      describe('with valid token and ids', function(){
        before(done => residenceMock.call(this, done));

        it('should respond with status 204', done => {
          request.delete(`${url}/api/profile/${this.tempProfile._id}/residence/${this.tempResidence._id}`)
          .set({Authorization: `Bearer ${this.tempToken}`})
          .end((err, res) => {
            if (err) return done(err);
            expect(res.status).to.equal(204);
            done();
          });
        });
      });
    });
  });
});
