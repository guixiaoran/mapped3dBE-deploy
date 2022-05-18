"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

require("dotenv/config");

var mongo = {
  URI: process.env.MONGO_URI || "mongodb://localhost/Mapped3D",
  //URI: process.env.MONGO_URI || "mongodb://"+process.env.MONGO_USER+":"+process.env.MONGO_PASS+"@localhost/"+process.env.MONGO_DBNAME_DEV,
  port: 27017
};
var _default = {
  mongo: mongo
};
exports["default"] = _default;