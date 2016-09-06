'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty = require('babel-runtime/core-js/object/define-property');

var _defineProperty2 = _interopRequireDefault(_defineProperty);

exports.createModel = createModel;

var _objectschema = require('objectschema');

var objectschema = _interopRequireWildcard(_objectschema);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
* Creates a Model class with context.
*/

function createModel(schema) {
  let ctx = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
  let classMethods = schema.classMethods;
  let classVirtuals = schema.classVirtuals;
  let instanceMethods = schema.instanceMethods;
  let instanceVirtuals = schema.instanceVirtuals;

  // Model class template

  class Model extends objectschema.Document {

    constructor(data) {
      super(schema, data);

      // attaching context as instance variable
      Object.defineProperty(this, 'ctx', {
        get: () => ctx,
        enumerable: false // do not expose as object key
      });

      // attaching instance methods
      for (let name in instanceMethods) {
        let method = instanceMethods[name];

        (0, _defineProperty2.default)(this, name, {
          value: method,
          enumerable: false // do not expose as object key
        });
      }

      // attaching instance virtuals
      for (let name in instanceVirtuals) {
        var _instanceVirtuals$nam = instanceVirtuals[name];
        let get = _instanceVirtuals$nam.get;
        let set = _instanceVirtuals$nam.set;


        (0, _defineProperty2.default)(this, name, {
          get,
          set,
          enumerable: true // expose as object key
        });
      }
    }
  };

  // attaching context as a class variable
  Object.defineProperty(Model, 'ctx', {
    get: () => ctx,
    enumerable: false // do not expose as object key
  });

  // attaching class methods
  for (let name in classMethods) {
    let method = classMethods[name];

    (0, _defineProperty2.default)(Model, name, {
      value: method.bind({ ctx }),
      enumerable: false // do not expose as object key
    });
  }

  // attaching class virtuals
  for (let name in classVirtuals) {
    var _classVirtuals$name = classVirtuals[name];
    let get = _classVirtuals$name.get;
    let set = _classVirtuals$name.set;


    (0, _defineProperty2.default)(Model, name, {
      get: get ? get.bind({ ctx }) : undefined,
      set: set ? set.bind({ ctx }) : undefined,
      enumerable: true // expose as object key
    });
  }

  // returning model class
  return Model;
}