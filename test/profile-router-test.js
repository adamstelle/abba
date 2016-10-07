'use strict';

const mongoose = require('mongoose');
const request = require('superagent');
const expect = require('chai').expect;
const Promise = require('bluebird');

const server = require('../server.js');
const User = require('../model/user.js');
const Profile = require('../model/profile.js');
const serverControl = require('./lib/server-control.js');

mongoose.Promise = Promise;

const url = `http://localhost:${process.env.PORT}`;

const exampleUser = {
  email: 'test@test.com',
  password: 'badpass',
};
const exampleProfile = {
  firstName: 'abba',
  lastName: 'team',
  phone: '425-555-5555',
  email: 'abba-team@gmail.com',
  status: 'owner',
};

describe('testing profile routes', function() {
  before(done => serverControl.serverUp(server, done));
  after(done => serverControl.serverDown(server, done));

  describe('testing POST api/profile', () => {
    describe('testing with valid body', () => {
      before(done => {
        new User(exampleUser)
        .generatePasswordHash(exampleUser.password)
        .then( user => user.save())
        .then( user => {
          this.tempUser = user;
          return user.generateToken();
        })
       .then( token => {
         this.tempToken = token;
         done();
       })
      .catch(done);
      });

      after(done => {
        Promise.all([
          User.remove({}),
          Profile.remove({}),
        ])
       .then( () => done())
       .catch(done);
      });
      
      it('expect to return res status eqaul to 200', done => {
        request.post(`${url}/api/profile`)
        .send(exampleProfile)
        .set({
          Authorization: `Bearer ${this.tempToken}`,
        })
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).to.equal(200);
        expect(res.body.firstName).to.equal(exampleProfile.firstName);
        expect(res.body.lastName).to.equal(exampleProfile.lastName);
        done();
      });
      });
    });
  });

  describe('testing GET to /api/profile/:id', () => {
    before(done => {
      new User(exampleUser)
      .generatePasswordHash(exampleUser.password)
      .then( user => user.save())
      .then( user => {
        this.tempUser = user;
        return user.generateToken();
      })
      .then( token => {
        this.tempToken = token;
        done();
      })
      .catch(done);
    });

    before( done => {
      exampleProfile.userID = this.tempUser._id.toString();
      new Profile(exampleProfile).save()
      .then( profile => {
        this.tempProfile = profile;
        done();
      })
      .catch(done);
    });

    after(() => {
      delete exampleProfile.userID;
    });

    it('should return a profile', done => {
      request.get(`${url}/api/profile/${this.tempProfile._id}`)
      .set({
        Authorization: `Bearer ${this.tempToken}`,
      })
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).to.equal(200);
        expect(err).to.be.null;
        expect(res.body.firstName).to.equal(exampleProfile.firstName);
        expect(res.body.lastName).to.equal(exampleProfile.lastName);
        expect(res.body.userID).to.equal(this.tempUser._id.toString());
        done();
      });
    });
  });
});