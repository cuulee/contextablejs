'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
class GeneralError extends Error {
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

exports.GeneralError = GeneralError;
class ValidationError extends GeneralError {
  constructor(fields) {
    let message = arguments.length <= 1 || arguments[1] === undefined ? 'Some fields are not valid.' : arguments[1];

    super(message);
    this.fields = fields;
    this.code = 422;
  }
}
exports.ValidationError = ValidationError;