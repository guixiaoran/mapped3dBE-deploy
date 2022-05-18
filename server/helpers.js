"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

require("dotenv/config");

var _hapi = _interopRequireDefault(require("@hapi/hapi"));

var _joi = _interopRequireDefault(require("joi"));

var _log4js = _interopRequireDefault(require("log4js"));

var _plugins = _interopRequireDefault(require("../plugins"));

var handlebars = _interopRequireWildcard(require("handlebars"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _index = _interopRequireDefault(require("../config/index"));

var _path = _interopRequireDefault(require("path"));

var _bootStrap = _interopRequireDefault(require("../utils/bootStrap"));

var _routes = _interopRequireDefault(require("../routes"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

/**
 * @description Helper file for the server
 */
var ServerHelper = /*#__PURE__*/function () {
  function ServerHelper() {
    _classCallCheck(this, ServerHelper);

    this.configureLog4js = function () {
      // Configuration for log4js.
      _log4js["default"].configure({
        appenders: {
          App: {
            type: 'console'
          },
          Upload_Manager: {
            type: 'console'
          },
          Socket_Manager: {
            type: 'console'
          },
          Token_Manager: {
            type: 'console'
          },
          Mongo_Manager: {
            type: 'console'
          }
        },
        categories: {
          "default": {
            appenders: ['App'],
            level: 'trace'
          },
          Upload_Manager: {
            appenders: ['Upload_Manager'],
            level: 'trace'
          },
          Socket_Manager: {
            appenders: ['Socket_Manager'],
            level: 'trace'
          },
          Token_Manager: {
            appenders: ['Token_Manager'],
            level: 'trace'
          },
          Mongo_Manager: {
            appenders: ['Mongo_Manager'],
            level: 'trace'
          }
        }
      }); // Global Logger variables for logging


      global.appLogger = _log4js["default"].getLogger('App');
      global.uploadLogger = _log4js["default"].getLogger('Upload_Manager');
      global.socketLogger = _log4js["default"].getLogger('Socket_Manager');
      global.tokenLogger = _log4js["default"].getLogger('Token_Manager');
      global.mongoLogger = _log4js["default"].getLogger('Mongo_Manager');
    };
  }

  _createClass(ServerHelper, [{
    key: "setGlobalAppRoot",
    value: function setGlobalAppRoot() {
      global.appRoot = _path["default"].resolve(__dirname);
    }
  }, {
    key: "bootstrap",
    value: function bootstrap() {
      _bootStrap["default"].bootstrapAdmin(function (err) {
        if (err) appLogger.debug(err);
      });
    }
    /**
     * 
     * @param {Hapi.Server} server 
     */

  }, {
    key: "addSwaggerRoutes",
    value: function addSwaggerRoutes(server) {
      server.route(_routes["default"]);
    }
    /**
     * 
     * @param {Hapi.Server} server 
     */

  }, {
    key: "attachLoggerOnEvents",
    value: function attachLoggerOnEvents(server) {
      server.events.on("response", function (request) {
        appLogger.info("".concat(request.info.remoteAddress, " : ").concat(request.method.toUpperCase(), " ").concat(request.url.pathname, " --> ").concat(request.response.statusCode));
        appLogger.info("Request payload:", request.payload);
      });
    }
    /**
     * @returns {Hapi.Server} A Hapi Server
     */

  }, {
    key: "createServer",
    value: function createServer() {
      var server = new _hapi["default"].Server({
        app: {
          name: process.env.APP_NAME || "default"
        },
        port: process.env.HAPI_PORT || 8000,
        routes: {
          cors: true
        }
      });
      server.validator(_joi["default"]);
      return server;
    }
    /**
     * @author Sanchit Dang
     * @description Adds Views to the server
     * @param {Hapi.Server} server 
     */

  }, {
    key: "addViews",
    value: function addViews(server) {
      server.views({
        engines: {
          html: handlebars
        },
        relativeTo: __dirname,
        path: "../../views"
      });
    }
    /**
     * @author Sanchit Dang
     * @description sets default route for the server
     * @param {Hapi.Server} server HAPI Server
     * @param {String} defaultRoute Optional - default route
     */

  }, {
    key: "setDefaultRoute",
    value: function setDefaultRoute(server, defaultRoute) {
      if (defaultRoute === undefined) defaultRoute = "/";
      server.route({
        method: "GET",
        path: defaultRoute,
        handler: function handler(req, res) {
          return res.view("welcome");
        }
      });
    }
    /**
     * 
     * @param {Hapi.Server} server HAPI Server
     */

  }, {
    key: "registerPlugins",
    value: function () {
      var _registerPlugins = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(server) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return server.register(_plugins["default"], {}, function (err) {
                  if (err) server.log(["error"], "Error while loading plugins : " + err);else server.log(["info"], "Plugins Loaded");
                });

              case 2:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function registerPlugins(_x) {
        return _registerPlugins.apply(this, arguments);
      }

      return registerPlugins;
    }()
  }, {
    key: "startServer",
    value:
    /**
     * 
     * @param {Hapi.Server} server 
     */
    function () {
      var _startServer = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(server) {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                _context2.next = 3;
                return server.start();

              case 3:
                appLogger.info("Server running on %s", server.info.uri);
                _context2.next = 9;
                break;

              case 6:
                _context2.prev = 6;
                _context2.t0 = _context2["catch"](0);
                appLogger.fatal(_context2.t0);

              case 9:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, null, [[0, 6]]);
      }));

      function startServer(_x2) {
        return _startServer.apply(this, arguments);
      }

      return startServer;
    }()
  }, {
    key: "connectMongoDB",
    value: function connectMongoDB() {
      var mongooseOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true
      };

      _mongoose["default"].set('useCreateIndex', true);

      _mongoose["default"].set('useFindAndModify', false);

      _mongoose["default"].connect(_index["default"].DB_CONFIG.mongo.URI, mongooseOptions, function (err) {
        if (err) {
          mongoLogger.debug("DB Error: ", err);
          process.exit(1);
        } else mongoLogger.info('MongoDB Connected');
      });
    }
  }]);

  return ServerHelper;
}();

var instance = new ServerHelper();
var _default = instance;
exports["default"] = _default;