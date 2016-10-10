'use strict';

const fs = require('fs');
const path = require('path');

const del = require('del');
const AWS = require('aws-sdk');
const multer = require('multer');
const createError = require('http-errors');
const debug = require('debug')('abba:photo-aws-helper');

const Photo = require('../model/photo.js');
const dataDir = `${__dirname}/../data`;
const Profile = require('../model/profile.js');
const bearerAuth = require('../lib/bearer-auth-middleware.js');
const s3UploadPromise = require('../lib/promisify-upload.js');

// module config
AWS.config.setPromisesDependency(require('bluebird'));

// module constants
const s3 = new AWS.S3();
const upload = multer({dest: `${__dirname}/../data`});

module.exports = exports = {};

exports.photoUpload = function(req, res, next){
  upload.single('image')
  .then((req) => {
    if(!req.file) return next(createError(400, 'no file found'));
    if(!req.file.path) return next(createError(500, 'no file was saved'));

    let ext = path.extname(req.file.originalName);
    let params = {
      ACL: 'public-read',
      Bucket: 'cf401demo',
      Key: `${req.file.filename}${ext}`,
      Body: fs.createReadStream(req.file.path),
    };
    Profile.findById(req.params.profileID)
    .catch(err => Promise.reject(createError(404, err.message)))
    .then(() => s3UploadPromise(params))
    .catch(err => Promise.reject(createError(500,  err.message)))
    // removing data from /data directory
    .then(data => {
      s3data = data;
      return del([`${dataDir}/*`]);
    })
    .then(() => {
      let photoData = {
        name: req.body.name,
        caption: req.body.description,
        objectKey: s3data.Key,
        imageURI: s3data.Location,
        userID: req.user._id,
      };
      return new Photo(photoData).save();
    })
    .then(photo => res.photo = photo)
    .then(next())
    .catch(next)
  })
};

module.exports = exports = deletePhoto(photo) {

};
//
// picRouter.delete('api/property/:propertyID/pic/:picID', bearerAuth, function(req, res, next){
//   debug('DELETE /api/property/:propertyID/pic/:picID');
//   Pic.findById(req.params.picID)
//   .catch(err => Promise.reject(createError(404, err.message)))
//   .then(pic => {
//     if(pic.propertyID.toString() !== req.params.propertyID)
//       return Promise.reject(createError(400, 'invalid property'));
//     if(pic.userID.tostring() !== req.user._id.toString())
//       return Promise.reject(createError(401, 'user not authorized to delete this pic'));
//     let params = {
//       Bucket: 'cf401demo',
//       Key: pic.objectKey,
//     };
//     return s3.deleteObject(params).promise();
//   })
//   .catch(err => Promise.reject(createError(500, err.message)))
//   .then(s3data => {
//     console.log('s3data:\n', s3data);
//     return Pic.findById(req.params.picID).remove();
//   });
//   next();
// });
