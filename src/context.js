import {createModel} from './model';

/*
* The core class for creating context.
*/

export class Context {

  /*
  * Class constructor.
  */

  constructor(ctx={}) {

    for (let name in ctx) {
      let value = ctx[name];

      Object.defineProperty(this, name, {
        get: () => value,
        enumerable: true // do not expose as object key
      });
    }

    Object.defineProperty(this, 'models', {
      value: {},
      enumerable: false // do not expose as object key
    });
  }

  /*
  * Creates a new Model class and stores it on the context.
  */

  defineModel(name, schema) {
    this.models[name] = createModel(schema, this);
    return this.getModel(name);
  }

  /*
  * Creates a new Model class and stores it on the context.
  */

  getModel(name) {
    return this.models[name];
  }

  /*
  * Creates a new Model class and stores it on the context.
  */

  deleteModel(name) {
    delete this.models[name];
  }

}
