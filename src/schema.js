import * as schema from 'objectschema/dist/schema';

/*
* Validator default options.
*/

export const handlerDefaults = {
  errorBuilder: (handler, error, value, {message}) => ({handler, message})
};

/*
* A class for defining Model structure and properties.
*/

export class Schema extends schema.Schema {

  /*
  * Class constructor.
  */

  constructor ({fields={}, strict=true, validatorOptions={}, typeOptions={}, handlerOptions={}, classMethods={}, classVirtuals={}, instanceMethods={}, instanceVirtuals={}}={}) {
    super({fields, strict, validatorOptions, typeOptions});

    Object.defineProperty(this, 'handlerOptions', { // handleable.js configuration options
      value: Object.assign({}, handlerDefaults, handlerOptions)
    });
    Object.defineProperty(this, 'classMethods', { // model class methods
      value: classMethods
    });
    Object.defineProperty(this, 'classVirtuals', { // model class virtual fields
      value: classVirtuals
    });
    Object.defineProperty(this, 'instanceMethods', { // model instance methods
      value: instanceMethods
    });
    Object.defineProperty(this, 'instanceVirtuals', { // model instance virtual fields
      value: instanceVirtuals
    });
  }

}
