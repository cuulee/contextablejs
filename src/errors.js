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

  constructor(fields, message='Some fields are not valid.') {
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

  _fieldsToArray(fields, prefix=null) {
    let errors = [];

    for (let key in fields) {
      let {messages, related} = fields[key];

      if (messages.length > 0) {
        errors.push({
          path: [prefix, key].filter(v => !!v).join('.'),
          messages
        });
      }

      if (related) {
        errors = errors.concat(
          this._fieldsToArray(related, key)
        );
      }
    }

    return errors;
  }

}
