import {
  isPresent,
  isArray,
  isObject,
  isUndefined
} from 'typeable';

import {Document} from 'objectschema';
import {Handler} from 'handleable';
import {Schema} from './schemas';
import {ValidationError} from './errors';
import {Field} from './fields';

/*
* Creates a Model class with context.
*/

export function createModel (schema, context=null) {
  let {classMethods, classVirtuals, instanceMethods, instanceVirtuals} = schema;

  /*
  * Model class template.
  */

  class Model extends Document {

    /*
    * Class constructor.
    */

    constructor (...args) {
      let [relatedSchema, data] = args; // a workaround because a Document constructor has more then 1 argument
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

        Object.defineProperty(this, name, {
          value: method
        });
      }

      for (let name in instanceVirtuals) {
        let {get, set} = instanceVirtuals[name];

        Object.defineProperty(this, name, {
          get,
          set,
          enumerable: true // expose as object key
        });
      }
    }

    /*
    * Returns a new instance of validator.
    */

    _createHandler () {
      return new Handler(Object.assign({}, this.$schema.handlerOptions, {context: this}));
    }

    /*
    * OVERRIDDEN: Creates a new Field instance.
    */

    _createField (name) {
      return new Field(this, name);
    }

    /*
    * If the error isn's an instance of ValidationError, then it tries to create
    * one by checking document fields against handlers.
    */

    async handle (error, {quiet = true} = {}) {
      if (error instanceof ValidationError) return this;

      let {fields} = this.$schema;
      for (let path in fields) {
        await this[`$${path}`].handle(error);
      }

      let paths = this.collectErrors().map((e) => e.path);
      if (!quiet && paths.length > 0) {
        let error = this._createValidationError(paths);
        throw error;
      }
      else if (paths.length === 0) {
        throw error; // unhandled error is always thrown
      }

      return this;
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

    Object.defineProperty(Model, name, {
      value: method.bind(Model)
    });
  }

  for (let name in classVirtuals) {
    let {get, set} = classVirtuals[name];

    Object.defineProperty(Model, name, {
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
