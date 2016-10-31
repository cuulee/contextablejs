import {
  isUndefined,
  isArray
} from 'typeable';

/*
* General error.
*/

export class GeneralError extends Error {

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

/*
* Validation error.
*/

export class ValidationError extends GeneralError {

  /*
  * Class constructor.
  */

  constructor(fields={}, message='Some fields are not valid.') {
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

  _fieldsToArray(fields, prefix=null) {
    let items = [];

    for (let key in fields) {
      let field = fields[key];
      let {errors, related} = field;

      if (errors.length > 0) {
        items.push({
          path: [prefix, key].filter(v => !!v).join('.'),
          errors
        });
      }

      if (related && isArray(related)) {
        for (let i in related) {
          let item = related[i];

          if (!isUndefined(item)) {
            items = items.concat(
              this._fieldsToArray(item, [prefix, key, i].filter(v => !!v).join('.'))
            );
          }
        }
      }
      else if (related) {
        items = items.concat(
          this._fieldsToArray(related, [prefix, key].filter(v => !!v).join('.'))
        );
      }
    }

    return items;
  }

}
