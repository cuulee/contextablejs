'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/*
* General error.
*/

class GeneralError extends Error {

  /*
  * Class constructor.
  */

  constructor(message) {
    super(message);

    Object.defineProperty(this, 'name', {
      value: this.constructor.name,
      enumerable: true // do not expose as object key
    });

    Object.defineProperty(this, 'message', {
      value: message,
      enumerable: true // do not expose as object key
    });

    this.code = 500;
  }
}

exports.GeneralError = GeneralError; /*
                                     * Validation error.
                                     */

class ValidationError extends GeneralError {

  /*
  * Class constructor.
  */

  constructor(fields) {
    let message = arguments.length <= 1 || arguments[1] === undefined ? 'Some fields are not valid.' : arguments[1];

    super(message);
    this.fields = fields;
    this.code = 422;
  }

  /*
  * Converts the class fields into an array of errors.
  */

  toArray() {
    return this._fieldsToArray(this.fields);
  }

  /*
  * Converts the provided fields into an array of errors.
  */

  _fieldsToArray(fields) {
    let prefix = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

    let errors = [];

    for (let key in fields) {
      var _fields$key = fields[key];
      let messages = _fields$key.messages;
      let related = _fields$key.related;


      if (messages.length > 0) {
        errors.push({
          path: [prefix, key].filter(v => !!v).join('.'),
          messages
        });
      }

      if (related) {
        errors = errors.concat(this._fieldsToArray(related, key));
      }
    }

    return errors;
  }

}
exports.ValidationError = ValidationError;