"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _genericService = _interopRequireDefault(require("./genericService"));

var _forgetPasswordService = _interopRequireDefault(require("./forgetPasswordService"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _default = {
  UserService: new _genericService["default"]("User"),
  ForgetPasswordService: _forgetPasswordService["default"],
  AdminService: new _genericService["default"]("Admin"),
  TokenService: new _genericService["default"]("Token"),
  SSOManagerService: new _genericService["default"]("SSO"),
  EnvironmentService: new _genericService["default"]("Environment"),
  LocalObjectService: new _genericService["default"]("LocalObject"),
  PublicObjectService: new _genericService["default"]("PublicObject"),
  LocalObjectItemService: new _genericService["default"]("LocalObjectItem")
};
exports["default"] = _default;