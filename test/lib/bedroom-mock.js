'use strict';
const debug = require('debug')('abba:residence-mock');

const Bedroom = require('../../model/bedroom.js');
const residenceMock = require('./residence-mock.js');

module.exports = function(done){
  debug('creating mock bedroom');

  let exampleBedroom = {
    type: 'Private bedroom',
    bedSize: 'Queen',
    bedType: 'Air mattress',
    sleepNum: 2,
    privateBath: true,
  };

  residenceMock.call(this, err => {
    if (err) return done(err);
    exampleBedroom.residenceID = this.tempResidence._id;
    exampleBedroom.userID = this.tempUser._id.toString();
    new Bedroom(exampleBedroom).save()
    .then(bedroom => {
      this.tempbedroom = bedroom;
      done();
    })
    .catch(done);
  });
};
