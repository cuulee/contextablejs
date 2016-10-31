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
    let data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    let message = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'Some fields are not valid.';
    let code = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 422;

    super(message);
    this.data = data;
    this.code = code;
  }

  /*
  * Returns the fields property.
  */

  toObject() {
    return this.data;
  }

  /*
  * Converts class fields into an array of errors.
  */

  toArray() {
    return this._fieldsToArray(this.data);
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

  /*
  * Returns errors array of a field at path.
  */

  getErrors() {
    for (var _len = arguments.length, keys = Array(_len), _key = 0; _key < _len; _key++) {
      keys[_key] = arguments[_key];
    }

    if ((0, _typeable.isArray)(keys[0])) {
      keys = keys[0];
    }

    let fields = this.toObject();
    let errors = keys.reduce((obj, key, index) => {
      let error = (obj || {})[key];

      if (!error) {
        return undefined;
      } else if ((0, _typeable.isInteger)(key)) {
        return error;
      } else {
        let isLast = index >= keys.length - 1;
        return !isLast ? error.related : error;
      }
    }, fields);

    return (0, _typeable.isUndefined)(errors) ? [] : errors.errors;
  }

  /*
  * Returns errors array of a field at path.
  */

  hasErrors() {
    return this.getErrors(...arguments).length > 0;
  }

}
exports.ValidationError = ValidationError;