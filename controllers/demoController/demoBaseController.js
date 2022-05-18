"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

/**
 * Please use appLogger for logging in this file try to abstain from console
 * levels of logging:
 * - TRACE - ‘blue’
 * - DEBUG - ‘cyan’
 * - INFO - ‘green’
 * - WARN - ‘yellow’
 * - ERROR - ‘red’
 * - FATAL - ‘magenta’
 */

/**
 * 
 * @param {Object} payload 
 * @param {String} payload.message 
 * @param {Function} callback 
 */
var demoFunction = function demoFunction(payload, callback) {
  appLogger.info(payload.message);
  return callback(null, payload);
};

var _default = {
  demoFunction: demoFunction
};
exports["default"] = _default;