"use strict";

var _server = require("./server/server");

require("dotenv/config");

// Read .env file.
process.env.NODE_ENV = process.env.NODE_ENV || 'DEVELOPMENT';
/**
 * This is required in all environments since this is what mongoose uses to establish connection to a MongoDB instance.
 */

(0, _server.startMyServer)();