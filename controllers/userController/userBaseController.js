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

/**
 * Please use appLogger for logging in this file try to abstain from console
 * levels of logging:
 * - TRACE - ‘blue’
 * - DEBUG - ‘cyan’
 * - INFO - ‘green’
 * - WARN - ‘yellow’
 * - ERROR - ‘red’
 * - FATAL - ‘magenta’
 */
var CodeGenerator = require("../../lib/codeGenerator");

var ERROR = _universalFunctions["default"].CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR;

var _ = require("underscore");

var createUser = function createUser(payloadData, callback) {
  var accessToken = null;
  var uniqueCode = null;
  var dataToSave = payloadData;
  if (dataToSave.password) dataToSave.password = _universalFunctions["default"].CryptData(dataToSave.password);
  var customerData = null;
  var appVersion = null;

  _async["default"].series([function (cb) {
    var query = {
      $or: [{
        emailId: payloadData.emailId
      }]
    };

    _services["default"].UserService.getRecord(query, {}, {
      lean: true
    }, function (error, data) {
      if (error) cb(error);else {
        if (data && data.length > 0) {
          if (data[0].emailVerified == true) cb(ERROR.USER_ALREADY_REGISTERED);else {
            _services["default"].UserService.deleteRecord({
              _id: data[0]._id
            }, function (err, updatedData) {
              if (err) cb(err);else cb(null);
            });
          }
        } else cb(null);
      }
    });
  }, function (cb) {
    //Validate for facebookId and password
    if (!dataToSave.password) cb(ERROR.PASSWORD_REQUIRED);else cb();
  }, function (cb) {
    //Validate countryCode
    if (dataToSave.countryCode.lastIndexOf("+") == 0) {
      if (!isFinite(dataToSave.countryCode.substr(1))) {
        cb(ERROR.INVALID_COUNTRY_CODE);
      } else cb();
    } else cb(ERROR.INVALID_COUNTRY_CODE);
  }, function (cb) {
    //Validate phone No
    if (dataToSave.phoneNumber && dataToSave.phoneNumber.split("")[0] == 0) cb(ERROR.INVALID_PHONE_NO_FORMAT);else cb();
  }, function (cb) {
    CodeGenerator.generateUniqueCode(6, _universalFunctions["default"].CONFIG.APP_CONSTANTS.DATABASE.USER_ROLES.USER, function (err, numberObj) {
      if (err) cb(err);else {
        if (!numberObj || numberObj.number == null) cb(ERROR.UNIQUE_CODE_LIMIT_REACHED);else {
          uniqueCode = numberObj.number;
          cb();
        }
      }
    });
  }, function (cb) {
    //Insert Into DB
    dataToSave.OTPCode = uniqueCode;
    dataToSave.phoneNumber = payloadData.phoneNumber;
    dataToSave.registrationDate = new Date().toISOString();
    dataToSave.firstLogin = true;

    _services["default"].UserService.createRecord(dataToSave, function (err, customerDataFromDB) {
      if (err) {
        if (err.code == 11000 && err.message.indexOf("emailId_1") > -1) {
          cb(ERROR.EMAIL_NO_EXIST);
        } else {
          cb(err);
        }
      } else {
        customerData = customerDataFromDB;
        cb();
      }
    });
  }, //  (cb) => {
  //     //Send SMS to User
  //     if (customerData) {
  //         NotificationManager.sendSMSToUser(uniqueCode, dataToSave.countryCode, dataToSave.mobileNo, (err, data) => {
  //             cb();
  //         })
  //     } else {
  //         cb(ERROR.IMP_ERROR)
  //     }
  //
  // },
  function (cb) {
    //Set Access Token
    if (customerData) {
      var tokenData = {
        id: customerData._id,
        type: _universalFunctions["default"].CONFIG.APP_CONSTANTS.DATABASE.USER_ROLES.USER
      };

      _tokenManager["default"].setToken(tokenData, payloadData.deviceData, function (err, output) {
        if (err) cb(err);else {
          accessToken = output && output.accessToken || null;
          cb();
        }
      });
    } else cb(ERROR.IMP_ERROR);
  }, function (cb) {
    appVersion = {
      latestIOSVersion: 100,
      latestAndroidVersion: 100,
      criticalAndroidVersion: 100,
      criticalIOSVersion: 100
    };
    cb(null);
  }], function (err, data) {
    if (err) callback(err);else {
      callback(null, {
        accessToken: accessToken,
        otpCode: customerData.OTPCode,
        userDetails: _universalFunctions["default"].deleteUnnecessaryUserData(customerData),
        appVersion: appVersion
      });
    }
  });
};
/**
 *
 * @param {Object} payload Payload
 * @param {Object} payload.userData UserData
 * @param {any} payload.data Payload Data
 * @param {Function} callback Callback Function
 */


