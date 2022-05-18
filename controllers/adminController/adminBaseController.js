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

var adminLogin = function adminLogin(payload, callback) {
  var emailId = payload.emailId;
  var password = payload.password;
  var userFound = false;
  var accessToken = null;
  var successLogin = false;

  _async["default"].series([function (cb) {
    _services["default"].AdminService.getRecord({
      emailId: emailId
    }, {}, {}, function (err, result) {
      if (err) cb(err);else {
        userFound = result && result[0] || null;
        cb(null, result);
      }
    });
  }, function (cb) {
    //validations
    if (!userFound) cb(ERROR.USER_NOT_FOUND);else {
      if (userFound && userFound.password != _universalFunctions["default"].CryptData(password)) {
        cb(ERROR.INCORRECT_PASSWORD);
      } else if (userFound.isBlocked == true) {
        cb(ERROR.ACCOUNT_BLOCKED);
      } else {
        successLogin = true;
        cb();
      }
    }
  }, function (cb) {
    var criteria = {
      emailId: emailId
    };
    var projection = {
      password: 0
    };
    var option = {
      lean: true
    };

    _services["default"].AdminService.getRecord(criteria, projection, option, function (err, result) {
      if (err) {
        cb(err);
      } else {
        userFound = result && result[0] || null;
        cb();
      }
    });
  }, function (cb) {
    if (successLogin) {
      var tokenData = {
        id: userFound._id,
        type: _universalFunctions["default"].CONFIG.APP_CONSTANTS.DATABASE.USER_ROLES.ADMIN
      };

      _tokenManager["default"].setToken(tokenData, payload.deviceData, function (err, output) {
        if (err) {
          cb(err);
        } else {
          if (output && output.accessToken) {
            accessToken = output && output.accessToken;
            cb();
          } else {
            cb(ERROR.IMP_ERROR);
          }
        }
      });
    } else {
      cb(ERROR.IMP_ERROR);
    }
  }], function (err, data) {
    if (err) {
      return callback(err);
    } else {
      return callback(null, {
        accessToken: accessToken,
        adminDetails: userFound
      });
    }
  });
};

var accessTokenLogin = function accessTokenLogin(payload, callback) {
  var userData = payload;
  var appVersion;
  var userFound = null;

  _async["default"].series([function (cb) {
    var criteria = {
      _id: userData.adminId
    };

    _services["default"].AdminService.getRecord(criteria, {
      password: 0
    }, {}, function (err, data) {
      if (err) cb(err);else {
        if (data.length == 0) cb(ERROR.INCORRECT_ACCESSTOKEN);else {
          userFound = data && data[0] || null;
          cb();
        }
      }
    });
  }, function (cb) {
    appVersion = {
      latestIOSVersion: 100,
      latestAndroidVersion: 100,
      criticalAndroidVersion: 100,
      criticalIOSVersion: 100
    };
    cb(null);
  }], function (err, user) {
    if (!err) return callback(null, {
      accessToken: userData.accessToken,
      adminDetails: _universalFunctions["default"].deleteUnnecessaryUserData(userFound),
      appVersion: appVersion
    });else callback(err);
  });
};

var createAdmin = function createAdmin(userData, payloadData, callback) {
  var newAdmin;
  var userFound = false;

  _async["default"].series([function (cb) {
    var criteria = {
      _id: userData.adminId
    };

    _services["default"].AdminService.getRecord(criteria, {
      password: 0
    }, {}, function (err, data) {
      if (err) cb(err);else {
        if (data.length == 0) cb(ERROR.INCORRECT_ACCESSTOKEN);else {
          userFound = data && data[0] || null;
          if (userFound.userType != Config.APP_CONSTANTS.DATABASE.USER_ROLES.SUPERADMIN) cb(ERROR.PRIVILEGE_MISMATCH);else cb();
        }
      }
    });
  }, function (cb) {
    var criteria = {
      emailId: payloadData.emailId
    };

    _services["default"].AdminService.getRecord(criteria, {}, {}, function (err, data) {
      if (err) cb(err);else {
        if (data.length > 0) cb(ERROR.USERNAME_EXIST);else cb();
      }
    });
  }, function (cb) {
    payloadData.initialPassword = _universalFunctions["default"].generateRandomString();
    payloadData.password = _universalFunctions["default"].CryptData(payloadData.initialPassword);
    payloadData.userType = Config.APP_CONSTANTS.DATABASE.USER_ROLES.ADMIN;

    _services["default"].AdminService.createAdmin(payloadData, function (err, data) {
      if (err) cb(err);else {
        newAdmin = data;
        cb();
      }
    });
  }], function (err, result) {
    if (err) return callback(err);else return callback(null, {
      adminDetails: _universalFunctions["default"].deleteUnnecessaryUserData(newAdmin)
    });
  });
};

