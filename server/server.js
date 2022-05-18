"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.startMyServer = void 0;

var _helpers = _interopRequireDefault(require("./helpers"));

var _socketManager = _interopRequireDefault(require("../lib/socketManager"));

var _ssoManager = _interopRequireDefault(require("../lib/ssoManager"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/**
 * @author Sanchit Dang
 * @description Initilize HAPI Server
 */
var initServer = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var server;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            //Create Server
            server = _helpers["default"].createServer(); //Register All Plugins

            _context.next = 3;
            return _helpers["default"].registerPlugins(server);

          case 3:
            //add views
            _helpers["default"].addViews(server); //Default Routes


            _helpers["default"].setDefaultRoute(server);

            _ssoManager["default"].createRoute(server); // Add routes to Swagger documentation


            _helpers["default"].addSwaggerRoutes(server); // Bootstrap Application


            _helpers["default"].bootstrap();

            _socketManager["default"].connectSocket(server);

            _helpers["default"].attachLoggerOnEvents(server); // Start Server


            _helpers["default"].startServer(server);

          case 11:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function initServer() {
    return _ref.apply(this, arguments);
  };
}();
/**
 * @author Sanchit Dang
 * @description Start HAPI Server
 */


var startMyServer = function startMyServer() {
  _helpers["default"].configureLog4js();

  _helpers["default"].connectMongoDB(); // Global variable to get app root folder path


  _helpers["default"].setGlobalAppRoot();

  process.on("unhandledRejection", function (err) {
    appLogger.fatal(err);
    process.exit(1);
  });
  initServer();
};

exports.startMyServer = startMyServer;