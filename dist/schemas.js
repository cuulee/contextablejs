'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Schema = undefined;

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _dist = require('objectschema/dist');

var objectschema = _interopRequireWildcard(_dist);

var _utils = require('objectschema/dist/utils');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
* A class for defining module structure.
*/

var Schema = exports.Schema = function (_objectschema$Schema) {
  (0, _inherits3.default)(Schema, _objectschema$Schema);

  /*
  * Class constructor.
  */

  function Schema() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$mixins = _ref.mixins,
        mixins = _ref$mixins === undefined ? [] : _ref$mixins,
        _ref$fields = _ref.fields,
        fields = _ref$fields === undefined ? {} : _ref$fields,
        _ref$strict = _ref.strict,
        strict = _ref$strict === undefined ? true : _ref$strict,
        _ref$validatorOptions = _ref.validatorOptions,
        validatorOptions = _ref$validatorOptions === undefined ? {} : _ref$validatorOptions,
        _ref$typeOptions = _ref.typeOptions,
        typeOptions = _ref$typeOptions === undefined ? {} : _ref$typeOptions,
        _ref$handlerOptions = _ref.handlerOptions,
        handlerOptions = _ref$handlerOptions === undefined ? {} : _ref$handlerOptions,
        _ref$classMethods = _ref.classMethods,
        classMethods = _ref$classMethods === undefined ? {} : _ref$classMethods,
        _ref$classVirtuals = _ref.classVirtuals,
        classVirtuals = _ref$classVirtuals === undefined ? {} : _ref$classVirtuals,
        _ref$instanceMethods = _ref.instanceMethods,
        instanceMethods = _ref$instanceMethods === undefined ? {} : _ref$instanceMethods,
        _ref$instanceVirtuals = _ref.instanceVirtuals,
        instanceVirtuals = _ref$instanceVirtuals === undefined ? {} : _ref$instanceVirtuals;

    (0, _classCallCheck3.default)(this, Schema);

    var _this = (0, _possibleConstructorReturn3.default)(this, (Schema.__proto__ || (0, _getPrototypeOf2.default)(Schema)).call(this, { mixins: mixins, fields: fields, strict: strict, validatorOptions: validatorOptions, typeOptions: typeOptions }));

    Object.defineProperty(_this, 'handlerOptions', { // handleable.js configuration options
      get: function get() {
        return _utils.merge.apply(undefined, (0, _toConsumableArray3.default)(mixins.map(function (v) {
          return v.handlerOptions;
        })).concat([handlerOptions]));
      },
      enumerable: true // required for deep nesting
    });

    Object.defineProperty(_this, 'classMethods', { // model class methods
      get: function get() {
        return _utils.merge.apply(undefined, (0, _toConsumableArray3.default)(mixins.map(function (v) {
          return v.classMethods;
        })).concat([classMethods]));
      },
      enumerable: true // required for deep nesting
    });

    Object.defineProperty(_this, 'classVirtuals', { // model class virtual fields
      get: function get() {
        return _utils.merge.apply(undefined, (0, _toConsumableArray3.default)(mixins.map(function (v) {
          return v.classVirtuals;
        })).concat([classVirtuals]));
      },
      enumerable: true // required for deep nesting
    });

    Object.defineProperty(_this, 'instanceMethods', { // model instance methods
      get: function get() {
        return _utils.merge.apply(undefined, (0, _toConsumableArray3.default)(mixins.map(function (v) {
          return v.instanceMethods;
        })).concat([instanceMethods]));
      },
      enumerable: true // required for deep nesting
    });

    Object.defineProperty(_this, 'instanceVirtuals', { // model instance virtual fields
      get: function get() {
        return _utils.merge.apply(undefined, (0, _toConsumableArray3.default)(mixins.map(function (v) {
          return v.instanceVirtuals;
        })).concat([instanceVirtuals]));
      },
      enumerable: true // required for deep nesting
    });
    return _this;
  }

  return Schema;
}(objectschema.Schema);