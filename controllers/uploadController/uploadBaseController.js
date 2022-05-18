"use strict";

var _universalFunctions = _interopRequireDefault(require("../../utils/universalFunctions"));

var _config = _interopRequireDefault(require("../../config"));

var _uploadManager = _interopRequireDefault(require("../../lib/uploadManager"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * Please use appLogger for logging in this file try to abstain from console
 * levels of logging:
 * - TRACE - ‘blue’
 * - DEBUG - ‘cyan’
 * - INFO - ‘green’
 * - WARN - ‘yellow’
 * - ERROR - ‘red’
 * - FATAL - ‘magenta’
 **/
// var UploadManager = require("../../lib/uploadManager");
var awsS3Config = require("../../config/awsS3Config");

var async = require("async");

var ERROR = _universalFunctions["default"].CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR;

var uploadImage = function uploadImage(payloadData, callback) {
  console.log(payloadData);
  var imageFileURL;
  var imageFile = payloadData.imageFile;

  if (payloadData.imageFile && payloadData.imageFile.filename) {
    imageFileURL = {
      original: null,
      thumbnail: null
    };
  }

  appLogger.info("????????", _universalFunctions["default"].checkFileExtension(imageFile.hapi.filename));
  async.series([function (cb) {
    if (payloadData.hasOwnProperty("imageFile") && imageFile && imageFile.hapi.filename) {
      _uploadManager["default"].uploadProfilePicture(imageFile, _config["default"].AWS_S3_CONFIG.s3BucketCredentials.folder.image, _universalFunctions["default"].generateRandomString(), function (err, uploadedInfo) {
        if (err) {
          cb(err);
        } else {
          imageFileURL = {
            original: uploadedInfo.profilePicture,
            thumbnail: uploadedInfo.profilePictureThumb
          };
          cb();
        }
      });
    } else {
      cb();
    }
  }], function (err, result) {
    if (err) callback(err);else callback(null, {
      imageFileURL: imageFileURL
    });
  });
};

var uploadVideo = function uploadVideo(payloadData, callback) {
  var videoFileURL;
  var videoFile = payloadData.videoFile;

  if (payloadData.videoFile && payloadData.videoFile.filename) {
    videoFileURL = {
      original: null,
      thumbnail: null
    };
  }

  appLogger.info("????????", _universalFunctions["default"].checkFileExtension(videoFile.hapi.filename));
  async.series([function (cb) {
    if (payloadData.hasOwnProperty("videoFile") && videoFile && videoFile.hapi.filename) {
      _uploadManager["default"].uploadVideoWithThumbnail(videoFile, _config["default"].AWS_S3_CONFIG.s3BucketCredentials.folder.video, _universalFunctions["default"].generateRandomString(), function (err, uploadedInfo) {
        if (err) {
          cb(err);
        } else {
          videoFileURL = {
            original: uploadedInfo.videoFile,
            thumbnail: uploadedInfo.videoFileThumb,
            videoInfo: uploadedInfo.videoInfo
          };
          cb();
        }
      });
    } else {
      cb();
    }
  }], function (err, result) {
    if (err) callback(err);else callback(null, {
      videoFileURL: videoFileURL
    });
  });
};

var uploadDocument = function uploadDocument(payloadData, callback) {
  var documentFileUrl;
  var documentFile = payloadData.documentFile;

  if (payloadData.documentFile && payloadData.documentFile.filename) {
    documentFileUrl = {
      original: null
    };
  }

  async.series([function (cb) {
    // console.log(
    //   "S3Creds here",
    //   awsS3Config.s3BucketCredentials.folder.files
    // );
    if (payloadData.hasOwnProperty("documentFile") && documentFile && documentFile.hapi.filename) {
      _uploadManager["default"].uploadfileWithoutThumbnail(documentFile, _config["default"].AWS_S3_CONFIG.s3BucketCredentials.folder.files, _universalFunctions["default"].generateRandomString(), function (err, uploadedInfo) {
        if (err) {
          cb(err);
        } else {
          documentFileUrl = {
            original: uploadedInfo.docFile
          };
          cb();
        }
      });
    } else {
      cb();
    }
  }], function (err, result) {
    if (err) callback(err);else callback(null, {
      documentFileUrl: documentFileUrl
    });
  });
};

module.exports = {
  uploadImage: uploadImage,
  uploadDocument: uploadDocument,
  uploadVideo: uploadVideo
};