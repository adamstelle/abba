'use strict';

const debug = require('debug')('abba:clean-up-mock');

const User = require('../../model/user.js');
const Photo = require('../../model/photo.js');
const Profile = require('../../model/profile.js');

module.exports = function(done) {
  debug('cleaning up database');
  Promise.all([
    User.remove({}),
    Photo.remove({}),
    Profile.remove({}),
  ])
  .then(() => done())
  .catch(done);
};


// 'use strict'
//
// const debug = require('debug')('slugram:clean-db')
//
// const Pic = require('../../model/pic.js')
// const User = require('../../model/user.js')
// const Gallery = require('../../model/gallery.js')
//
// module.exports = function(done){
//   debug('clean up database')
//   Promise.all([
//     Pic.remove({}),
//     User.remove({}),
//     Gallery.remove({}),
//   ])
//   .then( () => done())
//   .catch(done)
// }
