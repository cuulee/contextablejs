import * as objectschema from 'objectschema/dist';

/*
* A class for defining module structure.
*/

export class Schema extends objectschema.Schema {

  /*
  * Class constructor.
  */

  constructor ({fields={}, strict=true, validatorOptions={}, typeOptions={}, handlerOptions={}, classMethods={}, classVirtuals={}, instanceMethods={}, instanceVirtuals={}}={}) {
    super({fields, strict, validatorOptions, typeOptions});

    Object.defineProperty(this, 'handlerOptions', { // handleable.js configuration options
      value: handlerOptions
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
