export class GeneralError extends Error {
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

export class ValidationError extends GeneralError {
  constructor(fields, message='Some fields are not valid.') {
    super(message);
    this.fields = fields;
    this.code = 422;
  }
}
