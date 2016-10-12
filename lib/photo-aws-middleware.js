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
const Bedroom = require('../model/bedroom.js');
const s3UploadPromise = require('../lib/promisify-upload.js');

// module config
AWS.config.setPromisesDependency(require('bluebird'));

// module constants
const s3 = new AWS.S3();

module.exports = exports = {};

exports.profilePhotoUpload = function(req, res, next){
  debug('profilePhotoUpload helper');
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
  .then(photo => {
    res.photo = photo;
    next();
  })
  .catch(err => {
    next(createError(500, err.message));
  });
};

exports.photoDelete = function(req, res, next){
  debug('profilephotoDelete helper');
  Photo.findById(req.params.id)
  .catch(err => Promise.reject(createError(404, err.message)))
  .then(photo => {
    req.photo = photo;
    if(photo.userID.toString() !== req.user._id.toString())
      return Promise.reject(createError(401, 'User not permitted to delete this photo.'));
    let params = {
      Bucket: 'cf401demo',
      Key: photo.objectKey,
    };
    return s3.deleteObject(params).promise();
  })
  .catch(err => Promise.reject(createError(500, err.message)))
  .then(() => {
    Photo.findById(req.photo._id).remove();
  })
  .then(() => next())
  .catch(err => {
    next(createError(500, err.message));
  });
};

exports.bedroomPhotoUpload = function(req, res, next){
  debug('bedroomPhotoUpload helper');

  if(!req.files) return next(createError(400, 'no file found'));
  if(!req.files[0].path) return next(createError(500, 'no file was saved'));
  let numFiles = req.files.length;
  let i = 0;
  let photoDataArray = [];
  function uploadFiles() {
    let ext = path.extname(req.files[i].originalname);
    let params = {
      ACL: 'public-read',
      Bucket: 'cf401demo',
      Key: `${req.files[i].filename}${ext}`,
      Body: fs.createReadStream(req.files[i].path),
    };
    let s3data;
    Bedroom.findById(req.params.bedroomID)
    .catch(err => Promise.reject(createError(404, err.message)))
    .then(() => s3UploadPromise(params))
    .catch(err => Promise.reject(createError(500,  err)))
    .then(data => {
      s3data = data;
      let photoData = {
        name: req.body.name,
        caption: req.body.caption,
        objectKey: s3data.Key,
        imageURI: s3data.Location,
        userID: req.user._id,
      };
      new Photo(photoData).save()
      .then(photo => {
        photoDataArray.push(photo);
        i++;
        if (i < numFiles) uploadFiles();
        else {
          req.photos = photoDataArray;
          return del([`${dataDir}/*`])
          .then(() => {
            next();
          })
          .catch(err => Promise.reject(createError(500, err.message)));
        }
      })
      .catch(err => Promise.reject(createError(500, err.message)));
    })
    .catch(next);
  }
  uploadFiles();
};
