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


var createEnvironment = function createEnvironment(userData, payloadData, callback) {
  var environmentData;
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
    createEnvironment: function createEnvironment(cb) {
      var environmentToSave = {
        creatorID: userFound._id,
        environmentName: payloadData.environmentName,
        environmentCreator: userFound.firstName + userFound.lastName,
        panorama: payloadData.panorama,
        preset: payloadData.preset,
        video: payloadData.video,
        floorColor: payloadData.floorColor,
        skyColor: payloadData.skyColor,
        skyUrl: payloadData.skyUrl // vrObjects: payloadData.vrObjects,

      };
      console.log({
        environmentToSave: environmentToSave
      });

      _services["default"].EnvironmentService.createRecord(environmentToSave, function (err, data) {
        if (err) return cb(err);
        if ((data === null || data === void 0 ? void 0 : data.length) === 0) return cb(ERROR.DEFAULT);
        environmentData = data;
        console.log({
          data: data
        });
        return cb();
      });
    },
    // initialize object collection
    createLocalObject: function createLocalObject(cb) {
      _services["default"].LocalObjectService.createRecord({
        environmentId: environmentData._id
      }, function (err) {
        if (err) return cb(err);
        return cb();
      });
    }
  };

  _async["default"].series(task, function (err) {
    if (err) return callback(err);else return callback(null, {
      environmentData: environmentData
    });
  });
};

