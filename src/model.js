import {
  isPresent,
  isArray,
  isObject,
  isUndefined
} from 'typeable';
import {Document} from 'objectschema';
import {Handler} from 'handleable';
import {Schema} from './schema';
import {ValidationError} from './errors';

/*
* Creates a Model class with context.
*/

export function createModel(schema, ctx=null) {
  let {classMethods, classVirtuals, instanceMethods, instanceVirtuals} = schema;

  /*
  * Model class template.
  */

  class Model extends Document {

    /*
    * Class constructor.
    */

    constructor(...args) {
      let [relatedSchema, data] = args; // a workaround because a Document constructor has 2 arguments
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

    _createHandler() {
      return new Handler(Object.assign({}, this.$schema.handlerOptions, {context: this}));
    }

    /*
    * Validates fields and throws the ValidationError if not all fields are valid.
    */

    async approve() {
      let errors = await this.validate();

      if (isPresent(errors)) {
        throw new ValidationError(errors);
      }

      return this;
    }

    /*
    * If the error isn's an instance of ValidationError, then it tries to
    * create one by checking the fields handlers. If errors are found then
    * the ValidationError is returned, otherwise the methods throws an error.
    */

    async handle(error) {
      if (error instanceof ValidationError) {
        return error;
      }

      let errors = await this._handleFields(error);
      if (isPresent(errors)) {
        return new ValidationError(errors);
      }

      throw error;
    }

    /*
    * Returns an object with handled errors per field. Note that related null
    * documents (where Schema field is null) are ignored!
    */

    async _handleFields(error) {
      let data = {};

      for (let name in this.$schema.fields) {
        let value = this[name];
        let definition = this.$schema.fields[name];

        let info = await this._handleValue(error, value, definition);

        if (!isUndefined(info)) {
          data[name] = info;
        }
      }

      return data;
    }

    /*
    * Handles a value agains the field `definition` object.
    */

    async _handleValue(error, value, definition) {
      let data = {};

      data.errors = await this.$handler.handle(error, value, definition.handle);

      let related = await this._handleRelated(error, value, definition);
      if (related) {
        data.related = related;
      }

      let isValid = (
        data.errors.length === 0
        && this._isRelatedValid(related)
      );
      return isValid ? undefined : data;
    }

    /*
    * Handles nested data of a value agains the field `definition` object.
    */

    async _handleRelated(error, value, definition) {
      let {type} = definition;

      if (!value) {
        return undefined;
      }
      else if (type instanceof Schema) {
        return await value._handleFields(error);
      }
      else if (isArray(type) && isArray(value)) {
        let items = [];
        for (let v of value) {
          if (type[0] instanceof Schema) {
            items.push(v ? await v._handleFields(error) : undefined);
          }
          else {
            items.push(await this._handleValue(error, v, definition));
          }
        }
        return items;
      }
      else {
        return undefined;
      }
    }

    /*
    * Validates a related object of a field (a sub schema).
    */

    _isRelatedValid (related) {
      if (isObject(related)) {
        return Object.values(related).every(v => v.errors.length === 0 && !v.related);
      }
      else if (isArray(related)) {
        return related.every(v => this._isRelatedValid(v));
      }
      else {
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
