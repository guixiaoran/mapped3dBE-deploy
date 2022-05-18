"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _joi = _interopRequireDefault(require("joi"));

var _md = _interopRequireDefault(require("md5"));

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _config = _interopRequireDefault(require("../config"));

var _randomstring = _interopRequireDefault(require("randomstring"));

var _validator = _interopRequireDefault(require("validator"));

var _cryptoRandomString = _interopRequireDefault(require("crypto-random-string"));

var _moment = _interopRequireDefault(require("moment"));

var _momentRange = require("moment-range");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

var moment = (0, _momentRange.extendMoment)(_moment["default"]);

var sendError = function sendError(data) {
  console.trace('ERROR OCCURED ', data);

  if (_typeof(data) == 'object' && data.hasOwnProperty('statusCode') && data.hasOwnProperty('customMessage')) {
    appLogger.info('attaching resposnetype', data.type);
    var errorToSend = new _boom["default"].Boom(data.customMessage, {
      statusCode: data.statusCode
    });
    errorToSend.output.payload.responseType = data.type;
    return errorToSend;
  } else {
    var _errorToSend = '';

    if (_typeof(data) == 'object') {
      if (data.name == 'MongoError') {
        _errorToSend += _config["default"].APP_CONSTANTS.STATUS_MSG.ERROR.DB_ERROR.customMessage;

        if (data.code = 11000) {
          var duplicateValue = data.errmsg && data.errmsg.substr(data.errmsg.lastIndexOf('{ : "') + 5);
          duplicateValue = duplicateValue.replace('}', '');
          _errorToSend += _config["default"].APP_CONSTANTS.STATUS_MSG.ERROR.DUPLICATE.customMessage + " : " + duplicateValue;

          if (data.message.indexOf('customer_1_streetAddress_1_city_1_state_1_country_1_zip_1') > -1) {
            _errorToSend = _config["default"].APP_CONSTANTS.STATUS_MSG.ERROR.DUPLICATE_ADDRESS.customMessage;
          }
        }
      } else if (data.name == 'ApplicationError') {
        _errorToSend += _config["default"].APP_CONSTANTS.STATUS_MSG.ERROR.APP_ERROR.customMessage + ' : ';
      } else if (data.name == 'ValidationError') {
        _errorToSend += _config["default"].APP_CONSTANTS.STATUS_MSG.ERROR.APP_ERROR.customMessage + data.message;
      } else if (data.name == 'CastError') {
        _errorToSend += _config["default"].APP_CONSTANTS.STATUS_MSG.ERROR.DB_ERROR.customMessage + _config["default"].APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_ID.customMessage + data.value;
      }
    } else {
      _errorToSend = data;
    }

    var customErrorMessage = _errorToSend;

    if (typeof customErrorMessage == 'string') {
      if (_errorToSend.indexOf("[") > -1) {
        customErrorMessage = _errorToSend.substr(_errorToSend.indexOf("["));
      }

      customErrorMessage = customErrorMessage && customErrorMessage.replace(/"/g, '');
      customErrorMessage = customErrorMessage && customErrorMessage.replace('[', '');
      customErrorMessage = customErrorMessage && customErrorMessage.replace(']', '');
    }

    return new _boom["default"].Boom(customErrorMessage, {
      statusCode: 400
    });
  }
};

var sendSuccess = function sendSuccess(successMsg, data) {
  successMsg = successMsg || _config["default"].APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT.customMessage;

  if (_typeof(successMsg) == 'object' && successMsg.hasOwnProperty('statusCode') && successMsg.hasOwnProperty('customMessage')) {
    return {
      statusCode: successMsg.statusCode,
      message: successMsg.customMessage,
      data: data || {}
    };
  } else {
    return {
      statusCode: 200,
      message: successMsg,
      data: data || {}
    };
  }
};

var failActionFunction = function failActionFunction(request, reply, error) {
  var customErrorMessage = '';

  if (error.output.payload.message.indexOf("[") > -1) {
    customErrorMessage = error.output.payload.message.substr(error.output.payload.message.indexOf("["));
  } else {
    customErrorMessage = error.output.payload.message;
  }

  customErrorMessage = customErrorMessage.replace(/"/g, '');
  customErrorMessage = customErrorMessage.replace('[', '');
  customErrorMessage = customErrorMessage.replace(']', '');
  error.output.payload.message = customErrorMessage;
  delete error.output.payload.validation;
  return error;
};

var authorizationHeaderObj = _joi["default"].object({
  authorization: _joi["default"].string().required()
}).options({
  allowUnknown: true
});

var generateRandomString = function generateRandomString(stringLength) {
  if (stringLength === undefined) stringLength = 12;
  return _randomstring["default"].generate(stringLength);
};

var generateUrlSafeRandomString = function generateUrlSafeRandomString(stringLength) {
  if (stringLength === undefined) stringLength = 12;
  return (0, _cryptoRandomString["default"])({
    length: stringLength,
    type: 'url-safe'
  });
  ;
};

var generateRandomNumber = function generateRandomNumber() {
  var num = Math.floor(Math.random() * 90000) + 10000;
  return num;
};

var generateRandomAlphabet = function generateRandomAlphabet(len) {
  var charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  var randomString = '';

  for (var i = 0; i < len; i++) {
    var randomPoz = Math.floor(Math.random() * charSet.length);
    randomString += charSet.substring(randomPoz, randomPoz + 1);
    randomString = randomString.toUpperCase();
  }

  return randomString;
};

var CryptData = function CryptData(stringToCrypt) {
  return (0, _md["default"])((0, _md["default"])(stringToCrypt));
};

var validateLatLongValues = function validateLatLongValues(lat, _long) {
  var valid = true;

  if (lat < -90 || lat > 90) {
    valid = false;
  }

  if (_long < -180 || _long > 180) {
    valid = false;
  }

  return valid;
};

var validateString = function validateString(str, pattern) {
  appLogger.info(str, pattern, str.match(pattern));
  return str.match(pattern);
};

var verifyEmailFormat = function verifyEmailFormat(string) {
  return _validator["default"].isEmail(string);
};

var deleteUnnecessaryUserData = function deleteUnnecessaryUserData(userObj) {
  appLogger.info('deleting>>', userObj);
  delete userObj.__v;
  delete userObj.password;
  delete userObj.registrationDate;
  delete userObj.OTPCode;
  appLogger.info('deleted', userObj);
  return userObj;
};

var generateFilenameWithExtension = function generateFilenameWithExtension(oldFilename, newFilename) {
  var ext = oldFilename.substr((~-oldFilename.lastIndexOf(".") >>> 0) + 2);
  return newFilename + '.' + ext;
};

function isEmpty(obj) {
  // null and undefined are "empty"
  if (obj == null) return true; // Assume if it has a length property with a non-zero value
  // that that property is correct.

  if (obj.length && obj.length > 0) return false;
  if (obj.length === 0) return true; // Otherwise, does it have any properties of its own?
  // Note that this doesn't handle
  // toString and toValue enumeration bugs in IE < 9

  for (var key in obj) {
    if (hasOwnProperty.call(obj, key)) return false;
  }

  return true;
}

var getTimestamp = function getTimestamp(inDate) {
  if (inDate) return new Date();
  return new Date().toISOString();
};

var createArray = function createArray(List, keyName) {
  appLogger.info("create array------>>>>>>>");
  var IdArray = [];
  var keyName = keyName;

  for (var key in List) {
    if (List.hasOwnProperty(key)) {
      //logger.debug(data[key][keyName]);
      IdArray.push(List[key][keyName].toString());
    }
  }

  return IdArray;
};

function getRange(startDate, endDate, diffIn) {
  var dr = moment.range(startDate, endDate);
  if (!diffIn) diffIn = _config["default"].APP_CONSTANTS.TIME_UNITS.HOURS;
  if (diffIn == "milli") return dr.diff();
  return dr.diff(diffIn);
}

var checkFileExtension = function checkFileExtension(fileName) {
  return fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length) || fileName;
};
/**
 * @author Sanchit Dang
 * 
 * @param {Object} obj Object to clean.
 * @param {Function} callback callback function which returns cleaned object.
 * @returns {Object} Cleaned Version of the object. 
 */


var cleanObject = function cleanObject(obj, callback) {
  var newObj = Object.keys(obj).filter(function (k) {
    return obj[k] != undefined && obj[k] != null && obj[k] != '';
  }) // Remove undef. and null.
  .reduce(function (newObj, k) {
    return _typeof(obj[k]) === "object" ? _objectSpread(_objectSpread({}, newObj), {}, _defineProperty({}, k, cleanObject(obj[k]))) // Recurse.
    : _objectSpread(_objectSpread({}, newObj), {}, _defineProperty({}, k, obj[k]));
  }, // Copy value.
  {});
  if (callback instanceof Function) callback(newObj);
  return newObj;
};

var universalFunctions = {
  generateRandomString: generateRandomString,
  generateUrlSafeRandomString: generateUrlSafeRandomString,
  CryptData: CryptData,
  CONFIG: _config["default"],
  sendError: sendError,
  sendSuccess: sendSuccess,
  failActionFunction: failActionFunction,
  authorizationHeaderObj: authorizationHeaderObj,
  validateLatLongValues: validateLatLongValues,
  validateString: validateString,
  verifyEmailFormat: verifyEmailFormat,
  deleteUnnecessaryUserData: deleteUnnecessaryUserData,
  generateFilenameWithExtension: generateFilenameWithExtension,
  isEmpty: isEmpty,
  getTimestamp: getTimestamp,
  generateRandomNumber: generateRandomNumber,
  createArray: createArray,
  generateRandomAlphabet: generateRandomAlphabet,
  getRange: getRange,
  checkFileExtension: checkFileExtension,
  cleanObject: cleanObject
};
var _default = universalFunctions;
exports["default"] = _default;