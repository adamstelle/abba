'use strict';

const AWS = require('aws-sdk');
const s3 = new AWS.S3();

module.exports = function s3UploadPromise(params) {
  return new Promise((resolve, reject) => {
    s3.upload(params, (err, s3data) => {
      if (err) return reject(err);
      resolve(s3data);
    });
  });
};
