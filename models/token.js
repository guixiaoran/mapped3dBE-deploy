"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = require("mongoose");

var _config = _interopRequireDefault(require("../config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var token = new _mongoose.Schema({
  deviceType: {
    type: String,
    "enum": Object.values(_config["default"].APP_CONSTANTS.DATABASE.DEVICE_TYPES),
    required: true
  },
  accessToken: {
    type: String,
    required: true,
    trim: true,
    index: true,
    unique: true,
    sparse: true
  },
  deviceUUID: {
    type: String,
    required: true
  },
  deviceName: {
    type: String,
    required: true
  },
  userId: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  adminId: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: 'admin'
  },
  createdAt: {
    type: Date,
    "default": Date.now()
  },
  updatedAt: {
    type: Date,
    "default": Date.now()
  }
});

var _default = (0, _mongoose.model)('token', token);

exports["default"] = _default;