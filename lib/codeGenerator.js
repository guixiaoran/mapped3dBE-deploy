"use strict";

var _universalFunctions = _interopRequireDefault(require("../utils/universalFunctions"));

var _services = _interopRequireDefault(require("../services"));

var _async = _interopRequireDefault(require("async"));

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
var _ = require("underscore");

var generateRandomNumbers = function generateRandomNumbers(numberLength, excludeList) {
  var arrayList = [];
  excludeList = excludeList || [];
  var minString = "0";
  var maxString = "9";

  for (var i = 1; i < numberLength; i++) {
    minString = minString + "0";
    maxString = maxString + "9";
  }

  var minNumber = parseInt(minString);
  var maxNumber = parseInt(maxString); //Create list

  for (var _i = minNumber; _i < maxNumber; _i++) {
    var digitToCheck = _i.toString();

    if (digitToCheck.length < numberLength) {
      var diff = numberLength - digitToCheck.length;
      var zeros = "";

      for (var j = 0; j < diff; j++) {
        zeros += Math.floor(Math.random() * 10 + 1);
      }

      digitToCheck = zeros + digitToCheck;
    }

    if (digitToCheck < 999999) if (excludeList.indexOf(digitToCheck) == -1) {
      arrayList.push(digitToCheck);
    }
  }

  if (arrayList.length > 0) {
    arrayList = _.shuffle(arrayList);
    return arrayList[0];
  } else {
    return false;
  }
};

exports.generateUniqueCode = function (noOfDigits, userRole, callback) {
  noOfDigits = noOfDigits || 5;
  var excludeArray = [];
  var generatedRandomCode = null;

  _async["default"].series([function (cb) {
    //Push All generated codes in excludeAry
    if (userRole == _universalFunctions["default"].CONFIG.APP_CONSTANTS.DATABASE.USER_ROLES.USER) {
      _services["default"].UserService.getRecord({
        OTPCode: {
          $ne: null
        }
      }, {
        OTPCode: 1
      }, {
        lean: true
      }, function (err, data) {
        if (err) {
          cb(err);
        } else {
          if (data && data.length > 0) {
            excludeArray = data.map(function (row) {
              return row.OTPCode.toString();
            });
          }

          cb();
        }
      });
    } else cb(_universalFunctions["default"].CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.IMP_ERROR);
  }, function (cb) {
    //Generate Random Code of digits specified
    generatedRandomCode = generateRandomNumbers(noOfDigits, excludeArray);
    cb();
  }], function (err, data) {
    callback(err, {
      number: generatedRandomCode
    });
  });
};