"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireWildcard(require("mongoose"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var user = new _mongoose.Schema({
  firstName: {
    type: String,
    trim: true,
    required: true
  },
  lastName: {
    type: String,
    trim: true,
    required: true
  },
  emailId: {
    type: String,
    trim: true,
    required: true,
    unique: true
  },
  phoneNumber: {
    type: String,
    trim: true,
    index: true,
    min: 5,
    max: 15
  },
  password: {
    type: String
  },
  deakinSSO: {
    type: Boolean,
    "default": false
  },
  initialPassword: {
    type: String
  },
  firstLogin: {
    type: Boolean,
    "default": false
  },
  countryCode: {
    type: String
  },
  code: {
    type: String,
    trim: true
  },
  OTPCode: {
    type: String,
    trim: true
  },
  emailVerified: {
    type: Boolean,
    "default": false
  },
  registrationDate: {
    type: Date,
    "default": Date.now
  },
  codeUpdatedAt: {
    type: Date,
    "default": Date.now,
    required: true
  },
  isBlocked: {
    type: Boolean,
    "default": false,
    required: true
  }
});

var _default = _mongoose["default"].model("user", user);

exports["default"] = _default;