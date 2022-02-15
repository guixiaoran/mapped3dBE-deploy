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
const createEnvironment = (userData, payloadData, callback) => {
  let environmentData;
  let userFound;
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
    createEnvironment: (cb) => {
      let environmentToSave = {
        creatorID: userFound._id,
        environmentName: payloadData.environmentName,
        environmentCreator: payloadData.environmentCreator,
        panorama: payloadData.panorama,
        preset: payloadData.preset,
        video: payloadData.video,
        floorColor: payloadData.floorColor,
        skyColor: payloadData.skyColor,
        skyUrl: payloadData.skyUrl,
        // vrObjects: payloadData.vrObjects,
      };
      console.log({ environmentToSave });
      Service.EnvironmentService.createRecord(
        environmentToSave,
        function (err, data) {
          if (err) return cb(err);
          if (data?.length === 0) return cb(ERROR.DEFAULT);
          environmentData = data;
          console.log({ data });
          return cb();
        }
      );
    },
    // initialize object collection
    createLocalObject: (cb) => {
      Service.LocalObjectService.createRecord(
        { environmentId: environmentData._id },
        (err) => {
          if (err) return cb(err);
          return cb();
        }
      );
    },
  };
  async.series(task, function (err) {
    if (err) return callback(err);
    else return callback(null, { environmentData });
  });
};

const getEnvironments = (userData, callback) => {
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
        const criteria = {
          creatorID: userFound._id,
        };
        const projection = {
          accessToken: 0,
          OTPCode: 0,
          code: 0,
          codeUpdatedAt: 0,
          registrationDate: 0,
        };
        Service.EnvironmentService.getRecord(
          criteria,
          projection,
          {},

          function (err, data) {
            console.log(`Environments data---->`, { data });
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

const getEnvironmentsTourist = (callback) => {
  let cardList = [];
  async.series(
    [
      function (cb) {
        const criteria = {};
        const projection = {
          accessToken: 0,
          OTPCode: 0,
          code: 0,
          codeUpdatedAt: 0,
          registrationDate: 0,
        };
        Service.EnvironmentService.getRecord(
          criteria,
          projection,
          {},
          function (err, data) {
            console.log(`Environments data---->`, data);
            if (err) cb(err);
            else {
              cardList = data.map((element) => {
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
/**
 * @param {Object} userData
 * @param {url} payloadData.url  in url format
 * @param {Function} callback string
 * @param {name} payloadData.name string
 * @param {description} payloadData.description string
 * @param {requirements} payloadData.requirements string
 * @param {cost} payloadData.cost string
 */

const getEnvironmentByIdTourist = (env_id, callback) => {
  let cardList = [];
  let localObjects;
  async.series(
    [
      (cb) => {
        const query = {
          environmentId: env_id,
        };
        const projection = {
          userId: 0,
          __v: 0,
          _id: 0,
        };
        const populate = {
          path: "localObjectItem",
          select: {
            _id: 1,
            environmentId: 1,
            objectName: 1,
            position: 1,
            scale: 1,
            rotation: 1,
            url: 1,
          },
        };
        Service.LocalObjectService.getPopulatedRecords(
          query,
          projection,
          populate,
          function (err, data) {
            if (err) return cb(err);
            localObjects = (data && data[0].localObjectItem) || null;
            cb();
          }
        );
      },
      function (cb) {
        const criteria = { _id: env_id };
        const projection = {
          accessToken: 0,
          OTPCode: 0,
          code: 0,
          codeUpdatedAt: 0,
          registrationDate: 0,
        };
        Service.EnvironmentService.getRecord(
          criteria,
          projection,
          {},

          function (err, data) {
            console.log(`Environment data---->`, { data });
            if (err) cb(err);
            else {
              cardList = data.map((element) => {
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
      else callback(null, { data: cardList, localObjects });
    }
  );
};

const getEnvironmentById = (userData, env_id, callback) => {
  let cardList = [];
  let userFound;
  let localObjects;
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
      (cb) => {
        const query = {
          environmentId: env_id,
        };
        const projection = {
          userId: 0,
          __v: 0,
          _id: 0,
        };
        const populate = {
          path: "localObjectItem",
          select: {
            _id: 1,
            environmentId: 1,
            objectName: 1,
            position: 1,
            scale: 1,
            rotation: 1,
            url: 1,
          },
        };
        Service.LocalObjectService.getPopulatedRecords(
          query,
          projection,
          populate,
          function (err, data) {
            if (err) return cb(err);
            localObjects = (data && data[0].localObjectItem) || null;
            cb();
          }
        );
      },
      function (cb) {
        const criteria = { _id: env_id };
        const projection = {
          accessToken: 0,
          OTPCode: 0,
          code: 0,
          codeUpdatedAt: 0,
          registrationDate: 0,
        };
        Service.EnvironmentService.getRecord(
          criteria,
          projection,
          {},

          function (err, data) {
            console.log(`Environment data---->`, { data });
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
      else callback(null, { data: cardList, localObjects });
    }
  );
};

const deleteEnvironment = (userData, payloadData, callback) => {
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
        Service.EnvironmentService.deleteRecord(
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
const updateEnvironment = (userData, payloadData, callback) => {
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
        let environmentToSave = {
          CreatorID: userFound._id,
          environmentName: payloadData.environmentName,
          environmentCreator: payloadData.environmentCreator,
          panorama: payloadData.panorama,
          preset: payloadData.preset,
          video: payloadData.video,
          floorColor: payloadData.floorColor,
          skyColor: payloadData.skyColor,
          skyUrl: payloadData.skyUrl,
          // localObjectsId: payloadData.localObjectsId,
        };
        console.log({ environmentToSave });
        Service.EnvironmentService.updateRecord(
          { _id: payloadData._id },
          environmentToSave,
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
  createEnvironment: createEnvironment,
  getEnvironments: getEnvironments,
  getEnvironmentById: getEnvironmentById,
  deleteEnvironment: deleteEnvironment,
  updateEnvironment: updateEnvironment,
  getEnvironmentsTourist: getEnvironmentsTourist,
  getEnvironmentByIdTourist,
  getEnvironmentByIdTourist,
};

// const getServiceById = (userData, _id, callback) => {
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
