'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ValidationError = exports.GeneralError = undefined;

var _typeable = require('typeable');

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

  constructor() {
    let fields = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    let message = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'Some fields are not valid.';

    super(message);
    this.fields = fields;
    this.code = 422;
  }

  /*
  * Returns the fields property.
  */

  toObject() {
    return this.fields;
  }

  /*
  * Converts class fields into an array of errors.
  */

  toArray() {
    return this._fieldsToArray(this.fields);
  }

  /*
  * Converts the provided fields into an array of errors.
  */

  _fieldsToArray(fields) {
    let prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    let items = [];

    for (let key in fields) {
      let field = fields[key];
      let errors = field.errors,
          related = field.related;


      if (errors.length > 0) {
        items.push({
          path: [prefix, key].filter(v => !!v).join('.'),
          errors
        });
      }

      if (related && (0, _typeable.isArray)(related)) {
        for (let i in related) {
          let item = related[i];

          if (!(0, _typeable.isUndefined)(item)) {
            items = items.concat(this._fieldsToArray(item, [prefix, key, i].filter(v => !!v).join('.')));
          }
        }
      } else if (related) {
        items = items.concat(this._fieldsToArray(related, [prefix, key].filter(v => !!v).join('.')));
      }
    }

    return items;
  }

}
exports.ValidationError = ValidationError;