var getAdmin = function getAdmin(userData, callback) {
  var adminList = [];
  var userFound = false;

  _async["default"].series([function (cb) {
    var criteria = {
      _id: userData.adminId
    };

    _services["default"].AdminService.getRecord(criteria, {
      password: 0
    }, {}, function (err, data) {
      if (err) cb(err);else {
        if (data.length == 0) cb(ERROR.INCORRECT_ACCESSTOKEN);else {
          userFound = data && data[0] || null;
          if (userFound.userType != Config.APP_CONSTANTS.DATABASE.USER_ROLES.SUPERADMIN) cb(ERROR.PRIVILEGE_MISMATCH);else cb();
        }
      }
    });
  }, function (cb) {
    _services["default"].AdminService.getRecord({
      userType: Config.APP_CONSTANTS.DATABASE.USER_ROLES.ADMIN
    }, {
      password: 0,
      __v: 0,
      createdAt: 0
    }, {}, function (err, data) {
      if (err) cb(err);else {
        adminList = data;
        cb();
      }
    });
  }], function (err, result) {
    if (err) callback(err);else callback(null, {
      data: adminList
    });
  });
};

var blockUnblockAdmin = function blockUnblockAdmin(userData, payloadData, callback) {
  _async["default"].series([function (cb) {
    var criteria = {
      _id: userData.adminId
    };

    _services["default"].AdminService.getRecord(criteria, {
      password: 0
    }, {}, function (err, data) {
      if (err) cb(err);else {
        if (data.length == 0) cb(ERROR.INCORRECT_ACCESSTOKEN);else {
          userFound = data && data[0] || null;
          if (userFound.userType != Config.APP_CONSTANTS.DATABASE.USER_ROLES.SUPERADMIN) cb(ERROR.PRIVILEGE_MISMATCH);else cb();
        }
      }
    });
  }, function (cb) {
    _services["default"].AdminService.getRecord({
      _id: payloadData.adminId
    }, {}, {}, function (err, data) {
      if (err) cb(err);else {
        if (data.length == 0) cb(ERROR.USER_NOT_FOUND);else cb();
      }
    });
  }, function (cb) {
    var criteria = {
      _id: payloadData.adminId
    };
    var dataToUpdate = {
      $set: {
        isBlocked: payloadData.block
      }
    };

    _services["default"].AdminService.updateRecord(criteria, dataToUpdate, {}, function (err, data) {
      if (err) cb(err);else cb();
    });
  }], function (err, result) {
    if (err) callback(err);else callback(null);
  });
};

var createUser = function createUser(userData, payloadData, callback) {
  var newUserData;
  var userFound = false;

  _async["default"].series([function (cb) {
    var criteria = {
      _id: userData.adminId
    };

    _services["default"].AdminService.getRecord(criteria, {
      password: 0
    }, {}, function (err, data) {
      if (err) cb(err);else {
        if (data.length == 0) cb(ERROR.INCORRECT_ACCESSTOKEN);else {
          userFound = data && data[0] || null;
          cb();
        }
      }
    });
  }, function (cb) {
    _services["default"].UserService.getRecord({
      emailId: payloadData.emailId
    }, {}, {}, function (err, data) {
      if (err) cb(err);else {
        if (data.length != 0) cb(ERROR.USER_ALREADY_REGISTERED);else cb();
      }
    });
  }, function (cb) {
    payloadData.initialPassword = _universalFunctions["default"].generateRandomString();
    payloadData.password = _universalFunctions["default"].CryptData(payloadData.initialPassword);
    payloadData.emailVerified = true;

    _services["default"].UserService.createRecord(payloadData, function (err, data) {
      if (err) cb(err);else {
        newUserData = data;
        cb();
      }
    });
  }], function (err, result) {
    if (err) callback(err);else callback(null, {
      userData: _universalFunctions["default"].deleteUnnecessaryUserData(newUserData)
    });
  });
};

var getUser = function getUser(userData, callback) {
  var userList = [];
  var userFound = false;

  _async["default"].series([function (cb) {
    var criteria = {
      _id: userData.adminId
    };

    _services["default"].AdminService.getRecord(criteria, {
      password: 0
    }, {}, function (err, data) {
      if (err) cb(err);else {
        if (data.length == 0) cb(ERROR.INCORRECT_ACCESSTOKEN);else {
          userFound = data && data[0] || null;
          if (userFound.isBlocked == true) cb(ERROR.ACCOUNT_BLOCKED);else cb();
        }
      }
    });
  }, function (cb) {
    var projection = {
      password: 0,
      accessToken: 0,
      OTPCode: 0,
      code: 0,
      codeUpdatedAt: 0,
      __v: 0,
      registrationDate: 0
    };

    _services["default"].UserService.getRecord({}, projection, {}, function (err, data) {
      if (err) cb(err);else {
        userList = data;
        cb();
      }
    });
  }], function (err, result) {
    if (err) callback(err);else callback(null, {
      data: userList
    });
  });
};

