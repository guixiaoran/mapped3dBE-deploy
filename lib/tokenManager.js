"use strict";
/**
* Please use tokenLogger for logging in this file try to abstain from console
* levels of logging:
* - TRACE - ‘blue’
* - DEBUG - ‘cyan’
* - INFO - ‘green’
* - WARN - ‘yellow’
* - ERROR - ‘red’
* - FATAL - ‘magenta’
*/

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

require("dotenv/config");

var _services = _interopRequireDefault(require("../services"));

var _config2 = _interopRequireDefault(require("../config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var Jwt = require("jsonwebtoken");
/**
 * 
 * @param {String} userId 
 * @param {String} userType 
 * @param {String} deviceUUID 
 * @param {String} token 
 * @returns 
 */


var getTokenFromDB = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(userId, userType, token) {
    var criteria, result;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            criteria = function () {
              switch (userType) {
                case _config2["default"].APP_CONSTANTS.DATABASE.USER_ROLES.ADMIN:
                case _config2["default"].APP_CONSTANTS.DATABASE.USER_ROLES.SUPERADMIN:
                  return {
                    adminId: userId,
                    accessToken: token
                  };

                default:
                  return {
                    userId: userId,
                    accessToken: token
                  };
              }
            }();

            _context.next = 3;
            return _services["default"].TokenService.getRecordUsingPromise(criteria, {}, {});

          case 3:
            result = _context.sent;

            if (!(result && result.length > 0)) {
              _context.next = 9;
              break;
            }

            result[0].type = userType;
            return _context.abrupt("return", result[0]);

          case 9:
            return _context.abrupt("return", _config2["default"].APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_TOKEN);

          case 10:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function getTokenFromDB(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();
/**
 * 
 * @param {String} userId 
 * @param {String} userType 
 * @param {Object} tokenData 
 * @param {String} tokenData.accessToken
 * @param {String} tokenData.deviceType
 * @param {String} tokenData.deviceName
 * @param {String} tokenData.deviceUUID
 * @param {Function} callback 
 */


var setTokenInDB = function setTokenInDB(userId, userType, tokenData, callback) {
  tokenLogger.info("login_type::::::::", userType);
  var objectToCreate, criteria;

  switch (userType) {
    case _config2["default"].APP_CONSTANTS.DATABASE.USER_ROLES.SUPERADMIN:
    case _config2["default"].APP_CONSTANTS.DATABASE.USER_ROLES.ADMIN:
      {
        objectToCreate = _objectSpread(_objectSpread({
          adminId: userId
        }, tokenData), {}, {
          updatedAt: Date.now()
        });
        criteria = {
          adminId: userId,
          deviceUUID: tokenData.deviceUUID
        };
        break;
      }

    default:
      {
        objectToCreate = _objectSpread(_objectSpread({
          userId: userId
        }, tokenData), {}, {
          updatedAt: Date.now()
        });
        criteria = {
          userId: userId,
          deviceUUID: tokenData.deviceUUID
        };
      }
  }

  _services["default"].TokenService.getRecord(criteria, {}, {}, function (err, data) {
    if (data.length === 0) {
      _services["default"].TokenService.createRecord(objectToCreate, function (err) {
        if (err) callback(err);else {
          callback();
        }
      });
    } else {
      _services["default"].TokenService.updateRecord(criteria, _objectSpread(_objectSpread({}, tokenData), {}, {
        updatedAt: Date.now()
      }), function (err) {
        if (err) callback(err);else {
          callback();
        }
      });
    }
  });
};
/**
 * 
 * @param {Object} tokenData 
 * @param {String} tokenData.id User ID
 * @param {String} tokenData.type User Type 
 * @param {Object} deviceData 
 * @param {String} deviceData.deviceUUID 
 * @param {String} deviceData.deviceType
 * @param {String} deviceData.deviceName
 * @param {Function} callback 
 */


var setToken = function setToken(tokenData, deviceData, callback) {
  if (!tokenData.id || !tokenData.type) {
    callback(_config2["default"].APP_CONSTANTS.STATUS_MSG.ERROR.IMP_ERROR);
  } else {
    var tokenToSend = Jwt.sign(tokenData, process.env.JWT_SECRET_KEY);
    setTokenInDB(tokenData.id, tokenData.type, _objectSpread({
      accessToken: tokenToSend
    }, deviceData), function (err, data) {
      callback(err, {
        accessToken: tokenToSend
      });
    });
  }
};

var verifyToken = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(token) {
    var decodedData, result;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return Jwt.verify(token, process.env.JWT_SECRET_KEY);

          case 3:
            decodedData = _context2.sent;
            _context2.next = 6;
            return getTokenFromDB(decodedData.id, decodedData.type, token);

          case 6:
            result = _context2.sent;

            if (!(result && result._id)) {
              _context2.next = 11;
              break;
            }

            return _context2.abrupt("return", {
              userData: result
            });

          case 11:
            throw result;

          case 12:
            _context2.next = 18;
            break;

          case 14:
            _context2.prev = 14;
            _context2.t0 = _context2["catch"](0);
            console.error(_context2.t0);
            return _context2.abrupt("return", _context2.t0);

          case 18:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 14]]);
  }));

  return function verifyToken(_x4) {
    return _ref2.apply(this, arguments);
  };
}();

var decodeToken = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(token) {
    var decodedData;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            _context3.next = 3;
            return Jwt.verify(token, process.env.JWT_SECRET_KEY);

          case 3:
            decodedData = _context3.sent;
            return _context3.abrupt("return", {
              userData: decodedData,
              token: token
            });

          case 7:
            _context3.prev = 7;
            _context3.t0 = _context3["catch"](0);
            return _context3.abrupt("return", _context3.t0);

          case 10:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[0, 7]]);
  }));

  return function decodeToken(_x5) {
    return _ref3.apply(this, arguments);
  };
}();

var _default = {
  decodeToken: decodeToken,
  verifyToken: verifyToken,
  setToken: setToken
};
exports["default"] = _default;