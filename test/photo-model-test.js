// 'use strict';
//
// const awsMocks = require('../lib/aws-mocks.js');
//
// const expect = require('chai').expect;
// const debug = require('debug')('abba:photo-model-test');
//
// const server = require('../server.js');
// const User = require('../model/user.js');
// const Photo = require('../model/photo.js');
// const serverControl = require('/lib/server-control.js');
//
// // module constants
// const picURL = `${__dirname}/data/testpic.png`;
//
// const exampleUser = {
//   email: 'test@test.com',
//   password: 'badpass',
// };
//
// // Will need example profile
// // const exampleProfile = {
// //
// // }
//
// const examplePhotoData = {
//   name: 'whidbey',
//   caption: 'beautiful property with a view',
//   created: new Date(),
//   imageURI: awsMocks.uploadMock.Location,
//   objectKey: awsMocks.uploadMock.Key,
// };
//
// describe('testing photo model static functions', function(){
//   before(done => serverControl.serverUp(server, done));
//   after(done => serverControl.serverDown(server, done));
//   afterEach(done => {
//     debug('removing test users & photos');
//     Promise.all([
//       Photo.remove({}),
//       User.remove({}),
//     ])
//     .then(() => done())
//     .catch(done);
//   });
//   describe('testing upload a photo')
// });
