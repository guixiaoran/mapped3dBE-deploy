"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.name = void 0;
exports.register = register;

var _hapiSwagger = _interopRequireDefault(require("hapi-swagger"));

require("dotenv/config");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var swaggerOptions = {
  pathPrefixSize: 2,
  info: {
    'title': "".concat(process.env.APP_NAME, " Backend"),
    'description': "".concat(process.env.APP_NAME, " Backend APIs."),
    'version': "".concat(process.env.npm_package_version)
  },
  documentationPath: "/swagger",
  securityDefinitions: {
    'user': {
      type: 'apiKey',
      // apiKey is defined by the Swagger spec
      name: 'Authorization',
      // the name of the query parameter / header
      "in": 'header' // how the key is passed

    },
    'admin': {
      type: 'apiKey',
      // apiKey is defined by the Swagger spec
      name: 'Authorization',
      // the name of the query parameter / header
      "in": 'header' // how the key is passed

    }
  }
};

function register(server, options) {
  server.register({
    plugin: _hapiSwagger["default"],
    options: swaggerOptions
  }, {}, function (err) {
    if (err) server.log(['error'], 'hapi-swagger load error: ' + err);else server.log(['info'], 'hapi-swagger interface loaded');
  });
}

var name = 'swagger-plugin';
exports.name = name;