'use strict';

require('./lib/test-env.js');

const awsMocks = require('../lib/aws-mocks.js');
const expect = require('chai').expect;
const debug = require('debug')('abba:photo-aws-middleware-test');

const request = require('superagent');
const server = require('../server.js');
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

describe('testing photo middleware', function(){
  debug('testing photo middleware');
  before(done => serverControl.serverUp(server, done));
  after(done => serverControl.serverDown(server, done));
  before(done => profileMock.call(this, done));
  after(done => {
    cleanUpDatabase();
    done();
  });
  describe('testing upload a photo', ()=> {
    it('should return a photo', done => {
      request.post(`localhost:3000/api/profile/${this.tempProfile._id}/photo`)
      .set({
        Authorization: `Bearer ${this.tempToken}`,
      })
      .field('name', examplePhoto.name)
      .field('caption', examplePhoto.caption)
      .attach('image', `${__dirname}/data/testpic.png`)
      .then(res => {
        expect(res.status).to.equal(200);
        expect(res.body.caption).to.equal(examplePhoto.caption);
        expect(res.body.imageURI).to.equal(examplePhotoResult.imageURI);
        done();
      })
      .catch(done);
    });
  });
});
