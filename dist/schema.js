'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Schema = exports.handlerDefaults = undefined;

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _schema = require('objectschema/dist/schema');

var schema = _interopRequireWildcard(_schema);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
* Validator default options.
*/

const handlerDefaults = exports.handlerDefaults = {
  errorBuilder: (handler, error, value, _ref) => {
    let message = _ref.message;
    return { handler, message };
  }
};

/*
* A class for defining Model structure and properties.
*/

class Schema extends schema.Schema {

  /*
  * Class constructor.
  */

  constructor() {
    var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref2$fields = _ref2.fields;

    let fields = _ref2$fields === undefined ? {} : _ref2$fields;
    var _ref2$strict = _ref2.strict;
    let strict = _ref2$strict === undefined ? true : _ref2$strict;
    var _ref2$validatorOption = _ref2.validatorOptions;
    let validatorOptions = _ref2$validatorOption === undefined ? {} : _ref2$validatorOption;
    var _ref2$typeOptions = _ref2.typeOptions;
    let typeOptions = _ref2$typeOptions === undefined ? {} : _ref2$typeOptions;
    var _ref2$handlerOptions = _ref2.handlerOptions;
    let handlerOptions = _ref2$handlerOptions === undefined ? {} : _ref2$handlerOptions;
    var _ref2$classMethods = _ref2.classMethods;
    let classMethods = _ref2$classMethods === undefined ? {} : _ref2$classMethods;
    var _ref2$classVirtuals = _ref2.classVirtuals;
    let classVirtuals = _ref2$classVirtuals === undefined ? {} : _ref2$classVirtuals;
    var _ref2$instanceMethods = _ref2.instanceMethods;
    let instanceMethods = _ref2$instanceMethods === undefined ? {} : _ref2$instanceMethods;
    var _ref2$instanceVirtual = _ref2.instanceVirtuals;
    let instanceVirtuals = _ref2$instanceVirtual === undefined ? {} : _ref2$instanceVirtual;

    super({ fields, strict, validatorOptions, typeOptions });

    Object.defineProperty(this, 'handlerOptions', { // handleable.js configuration options
      value: (0, _assign2.default)({}, handlerDefaults, handlerOptions)
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