import * as objectschema from 'objectschema';
import {toArray} from 'typeable';
import {
  ValidatorError,
  HandlerError
} from './errors';

/*
* Document field class.
*/

export class Field extends objectschema.Field {

  /*
  * Returns the last error of the field.
  */

  _createError (data) {
    switch (data.name) {
      case 'ValidatorError':
        return new ValidatorError(data.validator, data.message, data.code);
      case 'HandlerError':
        return new HandlerError(data.handler, data.message, data.code);
      case 'Error':
        return new Error(data.message);
    }

    throw new Error(`Unknown model field error`);
  }

  /*
  * Handles the field by populating the `_errors` property.
  */

  async handle (error) {
    let relatives = toArray(this.value) || []; // validate related models
    for (let relative of relatives) {
      let isModel = relative instanceof this.$owner.constructor;

      if (isModel) {
        await relative.handle(error, {quiet: true}); // don't throw
      }
    }

    this._errors = await this.$owner.$handler.handle( // validate this field
      error,
      this.$owner.$schema.fields[this.name].handle
    );

    return this;
  }

}
