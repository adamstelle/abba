'use strict';

const awsMocks = require('../lib/aws-mocks.js');
const expect = require('chai').expect;
const debug = require('debug')('abba:photo-aws-middleware-test');

const request = require('superagent');

const server = require('../server.js');
const Profile = require('../model/profile.js');
const Bedroom = require('../model/bedroom.js');
const profileMock = require('./lib/profile-mock.js');
const bedroomMock = require('./lib/bedroom-mock.js');
const profilePhotoMock = require('./lib/profile-photo-mock.js');
const bedroomPhotoMock = require('./lib/bedroom-photo-mock.js');
const serverControl = require('./lib/server-control.js');
const cleanUpDatabase = require('./lib/clean-up-mock.js');

const examplePhoto = {
  name: 'whidbey',
  caption: 'beautiful property with a view',
  created: new Date(),
};

const examplePhotoResult = {
  name: 'whidbey',
  caption: 'beautiful property with a view',
  created: new Date(),
  imageURI: awsMocks.uploadMock.Location,
  objectKey: awsMocks.uploadMock.Key,
};

debug();

describe('testing photo middleware', function(){
  before(done => serverControl.serverUp(server, done));
  after(done => serverControl.serverDown(server, done));
  afterEach(done => cleanUpDatabase(done));
  
  describe('testing POST /api/profile/:profileID/photo', () => {
    describe('with valid body, auth and ID', () => {
      before(done => profileMock.call(this, done));
      it('should return a photo', done => {
        request.post(`localhost:3000/api/profile/${this.tempProfile._id}/photo`)
        .set({
          Authorization: `Bearer ${this.tempToken}`,
        })
        .field('name', examplePhoto.name)
        .field('caption', examplePhoto.caption)
        .attach('image', `${__dirname}/data/img1.jpg`)
        .then(res => {
          Profile.findById(this.tempProfile._id)
          .populate('photo')
          .then(profile => {
            expect(profile.photo.imageURI).to.equal(examplePhotoResult.imageURI);
            expect(profile.photo.objectKey).to.equal(examplePhotoResult.objectKey);
          });
          expect(res.status).to.equal(200);
          expect(res.body.caption).to.equal(examplePhoto.caption);
          // expect(res.body.imageURI).to.equal(examplePhotoResult.imageURI);
          done();
        })
        .catch(done);
      });
    });
  });
  describe('testing DELETE /api/profile/:profileID/photo/:id', () => {
    describe('testing with valid auth and ID', () => {
      beforeEach(done => profilePhotoMock.call(this, done));
      it('should return a 204 and remove photo from profile', done => {
        request.delete(`localhost:3000/api/profile/${this.tempProfile._id}/photo/${this.tempPhoto._id}`)
        .set({
          Authorization: `Bearer ${this.tempToken}`,
        })
        .then(res => {
          expect(res.status).to.equal(204);
          done();
        })
        .catch(done);
      });
      it('should remove the photo from the profile', done => {
        request.delete(`localhost:3000/api/profile/${this.tempProfile._id}/photo/${this.tempPhoto._id}`)
        .set({
          Authorization: `Bearer ${this.tempToken}`,
        })
        .then(res => {
          expect(res.status).to.equal(204);
          done();
        })
        .catch(done);
      });
    });
  });
  describe('testing POST /api/bedroom/:bedroomID/photo', () => {
    describe('single photo with valid body, auth and ID', () => {
      before(done => bedroomMock.call(this, done));
      it('should return a photo and add photo to bedrrom', done => {
        request.post(`localhost:3000/api/bedroom/${this.tempBedroom._id}/photo`)
        .set({
          Authorization: `Bearer ${this.tempToken}`,
        })
        .field('name', examplePhoto.name)
        .field('caption', examplePhoto.caption)
        .attach('image', `${__dirname}/data/img1.jpg`)
        .attach('image', `${__dirname}/data/img2.jpg`)
        .attach('image', `${__dirname}/data/img3.jpg`)
        .attach('image', `${__dirname}/data/img4.jpg`)
        .then(res => {
          Bedroom.findById(this.tempBedroom._id)
          .populate('bedroom')
          .then(bedroom => {
            expect(res.status).to.equal(200);
            expect(res.body[0].userID).to.equal(bedroom.userID.toString());
            expect(res.body[0].imageURI).to.equal(examplePhotoResult.imageURI);
            expect(res.body[0].caption).to.equal(examplePhoto.caption);
            done();
          });
        })
        .catch(done);
      });
    });
  });
  describe('testing DELETE /api/bedroom/:bedroomID/photo/:id', () => {
    describe('testing with valid auth and ID', () => {
      beforeEach(done => bedroomPhotoMock.call(this, done));
      it('should return a 204', done => {
        request.delete(`localhost:3000/api/bedroom/${this.tempBedroom._id}/photo/${this.tempPhoto._id}`)
        .set({
          Authorization: `Bearer ${this.tempToken}`,
        })
        .then(res => {
          expect(res.status).to.equal(204);
          done();
        })
        .catch(done);
      });
      it('should remove the photo from the bedroom', done => {
        request.delete(`localhost:3000/api/bedroom/${this.tempBedroom._id}/photo/${this.tempPhoto._id}`)
        .set({
          Authorization: `Bearer ${this.tempToken}`,
        })
        .then(res => {
          expect(res.status).to.equal(204);
          done();
        })
        .catch(done);
      });
    });
  });
});
