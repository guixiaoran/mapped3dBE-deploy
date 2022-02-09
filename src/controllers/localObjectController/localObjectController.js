import Service from "../../services";
import async from "async";
import UniversalFunctions from "../../utils/universalFunctions";
const ERROR = UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR;
const _ = require("underscore");

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
const createLocalObjectItem = (userData, payloadData, callback) => {
  let objectId;
  let localObjectData;
  let userFound; // custometData
  console.log(payloadData);

  const task = {
    validateUser: (cb) => {
      const criteria = {
        _id: userData.userId,
      };
      Service.UserService.getRecord(criteria, {}, {}, function (err, data) {
        if (err) return cb(err);
        if (data.length == 0) return cb(ERROR.INCORRECT_ACCESSTOKEN);
        userFound = (data && data[0]) || null;
        cb();
      });
    },
    createObject: (cb) => {
      let localObjectItemToSave = {
        // CreatorID: userFound._id,
        environmentId: payloadData.environmentId,
        objectName: payloadData.objectName,
        position: payloadData.position,
        scale: payloadData.scale,
        rotation: payloadData.rotation,
        url: payloadData.url,
      };
      console.log("localObjectItemToSave", { localObjectItemToSave });
      Service.LocalObjectItemService.createRecord(
        localObjectItemToSave,
        function (err, data) {
          if (err) return cb(err);
          if (data?.length === 0) return cb(ERROR.DEFAULT);
          localObjectData = data;
          objectId = (data && data._id) || null;
          console.log({ data, objectId });
          return cb();
        }
      );
    },
    addToLocalObjectList: (cb) => {
      const criteria = {
        environmentId: payloadData.environmentId,
      };
      const dataToAdd = {
        $addToSet: {
          localObjectItem: objectId,
        },
      };
      Service.LocalObjectService.updateRecord(
        criteria,
        dataToAdd,
        function (err) {
          if (err) return cb(err);
          return cb();
        }
      );
    },
    changeFirstLogin: (cb) => {
      if (!userFound.firstLogin) return cb();
      const criteria = {
        _id: userFound._id,
      };
      const dataToUpdate = {
        firstLogin: false,
      };
      Service.UserService.updateRecord(
        criteria,
        dataToUpdate,
        {},
        function (err) {
          if (err) return cb(err);
          return cb();
        }
      );
    },
  };
  async.series(task, function (err) {
    if (err) return callback(err);
    else return callback(null, { localObjectData });
  });
};

const getLocalObjects = (userData, callback) => {
  let cardList = [];
  let userFound;
  async.series(
    [
      function (cb) {
        const criteria = {
          _id: userData.userId,
        };
        Service.UserService.getRecord(
          criteria,
          { password: 0 },
          {},
          function (err, data) {
            if (err) cb(err);
            else {
              if (data.length == 0) cb(ERROR.INCORRECT_ACCESSTOKEN);
              else {
                userFound = (data && data[0]) || null;
                if (userFound.isBlocked == true) cb(ERROR.ACCOUNT_BLOCKED);
                else cb();
              }
            }
          }
        );
      },
      function (cb) {
        const criteria = {};
        const projection = {
          accessToken: 0,
          OTPCode: 0,
          code: 0,
          codeUpdatedAt: 0,
          registrationDate: 0,
        };
        Service.LocalObjectService.getRecord(
          criteria,
          projection,
          {},

          function (err, data) {
            console.log(`LocalObjects data---->`, { data });
            if (err) cb(err);
            else {
              cardList = data.map((element) => {
                // return UniversalFunctions.processUserData(element);
                return element;
              });
              cb();
            }
          }
        );
      },
    ],
    function (err, result) {
      if (err) callback(err);
      else callback(null, { data: cardList });
    }
  );
};

const getLocalObjectById = (userData, _id, callback) => {
  let cardList = [];
  let userFound;
  async.series(
    [
      function (cb) {
        const criteria = {
          _id: userData.userId,
        };
        Service.UserService.getRecord(
          criteria,
          { password: 0 },
          {},
          function (err, data) {
            if (err) cb(err);
            else {
              if (data.length == 0) cb(ERROR.INCORRECT_ACCESSTOKEN);
              else {
                userFound = (data && data[0]) || null;
                if (userFound.isBlocked == true) cb(ERROR.ACCOUNT_BLOCKED);
                else cb();
              }
            }
          }
        );
      },
      function (cb) {
        const criteria = { _id: _id };
        const projection = {
          accessToken: 0,
          OTPCode: 0,
          code: 0,
          codeUpdatedAt: 0,
          registrationDate: 0,
        };
        Service.LocalObjectService.getRecord(
          criteria,
          projection,
          {},

          function (err, data) {
            console.log(`LocalObject data---->`, { data });
            if (err) cb(err);
            else {
              cardList = data.map((element) => {
                // return UniversalFunctions.processUserData(element);
                return element;
              });
              cb();
            }
          }
        );
      },
    ],
    function (err, result) {
      if (err) callback(err);
      else callback(null, { data: cardList });
    }
  );
};

const deleteLocalObject = (userData, payloadData, callback) => {
  let news;
  let userFound;
  async.series(
    [
      function (cb) {
        var criteria = {
          _id: userData.userId,
        };
        Service.UserService.getRecord(criteria, {}, {}, function (err, data) {
          if (err) cb(err);
          else {
            if (data.length == 0) cb(ERROR.INCORRECT_ACCESSTOKEN);
            else {
              userFound = (data && data[0]) || null;
              if (userFound.isBlocked == true) cb(ERROR.ACCOUNT_BLOCKED);
              else cb();
            }
          }
        });
      },
      function (cb) {
        Service.LocalObjectService.deleteRecord(
          { _id: payloadData._id },
          function (err, data) {
            if (err) cb(err);
            else cb();
          }
        );
      },
    ],
    function (err, result) {
      if (err) return callback(err);
      else return callback(null, { data: news });
    }
  );
};

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
const updateLocalObjectItem = (userData, payloadData, callback) => {
  let userFound;
  async.series(
    [
      function (cb) {
        var criteria = {
          _id: userData.userId,
        };
        Service.UserService.getRecord(criteria, {}, {}, function (err, data) {
          if (err) cb(err);
          else {
            if (data.length == 0) cb(ERROR.INCORRECT_ACCESSTOKEN);
            else {
              userFound = (data && data[0]) || null;
              if (userFound.isBlocked == true) cb(ERROR.ACCOUNT_BLOCKED);
              else cb();
            }
          }
        });
      },

      function (cb) {
        let localObjectToSave = {
          // CreatorID: userFound._id,
          environmentId: payloadData.environmentId,
          objectName: payloadData.objectName,
          position: payloadData.position,
          scale: payloadData.scale,
          rotation: payloadData.rotation,
          // url: payloadData.url,
        };
        console.log({ localObjectToSave });
        Service.LocalObjectItemService.updateRecord(
          { _id: payloadData.objectId },
          localObjectToSave,
          {},
          function (err, data) {
            if (err) cb(err);
            else cb();
          }
        );
      },
    ],
    function (err, result) {
      if (err) return callback(err);
      else return callback(null);
    }
  );
};

export default {
  createLocalObjectItem: createLocalObjectItem,
  getLocalObjects: getLocalObjects,
  getLocalObjectById: getLocalObjectById,
  deleteLocalObject: deleteLocalObject,
  updateLocalObjectItem: updateLocalObjectItem,
};
