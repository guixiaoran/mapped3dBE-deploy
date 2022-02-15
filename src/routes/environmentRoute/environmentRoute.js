/**
 * Created by Xiaoran Gui on 16/12/21.
 */
import UniversalFunctions from "../../utils/universalFunctions";
import Joi from "joi";
import Controller from "../../controllers";

const Config = UniversalFunctions.CONFIG;

const createEnvironment = {
  method: "POST",
  path: "/api/environment/createEnvironment",
  handler: function (request, h) {
    var userData =
      (request.auth &&
        request.auth.credentials &&
        request.auth.credentials.userData) ||
      null;
    let payloadData = request.payload;
    return new Promise((resolve, reject) => {
      Controller.EnvironmentController.createEnvironment(
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
    description: "create environment",
    tags: ["api", "admin", "Service"],
    auth: "UserAuth",
    validate: {
      payload: {
        environmentName: Joi.string().required(""),
        environmentCreator: Joi.string().required(""),
        panorama: Joi.string().allow(""),
        preset: Joi.string().allow(""),
        video: Joi.string().allow(""),
        floorColor: Joi.string().allow(""),
        skyColor: Joi.string().allow(""),
        skyUrl: Joi.string().allow(""),
        // localObjectsId: Joi.array().items(Joi.string().allow("")),
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

const getEnvironments = {
  method: "GET",
  path: "/api/environment/getEnvironments",
  handler: function (request, h) {
    const userData =
      (request.auth &&
        request.auth.credentials &&
        request.auth.credentials.userData) ||
      null;
    return new Promise((resolve, reject) => {
      Controller.EnvironmentController.getEnvironments(
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
    description: "get Environments",
    tags: ["api", "user", "getEnvironments"],
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
const getEnvironmentsTourist = {
  method: "GET",
  path: "/api/environment/getEnvironmentsTourist",
  handler: function (request, h) {
    return new Promise((resolve, reject) => {
      Controller.EnvironmentController.getEnvironmentsTourist(function (
        err,
        data
      ) {
        if (err) reject(UniversalFunctions.sendError(err));
        else
          resolve(
            UniversalFunctions.sendSuccess(
              Config.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT,
              data
            )
          );
      });
    });
  },
  config: {
    description: "get Environments",
    tags: ["api", "user", "getEnvironments"],
    // auth: "UserAuth",
    validate: {
      failAction: UniversalFunctions.failActionFunction,
    },
    plugins: {
      "hapi-swagger": {
        security: [],
        responseMessages:
          UniversalFunctions.CONFIG.APP_CONSTANTS
            .swaggerDefaultResponseMessages,
      },
    },
  },
};

const getEnvironmentByIdTourist = {
  method: "GET",
  path: "/api/environment/getEnvironmentByIdTourist/{_id}",
  handler: function (request, h) {
    return new Promise((resolve, reject) => {
      Controller.EnvironmentController.getEnvironmentByIdTourist(
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
    description: "get environment",
    tags: ["api", "tourist", "getEnvironmentById"],
    // auth: "UserAuth",
    validate: {
      failAction: UniversalFunctions.failActionFunction,
      params: {
        _id: Joi.string().required(),
      },
    },
    plugins: {
      "hapi-swagger": {
        security: [],
        responseMessages:
          UniversalFunctions.CONFIG.APP_CONSTANTS
            .swaggerDefaultResponseMessages,
      },
    },
  },
};
const getEnvironmentById = {
  method: "GET",
  path: "/api/environment/getEnvironmentById/{_id}",
  handler: function (request, h) {
    const userData =
      (request.auth &&
        request.auth.credentials &&
        request.auth.credentials.userData) ||
      null;
    return new Promise((resolve, reject) => {
      Controller.EnvironmentController.getEnvironmentById(
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
    description: "get environment",
    tags: ["api", "user", "getEnvironmentById"],
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

const deleteEnvironment = {
  method: "DELETE",
  path: "/api/environment/deleteEnvironment/{_id}",
  handler: function (request, h) {
    const userData =
      (request.auth &&
        request.auth.credentials &&
        request.auth.credentials.userData) ||
      null;
    const payloadData = request.params;
    return new Promise((resolve, reject) => {
      Controller.EnvironmentController.deleteEnvironment(
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
    description: "deleteEnvironment",
    tags: ["api", "admin", "Environment"],
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

const updateEnvironment = {
  method: "PUT",
  path: "/api/environment/updateEnvironment/{_id}",
  handler: function (request, h) {
    const userData =
      (request.auth &&
        request.auth.credentials &&
        request.auth.credentials.userData) ||
      null;
    const payloadData = request.payload;
    payloadData._id = request.params._id;
    return new Promise((resolve, reject) => {
      Controller.EnvironmentController.updateEnvironment(
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
    description: "update Environment",
    tags: ["api", "user", "Environment"],
    auth: "UserAuth",
    validate: {
      params: {
        _id: Joi.string().required(),
      },
      payload: {
        environmentName: Joi.string().required(""),
        environmentCreator: Joi.string().required(""),
        panorama: Joi.string().allow(""),
        preset: Joi.string().allow(""),
        video: Joi.string().allow(""),
        floorColor: Joi.string().allow(""),
        skyColor: Joi.string().allow(""),
        skyUrl: Joi.string().allow(""),
        // localObjectsId: Joi.array().items(Joi.string().allow("")),
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

export default [
  createEnvironment,
  getEnvironments,
  updateEnvironment,
  deleteEnvironment,
  getEnvironmentById,
  getEnvironmentsTourist,
  getEnvironmentByIdTourist,
];
//, getServiceById, getServiceCount

// const getServiceById = {
//   method: "GET",
//   path: "/api/environment/getEnvironments/{_id}",
//   handler: function (request, h) {
//     const userData =
//       (request.auth &&
//         request.auth.credentials &&
//         request.auth.credentials.userData) ||
//       null;
//     return new Promise((resolve, reject) => {
//       Controller.ServiceController.getServiceById(
//         userData,
//         request.params._id,
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
//     description: "get environment",
//     tags: ["api", "user", "getServiceById"],
//     auth: "UserAuth",
//     validate: {
//       failAction: UniversalFunctions.failActionFunction,
//       params: {
//         _id: Joi.string().required(),
//       },
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

// const getServiceCount = {
//   method: "GET",
//   path: "/api/service/getServiceCount/{_id}",
//   handler: function (request, h) {
//     const userData =
//       (request.auth &&
//         request.auth.credentials &&
//         request.auth.credentials.userData) ||
//       null;
//     return new Promise((resolve, reject) => {
//       Controller.ServiceController.getServiceCount(
//         userData,
//         request.params._id,
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
//     description: "get Service",
//     tags: ["api", "user", "getService"],
//     auth: "UserAuth",
//     validate: {
//       failAction: UniversalFunctions.failActionFunction,
//       params: {
//         _id: Joi.string().required(),
//       },
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

// const deleteCard = {
//   method: "DELETE",
//   path: "/api/card/deleteCard/{_id}",
//   handler: function (request, h) {
//     const userData =
//       (request.auth &&
//         request.auth.credentials &&
//         request.auth.credentials.userData) ||
//       null;
//     const payloadData = request.params;
//     return new Promise((resolve, reject) => {
//       Controller.CardController.deleteCard(
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
//     description: "deleteCard",
//     tags: ["api", "admin", "card"],
//     auth: "UserAuth",
//     validate: {
//       params: {
//         _id: Joi.string().required(),
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
