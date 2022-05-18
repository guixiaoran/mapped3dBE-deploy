"use strict";

var _tokenManager = _interopRequireDefault(require("../lib/tokenManager"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var AuthBearer = require('hapi-auth-bearer-token');

exports.register = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(server, options, next) {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return server.register(AuthBearer);

          case 2:
            //Register Authorization Plugin
            server.auth.strategy('UserAuth', 'bearer-access-token', {
              allowQueryToken: false,
              allowMultipleHeaders: true,
              accessTokenName: 'accessToken',
              validate: function () {
                var _validate = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(request, token, h) {
                  var isValid, credentials;
                  return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          isValid = false;
                          _context.next = 3;
                          return _tokenManager["default"].verifyToken(token);

                        case 3:
                          credentials = _context.sent;

                          if (credentials && credentials['userData']) {
                            isValid = true;
                          }

                          return _context.abrupt("return", {
                            isValid: isValid,
                            credentials: credentials
                          });

                        case 6:
                        case "end":
                          return _context.stop();
                      }
                    }
                  }, _callee);
                }));

                function validate(_x4, _x5, _x6) {
                  return _validate.apply(this, arguments);
                }

                return validate;
              }()
            });

          case 3:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

exports.name = 'auth-token-plugin';