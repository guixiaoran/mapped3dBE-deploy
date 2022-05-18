"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _demoBaseController = _interopRequireDefault(require("./demoController/demoBaseController"));

var _userBaseController = _interopRequireDefault(require("./userController/userBaseController"));

var _adminBaseController = _interopRequireDefault(require("./adminController/adminBaseController"));

var _uploadBaseController = _interopRequireDefault(require("./uploadController/uploadBaseController"));

var _ssoBaseController = _interopRequireDefault(require("./ssoController/ssoBaseController"));

var _environmentController = _interopRequireDefault(require("./environmentController/environmentController"));

var _localObjectController = _interopRequireDefault(require("./localObjectController/localObjectController"));

var _publicObjectController = _interopRequireDefault(require("./publicObjectController/publicObjectController"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _default = {
  DemoBaseController: _demoBaseController["default"],
  UserBaseController: _userBaseController["default"],
  AdminBaseController: _adminBaseController["default"],
  UploadBaseController: _uploadBaseController["default"],
  SSOBaseController: _ssoBaseController["default"],
  EnvironmentController: _environmentController["default"],
  LocalObjectItemController: _localObjectController["default"],
  PublicObjectController: _publicObjectController["default"]
};
exports["default"] = _default;