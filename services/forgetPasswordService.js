"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _models = _interopRequireDefault(require("../models"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var getForgetPasswordRequest = function getForgetPasswordRequest(conditions, projection, options, callback) {
  _models["default"].ForgetPassword.find(conditions, projection, options, callback);
};

var updateForgetPasswordRequest = function updateForgetPasswordRequest(criteria, dataToSet, options, callback) {
  _models["default"].ForgetPassword.findOneAndUpdate(criteria, dataToSet, options, callback);
};

var createForgetPasswordRequest = function createForgetPasswordRequest(data, callback) {
  var forgotPasswordEntry = new _models["default"].ForgetPassword(data);
  forgotPasswordEntry.save(function (err, result) {
    callback(err, result);
  });
};

var _default = {
  getForgetPasswordRequest: getForgetPasswordRequest,
  updateForgetPasswordRequest: updateForgetPasswordRequest,
  createForgetPasswordRequest: createForgetPasswordRequest
};
exports["default"] = _default;