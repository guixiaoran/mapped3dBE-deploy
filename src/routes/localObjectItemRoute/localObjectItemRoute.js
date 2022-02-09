/**
 * Created by Xiaoran Gui on 16/12/21.
 */
import UniversalFunctions from "../../utils/universalFunctions";
import Joi from "joi";
import Controller from "../../controllers";

const Config = UniversalFunctions.CONFIG;

const createLocalObjectItem = {
  method: "POST",
  path: "/api/object/createLocalObjectItem",
  handler: function (request, h) {
    var userData =
      (request.auth &&
        request.auth.credentials &&
        request.auth.credentials.userData) ||
      null;
    let payloadData = request.payload;
    return new Promise((resolve, reject) => {
      Controller.LocalObjectItemController.createLocalObjectItem(
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
    description: "create Local Object",
    tags: ["api", "admin", "LocalObject"],
    auth: "UserAuth",
    validate: {
      payload: {
        environmentId: Joi.string().required(""),
        objectName: Joi.string().required(""),
        position: Joi.string().required(""),
        scale: Joi.string().allow(""),
        rotation: Joi.string().allow(""),
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

const getLocalObjects = {
  method: "GET",
  path: "/api/object/getLocalObjects",
  handler: function (request, h) {
    const userData =
      (request.auth &&
        request.auth.credentials &&
        request.auth.credentials.userData) ||
      null;
    return new Promise((resolve, reject) => {
      Controller.LocalObjectController.getLocalObjects(
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
    description: "get Local Objects",
    tags: ["api", "user", "getLocalObjects"],
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

const getLocalObjectById = {
  method: "GET",
  path: "/api/object/getLocalObjects/{_id}",
  handler: function (request, h) {
    const userData =
      (request.auth &&
        request.auth.credentials &&
        request.auth.credentials.userData) ||
      null;
    return new Promise((resolve, reject) => {
      Controller.LocalObjectController.getLocalObjectById(
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
    description: "get Local Object",
    tags: ["api", "user", "getLocalObjectById"],
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

const deleteLocalObject = {
  method: "DELETE",
  path: "/api/object/deleteLocalObject/{_id}",
  handler: function (request, h) {
    const userData =
      (request.auth &&
        request.auth.credentials &&
        request.auth.credentials.userData) ||
      null;
    const payloadData = request.params;
    return new Promise((resolve, reject) => {
      Controller.LocalObjectController.deleteLocalObject(
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
    description: "deleteLocalObject",
    tags: ["api", "admin", "LocalObject"],
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

const updateLocalObjectItem = {
  method: "PUT",
  path: "/api/object/updateLocalObjectItem/{_id}",
  handler: function (request, h) {
    const userData =
      (request.auth &&
        request.auth.credentials &&
        request.auth.credentials.userData) ||
      null;
    const payloadData = request.payload;
    payloadData._id = request.params._id;
    return new Promise((resolve, reject) => {
      Controller.LocalObjectItemController.updateLocalObjectItem(
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
    description: "update LocalObject",
    tags: ["api", "user", "LocalObject"],
    auth: "UserAuth",
    validate: {
      params: {
        _id: Joi.string().required(),
      },
      payload: {
        environmentId: Joi.string().required(""),
        objectName: Joi.string().required(""),
        position: Joi.string().allow(""),
        scale: Joi.string().allow(""),
        rotation: Joi.string().allow(""),
        url: Joi.string().allow(""),
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
  createLocalObjectItem,
  getLocalObjects,
  getLocalObjectById,
  deleteLocalObject,
  updateLocalObjectItem,
];
//, getServiceById, getServiceCount
