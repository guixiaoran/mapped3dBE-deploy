"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _universalFunctions = _interopRequireDefault(require("../../utils/universalFunctions"));

var _joi = _interopRequireDefault(require("joi"));

var _controllers = _interopRequireDefault(require("../../controllers"));

var _config = _interopRequireDefault(require("../../config"));

var _Joi$string, _Joi$string2;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var userRegister = {
  method: "POST",
  path: "/api/user/register",
  options: {
    description: "Register a new user",
    tags: ["api", "user"],
    handler: function handler(request, h) {
      var payloadData = request.payload;
      return new Promise(function (resolve, reject) {
        if (!_universalFunctions["default"].verifyEmailFormat(payloadData.emailId)) reject(_universalFunctions["default"].sendError(_universalFunctions["default"].CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_EMAIL_FORMAT));else {
          _controllers["default"].UserBaseController.createUser(payloadData, function (err, data) {
            if (err) reject(_universalFunctions["default"].sendError(err));else resolve(_universalFunctions["default"].sendSuccess(_universalFunctions["default"].CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.CREATED, data));
          });
        }
      });
    },
    validate: {
      payload: _joi["default"].object({
        firstName: _joi["default"].string().regex(/^[a-zA-Z ]+$/).trim().min(2).required(),
        lastName: _joi["default"].string().regex(/^[a-zA-Z ]+$/).trim().min(2).required(),
        emailId: _joi["default"].string().required(),
        phoneNumber: _joi["default"].string().regex(/^[0-9]+$/).min(5).required(),
        countryCode: _joi["default"].string().max(4).required().trim(),
        password: _joi["default"].string().required().min(5),
        deviceData: _joi["default"].object({
          deviceType: (_Joi$string = _joi["default"].string()).valid.apply(_Joi$string, _toConsumableArray(Object.values(_config["default"].APP_CONSTANTS.DATABASE.DEVICE_TYPES))).required(),
          deviceName: _joi["default"].string().required(),
          deviceUUID: _joi["default"].string().guid().required()
        }).label('deviceData')
      }).label("User: Register"),
      failAction: _universalFunctions["default"].failActionFunction
    },
    plugins: {
      "hapi-swagger": {
        responseMessages: _universalFunctions["default"].CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
};
var verifyOTP = {
  method: "PUT",
  path: "/api/user/verifyOTP",
  options: {
    auth: "UserAuth",
    description: "Verify OTP for User",
    tags: ["api", "user"],
    handler: function handler(request, h) {
      var payloadData = request.payload;
      var userData = request.auth && request.auth.credentials && request.auth.credentials.userData || null;
      return new Promise(function (resolve, reject) {
        _controllers["default"].UserBaseController.verifyOTP({
          data: payloadData,
          userData: userData
        }, function (err, data) {
          if (err) reject(_universalFunctions["default"].sendError(err));else {
            resolve(_universalFunctions["default"].sendSuccess(_universalFunctions["default"].CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.VERIFY_COMPLETE, data));
          }
        });
      });
    },
    validate: {
      payload: _joi["default"].object({
        OTPCode: _joi["default"].string().length(6).required()
      }).label("User: Verify OTP Model"),
      failAction: _universalFunctions["default"].failActionFunction
    },
    plugins: {
      "hapi-swagger": {
        security: [{
          'user': {}
        }],
        responseMessages: _universalFunctions["default"].CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
};
var login = {
  method: "POST",
  path: "/api/user/login",
  options: {
    description: "Login Via Phone Number & Password For User",
    tags: ["api", "user"],
    handler: function handler(request, h) {
      var payloadData = request.payload;

      if (!_universalFunctions["default"].verifyEmailFormat(payloadData.emailId)) {
        reject(_universalFunctions["default"].sendError(_universalFunctions["default"].CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_EMAIL_FORMAT));
      } else {
        return new Promise(function (resolve, reject) {
          _controllers["default"].UserBaseController.loginUser(payloadData, function (err, data) {
            if (err) reject(_universalFunctions["default"].sendError(err));else resolve(_universalFunctions["default"].sendSuccess(null, data));
          });
        });
      }
    },
    validate: {
      payload: _joi["default"].object({
        emailId: _joi["default"].string().required(),
        password: _joi["default"].string().required().min(5).trim(),
        deviceData: _joi["default"].object({
          deviceType: (_Joi$string2 = _joi["default"].string()).valid.apply(_Joi$string2, _toConsumableArray(Object.values(_config["default"].APP_CONSTANTS.DATABASE.DEVICE_TYPES))).required(),
          deviceName: _joi["default"].string().required(),
          deviceUUID: _joi["default"].string().guid().required()
        }).label('deviceData')
      }).label("User: Login"),
      failAction: _universalFunctions["default"].failActionFunction
    },
    plugins: {
      "hapi-swagger": {
        responseMessages: _universalFunctions["default"].CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
};
var resendOTP = {
  method: "PUT",
  path: "/api/user/resendOTP",
  options: {
    description: "Resend OTP for Customer",
    tags: ["api", "customer"],
    auth: "UserAuth",
    handler: function handler(request, h) {
      var userData = request.auth && request.auth.credentials && request.auth.credentials.userData || null;
      return new Promise(function (resolve, reject) {
        _controllers["default"].UserBaseController.resendOTP(userData, function (err, data) {
          if (err) {
            reject(_universalFunctions["default"].sendError(err));
          } else {
            resolve(_universalFunctions["default"].sendSuccess(_universalFunctions["default"].CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.VERIFY_SENT, data));
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
          'user': {}
        }],
        responseMessages: _universalFunctions["default"].CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
};
var getOTP = {
  method: "GET",
  path: "/api/user/getOTP",
  options: {
    description: "get OTP for Customer",
    tags: ["api", "user"],
    handler: function handler(request, h) {
      var userData = request.query;
      return new Promise(function (resolve, reject) {
        _controllers["default"].UserBaseController.getOTP(userData, function (error, success) {
          if (error) {
            reject(_universalFunctions["default"].sendError(error));
          } else {
            resolve(_universalFunctions["default"].sendSuccess(_universalFunctions["default"].CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, success));
          }
        });
      });
    },
    validate: {
      query: {
        emailId: _joi["default"].string().required()
      },
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
  path: "/api/user/accessTokenLogin",
  options: {
    description: "access token login",
    tags: ["api", "user"],
    handler: function handler(request, h) {
      var userData = request.auth && request.auth.credentials && request.auth.credentials.userData || null;
      var data = request.payload;
      return new Promise(function (resolve, reject) {
        _controllers["default"].UserBaseController.accessTokenLogin(userData, function (err, data) {
          if (!err) {
            resolve(_universalFunctions["default"].sendSuccess(null, data));
          } else {
            reject(_universalFunctions["default"].sendError(err));
          }
        });
      });
    },
    auth: "UserAuth",
    validate: {
      failAction: _universalFunctions["default"].failActionFunction
    },
    plugins: {
      "hapi-swagger": {
        security: [{
          'user': {}
        }],
        responseMessages: _universalFunctions["default"].CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
};
var logoutCustomer = {
  method: "PUT",
  path: "/api/user/logout",
  options: {
    description: "Logout user",
    auth: "UserAuth",
    tags: ["api", "user"],
    handler: function handler(request, h) {
      var userData = request.auth && request.auth.credentials && request.auth.credentials.userData || null;
      return new Promise(function (resolve, reject) {
        _controllers["default"].UserBaseController.logoutCustomer(userData, function (err, data) {
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
          'user': {}
        }],
        responseMessages: _universalFunctions["default"].CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
};
var getProfile = {
  method: "GET",
  path: "/api/user/getProfile",
  options: {
    description: "get profile of user",
    auth: "UserAuth",
    tags: ["api", "user"],
    handler: function handler(request, h) {
      var userData = request.auth && request.auth.credentials && request.auth.credentials.userData || null;
      return new Promise(function (resolve, reject) {
        if (userData && userData._id) {
          _controllers["default"].UserBaseController.getProfile(userData, function (error, success) {
            if (error) {
              reject(_universalFunctions["default"].sendError(error));
            } else {
              resolve(_universalFunctions["default"].sendSuccess(_universalFunctions["default"].CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, success));
            }
          });
        } else {
          reject(_universalFunctions["default"].sendError(_universalFunctions["default"].CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_TOKEN));
        }
      });
    },
    validate: {
      failAction: _universalFunctions["default"].failActionFunction
    },
    plugins: {
      "hapi-swagger": {
        security: [{
          'user': {}
        }],
        responseMessages: _universalFunctions["default"].CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
};
var changePassword = {
  method: "PUT",
  path: "/api/user/changePassword",
  options: {
    description: "change Password",
    tags: ["api", "customer"],
    handler: function handler(request, h) {
      var userData = request.auth && request.auth.credentials && request.auth.credentials.userData || null;
      return new Promise(function (resolve, reject) {
        _controllers["default"].UserBaseController.changePassword(userData, request.payload, function (err, user) {
          if (!err) {
            resolve(_universalFunctions["default"].sendSuccess(_universalFunctions["default"].CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.PASSWORD_RESET, user));
          } else {
            reject(_universalFunctions["default"].sendError(err));
          }
        });
      });
    },
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
      }).label("User: Change Password"),
      failAction: _universalFunctions["default"].failActionFunction
    },
    plugins: {
      "hapi-swagger": {
        security: [{
          'user': {}
        }],
        responseMessages: _universalFunctions["default"].CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
};
var forgotPassword = {
  method: "POST",
  path: "/api/user/forgotPassword",
  options: {
    description: "forgot password",
    tags: ["api", "user"],
    handler: function handler(request, h) {
      var payloadData = request.payload;
      return new Promise(function (resolve, reject) {
        if (!_universalFunctions["default"].verifyEmailFormat(payloadData.emailId)) {
          reject(_universalFunctions["default"].sendError(_universalFunctions["default"].CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_EMAIL_FORMAT));
        } else {
          _controllers["default"].UserBaseController.forgetPassword(request.payload, function (error, success) {
            if (error) {
              reject(_universalFunctions["default"].sendError(error));
            } else {
              resolve(_universalFunctions["default"].sendSuccess(_universalFunctions["default"].CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.VERIFY_SENT, success));
            }
          });
        }
      });
    },
    validate: {
      payload: _joi["default"].object({
        emailId: _joi["default"].string().required()
      }).label("User: Forget Password"),
      failAction: _universalFunctions["default"].failActionFunction
    },
    plugins: {
      "hapi-swagger": {
        responseMessages: _universalFunctions["default"].CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
};
var resetPassword = {
  method: "POST",
  path: "/api/user/resetPassword",
  options: {
    description: "reset password",
    tags: ["api", "user"],
    handler: function handler(request, h) {
      var payloadData = request.payload;
      return new Promise(function (resolve, reject) {
        if (!_universalFunctions["default"].verifyEmailFormat(payloadData.emailId)) {
          reject(_universalFunctions["default"].sendError(_universalFunctions["default"].CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_EMAIL_FORMAT));
        } else {
          _controllers["default"].UserBaseController.resetPassword(request.payload, function (error, success) {
            if (error) {
              reject(_universalFunctions["default"].sendError(error));
            } else {
              resolve(_universalFunctions["default"].sendSuccess(_universalFunctions["default"].CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.PASSWORD_RESET, success));
            }
          });
        }
      });
    },
    validate: {
      payload: _joi["default"].object({
        password: _joi["default"].string().min(6).required().trim(),
        emailId: _joi["default"].string().required(),
        OTPCode: _joi["default"].string().required()
      }).label("User: Reset Password"),
      failAction: _universalFunctions["default"].failActionFunction
    },
    plugins: {
      "hapi-swagger": {
        responseMessages: _universalFunctions["default"].CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
};
var _default = [userRegister, verifyOTP, login, resendOTP, getOTP, accessTokenLogin, logoutCustomer, getProfile, changePassword, forgotPassword, resetPassword];
exports["default"] = _default;