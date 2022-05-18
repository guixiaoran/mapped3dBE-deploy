"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _index = _interopRequireDefault(require("../models/index"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _classPrivateFieldLooseBase(receiver, privateKey) { if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) { throw new TypeError("attempted to use private field on non-instance"); } return receiver; }

var id = 0;

function _classPrivateFieldLooseKey(name) { return "__private_" + id++ + "_" + name; }

var _isModelValid = /*#__PURE__*/_classPrivateFieldLooseKey("isModelValid");

/**
 * @author Sanchit Dang
 * @description Generic Service Template
 */
var GenericService = /*#__PURE__*/function () {
  /**
   * 
   * @param {String} modelName Name of the Model
   */
  function GenericService(_modelName) {
    _classCallCheck(this, GenericService);

    Object.defineProperty(this, _isModelValid, {
      value: _isModelValid2
    });

    if (!_classPrivateFieldLooseBase(this, _isModelValid)[_isModelValid](_modelName)) {
      console.error("Invalid model name ".concat(_modelName));
      throw "Invalid model name '" + _modelName + "'. Terminating app...";
    }

    this.modelName = _modelName;
    this.objects = [];
  }
  /**
   * @private
   * @author Sanchit Dang
   * @description Validate if models exists
   * @param {String} modelName name of the model 
   */


  _createClass(GenericService, [{
    key: "updateRecord",
    value:
    /**
     * @author Sanchit Dang
     * @description Update a record in DB
     * @param {Object} criteria 
     * @param {Object} data 
     * @param {Object} options 
     * @param {Function} callback 
     */
    function updateRecord(criteria, data, options, callback) {
      data.updatedAt = Date.now();
      options.lean = true;
      options["new"] = true;

      _index["default"][this.modelName].findOneAndUpdate(criteria, data, options, callback);
    }
    /**
     * @author Sanchit Dang
     * @description Insert a record in DB
     * @param {Object} data 
     * @param {Function} callback 
     */

  }, {
    key: "createRecord",
    value: function createRecord(data, callback) {
      _index["default"][this.modelName](data).save(callback);
    }
    /**
     * @author Sanchit Dang
     * @description Hard delete a record
     * @param {Object} criteria 
     * @param {Function} callback 
     */

  }, {
    key: "deleteRecord",
    value: function deleteRecord(criteria, callback) {
      _index["default"][this.modelName].findOneAndRemove(criteria, callback);
    }
    /**
     * @author Sanchit Dang
     * @description Retrive records
     * @param {Object} criteria 
     * @param {Object} projection 
     * @param {Object} options 
     * @param {Function} callback 
     */

  }, {
    key: "getRecord",
    value: function getRecord(criteria, projection, options, callback) {
      options.lean = true;

      _index["default"][this.modelName].find(criteria, projection, options, callback);
    }
    /**
     * @author Sanchit Dang
     * @description Retrive records while populating them
     * @param {Object} criteria 
     * @param {Object} projection 
     * @param {Object} populate 
     * @param {Function} callback 
     */

  }, {
    key: "getPopulatedRecords",
    value: function getPopulatedRecords(criteria, projection, populate, callback) {
      _index["default"][this.modelName].find(criteria).select(projection).populate(populate).exec(callback);
    }
    /**
     * @author Sanchit Dang
     * @description Aggregate Records
     * @param {Object} criteria 
     * @param {Function} callback 
     */

  }, {
    key: "aggregate",
    value: function aggregate(criteria, callback) {
      _index["default"][this.modelName].aggregate(criteria, callback);
    }
    /**
     * @author Sanchit Dang
     * @description get records using promise
     * @param {Object} criteria 
     * @param {Object} projection 
     * @param {Object} options 
     */

  }, {
    key: "getRecordUsingPromise",
    value: function getRecordUsingPromise(criteria, projection, options) {
      var _this = this;

      options.lean = true;
      return new Promise(function (resolve, reject) {
        _index["default"][_this.modelName].find(criteria, projection, options, function (err, data) {
          if (err) reject(err);else resolve(data);
        });
      });
    }
  }]);

  return GenericService;
}();

exports["default"] = GenericService;

function _isModelValid2(modelName) {
  return !(!modelName || 0 === modelName.length || !_index["default"].hasOwnProperty(modelName));
}