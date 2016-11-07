'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Schema = undefined;

var _dist = require('objectschema/dist');

var objectschema = _interopRequireWildcard(_dist);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/*
* A class for defining module structure.
*/

class Schema extends objectschema.Schema {

  /*
  * Class constructor.
  */

  constructor() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$fields = _ref.fields;

    let fields = _ref$fields === undefined ? {} : _ref$fields;
    var _ref$strict = _ref.strict;
    let strict = _ref$strict === undefined ? true : _ref$strict;
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

    super({ fields, strict, validatorOptions, typeOptions });

    Object.defineProperty(this, 'handlerOptions', { // handleable.js configuration options
      value: handlerOptions
    });
    Object.defineProperty(this, 'classMethods', { // model class methods
      value: classMethods
    });
    Object.defineProperty(this, 'classVirtuals', { // model class virtual fields
      value: classVirtuals
    });
    Object.defineProperty(this, 'instanceMethods', { // model instance methods
      value: instanceMethods
    });
    Object.defineProperty(this, 'instanceVirtuals', { // model instance virtual fields
      value: instanceVirtuals
    });
  }

}
exports.Schema = Schema;