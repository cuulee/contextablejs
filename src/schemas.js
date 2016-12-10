import * as objectschema from 'objectschema/dist';
import {merge} from 'objectschema/dist/utils';

/*
* A class for defining module structure.
*/

export class Schema extends objectschema.Schema {

  /*
  * Class constructor.
  */

  constructor ({
    mixins = [],
    fields = {},
    strict = true,
    validators = {},
    types = {},
    firstErrorOnly = false,
    handlers = {},
    classMethods = {},
    classVirtuals = {},
    instanceMethods = {},
    instanceVirtuals = {}
  } = {}) {
    super({mixins, fields, strict, validators, types, firstErrorOnly});

    Object.defineProperty(this, 'handlers', { // handleable.js configuration options
      get: () => merge(
        ...mixins.map((v) => v.handlers),
        handlers
      ),
      enumerable: true // required for deep nesting
    });

    Object.defineProperty(this, 'classMethods', { // model class methods
      get: () => merge(
        ...mixins.map((v) => v.classMethods),
        classMethods
      ),
      enumerable: true // required for deep nesting
    });

    Object.defineProperty(this, 'classVirtuals', { // model class virtual fields
      get: () => merge(
        ...mixins.map((v) => v.classVirtuals),
        classVirtuals
      ),
      enumerable: true // required for deep nesting
    });

    Object.defineProperty(this, 'instanceMethods', { // model instance methods
      get: () => merge(
        ...mixins.map((v) => v.instanceMethods),
        instanceMethods
      ),
      enumerable: true // required for deep nesting
    });

    Object.defineProperty(this, 'instanceVirtuals', { // model instance virtual fields
      get: () => merge(
        ...mixins.map((v) => v.instanceVirtuals),
        instanceVirtuals
      ),
      enumerable: true // required for deep nesting
    });
  }

}
