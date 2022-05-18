"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _services = _interopRequireDefault(require("../../services"));

var _async = _interopRequireDefault(require("async"));

var _universalFunctions = _interopRequireDefault(require("../../utils/universalFunctions"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var ERROR = _universalFunctions["default"].CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR;

var _ = require("underscore");
/**
 *
 * @param {Object} userData
 * @param {Object} payloadData
 * @param {url} payloadData.url  in url format
 * @param {Function} callback string
 * @param {name} payloadData.name string
 * @param {description} payloadData.description string
 * @param {cost} payloadData.cost string
 */


var createLocalObjectItem = function createLocalObjectItem(userData, payloadData, callback) {
  var objectId;
  var localObjectData;
  var userFound; // custometData

  console.log(payloadData);
  var task = {
    validateUser: function validateUser(cb) {
      var criteria = {
        _id: userData.userId
      };

      _services["default"].UserService.getRecord(criteria, {}, {}, function (err, data) {
        if (err) return cb(err);
        if (data.length == 0) return cb(ERROR.INCORRECT_ACCESSTOKEN);
        userFound = data && data[0] || null;
        cb();
      });
    },
    createObject: function createObject(cb) {
      var localObjectItemToSave = {
        // CreatorID: userFound._id,
        environmentId: payloadData.environmentId,
        objectName: payloadData.objectName,
        position: payloadData.position,
        scale: payloadData.scale,
        rotation: payloadData.rotation,
        url: payloadData.url
      };
      console.log("localObjectItemToSave", {
        localObjectItemToSave: localObjectItemToSave
      });

      _services["default"].LocalObjectItemService.createRecord(localObjectItemToSave, function (err, data) {
        if (err) return cb(err);
        if ((data === null || data === void 0 ? void 0 : data.length) === 0) return cb(ERROR.DEFAULT);
        localObjectData = data;
        objectId = data && data._id || null;
        console.log({
          data: data,
          objectId: objectId
        });
        return cb();
      });
    },
    addToLocalObjectList: function addToLocalObjectList(cb) {
      var criteria = {
        environmentId: payloadData.environmentId
      };
      var dataToAdd = {
        $addToSet: {
          localObjectItem: objectId
        }
      };

      _services["default"].LocalObjectService.updateRecord(criteria, dataToAdd, function (err) {
        if (err) return cb(err);
        return cb();
      });
    },
    changeFirstLogin: function changeFirstLogin(cb) {
      if (!userFound.firstLogin) return cb();
      var criteria = {
        _id: userFound._id
      };
      var dataToUpdate = {
        firstLogin: false
      };

      _services["default"].UserService.updateRecord(criteria, dataToUpdate, {}, function (err) {
        if (err) return cb(err);
        return cb();
      });
    }
  };

  _async["default"].series(task, function (err) {
    if (err) return callback(err);else return callback(null, {
      localObjectData: localObjectData
    });
  });
};

var getLocalObjects = function getLocalObjects(userData, callback) {
  var cardList = [];
  var userFound;

  _async["default"].series([function (cb) {
    var criteria = {
      _id: userData.userId
    };

    _services["default"].UserService.getRecord(criteria, {
      password: 0
    }, {}, function (err, data) {
      if (err) cb(err);else {
        if (data.length == 0) cb(ERROR.INCORRECT_ACCESSTOKEN);else {
          userFound = data && data[0] || null;
          if (userFound.isBlocked == true) cb(ERROR.ACCOUNT_BLOCKED);else cb();
        }
      }
    });
  }, function (cb) {
    var criteria = {};
    var projection = {
      accessToken: 0,
      OTPCode: 0,
      code: 0,
      codeUpdatedAt: 0,
      registrationDate: 0
    };

    _services["default"].LocalObjectService.getRecord(criteria, projection, {}, function (err, data) {
      console.log("LocalObjects data---->", {
        data: data
      });
      if (err) cb(err);else {
        cardList = data.map(function (element) {
          // return UniversalFunctions.processUserData(element);
          return element;
        });
        cb();
      }
    });
  }], function (err, result) {
    if (err) callback(err);else callback(null, {
      data: cardList
    });
  });
};

var getLocalObjectById = function getLocalObjectById(userData, _id, callback) {
  var cardList = [];
  var userFound;

  _async["default"].series([function (cb) {
    var criteria = {
      _id: userData.userId
    };

    _services["default"].UserService.getRecord(criteria, {
      password: 0
    }, {}, function (err, data) {
      if (err) cb(err);else {
        if (data.length == 0) cb(ERROR.INCORRECT_ACCESSTOKEN);else {
          userFound = data && data[0] || null;
          if (userFound.isBlocked == true) cb(ERROR.ACCOUNT_BLOCKED);else cb();
        }
      }
    });
  }, function (cb) {
    var criteria = {
      _id: _id
    };
    var projection = {
      accessToken: 0,
      OTPCode: 0,
      code: 0,
      codeUpdatedAt: 0,
      registrationDate: 0
    };

    _services["default"].LocalObjectService.getRecord(criteria, projection, {}, function (err, data) {
      console.log("LocalObject data---->", {
        data: data
      });
      if (err) cb(err);else {
        cardList = data.map(function (element) {
          // return UniversalFunctions.processUserData(element);
          return element;
        });
        cb();
      }
    });
  }], function (err, result) {
    if (err) callback(err);else callback(null, {
      data: cardList
    });
  });
};

var deleteLocalObjectItem = function deleteLocalObjectItem(userData, payloadData, callback) {
  var news;
  var userFound;

  _async["default"].series([function (cb) {
    var criteria = {
      _id: userData.userId
    };

    _services["default"].UserService.getRecord(criteria, {}, {}, function (err, data) {
      if (err) cb(err);else {
        if (data.length == 0) cb(ERROR.INCORRECT_ACCESSTOKEN);else {
          userFound = data && data[0] || null;
          if (userFound.isBlocked == true) cb(ERROR.ACCOUNT_BLOCKED);else cb();
        }
      }
    });
  }, function (cb) {
    // console.log("payloadData._id:   ", payloadData._id);
    _services["default"].LocalObjectItemService.deleteRecord({
      _id: payloadData._id
    }, function (err, data) {
      if (err) cb(err);else cb();
    });
  }], function (err, result) {
    if (err) return callback(err);else return callback(null, {
      data: news
    });
  });
}; // /**
//  *
//  * @param {Object} userData
//  * @param {String} userData.userId the user Id that is provided from the access token
//  * @param {Object} payloadData
//  * @param {String} payloadData.cardId the id of the card to be update
//  * @param {String} payloadData.title the title of the card to be update
//  * @param {String} payloadData.description ...
//  * @param {String} payloadData.url ...
//  * @param {Function} callback
//  */


var updateLocalObjectItem = function updateLocalObjectItem(userData, payloadData, callback) {
  var userFound;

  _async["default"].series([function (cb) {
    var criteria = {
      _id: userData.userId
    };

    _services["default"].UserService.getRecord(criteria, {}, {}, function (err, data) {
      if (err) cb(err);else {
        if (data.length == 0) cb(ERROR.INCORRECT_ACCESSTOKEN);else {
          userFound = data && data[0] || null;
          if (userFound.isBlocked == true) cb(ERROR.ACCOUNT_BLOCKED);else cb();
        }
      }
    });
  }, function (cb) {
    var localObjectToSave = {
      // CreatorID: userFound._id,
      environmentId: payloadData.environmentId,
      objectName: payloadData.objectName,
      position: payloadData.position,
      scale: payloadData.scale,
      rotation: payloadData.rotation,
      url: payloadData.url
    };
    console.log({
      localObjectToSave: localObjectToSave
    });

    _services["default"].LocalObjectItemService.updateRecord({
      _id: payloadData._id
    }, localObjectToSave, {}, function (err, data) {
      if (err) cb(err);else cb();
    });
  }], function (err, result) {
    if (err) return callback(err);else return callback(null);
  });
};

var _default = {
  createLocalObjectItem: createLocalObjectItem,
  getLocalObjects: getLocalObjects,
  getLocalObjectById: getLocalObjectById,
  deleteLocalObjectItem: deleteLocalObjectItem,
  updateLocalObjectItem: updateLocalObjectItem
};
exports["default"] = _default;