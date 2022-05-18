"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _services = _interopRequireDefault(require("../services"));

var _async = _interopRequireDefault(require("async"));

var _universalFunctions = _interopRequireDefault(require("../utils/universalFunctions"));

var _users = require("../config/users");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var insertData = function insertData(adminData, callbackParent) {
  var _skip = false;

  _async["default"].series([function (cb) {
    _services["default"].AdminService.getRecord({
      emailId: adminData.emailId
    }, {}, {}, function (err, data) {
      if (err) cb(err);else {
        if (data.length > 0) {
          _skip = true;
          cb();
        } else cb();
      }
    });
  }, function (cb) {
    if (!_skip) {
      _services["default"].AdminService.createRecord(adminData, function (err, response) {
        if (err) {
          appLogger.debug("Implementation err", err);
          cb(err);
        } else {
          appLogger.info("Admin: ".concat(adminData.emailId, " Added Succesfully"));
          cb();
        }
      });
    } else cb();
  }], function (err, result) {
    if (err) return callbackParent(err);else {
      return callbackParent(null);
    }
  });
};

var bootstrapAdmin = function bootstrapAdmin(callbackParent) {
  var taskToRunInParallel = [];

  _users.superAdmins.forEach(function (admin) {
    taskToRunInParallel.push(function (admin) {
      return function (embeddedCB) {
        var adminData = {
          emailId: admin.email,
          password: _universalFunctions["default"].CryptData(admin.password),
          fullName: admin.name,
          userType: _universalFunctions["default"].CONFIG.APP_CONSTANTS.DATABASE.USER_ROLES.SUPERADMIN,
          createdAt: _universalFunctions["default"].getTimestamp(),
          firstLogin: true
        };
        insertData(adminData, embeddedCB);
      };
    }(admin));
  });

  _async["default"].parallel(taskToRunInParallel, function (error) {
    if (error) return callbackParent(error);
    return callbackParent(null);
  });
};

var _default = {
  bootstrapAdmin: bootstrapAdmin
};
exports["default"] = _default;