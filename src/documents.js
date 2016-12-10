import * as objectschema from 'objectschema';
import {Handler} from 'handleable';
import {Field} from './fields';

/*
* Creates a Model class with context.
*/

export class Document extends objectschema.Document {

  /*
  * Class constructor.
  */

  constructor (data, schema, parent) {
    super(data, schema, parent);

    Object.defineProperty(this, '$handler', { // field error handler
      value: this._createHandler()
    });
  }

  /*
  * Returns a new instance of validator.
  */

  _createHandler () {
    return new Handler(
      Object.assign({}, {
        handlers: this.$schema.handlers,
        firstErrorOnly: this.$schema.firstErrorOnly,
        context: this
      })
    );
  }

  /*
  * OVERRIDDEN: Creates a new Field instance.
  */

  _createField (name) {
    return new Field(this, name);
  }

  /*
  * If the error is not a validation error, then it tries to create one by
  * checking document fields against handlers.
  */

  async handle (error, {quiet = true} = {}) {
    if (error.code === 422) return this;

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

}
