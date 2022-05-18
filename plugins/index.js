"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _inert = _interopRequireDefault(require("@hapi/inert"));

var _vision = _interopRequireDefault(require("@hapi/vision"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _default = [_inert["default"], _vision["default"], {
  plugin: require('./swagger')
}, {
  plugin: require('./auth-token')
}];
exports["default"] = _default;