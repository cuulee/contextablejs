'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _values = require('babel-runtime/core-js/object/values');

var _values2 = _interopRequireDefault(_values);

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

var _schema = require('./schema');

var _errors = require('./errors');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
* Creates a Model class with context.
*/

function createModel(schema) {
  let ctx = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
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
          data = args[1]; // a workaround because a Document constructor has 2 arguments

      if (!data) {
        data = relatedSchema;
        relatedSchema = schema;
      }
      super(relatedSchema, data);

      Object.defineProperty(this, '$handler', {
        value: this._createHandler()
      });

      Object.defineProperty(this, '$ctx', {
        value: ctx
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
    * Validates fields and throws the ValidationError if not all fields are valid.
    */

    approve() {
      var _this = this;

      return (0, _asyncToGenerator3.default)(function* () {
        let errors = yield _this.validate();

        if ((0, _typeable.isPresent)(errors)) {
          throw new _errors.ValidationError(errors);
        }

        return _this;
      })();
    }

    /*
    * If the error isn's an instance of ValidationError, then it tries to
    * create one by checking the fields handlers. If errors are found then
    * the ValidationError is returned, otherwise the methods throws an error.
    */

    handle(error) {
      var _this2 = this;

      return (0, _asyncToGenerator3.default)(function* () {
        if (error instanceof _errors.ValidationError) {
          return error;
        }

        let errors = yield _this2._handleFields(error);
        if ((0, _typeable.isPresent)(errors)) {
          return new _errors.ValidationError(errors);
        }

        throw error;
      })();
    }

    /*
    * Returns an object with handled errors per field. Note that related null
    * documents (where Schema field is null) are ignored!
    */

    _handleFields(error) {
      var _this3 = this;

      return (0, _asyncToGenerator3.default)(function* () {
        let data = {};

        for (let name in _this3.$schema.fields) {
          let value = _this3[name];
          let definition = _this3.$schema.fields[name];

          let info = yield _this3._handleValue(error, value, definition);

          if (!(0, _typeable.isUndefined)(info)) {
            data[name] = info;
          }
        }

        return data;
      })();
    }

    /*
    * Handles a value agains the field `definition` object.
    */

    _handleValue(error, value, definition) {
      var _this4 = this;

      return (0, _asyncToGenerator3.default)(function* () {
        let data = {
          errors: yield _this4.$handler.handle(error, value, definition.handle),
          related: yield _this4._handleRelated(error, value, definition)
        };

        let isValid = data.errors.length === 0 && _this4._isRelatedValid(data.related);
        return isValid ? undefined : data;
      })();
    }

    /*
    * Handles nested data of a value agains the field `definition` object.
    */

    _handleRelated(error, value, definition) {
      var _this5 = this;

      return (0, _asyncToGenerator3.default)(function* () {
        let type = definition.type;


        if (!value) {
          return undefined;
        } else if (type instanceof _schema.Schema) {
          return yield value._handleFields(error);
        } else if ((0, _typeable.isArray)(type) && (0, _typeable.isArray)(value)) {
          let items = [];
          for (let v of value) {
            if (type[0] instanceof _schema.Schema) {
              items.push(v ? yield v._handleFields(error) : undefined);
            } else {
              items.push((yield _this5._handleValue(error, v, definition)));
            }
          }
          return items;
        } else {
          return undefined;
        }
      })();
    }

    /*
    * Validates a related object of a field (a sub schema).
    */

    _isRelatedValid(related) {
      if ((0, _typeable.isObject)(related)) {
        return (0, _values2.default)(related).every(v => v.errors.length === 0 && !v.related);
      } else if ((0, _typeable.isArray)(related)) {
        return related.every(v => this._isRelatedValid(v));
      } else {
        return true;
      }
    }
  };

  /*
  * Module static properties.
  */

  Object.defineProperty(Model, '$ctx', {
    value: ctx
  });

  Object.defineProperty(Model, '$schema', {
    value: schema
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