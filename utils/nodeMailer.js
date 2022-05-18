"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _nodemailer = _interopRequireDefault(require("nodemailer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var transporter = _nodemailer["default"].createTransport({
  service: 'gmail',
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASSWORD
  }
});
/**
 * 
 * @param {String} receiverEmail the email of the recipient
 * @param {Object} emailDetails The details included in the email, could be attachments, ical, etc.
 * @param {Function} callback 
 */


var sendEmailWithComplexDetails = function sendEmailWithComplexDetails(receiverEmail, emailDetails, callback) {
  var mailDetails = _objectSpread({
    from: process.env.NODEMAILER_USER,
    to: receiverEmail
  }, emailDetails);

  transporter.sendMail(mailDetails, function (err) {
    if (err) return callback(err);
    return callback();
  });
};
/**
 * 
 * @param {String} receiverEmail the email of the recipient
 * @param {Number} textContent the generated random number
 * @param {Function} callback 
 */


var sendEmailWithTextContent = function sendEmailWithTextContent(receiverEmail, textContent, callback) {
  var mailDetails = {
    from: process.env.NODEMAILER_USER,
    to: receiverEmail,
    text: textContent
  };
  transporter.sendMail(mailDetails, function (err) {
    if (err) return callback(err);
    return callback();
  });
};

var _default = {
  sendEmailWithComplexDetails: sendEmailWithComplexDetails,
  sendEmailWithTextContent: sendEmailWithTextContent
};
exports["default"] = _default;