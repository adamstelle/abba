// 'use strict';
//
// require('./lib/test-env.js');
//
// const mongoose = require('mongoose');
// const request = require('superagent');
// const expect = require('chai').expect;
//
// const server = require('../server.js');
// const serverControl = require('./lib/server-control.js');
//
// const residenceMock = require('./lib/residence-mock.js');
// const cleanUpDatabase = require('./lib/clean-up-mock.js');
//
// mongoose.Promise = Promise;
//
// const url = `http://localhost:${process.env.PORT}`;
//
// describe('testing residence routes', function() {
//   before(done => serverControl.serverUp(server, done));
//   after(done => serverControl.serverDown(server, done));
//   describe('testing POST /api/profile/:id/residence', function() {
//     describe('with valid body', function() {
//       after(done => {
//         cleanUpDatabase();
//         done();
//       });``
//       it('should return a token', (done) => {
//         request.post(`${url}/api/profile/:id/residence`)
//         .send({
//           dateBuilt: new Date(),
//           sqft: 300,
//           type: 'apartment',
//           street: '100 first street',
//           city: 'seattle',
//           state: 'WA',
//           zip: '12345',
//           address: '100 first street, seattle, WA 12345',
//         })
//         .end((err, res) => {
//           if (err) return done(err);
//           expect(res.status).to.equal(200);
//           expect(!!res.text).to.equal(true);
//           done();
//         });
//       });
//     }); //end of valid body
//
//     describe('with invalid body', function() {
//       it('should return a 400 bad request', (done) => {
//         request.post(`${url}/api/profile/:id/residence`)
//         .send('nope')
//         .set('Character-Type', 'application/json')
//         .end((err, res) => {
//           expect(res.status).to.equal(400);
//           done();
//         });
//       });
//     }); //end of invalid body
//
//     describe('with no body', function() {
//       it('should return a 400 bad request', (done) => {
//         request.post(`${url}/api/profile/:id/residence`)
//         .send()
//         .set('Character-Type', 'application/json')
//         .end((err, res) => {
//           expect(res.status).to.equal(400);
//           done();
//         });
//       });
//     }); //end of no body
//
//     describe('with duplicate address', function() {
//       before(done => residenceMock.call(this, done));
//       after(done => {
//         cleanUpDatabase();
//         done();
//       });
//       it('should return a 409 error', (done) => {
//         request.post(`${url}/api/profile/:id/residence`)
//         .send({
//           dateBuilt: this.exampleResidence.dateBuilt,
//           sqft: this.exampleResidence.sqft,
//           type: this.exampleResidence.type,
//           street: this.exampleResidence.street,
//           city: this.exampleResidence.city,
//           state: this.exampleResidence.state,
//           zip: this.exampleResidence.zip,
//           address: this.exampleResidence.address,
//         })
//         .end((err, res) => {
//           expect(res.status).to.equal(409);
//           expect(res.text).to.equal('ConflictError');
//           done();
//         });
//       });
//     }); //end of duplicate email
//
//     describe('with no street', function(){
//       before(done => residenceMock.call(this, done));
//       after(done => {
//         cleanUpDatabase();
//         done();
//       });
//       it ('should return a 400 error', (done) => {
//         request.post(`${url}/api/profile/:id/residence`)
//         .send({
//           dateBuilt: this.exampleResidence.dateBuilt,
//           sqft: this.exampleResidence.sqft,
//           type: this.exampleResidence.type,
//           city: this.exampleResidence.city,
//           state: this.exampleResidence.state,
//           zip: this.exampleResidence.zip,
//           address: this.exampleResidence.address,
//         })
//         .end((err, res) => {
//           expect(res.status).to.equal(400);
//           done();
//         });
//       });
//     }); //end of with no street
//
//     describe('with no type', function(){
//       before(done => residenceMock.call(this, done));
//       after(done => {
//         cleanUpDatabase();
//         done();
//       });
//       it ('should return a 400 error', (done) => {
//         request.post(`${url}/api/profile/:id/residence`)
//         .send({
//           dateBuilt: this.exampleResidence.dateBuilt,
//           sqft: this.exampleResidence.sqft,
//           street: this.exampleResidence.street,
//           city: this.exampleResidence.city,
//           state: this.exampleResidence.state,
//           zip: this.exampleResidence.zip,
//           address: this.exampleResidence.address,
//         })
//         .end((err, res) => {
//           expect(res.status).to.equal(400);
//           done();
//         });
//       });
//     }); //end of with no type
//
//     describe('with no city', function(){
//       before(done => residenceMock.call(this, done));
//       after(done => {
//         cleanUpDatabase();
//         done();
//       });
//       it ('should return a 400 error', (done) => {
//         request.post(`${url}/api/profile/:id/residence`)
//         .send({
//           dateBuilt: this.exampleResidence.dateBuilt,
//           sqft: this.exampleResidence.sqft,
//           type: this.exampleResidence.type,
//           street: this.exampleResidence.street,
//           state: this.exampleResidence.state,
//           zip: this.exampleResidence.zip,
//           address: this.exampleResidence.address,
//         })
//         .end((err, res) => {
//           expect(res.status).to.equal(400);
//           done();
//         });
//       });
//     }); //end of with no city
//
//     describe('with no state', function(){
//       before(done => residenceMock.call(this, done));
//       after(done => {
//         cleanUpDatabase();
//         done();
//       });
//       it ('should return a 400 error', (done) => {
//         request.post(`${url}/api/profile/:id/residence`)
//         .send({
//           dateBuilt: this.exampleResidence.dateBuilt,
//           sqft: this.exampleResidence.sqft,
//           type: this.exampleResidence.type,
//           street: this.exampleResidence.street,
//           city: this.exampleResidence.city,
//           zip: this.exampleResidence.zip,
//           address: this.exampleResidence.address,
//         })
//         .end((err, res) => {
//           expect(res.status).to.equal(400);
//           done();
//         });
//       });
//     }); //end of with no state
//
//     describe('with no zip', function(){
//       before(done => residenceMock.call(this, done));
//       after(done => {
//         cleanUpDatabase();
//         done();
//       });
//       it ('should return a 400 error', (done) => {
//         request.post(`${url}/api/profile/:id/residence`)
//         .send({
//           dateBuilt: this.exampleResidence.dateBuilt,
//           sqft: this.exampleResidence.sqft,
//           type: this.exampleResidence.type,
//           street: this.exampleResidence.street,
//           city: this.exampleResidence.city,
//           state: this.exampleResidence.state,
//           address: this.exampleResidence.address,
//         })
//         .end((err, res) => {
//           expect(res.status).to.equal(400);
//           done();
//         });
//       });
//     }); //end of with no zip
//
//     describe('with no sqft', function(){
//       before(done => residenceMock.call(this, done));
//       after(done => {
//         cleanUpDatabase();
//         done();
//       });
//       it ('should return a 400 error', (done) => {
//         request.post(`${url}/api/profile/:id/residence`)
//         .send({
//           dateBuilt: this.exampleResidence.dateBuilt,
//           type: this.exampleResidence.type,
//           street: this.exampleResidence.street,
//           city: this.exampleResidence.city,
//           state: this.exampleResidence.state,
//           zip: this.exampleResidence.zip,
//           address: this.exampleResidence.address,
//         })
//         .end((err, res) => {
//           expect(res.status).to.equal(400);
//           done();
//         });
//       });
//     }); //end of with no sqft
//   }); //end of POST tests
//
//   describe('testing GET /api/profile/:id/residence/:id', function() {
//     //with valid password and auth?
//     describe('with valid ID and auth', function() {
//       before(done => residenceMock.call(this, done));
//       after(done => {
//         cleanUpDatabase();
//         done();
//       });
//       it('should return a residence', (done) => {
//         request.get(`${url}/api/profile/:id/residence/:id`)
//         .end((err, res) => {
//           if (err) return done(err);
//           console.log('res.text is ', res.text);
//           expect(res.status).to.equal(200);
//           expect(!!res.text).to.equal(true);
//           done();
//         });
//       });
//     }); //end of with valid ID and auth
//     describe('with an invalid password and valid email', function() {
//       before(done => residenceMock.call(this, done));
//       after(done => {
//         cleanUpDatabase();
//         done();
//       });
//       it('should return a 401 not authorized', (done) => {
//         request.get(`${url}/api/profile/:id/residence/:id`)
//         .auth(this.tempUser.email, 'wrongpass')
//         .end((err, res) => {
//           expect(res.status).to.equal(401);
//           done();
//         });
//       });
//     });//end of with invalid password and valid email
//     describe('with a valid password and invalid email', function() {
//       before(done => residenceMock.call(this,done));
//       after(done => {
//         cleanUpDatabase();
//         done();
//       });
//     });
//     it('should return a 401 bad request', (done) => {
//       request.get(`${url}/api/profile/:id/residence/:id`)
//       .auth('wrong@test.com', this.tempPassword)
//       .end((err, res) => {
//         expect(res.status).to.equal(401);
//         done();
//       });
//     });
//   }); //end of GET tests
// });
