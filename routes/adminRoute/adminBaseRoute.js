"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _universalFunctions = _interopRequireDefault(require("../../utils/universalFunctions"));

var _joi = _interopRequireDefault(require("joi"));

var _controllers = _interopRequireDefault(require("../../controllers"));

var _config = _interopRequireDefault(require("../../config"));

var _Joi$string;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var adminLogin = {
  method: "POST",
  path: "/api/admin/login",
  options: {
    description: "Admin Login",
    tags: ["api", "admin"],
    handler: function handler(request, h) {
      return new Promise(function (resolve, reject) {
        _controllers["default"].AdminBaseController.adminLogin(request.payload, function (error, data) {
          if (error) reject(_universalFunctions["default"].sendError(error));else {
            resolve(_universalFunctions["default"].sendSuccess(null, data));
          }
        });
      });
    },
    validate: {
      payload: _joi["default"].object({
        emailId: _joi["default"].string().email().required(),
        password: _joi["default"].string().required().min(5).trim(),
        deviceData: _joi["default"].object({
          deviceType: (_Joi$string = _joi["default"].string()).valid.apply(_Joi$string, _toConsumableArray(Object.values(_config["default"].APP_CONSTANTS.DATABASE.DEVICE_TYPES))).required(),
          deviceName: _joi["default"].string().required(),
          deviceUUID: _joi["default"].string().guid().required()
        }).label('deviceData')
      }).label("Admin: Login"),
      failAction: _universalFunctions["default"].failActionFunction
    },
    plugins: {
      "hapi-swagger": {
        responseMessages: _universalFunctions["default"].CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
};
var accessTokenLogin = {
  method: "POST",
  path: "/api/admin/accessTokenLogin",
  handler: function handler(request, h) {
    var _request$auth, _request$auth$credent;

    var userData = (request === null || request === void 0 ? void 0 : (_request$auth = request.auth) === null || _request$auth === void 0 ? void 0 : (_request$auth$credent = _request$auth.credentials) === null || _request$auth$credent === void 0 ? void 0 : _request$auth$credent.userData) || null;
    request.auth && request.auth.credentials && request.auth.credentials.userData || null;
    return new Promise(function (resolve, reject) {
      _controllers["default"].AdminBaseController.accessTokenLogin(userData, function (err, data) {
        if (!err) {
          resolve(_universalFunctions["default"].sendSuccess(null, data));
        } else {
          reject(_universalFunctions["default"].sendError(err));
        }
      });
    });
  },
  config: {
    description: "access token login",
    tags: ["api", "admin"],
    auth: "UserAuth",
    validate: {
      failAction: _universalFunctions["default"].failActionFunction
    },
    plugins: {
      "hapi-swagger": {
        security: [{
          'admin': {}
        }],
        responseMessages: _universalFunctions["default"].CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
};
var createAdmin = {
  method: "POST",
  path: "/api/admin/createAdmin",
  handler: function handler(request, h) {
    var userData = request.auth && request.auth.credentials && request.auth.credentials.userData || null;
    var payloadData = request.payload;
    return new Promise(function (resolve, reject) {
      if (!_universalFunctions["default"].verifyEmailFormat(payloadData.emailId)) {
        reject(_universalFunctions["default"].sendError(_universalFunctions["default"].CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_EMAIL_FORMAT));
      } else {
        _controllers["default"].AdminBaseController.createAdmin(userData, payloadData, function (err, data) {
          if (!err) {
            resolve(_universalFunctions["default"].sendSuccess(null, data));
          } else {
            reject(_universalFunctions["default"].sendError(err));
          }
        });
      }
    });
  },
  options: {
    description: "create sub admin",
    tags: ["api", "admin"],
    auth: "UserAuth",
    validate: {
      payload: _joi["default"].object({
        emailId: _joi["default"].string().required(),
        fullName: _joi["default"].string().optional().allow("")
      }).label("Admin: Create Admin"),
      failAction: _universalFunctions["default"].failActionFunction
    },
    plugins: {
      "hapi-swagger": {
        security: [{
          'admin': {}
        }],
        responseMessages: _universalFunctions["default"].CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
};
var getAdmin = {
  method: "GET",
  path: "/api/admin/getAdmin",
  handler: function handler(request, h) {
    var userData = request.auth && request.auth.credentials && request.auth.credentials.userData || null;
    return new Promise(function (resolve, reject) {
      _controllers["default"].AdminBaseController.getAdmin(userData, function (err, data) {
        if (!err) {
          resolve(_universalFunctions["default"].sendSuccess(null, data));
        } else {
          reject(_universalFunctions["default"].sendError(err));
        }
      });
    });
  },
  config: {
    description: "get all sub admin list",
    tags: ["api", "admin"],
    auth: "UserAuth",
    validate: {
      failAction: _universalFunctions["default"].failActionFunction
    },
    plugins: {
      "hapi-swagger": {
        security: [{
          'admin': {}
        }],
        responseMessages: _universalFunctions["default"].CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
};
var blockUnblockAdmin = {
  method: "PUT",
  path: "/api/admin/blockUnblockAdmin",
  handler: function handler(request, h) {
    var userData = request.auth && request.auth.credentials && request.auth.credentials.userData || null;
    var payloadData = request.payload;
    return new Promise(function (resolve, reject) {
      _controllers["default"].AdminBaseController.blockUnblockAdmin(userData, payloadData, function (err, data) {
        if (!err) {
          resolve(_universalFunctions["default"].sendSuccess(null, data));
        } else {
          reject(_universalFunctions["default"].sendError(err));
        }
      });
    });
  },
  options: {
    description: "block/unblock a sub admin",
    tags: ["api", "admin"],
    auth: "UserAuth",
    validate: {
      payload: _joi["default"].object({
        adminId: _joi["default"].string().required(),
        block: _joi["default"]["boolean"]().required()
      }).label("Admin: Block-Unblock Admin"),
      failAction: _universalFunctions["default"].failActionFunction
    },
    plugins: {
      "hapi-swagger": {
        security: [{
          'admin': {}
        }],
        responseMessages: _universalFunctions["default"].CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
};
var createUser = {
  method: "POST",
  path: "/api/admin/createUser",
  handler: function handler(request, h) {
    var userData = request.auth && request.auth.credentials && request.auth.credentials.userData || null;
    var payloadData = request.payload;
    return new Promise(function (resolve, reject) {
      if (!_universalFunctions["default"].verifyEmailFormat(payloadData.emailId)) {
        reject(_universalFunctions["default"].sendError(_universalFunctions["default"].CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_EMAIL_FORMAT));
      } else {
        _controllers["default"].AdminBaseController.createUser(userData, payloadData, function (err, data) {
          if (!err) {
            resolve(_universalFunctions["default"].sendSuccess(null, data));
          } else {
            reject(_universalFunctions["default"].sendError(err));
          }
        });
      }
    });
  },
  options: {
    description: "create new user from admin",
    tags: ["api", "admin"],
    auth: "UserAuth",
    validate: {
      payload: _joi["default"].object({
        firstName: _joi["default"].string().regex(/^[a-zA-Z ]+$/).trim().min(2).required(),
        lastName: _joi["default"].string().regex(/^[a-zA-Z ]+$/).trim().min(2).required(),
        emailId: _joi["default"].string().required(),
        phoneNumber: _joi["default"].string().regex(/^[0-9]+$/).min(5).required(),
        countryCode: _joi["default"].string().max(4).required().trim()
      }).label("Admin: Create User"),
      failAction: _universalFunctions["default"].failActionFunction
    },
    plugins: {
      "hapi-swagger": {
        security: [{
          'admin': {}
        }],
        responseMessages: _universalFunctions["default"].CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
};
var getUser = {
  method: "GET",
  path: "/api/admin/getUser",
  handler: function handler(request, h) {
    var userData = request.auth && request.auth.credentials && request.auth.credentials.userData || null;
    return new Promise(function (resolve, reject) {
      _controllers["default"].AdminBaseController.getUser(userData, function (err, data) {
        if (!err) {
          resolve(_universalFunctions["default"].sendSuccess(null, data));
        } else {
          reject(_universalFunctions["default"].sendError(err));
        }
      });
    });
  },
  options: {
    description: "get all user list",
    tags: ["api", "admin"],
    auth: "UserAuth",
    validate: {
      failAction: _universalFunctions["default"].failActionFunction
    },
    plugins: {
      "hapi-swagger": {
        security: [{
          'admin': {}
        }],
        responseMessages: _universalFunctions["default"].CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
};
var blockUnblockUser = {
  method: "PUT",
  path: "/api/admin/blockUnblockUser",
  handler: function handler(request, h) {
    var userData = request.auth && request.auth.credentials && request.auth.credentials.userData || null;
    var payloadData = request.payload;
    return new Promise(function (resolve, reject) {
      _controllers["default"].AdminBaseController.blockUnblockUser(userData, payloadData, function (err, data) {
        if (!err) {
          resolve(_universalFunctions["default"].sendSuccess(null, data));
        } else {
          reject(_universalFunctions["default"].sendError(err));
        }
      });
    });
  },
  options: {
    description: "block/unblock a user",
    tags: ["api", "admin"],
    auth: "UserAuth",
    validate: {
      payload: _joi["default"].object({
        userId: _joi["default"].string().required(),
        block: _joi["default"]["boolean"]().required()
      }).label("Admin: Block-Unblock User"),
      failAction: _universalFunctions["default"].failActionFunction
    },
    plugins: {
      "hapi-swagger": {
        security: [{
          'admin': {}
        }],
        responseMessages: _universalFunctions["default"].CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
};
var changePassword = {
  method: "PUT",
  path: "/api/admin/changePassword",
  handler: function handler(request, h) {
    var userData = request.auth && request.auth.credentials && request.auth.credentials.userData || null;
    return new Promise(function (resolve, reject) {
      _controllers["default"].AdminBaseController.changePassword(userData, request.payload, function (err, user) {
        if (!err) {
          resolve(_universalFunctions["default"].sendSuccess(_universalFunctions["default"].CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.PASSWORD_RESET, user));
        } else {
          reject(_universalFunctions["default"].sendError(err));
        }
      });
    });
  },
  options: {
    description: "change Password",
    tags: ["api", "customer"],
    auth: "UserAuth",
    validate: {
      payload: _joi["default"].object({
        skip: _joi["default"]["boolean"]().required(),
        oldPassword: _joi["default"].string().when('skip', {
          is: false,
          then: _joi["default"].string().required().min(5),
          otherwise: _joi["default"].string().optional().allow("")
        }),
        newPassword: _joi["default"].string().when('skip', {
          is: false,
          then: _joi["default"].string().required().min(5),
          otherwise: _joi["default"].string().optional().allow("")
        })
      }).label("Admin: Change Password"),
      failAction: _universalFunctions["default"].failActionFunction
    },
    plugins: {
      "hapi-swagger": {
        security: [{
          'admin': {}
        }],
        responseMessages: _universalFunctions["default"].CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
};
var logoutAdmin = {
  method: "PUT",
  path: "/api/admin/logout",
  options: {
    description: "Logout admin",
    auth: "UserAuth",
    tags: ["api", "admin"],
    handler: function handler(request, h) {
      var userData = request.auth && request.auth.credentials && request.auth.credentials.userData || null;
      return new Promise(function (resolve, reject) {
        _controllers["default"].AdminBaseController.logoutAdmin(userData, function (err, data) {
          if (err) {
            reject(_universalFunctions["default"].sendError(err));
          } else {
            resolve(_universalFunctions["default"].sendSuccess(_universalFunctions["default"].CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.LOGOUT));
          }
        });
      });
    },
    validate: {
      failAction: _universalFunctions["default"].failActionFunction
    },
    plugins: {
      "hapi-swagger": {
        security: [{
          'admin': {}
        }],
        responseMessages: _universalFunctions["default"].CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
};
var _default = [adminLogin, accessTokenLogin, createAdmin, getAdmin, blockUnblockAdmin, createUser, getUser, blockUnblockUser, changePassword, logoutAdmin];
exports["default"] = _default;