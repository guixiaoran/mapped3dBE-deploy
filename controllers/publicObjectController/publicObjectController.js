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
//Public


var createPublicObject = function createPublicObject(userData, payloadData, callback) {
  var publicObjectData;
  var userFound;
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
      var publicObjectToSave = {
        creatorID: userFound._id,
        objectType: payloadData.objectType,
        objectName: payloadData.objectName,
        url: payloadData.url
      };
      console.log("publicObjectToSave", {
        publicObjectToSave: publicObjectToSave
      });

      _services["default"].PublicObjectService.createRecord(publicObjectToSave, function (err, data) {
        if (err) return cb(err);
        if ((data === null || data === void 0 ? void 0 : data.length) === 0) return cb(ERROR.DEFAULT);
        publicObjectData = data;
        console.log({
          data: data
        });
        return cb();
      });
    }
  };

  _async["default"].series(task, function (err) {
    if (err) return callback(err);else return callback(null, {
      publicObjectData: publicObjectData
    });
  });
};

var getPublicObjects = function getPublicObjects(userData, callback) {
  var cardList = [];
  var userFound, creatorID;

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
      creatorID: userFound._id
    };
    var projection = {
      accessToken: 0,
      OTPCode: 0,
      code: 0,
      codeUpdatedAt: 0,
      registrationDate: 0
    };

    _services["default"].PublicObjectService.getRecord(criteria, projection, {}, function (err, data) {
      console.log("PublicObjects data---->", {
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

var getPublicObjectById = function getPublicObjectById(userData, _id, callback) {
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

    _services["default"].PublicObjectService.getRecord(criteria, projection, {}, function (err, data) {
      console.log("PublicObject data---->", {
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
/**
 * @param {Object} userData
 * @param {url} payloadData.url  in url format
 * @param {Function} callback string
 * @param {name} payloadData.name string
 * @param {description} payloadData.description string
 * @param {requirements} payloadData.requirements string
 * @param {cost} payloadData.cost string
//  * @param {serviceId} payloadData.serviceId string
 */


var deletePublicObject = function deletePublicObject(userData, payloadData, callback) {
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
    _services["default"].PublicObjectService.deleteRecord({
      _id: payloadData._id
    }, function (err, data) {
      if (err) cb(err);else cb();
    });
  }], function (err, result) {
    if (err) return callback(err);else return callback(null, {
      data: news
    });
  });
}; // const deleteCard = (userData, payloadData, callback) => {
//   let news;
//   let userFound;
//   async.series(
//     [
//       function (cb) {
//         var criteria = {
//           _id: userData.userId,
//         };
//         Service.UserService.getRecord(criteria, {}, {}, function (err, data) {
//           if (err) cb(err);
//           else {
//             if (data.length == 0) cb(ERROR.INCORRECT_ACCESSTOKEN);
//             else {
//               userFound = (data && data[0]) || null;
//               if (userFound.isBlocked == true) cb(ERROR.ACCOUNT_BLOCKED);
//               else cb();
//             }
//           }
//         });
//       },
//       function (cb) {
//         Service.CardService.deleteRecord(
//           { _id: payloadData._id },
//           function (err, data) {
//             if (err) cb(err);
//             else cb();
//           }
//         );
//       },
//     ],
//     function (err, result) {
//       if (err) return callback(err);
//       else return callback(null, { data: news });
//     }
//   );
// };
// /**
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
// const updateCard = (userData, payloadData, callback) => {
//   let userFound;
//   async.series(
//     [
//       function (cb) {
//         var criteria = {
//           _id: userData.userId,
//         };
//         Service.UserService.getRecord(criteria, {}, {}, function (err, data) {
//           if (err) cb(err);
//           else {
//             if (data.length == 0) cb(ERROR.INCORRECT_ACCESSTOKEN);
//             else {
//               userFound = (data && data[0]) || null;
//               if (userFound.isBlocked == true) cb(ERROR.ACCOUNT_BLOCKED);
//               else cb();
//             }
//           }
//         });
//       },
//       function (cb) {
//         let cardToSave = {
//           title: payloadData.title,
//           description: payloadData.description,
//           url: payloadData.url,
//         };
//         console.log({ cardToSave });
//         Service.CardService.updateRecord(
//           { _id: payloadData.cardId },
//           cardToSave,
//           {},
//           function (err, data) {
//             if (err) cb(err);
//             else cb();
//           }
//         );
//       },
//     ],
//     function (err, result) {
//       if (err) return callback(err);
//       else return callback(null);
//     }
//   );
// };


var _default = {
  createPublicObject: createPublicObject,
  getPublicObjects: getPublicObjects,
  getPublicObjectById: getPublicObjectById,
  deletePublicObject: deletePublicObject // deleteCard: deleteCard,
  // updateCard: updateCard,

};
exports["default"] = _default;