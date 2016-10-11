'use strict';
// npm modules
const debug = require('debug')('abba:residence-mock');

// app modules
const lorem = require('lorem-ipsum');
const profileMock = require('./profile-mock.js');
const Residence = require('../../model/residence.js');

module.exports = function(done){
  debug('creating mock residence');
  let address = lorem({count: 2, units: 'word'}).split(' ').join('-');

  let exampleResidence = {
    dateBuilt: new Date(),
    sqft: '300',
    type: 'condo',
    street: '1234 Example Road',
    city: 'seattle',
    state: 'WA',
    zip: '12345',
    address: `${address}`,
  };

  profileMock.call(this, err => {
    if (err) return done(err);
    exampleResidence.profileID = this.tempProfile._id;
    exampleResidence.userID = this.tempUser._id.toString();
    new Residence(exampleResidence).save()
    .then(residence => {
      this.tempResidence = residence;
      done();
    })
    .catch(done);
  });
};
