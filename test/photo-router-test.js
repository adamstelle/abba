'use strict';

require('./lib/test-env.js');

const awsMocks = require('../lib/aws-mocks.js');
const expect = require('chai').expect;
const debug = require('debug')('abba:photo-aws-middleware-test');

const request = require('superagent');

const server = require('../server.js');
const Profile = require('../model/profile.js');
const photoMock = require('./lib/photo-mock.js');
const profileMock = require('./lib/profile-mock.js');
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

  describe('testing upload a photo', () => {
    before(done => profileMock.call(this, done));
    it('should return a photo', done => {
      request.post(`localhost:3000/api/profile/${this.tempProfile._id}/photo`)
      .set({
        Authorization: `Bearer ${this.tempToken}`,
      })
      .field('name', examplePhoto.name)
      .field('caption', examplePhoto.caption)
      .attach('image', `${__dirname}/data/testpic.png`)
      .then(res => {
        Profile.findById(this.tempProfile._id)
        .populate('photo')
        .then(profile => {
          expect(profile.photo.imageURI).to.equal(examplePhotoResult.imageURI);
          expect(profile.photo.objectKey).to.equal(examplePhotoResult.objectKey);
        });
        expect(res.status).to.equal(200);
        expect(res.body.caption).to.equal(examplePhoto.caption);
        expect(res.body.imageURI).to.equal(examplePhotoResult.imageURI);
        done();
      })
      .catch(done);
    });
  });
  describe('testing delete a photo', () => {
    before(done => photoMock.call(this, done));
    it('should return a 204', done => {
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
    before(done => photoMock.call(this, done));
    it('should remove the photo from the profile', done => {
      console.log('rpfoile is ', this.tempProfile._id);
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
