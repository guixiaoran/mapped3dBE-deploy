"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _services = _interopRequireDefault(require("../../services"));

var _async = _interopRequireDefault(require("async"));

var _universalFunctions = _interopRequireDefault(require("../../utils/universalFunctions"));

var _tokenManager = _interopRequireDefault(require("../../lib/tokenManager"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var ERROR = _universalFunctions["default"].CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR;
var Config = _universalFunctions["default"].CONFIG;
/**
 * @description Authentication for AAF Rapid SSO
 * @param {Object} payloadData 
 * @param {String} payloadData.name
 * @param {String} payloadData.email 
 * @param {Function} callback 
 */

var authCallback = function authCallback(payloadData, callback) {
  var ssoData;

  _async["default"].series([function (cb) {
    var dataToSave = {
      name: payloadData.name,
      email: payloadData.email,
      ssoString: _universalFunctions["default"].generateUrlSafeRandomString()
    };

    _services["default"].SSOManagerService.createRecord(dataToSave, function (err, data) {
      if (err) cb(err);else {
        ssoData = data;
        cb();
      }
    });
  }], function (err, data) {
    if (err) return callback(err);else return callback(null, {
      ssoData: ssoData
    });
  });
};
/**
 * @description SSO validation to register or login a user
 * @param {Object} payloadData 
 * @param {String} payloadData.ssoToken 
 * @param {Function} callback 
 */


var validateUserSSO = function validateUserSSO(payloadData, callback) {
  var ssoData, userData, accessToken;
  var newUser = false;

  _async["default"].series([function (cb) {
    var criteria = {
      ssoString: payloadData.ssoToken
    };

    _services["default"].SSOManagerService.getRecord(criteria, {}, {}, function (err, data) {
      if (err) cb(err);else {
        if (data.length == 0) cb(ERROR.SSO_STRING_EXPIRED);else {
          ssoData = data && data[0] || null;
          cb();
        }
      }
    });
  }, function (cb) {
    var criteria = {
      _id: ssoData._id
    };

    _services["default"].SSOManagerService.deleteRecord(criteria, function (err, data) {
      if (err) cb(err);else cb();
    });
  }, function (cb) {
    var criteria = {
      emailId: ssoData.email
    };

    _services["default"].UserService.getRecord(criteria, {}, {}, function (err, data) {
      if (err) cb(err);else {
        if (data.length == 0) {
          newUser = true;
          cb();
        } else {
          userData = data && data[0] || null;
          cb();
        }
      }
    });
  }, function (cb) {
    if (newUser) {
      var nameArray = ssoData.name.split(" ");
      var firstName = nameArray[0];
      var lastName = firstName;

      if (nameArray.length >= 2) {
        lastName = nameArray[0];
      }

      var dataToSave = {
        firstName: firstName,
        lastName: lastName,
        emailId: ssoData.email,
        registrationDate: new Date().toISOString(),
        deakinSSO: true,
        emailVerified: true
      };

      _services["default"].UserService.createRecord(dataToSave, function (err, data) {
        if (err) cb(err);else {
          userData = data;
          cb();
        }
      });
    } else cb();
  }, function (cb) {
    var tokenData = {
      id: userData._id,
      type: Config.APP_CONSTANTS.DATABASE.USER_ROLES.USER
    };

    _tokenManager["default"].setToken(tokenData, payloadData.deviceData, function (err, output) {
      if (err) cb(err);else {
        accessToken = output && output.accessToken || null;
        cb();
      }
    });
  }], function (err) {
    if (err) return callback(err);else return callback(null, {
      accessToken: accessToken,
      userData: userData
    });
  });
};

var _default = {
  authCallback: authCallback,
  validateUserSSO: validateUserSSO
};
exports["default"] = _default;