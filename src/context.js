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
      this.defineProperty(name, {
        get: () => context[name],
        enumerable: true
      });
    }
  }

  /*
  * Defines a new property directly on the context object.
  */

  defineProperty (name, descriptor) {
    Object.defineProperty(this, name, descriptor);

    return this[name];
  }

  /*
  * Creates a new Model class and stores it on the context.
  */

  defineModel (name, schema, options={}) {
    let model = createModel(schema, this);

    let descriptor = Object.assign({
      enumerable: true
    }, options, {
      get: () => model
    });
    delete descriptor.set;
    delete descriptor.value;

    return this.defineProperty(name, descriptor);
  }

}
