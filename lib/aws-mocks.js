'use strict';

const AWSMock = require('aws-sdk-mock');

module.exports = exports = {};

// Example response data from AWS
exports.uploadMock = {
  ETag: '"075c4d4656b2ef6c04145ae560c73e5a"',
  Location: 'https://cf401demo.s3.amazonaws.com/cb2d73360c93555fb407a2108e812bb9',
  key: 'cb2d73360c93555fb407a2108e812bb9',
  Key: 'cb2d73360c93555fb407a2108e812bb9',
  Bucket: 'cf401demo',
};

AWSMock.mock('S3', 'upload', function(params, callback){
  if(params.ACL !== 'public-read') return callback(new Error('ACL must be "public-read"'));
  if(params.Bucket !== 'cf401demo') return callback(new Error('Bucket must be "cf401demo"'));
  if(!params.Key) return callback(new Error('requires Key'));
  if(!params.Body) return callback(new Error('requires body'));
  callback(null, exports.uploadMock);
});

exports.deleteMock = {
  DeleteMarker: true,
  Bucket: 'cf401demo',
};

AWSMock.mock('S3', 'deleteObject', function(params, callback){
  if(params.Bucket !== 'cf401demo') return callback(new Error('Bucket must be "cf401demo"'));
  if(!params.Key) return callback(new Error('requires Key'));
  callback(null, exports.uploadMock);
});
