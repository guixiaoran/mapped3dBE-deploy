"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _universalFunctions = _interopRequireDefault(require("../../utils/universalFunctions"));

var _joi = _interopRequireDefault(require("joi"));

var _controllers = _interopRequireDefault(require("../../controllers"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var uploadImage = {
  method: "POST",
  path: "/api/upload/uploadImage",
  handler: function handler(request, reply) {
    console.log("from inside " + request);
    var payloadData = request.payload;
    console.log("from inside" + payloadData);
    return new Promise(function (resolve, reject) {
      _controllers["default"].UploadBaseController.uploadImage(payloadData, function (err, data) {
        if (err) {
          reject(_universalFunctions["default"].sendError(err));
        } else {
          resolve(_universalFunctions["default"].sendSuccess(_universalFunctions["default"].CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, data));
        }
      });
    });
  },
  options: {
    description: "image upload",
    tags: ["api", "upload", "image"],
    payload: {
      maxBytes: 20715200,
      output: "stream",
      parse: true,
      allow: "multipart/form-data",
      multipart: true
    },
    validate: {
      payload: _joi["default"].object({
        imageFile: _joi["default"].any().meta({
          swaggerType: "file"
        }).required().description("image file")
      }).label("Upload: Image"),
      failAction: _universalFunctions["default"].failActionFunction
    },
    plugins: {
      "hapi-swagger": {
        responseMessages: _universalFunctions["default"].CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
};
var uploadVideo = {
  method: "POST",
  path: "/api/upload/uploadVideo",
  handler: function handler(request, reply) {
    var payloadData = request.payload;
    return new Promise(function (resolve, reject) {
      _controllers["default"].UploadBaseController.uploadVideo(payloadData, function (err, data) {
        if (err) {
          reject(_universalFunctions["default"].sendError(err));
        } else {
          resolve(_universalFunctions["default"].sendSuccess(_universalFunctions["default"].CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, data));
        }
      });
    });
  },
  options: {
    description: "video upload",
    tags: ["api", "upload", "video"],
    payload: {
      maxBytes: 20715200000,
      output: "stream",
      parse: true,
      allow: "multipart/form-data"
    },
    validate: {
      payload: _joi["default"].object({
        videoFile: _joi["default"].any().meta({
          swaggerType: "file"
        }).required().description("video file")
      }).label("Upload: Video"),
      failAction: _universalFunctions["default"].failActionFunction
    },
    plugins: {
      "hapi-swagger": {
        responseMessages: _universalFunctions["default"].CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
};
var uploadDocument = {
  method: "POST",
  path: "/api/upload/uploadDocument",
  handler: function handler(request, reply) {
    var payloadData = request.payload;
    return new Promise(function (resolve, reject) {
      _controllers["default"].UploadBaseController.uploadDocument(payloadData, function (err, data) {
        if (err) {
          reject(_universalFunctions["default"].sendError(err));
        } else {
          resolve(_universalFunctions["default"].sendSuccess(_universalFunctions["default"].CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, data));
        }
      });
    });
  },
  options: {
    description: "upload document",
    tags: ["api", "upload", "document"],
    payload: {
      maxBytes: 2071520000,
      output: "stream",
      parse: true,
      allow: "multipart/form-data",
      multipart: true
    },
    validate: {
      payload: _joi["default"].object({
        documentFile: _joi["default"].any().meta({
          swaggerType: "file"
        }).required().description("document file")
      }).label("Upload: Document"),
      failAction: _universalFunctions["default"].failActionFunction
    },
    plugins: {
      "hapi-swagger": {
        responseMessages: _universalFunctions["default"].CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
};
var _default = [uploadImage, uploadDocument, uploadVideo];
exports["default"] = _default;