var blockUnblockUser = function blockUnblockUser(userData, payloadData, callback) {
  _async["default"].series([function (cb) {
    var criteria = {
      _id: userData.adminId
    };

    _services["default"].AdminService.getRecord(criteria, {
      password: 0
    }, {}, function (err, data) {
      if (err) cb(err);else {
        if (data.length == 0) cb(ERROR.INCORRECT_ACCESSTOKEN);else {
          userFound = data && data[0] || null;
          if (userFound.isBlocked == true) cb(ERROR.ACCOUNT_BLOCKED);else cb();
        }
      }
    });
  }, function (cb) {
    _services["default"].UserService.getRecord({
      _id: payloadData.userId
    }, {}, {}, function (err, data) {
      if (err) cb(err);else {
        if (data.length == 0) cb(ERROR.USER_NOT_FOUND);else cb();
      }
    });
  }, function (cb) {
    var criteria = {
      _id: payloadData.userId
    };
    var dataToUpdate = {
      $set: {
        isBlocked: payloadData.block
      }
    };

    _services["default"].UserService.updateRecord(criteria, dataToUpdate, {}, function (err, data) {
      if (err) cb(err);else cb();
    });
  }], function (err, result) {
    if (err) callback(err);else callback(null);
  });
};

var changePassword = function changePassword(userData, payloadData, callbackRoute) {
  var oldPassword = _universalFunctions["default"].CryptData(payloadData.oldPassword);

  var newPassword = _universalFunctions["default"].CryptData(payloadData.newPassword);

  var customerData;

  _async["default"].series([function (cb) {
    var query = {
      _id: userData.adminId
    };
    var options = {
      lean: true
    };

    _services["default"].AdminService.getRecord(query, {}, options, function (err, data) {
      if (err) {
        cb(err);
      } else {
        if (data.length == 0) cb(ERROR.INCORRECT_ACCESSTOKEN);else {
          customerData = data && data[0] || null;
          if (customerData.isBlocked) cb(ERROR.ACCOUNT_BLOCKED);else cb();
        }
      }
    });
  }, function (callback) {
    var query = {
      _id: userData.adminId
    };
    var projection = {
      password: 1,
      firstLogin: 1
    };
    var options = {
      lean: true
    };

    _services["default"].AdminService.getRecord(query, projection, options, function (err, data) {
      if (err) {
        callback(err);
      } else {
        customerData = data && data[0] || null;

        if (customerData == null) {
          callback(ERROR.NOT_FOUND);
        } else {
          if (payloadData.skip == false) {
            if (data[0].password == oldPassword && data[0].password != newPassword) {
              callback(null);
            } else if (data[0].password != oldPassword) {
              callback(ERROR.WRONG_PASSWORD);
            } else if (data[0].password == newPassword) {
              callback(ERROR.NOT_UPDATE);
            }
          } else callback(null);
        }
      }
    });
  }, function (callback) {
    var dataToUpdate;

    if (payloadData.skip == true && customerData.firstLogin == false) {
      dataToUpdate = {
        $set: {
          firstLogin: true
        },
        $unset: {
          initialPassword: 1
        }
      };
    } else if (payloadData.skip == false && customerData.firstLogin == false) {
      dataToUpdate = {
        $set: {
          password: newPassword,
          firstLogin: true
        },
        $unset: {
          initialPassword: 1
        }
      };
    } else if (payloadData.skip == true && customerData.firstLogin == true) {
      dataToUpdate = {};
    } else {
      dataToUpdate = {
        $set: {
          password: newPassword
        }
      };
    }

    var condition = {
      _id: userData.adminId
    };

    _services["default"].AdminService.updateRecord(condition, dataToUpdate, {}, function (err, user) {
      if (err) {
        callback(err);
      } else {
        if (!user || user.length == 0) {
          callback(ERROR.NOT_FOUND);
        } else {
          callback(null);
        }
      }
    });
  }], function (error, result) {
    if (error) {
      return callbackRoute(error);
    } else {
      return callbackRoute(null);
    }
  });
};

var logoutAdmin = function logoutAdmin(userData, callbackRoute) {
  _async["default"].series([function (cb) {
    var criteria = {
      _id: userData.adminId
    };

    _services["default"].AdminService.getRecord(criteria, {}, {}, function (err, data) {
      if (err) cb(err);else {
        if (data.length == 0) cb(ERROR.INCORRECT_ACCESSTOKEN);else {
          cb();
        }
      }
    });
  }, function (callback) {
    var condition = {
      _id: userData.adminId
    };
    var dataToUpdate = {
      $unset: {
        accessToken: 1
      }
    };

    _services["default"].AdminService.updateRecord(condition, dataToUpdate, {}, function (err, result) {
      if (err) {
        callback(err);
      } else {
        callback();
      }
    });
  }], function (error, result) {
    if (error) {
      return callbackRoute(error);
    } else {
      return callbackRoute(null);
    }
  });
};

var _default = {
  adminLogin: adminLogin,
  accessTokenLogin: accessTokenLogin,
  createAdmin: createAdmin,
  getAdmin: getAdmin,
  blockUnblockAdmin: blockUnblockAdmin,
  createUser: createUser,
  getUser: getUser,
  blockUnblockUser: blockUnblockUser,
  changePassword: changePassword,
  logoutAdmin: logoutAdmin
};
exports["default"] = _default;