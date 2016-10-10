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
// const mockUser = require('./lib/user-mock.js');
// const residenceMock = require('./lib/residence-mock.js');
// const cleanUpDatabase = require('./lib/clean-up-mock.js');
//
// mongoose.Promise = Promise;
//
// const url = `http://localhost:${process.env.PORT}`;
//
// const exampleBedroom = {
//   type: 'master',
//   bedSize: 'queen',
//   bedType: 'regular',
//   sleepNum: 2,
//   photoArray: [],
//   residenceID: 1234,
//   estimateID: 50,
// };
//
// describe('testing bedroom router', function() {
//   before(done => serverControl.serverUp(server, done));
//   after(done => serverControl.serverDown(server, done));
//   describe('testing POST /api/residence/:resID/bedroom ', function() {
//     describe('with valid body', function() {
//       //assuming residence Mock is a thing
//       before(done => mockUser.call(this, done));
//       before(done => residenceMock.call(this, done));
//       after(done => {
//         cleanUpDatabase();
//         done();
//       });
//       it('should return a bedroom', (done) => {
//         request.post(`${url}/api/residence/${this.tempResidence._id}/bedroom`)
//         .send({
//           type: 'master',
//           bedSize: 'queen',
//           bedType: 'regular',
//           sleepNum: 2,
//           photoArray: [],
//           residenceID: `${this.tempResidence.id}`,
//           estimateID: 'tbd',
//         })
//         .set({Authorization: `Bearer ${this.tempToken._id}`})
//         .end((err, res) => {
//           expect(res.status).to.equal(200);
//           done();
//         });
//       }); //end of it should return a bedroom
//     });//end of describe with valid body
//
//     describe('with invalid body', function() {
//       before(done => mockUser.call(this, done));
//       before(done => residenceMock.call(this, done));
//       after(done => {
//         cleanUpDatabase();
//         done();
//       });
//       it('should return a 400 bad request', (done) => {
//         request.post(`${url}/api/residence/${this.tempResidence._id}/bedroom`)
//         .send('asdf')
//         .set('Character-Type', 'application/json')
//         .set({Authorization: `Bearer ${this.tempToken._id}/bedroom`})
//         .end((err, res) => {
//           expect(res.status).to.equal(400);
//           done();
//         });
//       }); //end of it should return a 400 bad request
//     }); //end of describe with invalid body
//
//     describe('with missing body', function() {
//       before(done => mockUser.call(this, done));
//       before(done => residenceMock.call(this, done));
//       after(done => {
//         cleanUpDatabase();
//         done();
//       });
//       it('should return a 400 bad request', (done) => {
//         request.post(`${url}/api/residence/${this.tempResidence._id}`)
//         .send({})
//         .set('Character-Type', 'application/json')
//         .set({Authorization: `Bearer ${this.tempToken._id}/bedroom`})
//         .end((err, res) => {
//           expect(res.status).to.equal(400);
//           done();
//         });
//       }); //end of it should return 400 bad request
//     }); //end of describe with missing body
//
//     describe('with invalid token', function() {
//       before(done => mockUser.call(this, done));
//       before(done => residenceMock.call(this, done));
//       after(done => {
//         cleanUpDatabase();
//         done();
//       });
//       it('should return a 401 not authorized', (done) => {
//         request.post(`${url}/api/residence/${this.tempResidence._id}/bedroom`)
//         .send(exampleBedroom)
//         .set({Authorization: `Bearer ${this.tempToken}bad`})
//         .end((err, res) => {
//           expect(res.status).to.equal(401);
//           done();
//         });
//       });
//     }); //end of describe with invalid token
//     describe('with invalid residence id', function() {
//       before(done => mockUser.call(this, done));
//       before(done => residenceMock.call(this, done));
//       after(done => {
//         cleanUpDatabase();
//         done();
//       });
//       it('should return a 404 not found', (done) => {
//         request.post(`${url}/api/residence/1234/bedroom`)
//         .send(exampleBedroom)
//         .set({Authorization: `Bearer ${this.tempToken._id}/bedroom`})
//         .end((err, res) => {
//           expect(res.status).to.equal(404);
//           done();
//         });
//       });
//     });
//   });//end of POST tests
//
// // - GET : /api/residence/:resID/bedroom/:bedID
//   describe('testing GET requests to /api/residence/:resID/bedroom', function() {
//     describe('with valid token', function() {
//       before(done => mockUser.call(this, done));
//       before(done => residenceMock.call(this, done));
//       after(done => {
//         cleanUpDatabase();
//         done();
//       });
//       it('should return a bedroom', (done) => {
//
//       });
//
//     });//end of describe with valid token
//
//   });//end of GET tests
// }); //end of bedroom router tests
