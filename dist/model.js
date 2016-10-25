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
      var _arguments = Array.prototype.slice.call(arguments);

      let relatedSchema = _arguments[0],
          data = _arguments[1]; // a workaround because a Document constructor has 2 arguments

      if (!data) {
        data = relatedSchema;
        relatedSchema = schema;
      }
      super(relatedSchema, data);

      Object.defineProperty(this, 'handler', {
        value: this._createHandler(),
        enumerable: false // do not expose as object key
      });

      Object.defineProperty(this, 'ctx', {
        get: () => ctx,
        enumerable: false // do not expose as object key
      });

      Object.defineProperty(this, 'Model', {
        get: () => Model,
        enumerable: false // do not expose as object key
      });

      for (let name in instanceMethods) {
        let method = instanceMethods[name];

        (0, _defineProperty2.default)(this, name, {
          value: method,
          enumerable: false // do not expose as object key
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
      return new _handleable.Handler((0, _assign2.default)({}, this.schema.handlerOptions, { context: this }));
    }

    /*
    * OVERRIDING: Validates all class fields and returns errors.
    */

    validate() {
      var _this = this;

      return (0, _asyncToGenerator3.default)(function* () {
        let errors = yield _this._validateFields();

        if ((0, _typeable.isPresent)(errors)) {
          throw new _errors.ValidationError(errors);
        }
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

        for (let name in _this3.schema.fields) {
          let info = yield _this3._handleField(error, name);

          if (!(0, _typeable.isUndefined)(info)) {
            data[name] = info;
          }
        }

        return data;
      })();
    }

    /*
    * Handles an error for a specified field.
    */

    _handleField(error, name) {
      var _this4 = this;

      return (0, _asyncToGenerator3.default)(function* () {
        let value = _this4[name];
        let definition = _this4.schema.fields[name];

        return yield _this4._handleValue(error, value, definition);
      })();
    }

    /*
    * Handles a value agains the field `definition` object.
    */

    _handleValue(error, value, definition) {
      var _this5 = this;

      return (0, _asyncToGenerator3.default)(function* () {
        let data = {};

        data.messages = yield _this5.handler.handle(error, value, definition.handle);

        let related = yield _this5._handleRelatedObject(error, value, definition);
        if (related) {
          data.related = related;
        }

        let isValid = data.messages.length === 0 && _this5._isRelatedObjectValid(related);
        return isValid ? undefined : data;
      })();
    }

    /*
    * Handles nested data of a value agains the field `definition` object.
    */

    _handleRelatedObject(error, value, definition) {
      var _this6 = this;

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
              if (v) {
                items.push((yield v._handleFields(error)));
              } else {
                items.push(undefined);
              }
            } else {
              items.push((yield _this6._handleValue(error, v, definition)));
            }
          }
          return items;
        } else {
          return undefined;
        }
      })();
    }

  };

  /*
  * Module static properties.
  */

  Object.defineProperty(Model, 'ctx', {
    get: () => ctx,
    enumerable: false // do not expose as object key
  });

  for (let name in classMethods) {
    let method = classMethods[name];

    (0, _defineProperty2.default)(Model, name, {
      value: method.bind({ ctx, Model }),
      enumerable: false // do not expose as object key
    });
  }

  for (let name in classVirtuals) {
    var _classVirtuals$name = classVirtuals[name];
    let get = _classVirtuals$name.get,
        set = _classVirtuals$name.set;


    (0, _defineProperty2.default)(Model, name, {
      get: get ? get.bind({ ctx, Model }) : undefined,
      set: set ? set.bind({ ctx, Model }) : undefined,
      enumerable: true // expose as object key
    });
  }

  /*
  * Returning Module class.
  */

  return Model;
}