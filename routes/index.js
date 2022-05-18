"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _demoBaseRoute = _interopRequireDefault(require("./demoRoute/demoBaseRoute"));

var _userBaseRoute = _interopRequireDefault(require("./userRoute/userBaseRoute"));

var _adminBaseRoute = _interopRequireDefault(require("./adminRoute/adminBaseRoute"));

var _uploadBaseRoute = _interopRequireDefault(require("./uploadRoute/uploadBaseRoute"));

var _environmentRoute = _interopRequireDefault(require("./environmentRoute/environmentRoute"));

var _localObjectItemRoute = _interopRequireDefault(require("./localObjectItemRoute/localObjectItemRoute"));

var _publicObjectRoute = _interopRequireDefault(require("./publicObjectRoute/publicObjectRoute"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Routes = [].concat(_demoBaseRoute["default"], _userBaseRoute["default"], _adminBaseRoute["default"], _uploadBaseRoute["default"], _environmentRoute["default"], _localObjectItemRoute["default"], _publicObjectRoute["default"]);
var _default = Routes;
exports["default"] = _default;