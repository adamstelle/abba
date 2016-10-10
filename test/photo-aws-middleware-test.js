require('./lib/test-env.js');

'use strict';

const awsMocks = require('../lib/aws-mocks.js');

const expect = require('chai').expect;
const debug = require('debug')('abba:photo-model-test');

const request = require('superagent');
const server = require('../server.js');
const User = require('../model/user.js');
const Photo = require('../model/photo.js');
const profileMock = require('./lib/profile-mock.js');
const serverControl = require('./lib/server-control.js');
const cleanUpDatabase = require('./lib/clean-up-mock.js');

// module constants
const picURL = `${__dirname}/data/testpic.png`;

// Will need example profile
// const exampleProfile = {
//
// }

const examplePhotoData = {
  name: 'whidbey',
  caption: 'beautiful property with a view',
  created: new Date(),
  imageURI: awsMocks.uploadMock.Location,
  objectKey: awsMocks.uploadMock.Key,
};

describe('testing photo model static functions', function(){
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
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).to.equal(200);
        expect(err).to.be.null;
        done();
      });
    });
  });
});
