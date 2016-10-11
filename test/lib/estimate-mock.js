'use strict';

//npm modules
const debug = require('debug')('abba:estimate-mock');

//app modules
const Estimate = require('../../model/estimate.js');
const bedroomMock = require('./bedroom-mock.js');

module.exports = function(done){
  debug('creating mock-estimate');

  let exampleEstimate = {
    nightlyEst: 50,
    monthlyEst: 500,
    occupancyRate: .5,
  };

  bedroomMock.call(this, err => {
    if (err) return done(err);
    exampleEstimate.bedID = this.tempBedroom._id;
    exampleEstimate.userID = this.tempUser._id.toString();
    exampleEstimate.resID = this.tempResidence._id;
    new Estimate(exampleEstimate).save()
    .then(estimate => {
      this.tempEstimate = estimate;
      done();
    })
    .catch(done);
  });
};
