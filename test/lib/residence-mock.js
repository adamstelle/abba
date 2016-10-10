'use strict';
// npm modules
const debug = require('debug')('abba:photo-mock');

// app modules
const Residence = require('../../model/residence.js');
const profileMock = require('./profile-mock.js');

module.exports = function(done){
  debug('creating mock photo');
  let exampleResidence = {
    dateBuilt: new Date(),
    sqft: 300,
    type: 'condo',
    street: '1234 Example Road',
    city: 'seattle',
    state: 'WA',
    zip: '12345',
    address: '1234 Example Road, seattle, WA, 12345',
  };

  profileMock.call(this, err => {
    if (err) return done(err);
    exampleResidence.userID = this._id.toString();
    new Residence(exampleResidence).save()
    .then(residence => {
      this.tempResidence = residence;
      done();
    })
    .catch(done);
  });
};