var verifyOTP = function verifyOTP(payload, callback) {
  var userData = payload.userData;
  var payloadData = payload.data;
  var customerData;

  _async["default"].series([function (cb) {
    var query = {
      _id: userData.userId
    };
    var options = {
      lean: true
    };

    _services["default"].UserService.getRecord(query, {}, options, function (err, data) {
      if (err) cb(err);else {
        if (data.length == 0) cb(ERROR.INCORRECT_ACCESSTOKEN);else {
          customerData = data && data[0] || null;
          cb();
        }
      }
    });
  }, function (cb) {
    //Check verification code :
    if (payloadData.OTPCode == customerData.OTPCode) cb();else cb(ERROR.INVALID_CODE);
  }, function (cb) {
    //trying to update customer
    var criteria = {
      _id: userData.userId,
      OTPCode: payloadData.OTPCode
    };
    var setQuery = {
      $set: {
        emailVerified: true
      },
      $unset: {
        OTPCode: 1
      }
    };
    var options = {
      "new": true
    };

    _services["default"].UserService.updateRecord(criteria, setQuery, options, function (err, updatedData) {
      if (err) cb(err);else {
        if (!updatedData) cb(ERROR.INVALID_CODE);else cb();
      }
    });
  }], function (err, result) {
    if (err) callback(err);else callback();
  });
};

