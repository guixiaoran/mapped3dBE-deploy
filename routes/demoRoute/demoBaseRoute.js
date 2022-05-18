"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _universalFunctions = _interopRequireDefault(require("../../utils/universalFunctions"));

var _joi = _interopRequireDefault(require("joi"));

var _controllers = _interopRequireDefault(require("../../controllers"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Config = _universalFunctions["default"].CONFIG;
var demoApi = {
  method: "POST",
  path: "/api/demo/demoApi",
  options: {
    description: "demo api",
    tags: ["api", "demo"],
    handler: function handler(request, h) {
      var payloadData = request.payload;
      return new Promise(function (resolve, reject) {
        _controllers["default"].DemoBaseController.demoFunction(payloadData, function (err, data) {
          if (err) reject(_universalFunctions["default"].sendError(err));else resolve(_universalFunctions["default"].sendSuccess(Config.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, data));
        });
      });
    },
    validate: {
      payload: _joi["default"].object({
        message: _joi["default"].string().required()
      }).label("Demo Model"),
      failAction: _universalFunctions["default"].failActionFunction
    },
    plugins: {
      "hapi-swagger": {
        responseMessages: _universalFunctions["default"].CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
};
var DemoBaseRoute = [demoApi];
var _default = DemoBaseRoute;
exports["default"] = _default;