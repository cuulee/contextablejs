import {
  isPresent,
  isArray,
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

    constructor() {
      let [relatedSchema, data] = arguments; // a workaround because a Document constructor has 2 arguments
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

        Object.defineProperty(this, name, {
          value: method,
          enumerable: false // do not expose as object key
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
      return new Handler(Object.assign({}, this.schema.handlerOptions, {context: this}));
    }

    /*
    * OVERRIDING: Validates all class fields and returns errors.
    */

    async validate() {
      let errors = await this._validateFields();

      if (isPresent(errors)) {
        throw new ValidationError(errors);
      }
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
      else {
        let errors = await this._handleFields(error);

        if (isPresent(errors)) {
          return new ValidationError(errors);
        }
        else {
          throw error;
        }
      }
    }

    /*
    * Returns an object with handled errors per field. Note that related null
    * documents (where Schema field is null) are ignored!
    */

    async _handleFields(error) {
      let data = {};

      for (let name in this.schema.fields) {
        let info = await this._handleField(error, name);

        if (!isUndefined(info)) {
          data[name] = info;
        }
      }

      return data;
    }

    /*
    * Handles an error for a specified field.
    */

    async _handleField(error, name) {
      let value = this[name];
      let definition = this.schema.fields[name];

      return await this._handleValue(error, value, definition);
    }

    /*
    * Handles a value agains the field `definition` object.
    */

    async _handleValue(error, value, definition) {
      let data = {};

      data.messages = await this.handler.handle(error, value, definition.handle);

      let related = await this._handleRelatedObject(error, value, definition);
      if (related) {
        data.related = related;
      }

      let isValid = (
        data.messages.length === 0
        && this._isRelatedObjectValid(related)
      );
      return isValid ? undefined : data;
    }

    /*
    * Handles nested data of a value agains the field `definition` object.
    */

    async _handleRelatedObject(error, value, definition) {
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
            if (v) {
              items.push(await v._handleFields(error));
            }
            else {
              items.push(undefined);
            }
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

    Object.defineProperty(Model, name, {
      value: method.bind({ctx, Model}),
      enumerable: false // do not expose as object key
    });
  }

  for (let name in classVirtuals) {
    let {get, set} = classVirtuals[name];

    Object.defineProperty(Model, name, {
      get: get ? get.bind({ctx, Model}) : undefined,
      set: set ? set.bind({ctx, Model}) : undefined,
      enumerable: true // expose as object key
    });
  }

  /*
  * Returning Module class.
  */

  return Model;
}
