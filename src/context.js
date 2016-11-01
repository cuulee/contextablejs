import {createModel} from './model';

/*
* The core class for creating context.
*/

export class Context {

  /*
  * Class constructor.
  */

  constructor (context={}) {

    for (let name in context) {
      let value = context[name];

      Object.defineProperty(this, name, {
        get: () => value,
        enumerable: true // do not expose as object key
      });
    }

    Object.defineProperty(this, '_models', {
      value: {},
      writable: false // do not expose as object key
    });
  }

  /*
  * Creates a new Model class and stores it on the context.
  */

  defineModel (name, schema) {
    this._models[name] = createModel(schema, this);
    return this.getModel(name);
  }

  /*
  * Creates a new Model class and stores it on the context.
  */

  getModel (name) {
    return this._models[name];
  }

  /*
  * Creates a new Model class and stores it on the context.
  */

  deleteModel (name) {
    delete this._models[name];
  }

}
