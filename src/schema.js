import {isObject} from 'typeable';
import * as schema from 'objectschema/dist/schema';

/*
* A list of available Schema modes.
*/

export const modes = schema.modes;

/*
* A class for defining Model structure and properties.
*/

export class Schema extends schema.Schema {

  /*
  * Class constructor.
  */

  constructor({mode=modes.STRICT, fields={}, validator={}, classMethods={}, classVirtuals={}, instanceMethods={}, instanceVirtuals={}}={}) {
    super({mode, fields, validator});

    if (!isObject(classMethods)) {
      throw new Error(`Schema classMethods key should be an Object`);
    }
    if (!isObject(instanceMethods)) {
      throw new Error(`Schema instanceMethods key should be an Object`);
    }

    this.validator = validator; // model validator configuration options
    this.classMethods = classMethods; // model class methods
    this.classVirtuals = classVirtuals; // model class virtual fields
    this.instanceMethods = instanceMethods; // model instance methods
    this.instanceVirtuals = instanceVirtuals; // model instance virtual fields
  }

}
