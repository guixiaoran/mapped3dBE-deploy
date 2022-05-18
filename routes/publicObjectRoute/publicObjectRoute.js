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
var Config = _universalFunctions["default"].CONFIG; //public Public

var createPublicObject = {
  method: "POST",
  path: "/api/object/createPublicObject",
  handler: function handler(request, h) {
    var userData = request.auth && request.auth.credentials && request.auth.credentials.userData || null;
    var payloadData = request.payload;
    return new Promise(function (resolve, reject) {
      _controllers["default"].PublicObjectController.createPublicObject(userData, payloadData, function (err, data) {
        if (err) reject(_universalFunctions["default"].sendError(err));else resolve(_universalFunctions["default"].sendSuccess(Config.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, data));
      });
    });
  },
  config: {
    description: "create PublicObject",
    tags: ["api", "admin", "PublicObject"],
    auth: "UserAuth",
    validate: {
      payload: {
        objectType: _joi["default"].string().required(""),
        objectName: _joi["default"].string().required(""),
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
var getPublicObjects = {
  method: "GET",
  path: "/api/object/getPublicObjects",
  handler: function handler(request, h) {
    var userData = request.auth && request.auth.credentials && request.auth.credentials.userData || null;
    return new Promise(function (resolve, reject) {
      _controllers["default"].PublicObjectController.getPublicObjects(userData, function (err, data) {
        if (err) reject(_universalFunctions["default"].sendError(err));else resolve(_universalFunctions["default"].sendSuccess(Config.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, data));
      });
    });
  },
  config: {
    description: "get Public Objects",
    tags: ["api", "user", "getPublicObjects"],
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
var getPublicObjectById = {
  method: "GET",
  path: "/api/object/getPublicObjects/{_id}",
  handler: function handler(request, h) {
    var userData = request.auth && request.auth.credentials && request.auth.credentials.userData || null;
    return new Promise(function (resolve, reject) {
      _controllers["default"].PublicObjectController.getPublicObjectById(userData, request.params._id, function (err, data) {
        if (err) reject(_universalFunctions["default"].sendError(err));else resolve(_universalFunctions["default"].sendSuccess(Config.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, data));
      });
    });
  },
  config: {
    description: "get Public Object by ID",
    tags: ["api", "user", "getPublicObjectById"],
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
var deletePublicObject = {
  method: "DELETE",
  path: "/api/object/deletePublicObject/{_id}",
  handler: function handler(request, h) {
    var userData = request.auth && request.auth.credentials && request.auth.credentials.userData || null;
    var payloadData = request.params;
    return new Promise(function (resolve, reject) {
      _controllers["default"].PublicObjectController.deletePublicObject(userData, payloadData, function (err, data) {
        if (err) reject(_universalFunctions["default"].sendError(err));else resolve(_universalFunctions["default"].sendSuccess(Config.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, data));
      });
    });
  },
  config: {
    description: "delete PublicObject",
    tags: ["api", "user", "PublicObject"],
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
}; // const updateCard = {
//   method: "PUT",
//   path: "/api/card/updateCard/{_id}",
//   handler: function (request, h) {
//     const userData =
//       (request.auth &&
//         request.auth.credentials &&
//         request.auth.credentials.userData) ||
//       null;
//     const payloadData = request.payload;
//     payloadData.cardId = request.params._id;
//     return new Promise((resolve, reject) => {
//       Controller.CardController.updateCard(
//         userData,
//         payloadData,
//         function (err, data) {
//           if (err) reject(UniversalFunctions.sendError(err));
//           else
//             resolve(
//               UniversalFunctions.sendSuccess(
//                 Config.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT,
//                 data
//               )
//             );
//         }
//       );
//     });
//   },
//   config: {
//     description: "update Card",
//     tags: ["api", "user", "card"],
//     auth: "UserAuth",
//     validate: {
//       params: {
//         _id: Joi.string().required(),
//       },
//       payload: {
//         title: Joi.string().optional().allow(""),
//         description: Joi.string().optional().allow(""),
//         url: Joi.string().uri().optional().allow(""),
//       },
//       failAction: UniversalFunctions.failActionFunction,
//     },
//     plugins: {
//       "hapi-swagger": {
//         security: [{ user: {} }],
//         responseMessages:
//           UniversalFunctions.CONFIG.APP_CONSTANTS
//             .swaggerDefaultResponseMessages,
//       },
//     },
//   },
// };

var _default = [createPublicObject, getPublicObjects, getPublicObjectById, deletePublicObject]; //, getServiceById, getServiceCount

exports["default"] = _default;