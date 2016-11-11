'use strict';

require('./lib/test-env.js');
require('../lib/aws-mocks.js');


const mongoose = require('mongoose');
const request = require('superagent');
const expect = require('chai').expect;
const Promise = require('bluebird');

const server = require('../server.js');
const userMock = require('./lib/user-mock.js');
const profileMock = require('./lib/profile-mock.js');
const serverControl = require('./lib/server-control.js');
const cleanUpDatabase = require('./lib/clean-up-mock.js');

mongoose.Promise = Promise;

const url = `http://localhost:${process.env.PORT}`;

let exampleProfileData = {
  firstName: 'abba',
  lastName: 'team',
  phone: 4255555555,
  email: 'testy@test.com',
  status: 'owner',
};

describe('testing profile routes', function() {
  before(done => serverControl.serverUp(server, done));
  after(done => serverControl.serverDown(server, done));
  afterEach(done => cleanUpDatabase(done));
  describe('testing POST api/profile', () => {
    describe('testing with valid body', () => {
      before(done => userMock.call(this, done));
      it('expect to return res status eqaul to 200', done => {
        request.post(`${url}/api/profile`)
        .send(exampleProfileData)
        .set({
          Authorization: `Bearer ${this.tempToken}`,
        })
        .end((err, res) => {
            console.log('POST res.header', res.headers);
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.firstName).to.equal(exampleProfileData.firstName);
          expect(res.body.lastName).to.equal(exampleProfileData.lastName);
          done();
        });
      });
    });

    describe('testing with Invalid body', () => {
      before(done => userMock.call(this, done));
      it('expect to return res status eqaul to 400', done => {
        request.post(`${url}/api/profile`)
        .send({name:'Abba Team'})
        .set({
          Authorization: `Bearer ${this.tempToken}`,
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(err).to.not.be.null;
          done();
        });
      });
    });

    describe('testing with Invalid Token', () => {
      before(done => userMock.call(this, done));
      it('expect to return res status eqaul to 401', done => {
        request.post(`${url}/api/profile`)
        .send(exampleProfileData)
        .set({
          Authorization: 'Bearer faketown',
        })
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(err).to.not.be.null;
          done();
        });
      });
    });
  });

  describe('with body missing required firstName', function() {
    before(done => userMock.call(this, done));

    it('should return a 400 bad request', (done) => {
      let modProfData = Object.assign({}, exampleProfileData);
      delete modProfData.firstName;
      request.post(`${url}/api/profile`)
      .set({Authorization: `Bearer ${this.tempToken}`})
      .send(modProfData)
      .set('Character-Type', 'application/json')
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(err.message).to.equal('Bad Request');
        done();
      });
    });
  });

  describe('with body missing required lastName', function() {
    before(done => userMock.call(this, done));

    it('should return a 400 bad request', (done) => {
      let modProfData = Object.assign({}, exampleProfileData);
      delete modProfData.lastName;
      request.post(`${url}/api/profile`)
      .set({Authorization: `Bearer ${this.tempToken}`})
      .send(modProfData)
      .set('Character-Type', 'application/json')
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(err.message).to.equal('Bad Request');
        done();
      });
    });
  });

  describe('with body missing required email', function() {
    before(done => userMock.call(this, done));

    it('should return a 400 bad request', (done) => {
      let modProfData = Object.assign({}, exampleProfileData);
      delete modProfData.email;
      request.post(`${url}/api/profile`)
      .set({Authorization: `Bearer ${this.tempToken}`})
      .send(modProfData)
      .set('Character-Type', 'application/json')
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(err.message).to.equal('Bad Request');
        done();
      });
    });
  });

  describe('with body missing required phone', function() {
    before(done => userMock.call(this, done));

    it('should return a 400 bad request', (done) => {
      let modProfData = Object.assign({}, exampleProfileData);
      delete modProfData.phone;
      request.post(`${url}/api/profile`)
      .set({Authorization: `Bearer ${this.tempToken}`})
      .send(modProfData)
      .set('Character-Type', 'application/json')
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(err.message).to.equal('Bad Request');
        done();
      });
    });
  });

  describe('with duplicate email', function() {
    before(done => profileMock.call(this, done));
    it('should return a 409 bad request', (done) => {
      let modProfData = Object.assign({}, exampleProfileData);
      modProfData.email = this.tempProfile.email;
      request.post(`${url}/api/profile`)
      .set({Authorization: `Bearer ${this.tempToken}`})
      .send(modProfData)
      .set('Character-Type', 'application/json')
      .end((err, res) => {
        expect(res.status).to.equal(409);
        expect(err.message).to.equal('Conflict');
        done();
      });
    });
  });

  describe('with no body', function() {
    before(done => userMock.call(this, done));

    it('should return a 400 bad request', (done) => {
      request.post(`${url}/api/profile`)
      .set({Authorization: `Bearer ${this.tempToken}`})
      .send()
      .set('Character-Type', 'application/json')
      .end((err, res) => {
        expect(res.status).to.equal(400);
        done();
      });
    });
  });

  describe('testing GET to /api/profile/:id', () => {
    describe('testing with with valid profile_id', function() {
      before(done => profileMock.call(this, done));

      it('should return a profile', done => {
        request.get(`${url}/api/profile/${this.tempProfile._id}`)
        .set({
          Authorization: `Bearer ${this.tempToken}`,
        })
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(err).to.be.null;
          expect(res.body.firstName).to.equal(this.tempProfile.firstName);
          expect(res.body.lastName).to.equal(this.tempProfile.lastName);
          expect(res.body.userID).to.equal(this.tempUser._id.toString());
          done();
        });
      });
    });

    describe('testing with Invalid profile_id', function() {
      before(done => profileMock.call(this, done));
      it('should return a 404 error', done => {
        request.get(`${url}/api/profile/3334`)
        .set({
          Authorization: `Bearer ${this.tempToken}`,
        })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(err).to.not.be.null;
          done();
        });
      });
    });

    describe('testing with invalid token', function() {
      before(done => profileMock.call(this, done));
      it('should return a 401 error', done => {
        request.get(`${url}/api/profile/${this.tempProfile._id}`)
        .set({Authorization: `Bearer ${this.tempToken}FAKENESS`})
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(err).to.not.be.null;
          done();
        });
      });
    });

    describe('testing with invalid header', function() {
      before(done => profileMock.call(this, done));
      it('should return a 401 error', done => {
        request.get(`${url}/api/profile/${this.tempProfile._id}`)
        .set({Authorization: 'Notbearer!'})
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(err).to.not.be.null;
          done();
        });
      });
    });

    describe('with unathorized user', function() {
      before(done => profileMock.call(this, done));
      before(done => userMock.call(this,done));

      it('should return a 401 unauthorized user', (done) => {
        request.get(`${url}/api/profile/${this.tempProfile._id}`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(err.message).to.equal('Unauthorized');
          done();
        });
      });
    });
  });

  describe('testing DELETE api/profile/:id', () => {
    describe('testing with valid profile_id', () => {
      before(done => profileMock.call(this, done));

      it('should DELETE a profile with valid id', done => {
        request.delete(`${url}/api/profile/${this.tempProfile._id}`)
        .set({
          Authorization: `Bearer ${this.tempToken}`,
        })
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(204);
          expect(err).to.be.null;
          done();
        });
      });
    });

    describe('testing with Invalid profile_id', () => {
      it('expect to return error for deleting profile with invalid id', done => {
        request.delete(`${url}/api/profile/badID`)
        .set({
          Authorization: `Bearer ${this.tempToken}`,
        })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(err).to.not.be.null;
          done();
        });
      });
    });

    describe('testing with invalid token', function() {
      before(done => profileMock.call(this, done));
      it('should return a 401 error', done => {
        request.delete(`${url}/api/profile/${this.tempProfile._id}`)
        .set({Authorization: `Bearer ${this.tempToken}FAKENESS`})
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(err).to.not.be.null;
          done();
        });
      });
    });

    describe('testing with invalid header', function() {
      before(done => profileMock.call(this, done));
      it('should return a 401 error', done => {
        request.delete(`${url}/api/profile/${this.tempProfile._id}`)
        .set({Authorization: 'Notbearer!'})
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(err).to.not.be.null;
          done();
        });
      });
    });

    describe('with unathorized user', function() {
      before(done => profileMock.call(this, done));
      before(done => userMock.call(this,done));

      it('should return a 401 unauthorized user', (done) => {
        request.delete(`${url}/api/profile/${this.tempProfile._id}`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(err.message).to.equal('Unauthorized');
          done();
        });
      });
    });
  });

  describe('testing PUT api/profile/:id', () => {
    let updatedProfile = {
      firstName: 'abba2',
      lastName: 'team2',
      phone: 4255000000,
    };
    describe('testing with valid body / id', () => {
      before(done => profileMock.call(this, done));
      it('should update a profile with valid id / body', done => {
        request.put(`${url}/api/profile/${this.tempProfile._id}`)
        .set({
          Authorization: `Bearer ${this.tempToken}`,
        })
        .send(updatedProfile)
        .end((err, res) => {
          if(err) done(err);
          expect(res.status).to.equal(200);
          for (var i in updatedProfile) {
            expect(res.body[i]).to.equal(updatedProfile[i]);
          }
          expect(res.body).to.have.property('email');
          expect(res.body).to.have.property('status');
          expect(err).to.be.null;
          done();
        });
      });
    });

    describe('testing with Invalid id', () => {
      it('should return a error for updating with Invalid id', done => {
        request.put(`${url}/api/profile/${8888}`)
        .set({
          Authorization: `Bearer ${this.tempToken}`,
        })
        .send(updatedProfile)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(err).to.not.be.null;
          done();
        });
      });
    });

    describe('testing with invalid token', function() {
      before(done => profileMock.call(this, done));
      it('should return a 401 error', done => {
        request.put(`${url}/api/profile/${this.tempProfile._id}`)
        .set({Authorization: `Bearer ${this.tempToken}FAKENESS`})
        .send(updatedProfile)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(err).to.not.be.null;
          done();
        });
      });
    });

    describe('testing with invalid header', function() {
      before(done => profileMock.call(this, done));
      it('should return a 401 error', done => {
        request.put(`${url}/api/profile/${this.tempProfile._id}`)
        .set({Authorization: 'Notbearer!'})
        .send(updatedProfile)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(err).to.not.be.null;
          done();
        });
      });
    });

    describe('with unathorized user', function() {
      before(done => profileMock.call(this, done));
      before(done => userMock.call(this,done));

      it('should return a 401 unauthorized user', (done) => {
        request.put(`${url}/api/profile/${this.tempProfile._id}`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .send(updatedProfile)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(err.message).to.equal('Unauthorized');
          done();
        });
      });
    });

    describe('testing with Invalid body', () => {
      before(done => profileMock.call(this, done));

      it('should return a error for updating with Invalid id', done => {
        request.put(`${url}/api/profile/${this.tempProfile._id}`)
        .set({
          Authorization: `Bearer ${this.tempToken}`,
          'Content-Type':'application/json',
        })
        .send('}')
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    });
  });
});
