"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = require("mongoose");

var sso = new _mongoose.Schema({
  ssoString: {
    type: _mongoose.Schema.Types.String,
    required: true
  },
  name: {
    type: _mongoose.Schema.Types.String
  },
  email: {
    type: _mongoose.Schema.Types.String
  }
});

var _default = (0, _mongoose.model)('sso', sso);

exports["default"] = _default;