"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

require("dotenv/config");

var _hapi = _interopRequireDefault(require("@hapi/hapi"));

var _jwtSimple = _interopRequireDefault(require("jwt-simple"));

var _universalFunctions = _interopRequireDefault(require("../utils/universalFunctions"));

var _controllers = _interopRequireDefault(require("../controllers"));

var _config2 = _interopRequireDefault(require("../config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var ValidationError = /*#__PURE__*/function (_Error) {
  _inherits(ValidationError, _Error);

  var _super = _createSuper(ValidationError);

  function ValidationError() {
    _classCallCheck(this, ValidationError);

    return _super.apply(this, arguments);
  }

  return _createClass(ValidationError);
}( /*#__PURE__*/_wrapNativeSuper(Error));

var SSOManager = /*#__PURE__*/function () {
  function SSOManager() {
    _classCallCheck(this, SSOManager);

    this.jwtSecret = process.env.JWT_SECRET_SSO;
    this.appUrl = process.env.APP_URL_SSO;
  }
  /**
   * 
   * @param {Hapi.Server} server 
   */


  _createClass(SSOManager, [{
    key: "createRoute",
    value: function createRoute(server) {
      var _this = this;

      server.route({
        method: "POST",
        path: '/sso/auth/callback',
        handler: function handler(req, res) {
          return new Promise(function (resolve, reject) {
            _this.decode({
              assertion: req.payload.assertion
            }).then(function (attrs) {
              var user = {
                id: attrs.edupersontargetedid,
                email: attrs.mail,
                name: attrs.displayname
              };

              _controllers["default"].SSOBaseController.authCallback(user, function (err, data) {
                if (err) reject(err);else {
                  resolve(res.redirect(_this.appUrl + "/".concat(data.ssoData.ssoString)));
                }
              });
            })["catch"](function (error) {
              reject(error);
            });
          });
        }
      });
      /**
       * SSO Validation
       * @description API to validate ssoToken
       * @param {Object} payload
       * @param {String} obj.ssoToken
       * @param {Object} obj.deviceData
       * @param {String} obj.deviceData.deviceType
       * @param {String} obj.deviceData.deviceName
       * @param {String} obj.deviceData.deviceUUID
       */

      server.route({
        method: 'POST',
        path: '/api/sso/auth/validate',
        handler: function handler(req, res) {
          return new Promise(function (resolve, reject) {
            var payloadData = req.payload;

            _controllers["default"].SSOBaseController.validateUserSSO(payloadData, function (err, data) {
              if (err) reject(_universalFunctions["default"].sendError(err));else resolve(_universalFunctions["default"].sendSuccess(_config2["default"].APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, data));
            });
          });
        }
      });
    }
  }, {
    key: "getToken",
    value: function getToken() {
      return false;
    }
  }, {
    key: "saveToken",
    value: function saveToken(token) {
      console.log("STORE TOKEN : ".concat(token));
    }
    /**
     * 
     * @param {Object} options 
     * @param {Object} options.assertion 
     * @param {Enumerator<PROD,TEST>} options.env 
     * @returns 
     */

  }, {
    key: "decode",
    value: function () {
      var _decode = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var _this2 = this;

        var options,
            _args = arguments;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                options = _args.length > 0 && _args[0] !== undefined ? _args[0] : {};
                return _context.abrupt("return", new Promise(function (resolve, reject) {
                  var assertion = options.assertion,
                      env = options.env;
                  if (!assertion) throw new Error("Option \"assertion\" is undefined.");

                  var jwt = function () {
                    try {
                      return (0, _jwtSimple["default"].decode)(assertion, _this2.jwtSecret);
                    } catch (error) {
                      throw new ValidationError("Failed to decode signed JWT.");
                    }
                  }();

                  if (env === "PROD" && jwt.iss !== "https://rapid.aaf.edu.au") {
                    throw new ValidationError("Invalid JWT issuer.");
                  }

                  if (env === "PROD" && jwt.aud !== _this2.appUrl) {
                    throw new ValidationError("Invalid JWT audience.");
                  }

                  Promise.resolve(_this2.getToken(jwt.jti)).then(function (found) {
                    if (found) {
                      // The same token cannot be used twice.
                      throw new ValidationError("Invalid JWT identifier.");
                    }

                    return _this2.saveToken(jwt.jti);
                  }).then(function () {
                    return jwt["https://aaf.edu.au/attributes"];
                  }).then(resolve)["catch"](reject);
                }));

              case 2:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function decode() {
        return _decode.apply(this, arguments);
      }

      return decode;
    }()
  }]);

  return SSOManager;
}();

var instance = new SSOManager();
var _default = instance;
exports["default"] = _default;