'use strict';

const fs = require('fs');
const path = require('path');

const del = require('del');
const AWS = require('aws-sdk');
const createError = require('http-errors');
const debug = require('debug')('abba:photo-aws-middleware');

const Photo = require('../model/photo.js');
const dataDir = `${__dirname}/../data`;
const Profile = require('../model/profile.js');
const s3UploadPromise = require('../lib/promisify-upload.js');

// module config
AWS.config.setPromisesDependency(require('bluebird'));

// module constants
const s3 = new AWS.S3();

module.exports = exports = {};

exports.photoUpload = function(req, res, next){
  debug('photoUpload middleware');
  if(!req.file) return next(createError(400, 'no file found'));
  if(!req.file.path) return next(createError(500, 'no file was saved'));
  let ext = path.extname(req.file.originalname);
  let params = {
    ACL: 'public-read',
    Bucket: 'cf401demo',
    Key: `${req.file.filename}${ext}`,
    Body: fs.createReadStream(req.file.path),
  };
  let s3data;
  Profile.findById(req.params.profID)
  .catch(err => Promise.reject(createError(404, err.message)))
  .then(() => s3UploadPromise(params))
  .catch(err => Promise.reject(console.log(process.env.AWS_SECRET_ACCESS_KEY + 'and err is ',err)))
  .catch(err => Promise.reject(createError(500,  err)))
  .then(data => {
    s3data = data;
    return del([`${dataDir}/*`]);
  })
  .then(() => {
    let photoData = {
      name: req.body.name,
      caption: req.body.caption,
      objectKey: s3data.Key,
      imageURI: s3data.Location,
      userID: req.user._id,
    };
    return new Photo(photoData).save();
  })
  .then(photo => res.json(photo))
  .catch(err => {
    next(createError(500, err.message));
  });
};

exports.photoDelete = function(req, res, next){
  Photo.findById(req.params.id)
  .catch(err => Promise.reject(createError(404, err.message)))
  .then(photo => {
    if(photo.userID.toString() !== req.user._id)
      return Promise.reject(createError(401, 'User not permitted to delete this photo.'));
    let params = {
      Bucket: 'cf401demo',
      Key: photo.objectKey,
    };
    return s3.deleteObject(params).promise();
  })
  .catch(err => Promise.reject(createError(500, err.message)))
  .then(s3data => {
    console.log('s3data is ', s3data);
    return Photo.findById(req.params.id).remove();
  });
  next();
};
