'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Schema = exports.modes = undefined;

var _typeable = require('typeable');

var _schema = require('objectschema/dist/schema');

var schema = _interopRequireWildcard(_schema);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/*
* A list of available Schema modes.
*/

const modes = exports.modes = schema.modes;

/*
* A class for defining Model structure and properties.
*/

class Schema extends schema.Schema {

  /*
  * Class constructor.
  */

  constructor() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$mode = _ref.mode;

    let mode = _ref$mode === undefined ? modes.STRICT : _ref$mode;
    var _ref$fields = _ref.fields;
    let fields = _ref$fields === undefined ? {} : _ref$fields;
    var _ref$validatorOptions = _ref.validatorOptions;
    let validatorOptions = _ref$validatorOptions === undefined ? {} : _ref$validatorOptions;
    var _ref$typeOptions = _ref.typeOptions;
    let typeOptions = _ref$typeOptions === undefined ? {} : _ref$typeOptions;
    var _ref$handlerOptions = _ref.handlerOptions;
    let handlerOptions = _ref$handlerOptions === undefined ? {} : _ref$handlerOptions;
    var _ref$classMethods = _ref.classMethods;
    let classMethods = _ref$classMethods === undefined ? {} : _ref$classMethods;
    var _ref$classVirtuals = _ref.classVirtuals;
    let classVirtuals = _ref$classVirtuals === undefined ? {} : _ref$classVirtuals;
    var _ref$instanceMethods = _ref.instanceMethods;
    let instanceMethods = _ref$instanceMethods === undefined ? {} : _ref$instanceMethods;
    var _ref$instanceVirtuals = _ref.instanceVirtuals;
    let instanceVirtuals = _ref$instanceVirtuals === undefined ? {} : _ref$instanceVirtuals;

    super({ mode, fields, validatorOptions, typeOptions });

    if (!(0, _typeable.isObject)(handlerOptions)) {
      throw new Error(`Schema handlerOptions key should be an Object`);
    }
    if (!(0, _typeable.isObject)(classMethods)) {
      throw new Error(`Schema classMethods key should be an Object`);
    }
    if (!(0, _typeable.isObject)(instanceMethods)) {
      throw new Error(`Schema instanceMethods key should be an Object`);
    }

    this.handlerOptions = handlerOptions; // handleable.js configuration options
    this.classMethods = classMethods; // model class methods
    this.classVirtuals = classVirtuals; // model class virtual fields
    this.instanceMethods = instanceMethods; // model instance methods
    this.instanceVirtuals = instanceVirtuals; // model instance virtual fields
  }

}
exports.Schema = Schema;