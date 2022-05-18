"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _universalFunctions = _interopRequireDefault(require("../../utils/universalFunctions"));

var _joi = _interopRequireDefault(require("joi"));

var _controllers = _interopRequireDefault(require("../../controllers"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * Created by Xiaoran Gui on 16/12/21.
 */
var Config = _universalFunctions["default"].CONFIG;
var createLocalObjectItem = {
  method: "POST",
  path: "/api/object/createLocalObjectItem",
  handler: function handler(request, h) {
    var userData = request.auth && request.auth.credentials && request.auth.credentials.userData || null;
    var payloadData = request.payload;
    return new Promise(function (resolve, reject) {
      _controllers["default"].LocalObjectItemController.createLocalObjectItem(userData, payloadData, function (err, data) {
        if (err) reject(_universalFunctions["default"].sendError(err));else resolve(_universalFunctions["default"].sendSuccess(Config.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, data));
      });
    });
  },
  config: {
    description: "create Local Object",
    tags: ["api", "admin", "LocalObject"],
    auth: "UserAuth",
    validate: {
      payload: {
        environmentId: _joi["default"].string().required(""),
        objectName: _joi["default"].string().required(""),
        position: _joi["default"].string().required(""),
        scale: _joi["default"].string().allow(""),
        rotation: _joi["default"].string().allow(""),
        url: _joi["default"].string().allow("") //  requirements: Joi.array().items(Joi.string().allow("")),

      },
      failAction: _universalFunctions["default"].failActionFunction
    },
    plugins: {
      "hapi-swagger": {
        security: [{
          user: {}
        }],
        responseMessages: _universalFunctions["default"].CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
};
var getLocalObjects = {
  method: "GET",
  path: "/api/object/getLocalObjects",
  handler: function handler(request, h) {
    var userData = request.auth && request.auth.credentials && request.auth.credentials.userData || null;
    return new Promise(function (resolve, reject) {
      _controllers["default"].LocalObjectController.getLocalObjects(userData, function (err, data) {
        if (err) reject(_universalFunctions["default"].sendError(err));else resolve(_universalFunctions["default"].sendSuccess(Config.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, data));
      });
    });
  },
  config: {
    description: "get Local Objects",
    tags: ["api", "user", "getLocalObjects"],
    auth: "UserAuth",
    validate: {
      failAction: _universalFunctions["default"].failActionFunction
    },
    plugins: {
      "hapi-swagger": {
        security: [{
          user: {}
        }],
        responseMessages: _universalFunctions["default"].CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
};
var getLocalObjectById = {
  method: "GET",
  path: "/api/object/getLocalObjects/{_id}",
  handler: function handler(request, h) {
    var userData = request.auth && request.auth.credentials && request.auth.credentials.userData || null;
    return new Promise(function (resolve, reject) {
      _controllers["default"].LocalObjectController.getLocalObjectById(userData, request.params._id, function (err, data) {
        if (err) reject(_universalFunctions["default"].sendError(err));else resolve(_universalFunctions["default"].sendSuccess(Config.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, data));
      });
    });
  },
  config: {
    description: "get Local Object",
    tags: ["api", "user", "getLocalObjectById"],
    auth: "UserAuth",
    validate: {
      failAction: _universalFunctions["default"].failActionFunction,
      params: {
        _id: _joi["default"].string().required()
      }
    },
    plugins: {
      "hapi-swagger": {
        security: [{
          user: {}
        }],
        responseMessages: _universalFunctions["default"].CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
};
var deleteLocalObjectItem = {
  method: "DELETE",
  path: "/api/object/deleteLocalObjectItem/{_id}",
  handler: function handler(request, h) {
    var userData = request.auth && request.auth.credentials && request.auth.credentials.userData || null;
    var payloadData = request.params;
    return new Promise(function (resolve, reject) {
      _controllers["default"].LocalObjectItemController.deleteLocalObjectItem(userData, payloadData, function (err, data) {
        if (err) reject(_universalFunctions["default"].sendError(err));else resolve(_universalFunctions["default"].sendSuccess(Config.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, data));
      });
    });
  },
  config: {
    description: "deleteLocalObject",
    tags: ["api", "admin", "LocalObject"],
    auth: "UserAuth",
    validate: {
      params: {
        _id: _joi["default"].string().required()
      },
      failAction: _universalFunctions["default"].failActionFunction
    },
    plugins: {
      "hapi-swagger": {
        security: [{
          user: {}
        }],
        responseMessages: _universalFunctions["default"].CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
};
var updateLocalObjectItem = {
  method: "PUT",
  path: "/api/object/updateLocalObjectItem/{_id}",
  handler: function handler(request, h) {
    var userData = request.auth && request.auth.credentials && request.auth.credentials.userData || null;
    var payloadData = request.payload;
    payloadData._id = request.params._id;
    return new Promise(function (resolve, reject) {
      _controllers["default"].LocalObjectItemController.updateLocalObjectItem(userData, payloadData, function (err, data) {
        if (err) reject(_universalFunctions["default"].sendError(err));else resolve(_universalFunctions["default"].sendSuccess(Config.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, data));
      });
    });
  },
  config: {
    description: "update LocalObject",
    tags: ["api", "user", "LocalObject"],
    auth: "UserAuth",
    validate: {
      params: {
        _id: _joi["default"].string().required()
      },
      payload: {
        environmentId: _joi["default"].string().required(""),
        objectName: _joi["default"].string().required(""),
        position: _joi["default"].string().allow(""),
        scale: _joi["default"].string().allow(""),
        rotation: _joi["default"].string().allow(""),
        url: _joi["default"].string().allow("")
      },
      failAction: _universalFunctions["default"].failActionFunction
    },
    plugins: {
      "hapi-swagger": {
        security: [{
          user: {}
        }],
        responseMessages: _universalFunctions["default"].CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
};
var _default = [createLocalObjectItem, getLocalObjects, getLocalObjectById, deleteLocalObjectItem, updateLocalObjectItem]; //, getServiceById, getServiceCount

exports["default"] = _default;