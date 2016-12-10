'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty = require('babel-runtime/core-js/object/define-property');

var _defineProperty2 = _interopRequireDefault(_defineProperty);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

exports.createModel = createModel;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
* Compiles a schema into a model class.
*/

function createModel(Document, schema) {
  var context = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  var classMethods = schema.classMethods,
      classVirtuals = schema.classVirtuals,
      instanceMethods = schema.instanceMethods,
      instanceVirtuals = schema.instanceVirtuals;

  var Model = function (_Document) {
    (0, _inherits3.default)(Model, _Document);

    function Model(_data, _schema, _parent) {
      (0, _classCallCheck3.default)(this, Model);

      var _this = (0, _possibleConstructorReturn3.default)(this, (Model.__proto__ || (0, _getPrototypeOf2.default)(Model)).call(this, _data, _schema || schema, _parent));

      Object.defineProperty(_this, '$context', { // context object
        get: function get() {
          return context || _this.$root.$context;
        }
      });

      for (var name in instanceMethods) {
        (0, _defineProperty2.default)(_this, name, {
          value: instanceMethods[name]
        });
      }

      for (var _name in instanceVirtuals) {
        (0, _defineProperty2.default)(_this, _name, {
          get: instanceVirtuals[_name].get,
          set: instanceVirtuals[_name].set,
          enumerable: true // expose as object key
        });
      }
      return _this;
    }

    return Model;
  }(Document);

  Object.defineProperty(Model, '$context', {
    value: context
  });

  for (var name in classMethods) {
    (0, _defineProperty2.default)(Model, name, {
      value: classMethods[name].bind(Model)
    });
  }

  for (var _name2 in classVirtuals) {
    (0, _defineProperty2.default)(Model, _name2, {
      get: classVirtuals[_name2].get ? classVirtuals[_name2].get.bind(Model) : undefined,
      set: classVirtuals[_name2].set ? classVirtuals[_name2].set.bind(Model) : undefined,
      enumerable: true // expose as object key
    });
  }

  return Model;
}