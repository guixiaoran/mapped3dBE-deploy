/**
 * Created by Xiaoran Gui on 16/12/21.
 */
import UniversalFunctions from "../../utils/universalFunctions";
import Joi from "joi";
import Controller from "../../controllers";

const Config = UniversalFunctions.CONFIG;
//public Public
const createPublicObject = {
  method: "POST",
  path: "/api/object/createPublicObject",
  handler: function (request, h) {
    var userData =
      (request.auth &&
        request.auth.credentials &&
        request.auth.credentials.userData) ||
      null;
    let payloadData = request.payload;
    return new Promise((resolve, reject) => {
      Controller.PublicObjectController.createPublicObject(
        userData,
        payloadData,
        function (err, data) {
          if (err) reject(UniversalFunctions.sendError(err));
          else
            resolve(
              UniversalFunctions.sendSuccess(
                Config.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT,
                data
              )
            );
        }
      );
    });
  },
  config: {
    description: "create PublicObject",
    tags: ["api", "admin", "PublicObject"],
    auth: "UserAuth",
    validate: {
      payload: {
        objectName: Joi.string().required(""),
        url: Joi.string().allow(""),
        //  requirements: Joi.array().items(Joi.string().allow("")),
      },
      failAction: UniversalFunctions.failActionFunction,
    },
    plugins: {
      "hapi-swagger": {
        security: [{ user: {} }],
        responseMessages:
          UniversalFunctions.CONFIG.APP_CONSTANTS
            .swaggerDefaultResponseMessages,
      },
    },
  },
};

const getPublicObjects = {
  method: "GET",
  path: "/api/object/getPublicObjects",
  handler: function (request, h) {
    const userData =
      (request.auth &&
        request.auth.credentials &&
        request.auth.credentials.userData) ||
      null;
    return new Promise((resolve, reject) => {
      Controller.PublicObjectController.getPublicObjects(
        userData,
        function (err, data) {
          if (err) reject(UniversalFunctions.sendError(err));
          else
            resolve(
              UniversalFunctions.sendSuccess(
                Config.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT,
                data
              )
            );
        }
      );
    });
  },
  config: {
    description: "get Public Objects",
    tags: ["api", "user", "getPublicObjects"],
    auth: "UserAuth",
    validate: {
      failAction: UniversalFunctions.failActionFunction,
    },
    plugins: {
      "hapi-swagger": {
        security: [{ user: {} }],
        responseMessages:
          UniversalFunctions.CONFIG.APP_CONSTANTS
            .swaggerDefaultResponseMessages,
      },
    },
  },
};

const getPublicObjectById = {
  method: "GET",
  path: "/api/object/getPublicObjects/{_id}",
  handler: function (request, h) {
    const userData =
      (request.auth &&
        request.auth.credentials &&
        request.auth.credentials.userData) ||
      null;
    return new Promise((resolve, reject) => {
      Controller.PublicObjectController.getPublicObjectById(
        userData,
        request.params._id,
        function (err, data) {
          if (err) reject(UniversalFunctions.sendError(err));
          else
            resolve(
              UniversalFunctions.sendSuccess(
                Config.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT,
                data
              )
            );
        }
      );
    });
  },
  config: {
    description: "get Public Object by ID",
    tags: ["api", "user", "getPublicObjectById"],
    auth: "UserAuth",
    validate: {
      failAction: UniversalFunctions.failActionFunction,
      params: {
        _id: Joi.string().required(),
      },
    },
    plugins: {
      "hapi-swagger": {
        security: [{ user: {} }],
        responseMessages:
          UniversalFunctions.CONFIG.APP_CONSTANTS
            .swaggerDefaultResponseMessages,
      },
    },
  },
};

const deletePublicObject = {
  method: "DELETE",
  path: "/api/object/deletePublicObject/{_id}",
  handler: function (request, h) {
    const userData =
      (request.auth &&
        request.auth.credentials &&
        request.auth.credentials.userData) ||
      null;
    const payloadData = request.params;
    return new Promise((resolve, reject) => {
      Controller.PublicObjectController.deletePublicObject(
        userData,
        payloadData,
        function (err, data) {
          if (err) reject(UniversalFunctions.sendError(err));
          else
            resolve(
              UniversalFunctions.sendSuccess(
                Config.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT,
                data
              )
            );
        }
      );
    });
  },
  config: {
    description: "delete PublicObject",
    tags: ["api", "user", "PublicObject"],
    auth: "UserAuth",
    validate: {
      params: {
        _id: Joi.string().required(),
      },
      failAction: UniversalFunctions.failActionFunction,
    },
    plugins: {
      "hapi-swagger": {
        security: [{ user: {} }],
        responseMessages:
          UniversalFunctions.CONFIG.APP_CONSTANTS
            .swaggerDefaultResponseMessages,
      },
    },
  },
};

// const updateCard = {
//   method: "PUT",
//   path: "/api/card/updateCard/{_id}",
//   handler: function (request, h) {
//     const userData =
//       (request.auth &&
//         request.auth.credentials &&
//         request.auth.credentials.userData) ||
//       null;
//     const payloadData = request.payload;
//     payloadData.cardId = request.params._id;
//     return new Promise((resolve, reject) => {
//       Controller.CardController.updateCard(
//         userData,
//         payloadData,
//         function (err, data) {
//           if (err) reject(UniversalFunctions.sendError(err));
//           else
//             resolve(
//               UniversalFunctions.sendSuccess(
//                 Config.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT,
//                 data
//               )
//             );
//         }
//       );
//     });
//   },
//   config: {
//     description: "update Card",
//     tags: ["api", "user", "card"],
//     auth: "UserAuth",
//     validate: {
//       params: {
//         _id: Joi.string().required(),
//       },
//       payload: {
//         title: Joi.string().optional().allow(""),
//         description: Joi.string().optional().allow(""),
//         url: Joi.string().uri().optional().allow(""),
//       },
//       failAction: UniversalFunctions.failActionFunction,
//     },
//     plugins: {
//       "hapi-swagger": {
//         security: [{ user: {} }],
//         responseMessages:
//           UniversalFunctions.CONFIG.APP_CONSTANTS
//             .swaggerDefaultResponseMessages,
//       },
//     },
//   },
// };

export default [
  createPublicObject,
  getPublicObjects,
  getPublicObjectById,
  deletePublicObject,
];
//, getServiceById, getServiceCount