var loginUser = function loginUser(payloadData, callback) {
  var userFound = false;
  var accessToken = null;
  var successLogin = false;
  var updatedUserDetails = null;
  var appVersion = null;

  _async["default"].series([function (cb) {
    var criteria = {
      emailId: payloadData.emailId
    };
    var option = {
      lean: true
    };

    _services["default"].UserService.getRecord(criteria, {}, option, function (err, result) {
      if (err) cb(err);else {
        userFound = result && result[0] || null;
        cb();
      }
    });
  }, function (cb) {
    //validations
    if (!userFound) cb(ERROR.USER_NOT_FOUND);else {
      if (userFound.isBlocked) cb(ERROR.ACCOUNT_BLOCKED);else {
        if (userFound && userFound.password != _universalFunctions["default"].CryptData(payloadData.password)) {
          cb(ERROR.INCORRECT_PASSWORD);
        } // else if (userFound.emailVerified == false) {
        //   cb(ERROR.NOT_REGISTERED);
        // }
        else {
          successLogin = true;
          cb();
        }
      }
    }
  }, function (cb) {
    var criteria = {
      emailId: payloadData.emailId
    };
    var projection = {
      password: 0,
      accessToken: 0,
      initialPassword: 0,
      OTPCode: 0,
      code: 0,
      codeUpdatedAt: 0
    };
    var option = {
      lean: true
    };

    _services["default"].UserService.getRecord(criteria, projection, option, function (err, result) {
      if (err) cb(err);else {
        userFound = result && result[0] || null;
        cb();
      }
    });
  }, function (cb) {
    if (successLogin) {
      var tokenData = {
        id: userFound._id,
        type: _universalFunctions["default"].CONFIG.APP_CONSTANTS.DATABASE.USER_ROLES.USER
      };

      _tokenManager["default"].setToken(tokenData, payloadData.deviceData, function (err, output) {
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
    } else cb(ERROR.IMP_ERROR);
  }, function (cb) {
    appVersion = {
      latestIOSVersion: 100,
      latestAndroidVersion: 100,
      criticalAndroidVersion: 100,
      criticalIOSVersion: 100
    };
    cb(null);
  }], function (err, data) {
    if (err) callback(err);else {
      callback(null, {
        accessToken: accessToken,
        userDetails: _universalFunctions["default"].deleteUnnecessaryUserData(userFound),
        appVersion: appVersion
      });
    }
  });
};

var resendOTP = function resendOTP(userData, callback) {
  /*
     Create a Unique 6 digit code
     Insert It Into Customer DB
     Send Back Response
     */
  var uniqueCode = null;
  var customerData;

  _async["default"].series([function (cb) {
    var query = {
      _id: userData.userId
    };
    var options = {
      lean: true
    };

    _services["default"].UserService.getRecord(query, {}, options, function (err, data) {
      if (err) {
        cb(err);
      } else {
        if (data.length == 0) cb(ERROR.INCORRECT_ACCESSTOKEN);else {
          customerData = data && data[0] || null;

          if (customerData.emailVerified == true) {
            cb(ERROR.EMAIL_VERIFICATION_COMPLETE);
          } else {
            cb();
          }
        }
      }
    });
  }, function (cb) {
    CodeGenerator.generateUniqueCode(6, _universalFunctions["default"].CONFIG.APP_CONSTANTS.DATABASE.USER_ROLES.USER, function (err, numberObj) {
      if (err) {
        cb(err);
      } else {
        if (!numberObj || numberObj.number == null) {
          cb(ERROR.UNIQUE_CODE_LIMIT_REACHED);
        } else {
          uniqueCode = numberObj.number;
          cb();
        }
      }
    });
  }, function (cb) {
    var criteria = {
      _id: userData.userId
    };
    var setQuery = {
      $set: {
        OTPCode: uniqueCode,
        codeUpdatedAt: new Date().toISOString()
      }
    };
    var options = {
      lean: true
    };

    _services["default"].UserService.updateRecord(criteria, setQuery, options, cb);
  }], function (err, result) {
    callback(err, {
      OTPCode: uniqueCode
    });
  });
};

var getOTP = function getOTP(payloadData, callback) {
  var query = {
    emailId: payloadData.emailId
  };
  var projection = {
    _id: 0,
    OTPCode: 1
  };
  var options = {
    lean: true
  };

  _services["default"].UserService.getRecord(query, projection, options, function (err, data) {
    if (err) {
      callback(err);
    } else {
      var customerData = data && data[0] || null;

      if (customerData == null || customerData.OTPCode == undefined) {
        callback(ERROR.OTP_CODE_NOT_FOUND);
      } else {
        callback(null, customerData);
      }
    }
  });
};

var accessTokenLogin = function accessTokenLogin(userData, callback) {
  var appVersion;
  var userdata = {};
  var userFound = null;

  _async["default"].series([function (cb) {
    var criteria = {
      _id: userData.userId
    };

    _services["default"].UserService.getRecord(criteria, {
      password: 0
    }, {}, function (err, data) {
      if (err) cb(err);else {
        if (data.length == 0) cb(ERROR.INCORRECT_ACCESSTOKEN);else {
          userFound = data && data[0] || null;
          if (userFound.isBlocked) cb(ERROR.ACCOUNT_BLOCKED);else cb();
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
    if (!err) callback(null, {
      accessToken: userdata.accessToken,
      userDetails: _universalFunctions["default"].deleteUnnecessaryUserData(userFound),
      appVersion: appVersion
    });else callback(err);
  });
};

var logoutCustomer = function logoutCustomer(tokenData, callback) {
  _services["default"].TokenService.deleteRecord({
    _id: tokenData._id
  }, function (err) {
    if (err) callback(err);else callback();
  });
};

var getProfile = function getProfile(userData, callback) {
  var customerData;

  _async["default"].series([function (cb) {
    var query = {
      _id: userData.userId
    };
    var projection = {
      __v: 0,
      password: 0,
      accessToken: 0,
      codeUpdatedAt: 0
    };
    var options = {
      lean: true
    };

    _services["default"].UserService.getRecord(query, projection, options, function (err, data) {
      if (err) {
        cb(err);
      } else {
        if (data.length == 0) cb(ERROR.INCORRECT_ACCESSTOKEN);else {
          customerData = data && data[0] || null;
          if (customerData.isBlocked) cb(ERROR.ACCOUNT_BLOCKED);else cb();
        }
      }
    });
  }], function (err, result) {
    if (err) callback(err);else callback(null, {
      customerData: customerData
    });
  });
};

var changePassword = function changePassword(userData, payloadData, callbackRoute) {
  var oldPassword = _universalFunctions["default"].CryptData(payloadData.oldPassword);

  var newPassword = _universalFunctions["default"].CryptData(payloadData.newPassword);

  var customerData;

  _async["default"].series([function (cb) {
    var query = {
      _id: userData.userId
    };
    var options = {
      lean: true
    };

    _services["default"].UserService.getRecord(query, {}, options, function (err, data) {
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
      _id: userData.userId
    };
    var projection = {
      password: 1,
      firstLogin: 1
    };
    var options = {
      lean: true
    };

    _services["default"].UserService.getRecord(query, projection, options, function (err, data) {
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
      _id: userData.userId
    };

    _services["default"].UserService.updateRecord(condition, dataToUpdate, {}, function (err, user) {
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

var forgetPassword = function forgetPassword(payloadData, callback) {
  var dataFound = null;
  var code;
  var forgotDataEntry;
  var userFound;

  _async["default"].series([function (cb) {
    var query = {
      emailId: payloadData.emailId
    };

    _services["default"].UserService.getRecord(query, {
      _id: 1,
      emailId: 1,
      emailVerified: 1
    }, {}, function (err, data) {
      if (err) {
        cb(ERROR.PASSWORD_CHANGE_REQUEST_INVALID);
      } else {
        dataFound = data && data[0] || null;

        if (dataFound == null) {
          cb(ERROR.USER_NOT_REGISTERED);
        } // else {
        //   if (dataFound.emailVerified == false) {
        //     cb(ERROR.NOT_VERFIFIED);
        //   }
        else {
          userFound = data && data[0] || null;
          if (userFound.isBlocked) cb(ERROR.ACCOUNT_BLOCKED);else cb();
        } // }

      }
    });
  }, function (cb) {
    CodeGenerator.generateUniqueCode(6, _universalFunctions["default"].CONFIG.APP_CONSTANTS.DATABASE.USER_ROLES.USER, function (err, numberObj) {
      if (err) {
        cb(err);
      } else {
        if (!numberObj || numberObj.number == null) {
          cb(ERROR.UNIQUE_CODE_LIMIT_REACHED);
        } else {
          code = numberObj.number;
          cb();
        }
      }
    });
  }, function (cb) {
    var dataToUpdate = {
      code: code
    };
    var query = {
      _id: dataFound._id
    };

    _services["default"].UserService.updateRecord(query, dataToUpdate, {}, function (err, data) {
      if (err) {
        cb(err);
      } else {
        cb();
      }
    });
  }, function (cb) {
    _services["default"].ForgetPasswordService.getForgetPasswordRequest({
      customerID: dataFound._id
    }, {
      _id: 1,
      isChanged: 1
    }, {
      lean: 1
    }, function (err, data) {
      if (err) {
        cb(err);
      } else {
        forgotDataEntry = data && data[0] || null;
        cb();
      }
    });
  }, function (cb) {
    var data = {
      customerID: dataFound._id,
      requestedAt: Date.now(),
      userType: _universalFunctions["default"].CONFIG.APP_CONSTANTS.DATABASE.USER_ROLES.USER
    };

    if (forgotDataEntry == null) {
      _services["default"].ForgetPasswordService.createForgetPasswordRequest(data, function (err, data) {
        if (err) {
          cb(err);
        } else {
          cb();
        }
      });
    } else {
      if (forgotDataEntry.isChanged == true) {
        data.isChanged = false;
      }

      _services["default"].ForgetPasswordService.updateForgetPasswordRequest({
        _id: forgotDataEntry._id
      }, data, {}, cb);
    }
  }], function (error, result) {
    if (error) {
      callback(error);
    } else {
      callback(null, {
        emailId: payloadData.emailId,
        OTPCode: code
      });
    }
  });
};

var resetPassword = function resetPassword(payloadData, callbackRoute) {
  var foundData;
  var customerId = null;
  var data;

  _async["default"].series([function (callback) {
    var query = {
      emailId: payloadData.emailId
    };

    _services["default"].UserService.getRecord(query, {
      _id: 1,
      code: 1,
      emailVerified: 1
    }, {
      lean: true
    }, function (err, result) {
      if (err) {
        callback(err);
      } else {
        data = result && result[0] || null;

        if (data == null) {
          callback(ERROR.INCORRECT_ID);
        } else {
          if (payloadData.OTPCode != data.code) {
            callback(ERROR.INVALID_CODE);
          } else {
            if (data.phoneVerified == false) {
              callback(ERROR.NOT_VERFIFIED);
            } else {
              customerId = data._id;
              callback();
            }
          }
        }
      }
    });
  }, function (callback) {
    var query = {
      customerID: customerId,
      isChanged: false
    };

    _services["default"].ForgetPasswordService.getForgetPasswordRequest(query, {
      __v: 0
    }, {
      limit: 1,
      lean: true
    }, function (err, data) {
      if (err) {
        callback(err);
      } else {
        foundData = data && data[0] || null;
        callback();
      }
    });
  }, function (callback) {
    if (!_universalFunctions["default"].isEmpty(foundData)) {
      var minutes = _universalFunctions["default"].getRange(foundData.requestedAt, _universalFunctions["default"].getTimestamp(), _universalFunctions["default"].CONFIG.APP_CONSTANTS.TIME_UNITS.MINUTES);

      if (minutes < 0 || minutes > 30) {
        return callback(ERROR.PASSWORD_CHANGE_REQUEST_EXPIRE);
      } else {
        callback();
      }
    } else {
      return callback(ERROR.PASSWORD_CHANGE_REQUEST_INVALID);
    }
  }, function (callback) {
    var dataToUpdate = {
      password: _universalFunctions["default"].CryptData(payloadData.password)
    };
    appLogger.info(dataToUpdate);

    _services["default"].UserService.updateRecord({
      _id: customerId
    }, dataToUpdate, {}, function (error, result) {
      if (error) {
        callback(error);
      } else {
        if (result.n === 0) {
          callback(ERROR.USER_NOT_FOUND);
        } else {
          callback();
        }
      }
    });
  }, function (callback) {
    var dataToUpdate = {
      isChanged: true,
      changedAt: _universalFunctions["default"].getTimestamp()
    };

    _services["default"].ForgetPasswordService.updateForgetPasswordRequest({
      customerID: customerId
    }, dataToUpdate, {
      lean: true
    }, callback);
  }], function (error) {
    if (error) {
      callbackRoute(error);
    } else {
      callbackRoute(null);
    }
  });
};

var _default = {
  createUser: createUser,
  verifyOTP: verifyOTP,
  loginUser: loginUser,
  resendOTP: resendOTP,
  getOTP: getOTP,
  accessTokenLogin: accessTokenLogin,
  logoutCustomer: logoutCustomer,
  getProfile: getProfile,
  changePassword: changePassword,
  forgetPassword: forgetPassword,
  resetPassword: resetPassword
};
exports["default"] = _default;