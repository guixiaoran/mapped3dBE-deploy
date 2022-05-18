"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _user = _interopRequireDefault(require("./user"));

var _admin = _interopRequireDefault(require("./admin"));

var _token = _interopRequireDefault(require("./token"));

var _sso = _interopRequireDefault(require("./sso"));

var _environment = _interopRequireDefault(require("./environment"));

var _localObject = _interopRequireDefault(require("./localObject"));

var _localObjectItem = _interopRequireDefault(require("./localObjectItem"));

var _publicObject = _interopRequireDefault(require("./publicObject"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * Created by Sanchit
 */
var ForgetPassword = require("./forgotPasswordRequest");

var _default = {
  User: _user["default"],
  ForgetPassword: ForgetPassword,
  Admin: _admin["default"],
  Token: _token["default"],
  SSO: _sso["default"],
  Environment: _environment["default"],
  LocalObject: _localObject["default"],
  PublicObject: _publicObject["default"],
  LocalObjectItem: _localObjectItem["default"]
};
exports["default"] = _default;