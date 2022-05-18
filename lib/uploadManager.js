"use strict";

var _config = _interopRequireDefault(require("../config"));

var _universalFunctions = _interopRequireDefault(require("../utils/universalFunctions"));

var _async = _interopRequireDefault(require("async"));

var _path = _interopRequireDefault(require("path"));

var _knox = _interopRequireDefault(require("knox"));

var _fsExtra = _interopRequireDefault(require("fs-extra"));

var _fs = _interopRequireDefault(require("fs"));

var _awsSdk = _interopRequireDefault(require("aws-sdk"));

var _fluentFfmpeg = _interopRequireDefault(require("fluent-ffmpeg"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
* Please use uploadLogger for logging in this file try to abstain from console
* levels of logging:
* - TRACE - ‘blue’
* - DEBUG - ‘cyan’
* - INFO - ‘green’
* - WARN - ‘yellow’
* - ERROR - ‘red’
* - FATAL - ‘magenta’
*/
// 1) Save Local Files
// 2) Create Thumbnails
// 3) Upload Files to S3
// 4) Delete Local files
// */
//
var deleteFile = function deleteFile(path, callback) {
  _fs["default"].unlink(path, function (err) {
    uploadLogger.error("delete", err);

    if (err) {
      var error = {
        response: {
          message: "Something went wrong",
          data: {}
        },
        statusCode: 500
      };
      return callback(error);
    } else return callback(null);
  });
};

var uploadImageToS3Bucket = function uploadImageToS3Bucket(file, isThumb, callback) {
  var path = file.path,
      filename = file.name,
      folder = file.s3Folder,
      mimeType = file.mimeType;

  if (isThumb) {
    path = path + 'thumb/';
    filename = file.thumbName;
    folder = file.s3FolderThumb;
  } //<-------  Configuation of s3 bcuket ------------>


  var accessKeyId = _config["default"].AWS_S3_CONFIG.s3BucketCredentials.accessKeyId;
  var secretAccessKeyId = _config["default"].AWS_S3_CONFIG.s3BucketCredentials.secretAccessKey;
  console.log("path to read::" + path + filename); // uploadLogger.info("path to read::" + path + filename);

  _fs["default"].readFile(path + filename, function (error, fileBuffer) {
    uploadLogger.info("path to read from temp::" + path + filename);

    if (error) {
      uploadLogger.error("UPLOAD", error, fileBuffer);
      var errResp = {
        response: {
          message: "Something went wrong",
          data: {}
        },
        statusCode: 500
      };
      return callback(errResp);
    }

    _awsSdk["default"].config.update({
      accessKeyId: accessKeyId,
      secretAccessKey: secretAccessKeyId
    });

    var s3bucket = new _awsSdk["default"].S3();
    var params = {
      Bucket: _config["default"].AWS_S3_CONFIG.s3BucketCredentials.bucket,
      Key: folder + '/' + filename,
      Body: fileBuffer,
      ACL: 'public-read',
      ContentType: mimeType
    };
    s3bucket.putObject(params, function (err, data) {
      console.error("PUT", err, data);

      if (err) {
        var error = {
          response: {
            message: "Something went wrong",
            data: {}
          },
          statusCode: 500
        };
        return callback(error);
      } else {
        deleteFile(path + filename, function (err) {
          uploadLogger.error(err);
          if (err) return callback(err);else return callback(null);
        });
      }
    });
  });
};

function initParallelUpload(fileObj, withThumb, callbackParent) {
  _async["default"].parallel([function (callback) {
    uploadLogger.info("uploading image");
    uploadImageToS3Bucket(fileObj, false, callback);
  }, function (callback) {
    if (withThumb) {
      uploadLogger.info("uploading thumbnil");
      uploadImageToS3Bucket(fileObj, true, callback);
    } else callback(null);
  }], function (error) {
    if (error) callbackParent(error);else callbackParent(null);
  });
}

var saveFile = function saveFile(fileData, path, callback) {
  var file = _fs["default"].createWriteStream(path);

  uploadLogger.info("=========save file======");
  file.on('error', function (err) {
    uploadLogger.error('@@@@@@@@@@@@@', err);
    var error = {
      response: {
        message: "Some",
        data: {}
      },
      statusCode: 500
    };
    return callback(error);
  });
  fileData.pipe(file);
  fileData.on('end', function (err) {
    if (err) {
      var error = {
        response: {
          message: "Some",
          data: {}
        },
        statusCode: 500
      };
      return callback(error);
    } else callback(null);
  });
};

var createThumbnailImage = function createThumbnailImage(path, name, callback) {
  uploadLogger.info('------first-----');

  var gm = require('gm').subClass({
    imageMagick: true
  });

  var thumbPath = path + 'thumb/' + "Thumb_" + name; //var tmp_path = path + "-tmpPath"; //will be put into a temp directory

  gm(path + name).resize(160, 160, "!").autoOrient().write(thumbPath, function (err) {
    uploadLogger.info('createThumbnailImage');

    if (!err) {
      return callback(null);
    } else {
      var error = {
        response: {
          message: "Something went wrong",
          data: {}
        },
        statusCode: 500
      };
      uploadLogger.info('<<<<<<<<<<<<<<<<<', error);
      return callback(error);
    }
  });
};

var getVideoInfo = function getVideoInfo(filePath, callback) {
  _fluentFfmpeg["default"].ffprobe(filePath, function (err, data) {
    if (err) callback(err);else callback(null, data);
  });
};

var createThumbnailVideo = function createThumbnailVideo(filePath, name, videoData, callback) {
  uploadLogger.info('------first-----');
  var thumbPath = filePath + 'thumb/' + 'Thumb_' + name.split('.').slice(0, -1).join('.') + '.jpg';
  var durationInSeconds = videoData.format.duration;
  var frameIntervalInSeconds = Math.floor(durationInSeconds);
  (0, _fluentFfmpeg["default"])().input(filePath + name).outputOptions(["-vf fps=1/".concat(frameIntervalInSeconds)]).output(thumbPath).on('end', function () {
    callback();
  }).on('error', function (err) {
    callback(err);
  }).run();
};

function uploadFile(otherConstants, fileDetails, createThumbnail, callbackParent) {
  var filename = fileDetails.name;
  var TEMP_FOLDER = otherConstants.TEMP_FOLDER;
  var s3Folder = otherConstants.s3Folder;
  var file = fileDetails.file;
  var mimiType = file.hapi.headers['content-type'];

  _async["default"].waterfall([function (callback) {
    uploadLogger.info('TEMP_FOLDER + filename' + TEMP_FOLDER + filename);
    saveFile(file, TEMP_FOLDER + filename, callback);
    uploadLogger.info("*******save File******");
  }, function (callback) {
    if (createThumbnail) {
      createThumbnailImage(TEMP_FOLDER, filename, callback);
      uploadLogger.info("*******thumbnailImage********", callback);
    } else callback(null);
  }, function (callback) {
    var fileObj = {
      path: TEMP_FOLDER,
      name: filename,
      thumbName: "Thumb_" + filename,
      mimeType: mimiType,
      s3Folder: s3Folder
    };
    if (createThumbnail) fileObj.s3FolderThumb = otherConstants.s3FolderThumb;
    initParallelUpload(fileObj, createThumbnail, callback);
  }], function (error) {
    if (error) callbackParent(error);else callbackParent(null);
  });
}

;

function uploadVideoFile(otherConstants, fileDetails, createThumbnail, callbackParent) {
  var filename = fileDetails.name;
  var TEMP_FOLDER = otherConstants.TEMP_FOLDER;
  var s3Folder = otherConstants.s3Folder;
  var file = fileDetails.file;
  var mimiType = file.hapi.headers['content-type'];
  var videoData;

  _async["default"].waterfall([function (callback) {
    uploadLogger.info('TEMP_FOLDER + filename' + TEMP_FOLDER + filename);
    saveFile(file, TEMP_FOLDER + filename, callback);
    uploadLogger.info("*******save File******", callback);
  }, function (callback) {
    getVideoInfo(TEMP_FOLDER + filename, function (err, data) {
      if (err) callback(err);else {
        videoData = data;
        callback();
      }
    });
  }, function (callback) {
    if (createThumbnail) {
      createThumbnailVideo(TEMP_FOLDER, filename, videoData, callback);
    } else callback(null);
  }, function (callback) {
    var fileObj = {
      path: TEMP_FOLDER,
      name: filename,
      thumbName: "Thumb_" + filename.split('.').slice(0, -1).join('.') + '.jpg',
      mimeType: mimiType,
      s3Folder: s3Folder
    };
    if (createThumbnail) fileObj.s3FolderThumb = otherConstants.s3FolderThumb;
    initParallelUpload(fileObj, createThumbnail, callback);
  }], function (error) {
    if (error) callbackParent(error);else callbackParent(null, {
      videoData: videoData
    });
  });
}

;

function uploadProfilePicture(profilePicture, folder, filename, callbackParent) {
  var baseFolder = folder + '/' + _config["default"].AWS_S3_CONFIG.s3BucketCredentials.folder.profilePicture;
  var baseURL = _config["default"].AWS_S3_CONFIG.s3BucketCredentials.s3URL + '/' + baseFolder + '/';
  var urls = {};

  _async["default"].waterfall([function (callback) {
    var profileFolder = _config["default"].AWS_S3_CONFIG.s3BucketCredentials.folder.original;
    var profileFolderThumb = _config["default"].AWS_S3_CONFIG.s3BucketCredentials.folder.thumb;

    var profilePictureName = _universalFunctions["default"].generateFilenameWithExtension(profilePicture.hapi.filename, "Profile_" + filename);

    var s3Folder = baseFolder + '/' + profileFolder;
    var s3FolderThumb = baseFolder + '/' + profileFolderThumb;
    var profileFolderUploadPath = _config["default"].AWS_S3_CONFIG.s3BucketCredentials.projectFolder + "/profilePicture";
    var path = _path["default"].resolve("..") + "/uploads/" + profileFolderUploadPath + "/";
    var fileDetails = {
      file: profilePicture,
      name: profilePictureName
    };
    var otherConstants = {
      TEMP_FOLDER: path,
      s3Folder: s3Folder,
      s3FolderThumb: s3FolderThumb
    };
    urls.profilePicture = baseURL + profileFolder + '/' + profilePictureName;
    urls.profilePictureThumb = baseURL + profileFolderThumb + '/Thumb_' + profilePictureName;
    uploadFile(otherConstants, fileDetails, true, callback);
  }], function (error) {
    if (error) {
      uploadLogger.error("upload image error :: ", error);
      callbackParent(error);
    } else {
      uploadLogger.info("upload image result :", urls);
      callbackParent(null, urls);
    }
  });
}

function uploadfileWithoutThumbnail(docFile, folder, filename, callbackParent) {
  var baseFolder = folder + '/' + _config["default"].AWS_S3_CONFIG.s3BucketCredentials.folder.docs;
  var baseURL = _config["default"].AWS_S3_CONFIG.s3BucketCredentials.s3URL + '/' + baseFolder + '/';
  var urls = {};

  _async["default"].waterfall([function (callback) {
    var docFileFolder = _config["default"].AWS_S3_CONFIG.s3BucketCredentials.folder.original; //var profileFolderThumb =CONFIG.awsS3Config.s3BucketCredentials.folder.thumb;

    var docFileName = _universalFunctions["default"].generateFilenameWithExtension(docFile.hapi.filename, "Docs_" + filename);

    var s3Folder = baseFolder + '/' + docFileFolder; //var s3FolderThumb = baseFolder + '/' + profileFolderThumb;

    var docFolderUploadPath = _config["default"].AWS_S3_CONFIG.s3BucketCredentials.projectFolder + "/docs";
    var path = _path["default"].resolve("..") + "/uploads/" + docFolderUploadPath + "/";
    var fileDetails = {
      file: docFile,
      name: docFileName
    };
    var otherConstants = {
      TEMP_FOLDER: path,
      s3Folder: s3Folder //s3FolderThumb: s3FolderThumb

    };
    urls.docFile = baseURL + docFileFolder + '/' + docFileName; //urls.profilePictureThumb = baseURL + profileFolderThumb + '/Thumb_' + profilePictureName;

    uploadFile(otherConstants, fileDetails, false, callback);
  }], function (error) {
    if (error) {
      uploadLogger.error("upload image error :: ", error);
      callbackParent(error);
    } else {
      uploadLogger.info("upload image result :", urls);
      callbackParent(null, urls);
    }
  });
}

function uploadVideoWithThumbnail(videoFile, folder, filename, callbackParent) {
  var baseFolder = folder + '/' + _config["default"].AWS_S3_CONFIG.s3BucketCredentials.folder.video;
  var baseURL = _config["default"].AWS_S3_CONFIG.s3BucketCredentials.s3URL + '/' + baseFolder + '/';
  var urls = {};
  var fileDetails, otherConstants;

  _async["default"].waterfall([function (callback) {
    var videoFileFolder = _config["default"].AWS_S3_CONFIG.s3BucketCredentials.folder.original;
    var videoFolderThumb = _config["default"].AWS_S3_CONFIG.s3BucketCredentials.folder.thumb;

    var videoFileName = _universalFunctions["default"].generateFilenameWithExtension(videoFile.hapi.filename, "Video_" + filename);

    var s3Folder = baseFolder + '/' + videoFileFolder;
    var s3FolderThumb = baseFolder + '/' + videoFolderThumb;
    var videoFolderUploadPath = _config["default"].AWS_S3_CONFIG.s3BucketCredentials.projectFolder + "/video";
    var path = _path["default"].resolve("..") + "/uploads/" + videoFolderUploadPath + "/";
    fileDetails = {
      file: videoFile,
      name: videoFileName
    };
    otherConstants = {
      TEMP_FOLDER: path,
      s3Folder: s3Folder,
      s3FolderThumb: s3FolderThumb
    };
    urls.videoFile = baseURL + videoFileFolder + '/' + videoFileName;
    urls.videoFileThumb = baseURL + videoFolderThumb + '/Thumb_' + videoFileName.split('.').slice(0, -1).join('.') + '.jpg';
    uploadVideoFile(otherConstants, fileDetails, true, function (err, data) {
      if (err) callback(err);else {
        urls.videoInfo = data.videoData;
        callback();
      }
    });
  }], function (error) {
    if (error) {
      uploadLogger.error("upload image error :: ", error);
      callbackParent(error);
    } else {
      uploadLogger.info("upload image result :", urls);
      callbackParent(null, urls);
    }
  });
}

function saveCSVFile(fileData, path, callback) {
  _fsExtra["default"].copy(fileData, path, callback);
}

module.exports = {
  uploadProfilePicture: uploadProfilePicture,
  saveCSVFile: saveCSVFile,
  uploadfileWithoutThumbnail: uploadfileWithoutThumbnail,
  uploadVideoWithThumbnail: uploadVideoWithThumbnail
};