var getEnvironments = function getEnvironments(userData, callback) {
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
      creatorID: userFound._id
    };
    var projection = {
      accessToken: 0,
      OTPCode: 0,
      code: 0,
      codeUpdatedAt: 0,
      registrationDate: 0
    };

    _services["default"].EnvironmentService.getRecord(criteria, projection, {}, function (err, data) {
      console.log("Environments data---->", {
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

var getEnvironmentsTourist = function getEnvironmentsTourist(callback) {
  var cardList = [];

  _async["default"].series([function (cb) {
    var criteria = {};
    var projection = {
      accessToken: 0,
      OTPCode: 0,
      code: 0,
      codeUpdatedAt: 0,
      registrationDate: 0
    };

    _services["default"].EnvironmentService.getRecord(criteria, projection, {}, function (err, data) {
      console.log("Environments data---->", data);
      if (err) cb(err);else {
        cardList = data.map(function (element) {
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
 */


var getEnvironmentByIdTourist = function getEnvironmentByIdTourist(env_id, callback) {
  var cardList = [];
  var localObjects;

  _async["default"].series([function (cb) {
    var query = {
      environmentId: env_id
    };
    var projection = {
      userId: 0,
      __v: 0,
      _id: 0
    };
    var populate = {
      path: "localObjectItem",
      select: {
        _id: 1,
        environmentId: 1,
        objectName: 1,
        position: 1,
        scale: 1,
        rotation: 1,
        url: 1
      }
    };

    _services["default"].LocalObjectService.getPopulatedRecords(query, projection, populate, function (err, data) {
      if (err) return cb(err);
      localObjects = data && data[0].localObjectItem || null;
      cb();
    });
  }, function (cb) {
    var criteria = {
      _id: env_id
    };
    var projection = {
      accessToken: 0,
      OTPCode: 0,
      code: 0,
      codeUpdatedAt: 0,
      registrationDate: 0
    };

    _services["default"].EnvironmentService.getRecord(criteria, projection, {}, function (err, data) {
      console.log("Environment data---->", {
        data: data
      });
      if (err) cb(err);else {
        cardList = data.map(function (element) {
          return element;
        });
        cb();
      }
    });
  }], function (err, result) {
    if (err) callback(err);else callback(null, {
      data: cardList,
      localObjects: localObjects
    });
  });
};

var getEnvironmentById = function getEnvironmentById(userData, env_id, callback) {
  var cardList = [];
  var userFound;
  var localObjects;

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
    var query = {
      environmentId: env_id
    };
    var projection = {
      userId: 0,
      __v: 0,
      _id: 0
    };
    var populate = {
      path: "localObjectItem",
      select: {
        _id: 1,
        environmentId: 1,
        objectName: 1,
        position: 1,
        scale: 1,
        rotation: 1,
        url: 1
      }
    };

    _services["default"].LocalObjectService.getPopulatedRecords(query, projection, populate, function (err, data) {
      if (err) return cb(err);
      localObjects = data && data[0].localObjectItem || null;
      cb();
    });
  }, function (cb) {
    var criteria = {
      _id: env_id
    };
    var projection = {
      accessToken: 0,
      OTPCode: 0,
      code: 0,
      codeUpdatedAt: 0,
      registrationDate: 0
    };

    _services["default"].EnvironmentService.getRecord(criteria, projection, {}, function (err, data) {
      console.log("Environment data---->", {
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
      data: cardList,
      localObjects: localObjects
    });
  });
};

var deleteEnvironment = function deleteEnvironment(userData, payloadData, callback) {
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
    _services["default"].EnvironmentService.deleteRecord({
      _id: payloadData._id
    }, function (err, data) {
      if (err) cb(err);else cb();
    });
  }], function (err, result) {
    if (err) return callback(err);else return callback(null, {
      data: news
    });
  });
};
/**
 *
 * @param {Object} userData
 * @param {String} userData.userId the user Id that is provided from the access token
 * @param {Object} payloadData
 * @param {String} payloadData.cardId the id of the card to be update
 * @param {String} payloadData.title the title of the card to be update
 * @param {String} payloadData.description ...
 * @param {String} payloadData.url ...
 * @param {Function} callback
 */


var updateEnvironment = function updateEnvironment(userData, payloadData, callback) {
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
    var environmentToSave = {
      creatorID: userFound._id,
      environmentName: payloadData.environmentName,
      environmentCreator: userFound.firstName + userFound.lastName,
      panorama: payloadData.panorama,
      preset: payloadData.preset,
      video: payloadData.video,
      floorColor: payloadData.floorColor,
      skyColor: payloadData.skyColor,
      skyUrl: payloadData.skyUrl
    }; // console.log({ environmentToSave });

    console.log("payloadData._id", payloadData._id);

    _services["default"].EnvironmentService.updateRecord({
      _id: payloadData._id
    }, environmentToSave, {}, function (err, data) {
      if (err) cb(err);else cb();
    });
  }], function (err, result) {
    if (err) return callback(err);else return callback(null);
  });
};

var _default = {
  createEnvironment: createEnvironment,
  getEnvironments: getEnvironments,
  getEnvironmentById: getEnvironmentById,
  deleteEnvironment: deleteEnvironment,
  updateEnvironment: updateEnvironment,
  getEnvironmentsTourist: getEnvironmentsTourist,
  getEnvironmentByIdTourist: getEnvironmentByIdTourist
}; // const getServiceById = (userData, _id, callback) => {
//   let cardList = [];
//   let userFound;
//   async.series(
//     [
//       function (cb) {
//         const criteria = {
//           _id: userData.userId,
//         };
//         Service.UserService.getRecord(
//           criteria,
//           { password: 0 },
//           {},
//           function (err, data) {
//             if (err) cb(err);
//             else {
//               if (data.length == 0) cb(ERROR.INCORRECT_ACCESSTOKEN);
//               else {
//                 userFound = (data && data[0]) || null;
//                 if (userFound.isBlocked == true) cb(ERROR.ACCOUNT_BLOCKED);
//                 else cb();
//               }
//             }
//           }
//         );
//       },
//       function (cb) {
//         const criteria = { _id: _id };
//         const projection = {
//           accessToken: 0,
//           OTPCode: 0,
//           code: 0,
//           codeUpdatedAt: 0,
//           registrationDate: 0,
//         };
//         Service.ServiceService.getRecord(
//           criteria,
//           projection,
//           {},
//           function (err, data) {
//             console.log(`Service data---->`, { data });
//             if (err) cb(err);
//             else {
//               cardList = data.map((element) => {
//                 // return UniversalFunctions.processUserData(element);
//                 return element;
//               });
//               cb();
//             }
//           }
//         );
//       },
//     ],
//     function (err, result) {
//       if (err) callback(err);
//       else callback(null, { data: cardList });
//     }
//   );
// };
// const deleteCard = (userData, payloadData, callback) => {
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

exports["default"] = _default;