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
var createEnvironment = {
  method: "POST",
  path: "/api/environment/createEnvironment",
  handler: function handler(request, h) {
    var userData = request.auth && request.auth.credentials && request.auth.credentials.userData || null;
    var payloadData = request.payload;
    return new Promise(function (resolve, reject) {
      _controllers["default"].EnvironmentController.createEnvironment(userData, payloadData, function (err, data) {
        if (err) reject(_universalFunctions["default"].sendError(err));else resolve(_universalFunctions["default"].sendSuccess(Config.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, data));
      });
    });
  },
  config: {
    description: "create environment",
    tags: ["api", "admin", "Service"],
    auth: "UserAuth",
    validate: {
      payload: {
        environmentName: _joi["default"].string().required(""),
        panorama: _joi["default"].string().allow(""),
        preset: _joi["default"].string().allow(""),
        video: _joi["default"].string().allow(""),
        floorColor: _joi["default"].string().allow(""),
        skyColor: _joi["default"].string().allow(""),
        skyUrl: _joi["default"].string().allow("")
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
var getEnvironments = {
  method: "GET",
  path: "/api/environment/getEnvironments",
  handler: function handler(request, h) {
    var userData = request.auth && request.auth.credentials && request.auth.credentials.userData || null;
    return new Promise(function (resolve, reject) {
      _controllers["default"].EnvironmentController.getEnvironments(userData, function (err, data) {
        if (err) reject(_universalFunctions["default"].sendError(err));else resolve(_universalFunctions["default"].sendSuccess(Config.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, data));
      });
    });
  },
  config: {
    description: "get Environments",
    tags: ["api", "user", "getEnvironments"],
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
var getEnvironmentsTourist = {
  method: "GET",
  path: "/api/environment/getEnvironmentsTourist",
  handler: function handler(request, h) {
    return new Promise(function (resolve, reject) {
      _controllers["default"].EnvironmentController.getEnvironmentsTourist(function (err, data) {
        if (err) reject(_universalFunctions["default"].sendError(err));else resolve(_universalFunctions["default"].sendSuccess(Config.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, data));
      });
    });
  },
  config: {
    description: "get Environments",
    tags: ["api", "user", "getEnvironments"],
    // auth: "UserAuth",
    validate: {
      failAction: _universalFunctions["default"].failActionFunction
    },
    plugins: {
      "hapi-swagger": {
        security: [],
        responseMessages: _universalFunctions["default"].CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
};
var getEnvironmentByIdTourist = {
  method: "GET",
  path: "/api/environment/getEnvironmentByIdTourist/{_id}",
  handler: function handler(request, h) {
    return new Promise(function (resolve, reject) {
      _controllers["default"].EnvironmentController.getEnvironmentByIdTourist(request.params._id, function (err, data) {
        if (err) reject(_universalFunctions["default"].sendError(err));else resolve(_universalFunctions["default"].sendSuccess(Config.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, data));
      });
    });
  },
  config: {
    description: "get environment",
    tags: ["api", "tourist", "getEnvironmentById"],
    // auth: "UserAuth",
    validate: {
      failAction: _universalFunctions["default"].failActionFunction,
      params: {
        _id: _joi["default"].string().required()
      }
    },
    plugins: {
      "hapi-swagger": {
        security: [],
        responseMessages: _universalFunctions["default"].CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
};
var getEnvironmentById = {
  method: "GET",
  path: "/api/environment/getEnvironmentById/{_id}",
  handler: function handler(request, h) {
    var userData = request.auth && request.auth.credentials && request.auth.credentials.userData || null;
    return new Promise(function (resolve, reject) {
      _controllers["default"].EnvironmentController.getEnvironmentById(userData, request.params._id, function (err, data) {
        if (err) reject(_universalFunctions["default"].sendError(err));else resolve(_universalFunctions["default"].sendSuccess(Config.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, data));
      });
    });
  },
  config: {
    description: "get environment",
    tags: ["api", "user", "getEnvironmentById"],
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
var deleteEnvironment = {
  method: "DELETE",
  path: "/api/environment/deleteEnvironment/{_id}",
  handler: function handler(request, h) {
    var userData = request.auth && request.auth.credentials && request.auth.credentials.userData || null;
    var payloadData = request.params;
    return new Promise(function (resolve, reject) {
      _controllers["default"].EnvironmentController.deleteEnvironment(userData, payloadData, function (err, data) {
        if (err) reject(_universalFunctions["default"].sendError(err));else resolve(_universalFunctions["default"].sendSuccess(Config.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, data));
      });
    });
  },
  config: {
    description: "deleteEnvironment",
    tags: ["api", "admin", "Environment"],
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
var updateEnvironment = {
  method: "PUT",
  path: "/api/environment/updateEnvironment/{_id}",
  handler: function handler(request, h) {
    var userData = request.auth && request.auth.credentials && request.auth.credentials.userData || null;
    var payloadData = request.payload;
    payloadData._id = request.params._id;
    return new Promise(function (resolve, reject) {
      _controllers["default"].EnvironmentController.updateEnvironment(userData, payloadData, function (err, data) {
        if (err) reject(_universalFunctions["default"].sendError(err));else resolve(_universalFunctions["default"].sendSuccess(Config.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, data));
      });
    });
  },
  config: {
    description: "update Environment",
    tags: ["api", "user", "Environment"],
    auth: "UserAuth",
    validate: {
      params: {
        _id: _joi["default"].string().required()
      },
      payload: {
        environmentName: _joi["default"].string().required(""),
        panorama: _joi["default"].string().allow(""),
        preset: _joi["default"].string().allow(""),
        video: _joi["default"].string().allow(""),
        floorColor: _joi["default"].string().allow(""),
        skyColor: _joi["default"].string().allow(""),
        skyUrl: _joi["default"].string().allow("")
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
var _default = [createEnvironment, getEnvironments, updateEnvironment, deleteEnvironment, getEnvironmentById, getEnvironmentsTourist, getEnvironmentByIdTourist]; //, getServiceById, getServiceCount
// const getServiceById = {
//   method: "GET",
//   path: "/api/environment/getEnvironments/{_id}",
//   handler: function (request, h) {
//     const userData =
//       (request.auth &&
//         request.auth.credentials &&
//         request.auth.credentials.userData) ||
//       null;
//     return new Promise((resolve, reject) => {
//       Controller.ServiceController.getServiceById(
//         userData,
//         request.params._id,
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
//     description: "get environment",
//     tags: ["api", "user", "getServiceById"],
//     auth: "UserAuth",
//     validate: {
//       failAction: UniversalFunctions.failActionFunction,
//       params: {
//         _id: Joi.string().required(),
//       },
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
// const getServiceCount = {
//   method: "GET",
//   path: "/api/service/getServiceCount/{_id}",
//   handler: function (request, h) {
//     const userData =
//       (request.auth &&
//         request.auth.credentials &&
//         request.auth.credentials.userData) ||
//       null;
//     return new Promise((resolve, reject) => {
//       Controller.ServiceController.getServiceCount(
//         userData,
//         request.params._id,
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
//     description: "get Service",
//     tags: ["api", "user", "getService"],
//     auth: "UserAuth",
//     validate: {
//       failAction: UniversalFunctions.failActionFunction,
//       params: {
//         _id: Joi.string().required(),
//       },
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
// const deleteCard = {
//   method: "DELETE",
//   path: "/api/card/deleteCard/{_id}",
//   handler: function (request, h) {
//     const userData =
//       (request.auth &&
//         request.auth.credentials &&
//         request.auth.credentials.userData) ||
//       null;
//     const payloadData = request.params;
//     return new Promise((resolve, reject) => {
//       Controller.CardController.deleteCard(
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
//     description: "deleteCard",
//     tags: ["api", "admin", "card"],
//     auth: "UserAuth",
//     validate: {
//       params: {
//         _id: Joi.string().required(),
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
// const updateCard = {
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

exports["default"] = _default;