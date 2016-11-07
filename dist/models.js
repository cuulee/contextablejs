'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _defineProperty = require('babel-runtime/core-js/object/define-property');

var _defineProperty2 = _interopRequireDefault(_defineProperty);

exports.createModel = createModel;

var _typeable = require('typeable');

var _objectschema = require('objectschema');

var _handleable = require('handleable');

var _schemas = require('./schemas');

var _errors = require('./errors');

var _fields = require('./fields');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
* Creates a Model class with context.
*/

function createModel(schema) {
  let context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  let classMethods = schema.classMethods,
      classVirtuals = schema.classVirtuals,
      instanceMethods = schema.instanceMethods,
      instanceVirtuals = schema.instanceVirtuals;

  /*
  * Model class template.
  */

  class Model extends _objectschema.Document {

    /*
    * Class constructor.
    */

    constructor() {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      let relatedSchema = args[0],
          data = args[1]; // a workaround because a Document constructor has more then 1 argument

      if (!data) {
        data = relatedSchema;
        relatedSchema = schema;
      }
      super(relatedSchema, data);

      Object.defineProperty(this, '$context', {
        value: context
      });
      Object.defineProperty(this, '$handler', {
        value: this._createHandler()
      });

      for (let name in instanceMethods) {
        let method = instanceMethods[name];

        (0, _defineProperty2.default)(this, name, {
          value: method
        });
      }

      for (let name in instanceVirtuals) {
        var _instanceVirtuals$nam = instanceVirtuals[name];
        let get = _instanceVirtuals$nam.get,
            set = _instanceVirtuals$nam.set;


        (0, _defineProperty2.default)(this, name, {
          get,
          set,
          enumerable: true // expose as object key
        });
      }
    }

    /*
    * Returns a new instance of validator.
    */

    _createHandler() {
      return new _handleable.Handler((0, _assign2.default)({}, this.$schema.handlerOptions, { context: this }));
    }

    /*
    * OVERRIDDEN: Creates a new Field instance.
    */

    _createField(name) {
      return new _fields.Field(this, name);
    }

    /*
    * If the error isn's an instance of ValidationError, then it tries to create
    * one by checking document fields against handlers.
    */

    handle(error) {
      var _this = this,
          _arguments = arguments;

      return (0, _asyncToGenerator3.default)(function* () {
        var _ref = _arguments.length > 1 && _arguments[1] !== undefined ? _arguments[1] : {},
            _ref$quiet = _ref.quiet;

        let quiet = _ref$quiet === undefined ? true : _ref$quiet;

        if (error instanceof _errors.ValidationError) return _this;

        let fields = _this.$schema.fields;

        for (let path in fields) {
          yield _this[`$${ path }`].handle(error);
        }

        let paths = _this.collectErrors().map(function (e) {
          return e.path;
        });
        if (!quiet && paths.length > 0) {
          let error = _this._createValidationError(paths);
          throw error;
        } else if (paths.length === 0) {
          throw error; // unhandled error is always thrown
        }

        return _this;
      })();
    }
  };

  /*
  * Module static properties.
  */

  Object.defineProperty(Model, '$context', {
    value: context
  });

  for (let name in classMethods) {
    let method = classMethods[name];

    (0, _defineProperty2.default)(Model, name, {
      value: method.bind(Model)
    });
  }

  for (let name in classVirtuals) {
    var _classVirtuals$name = classVirtuals[name];
    let get = _classVirtuals$name.get,
        set = _classVirtuals$name.set;


    (0, _defineProperty2.default)(Model, name, {
      get: get ? get.bind(Model) : undefined,
      set: set ? set.bind(Model) : undefined,
      enumerable: true // expose as object key
    });
  }

  /*
  * Returning Module class.
  */

  return Model;
}