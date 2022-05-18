"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _hapi = _interopRequireDefault(require("@hapi/hapi"));

var _socket = _interopRequireDefault(require("socket.io"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
* Please use socketLogger for logging in this file try to abstain from console
* levels of logging:
* - TRACE - ‘blue’
* - DEBUG - ‘cyan’
* - INFO - ‘green’
* - WARN - ‘yellow’
* - ERROR - ‘red’
* - FATAL - ‘magenta’
*/
var SocketManager = /*#__PURE__*/_createClass(function SocketManager() {
  _classCallCheck(this, SocketManager);

  this.connectSocket = function (server) {
    var io = (0, _socket["default"])().listen(server.listener);
    socketLogger.info("socket server started");
    io.on('connection', function (socket) {
      socketLogger.info("connection established: ", socket.id);
      socket.emit('message', {
        message: {
          type: 'connection',
          statusCode: 200,
          statusMessage: 'WELCOME TO ',
          data: ""
        }
      });
    });
  };
});

var instance = new SocketManager();
var _default = instance;
exports["default"] = _default;