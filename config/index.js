"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _appConstants = _interopRequireDefault(require("./appConstants"));

var _awsS3Config = _interopRequireDefault(require("./awsS3Config"));

var _dbConfig = _interopRequireDefault(require("./dbConfig"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _default = {
  APP_CONSTANTS: _appConstants["default"],
  AWS_S3_CONFIG: _awsS3Config["default"],
  DB_CONFIG: _dbConfig["default"]
};
exports["default"] = _default;