import * as objectschema from 'objectschema';

/*
* Creates a Model class with context.
*/

export function createModel(schema, ctx=null) {
  let {classMethods, classVirtuals, instanceMethods, instanceVirtuals} = schema;

  // Model class template
  class Model extends objectschema.Document {

    constructor(data) {
      super(schema, data);

      // attaching context as instance variable
      Object.defineProperty(this, 'ctx', {
        get: () => ctx,
        enumerable: false // do not expose as object key
      });

      // attaching instance methods
      for (let name in instanceMethods) {
        let method = instanceMethods[name];

        Object.defineProperty(this, name, {
          value: method,
          enumerable: false // do not expose as object key
        });
      }

      // attaching instance virtuals
      for (let name in instanceVirtuals) {
        let {get, set} = instanceVirtuals[name];

        Object.defineProperty(this, name, {
          get,
          set,
          enumerable: true // expose as object key
        });
      }
    }
  };

  // attaching context as a class variable
  Object.defineProperty(Model, 'ctx', {
    get: () => ctx,
    enumerable: false // do not expose as object key
  });

  // attaching class methods
  for (let name in classMethods) {
    let method = classMethods[name];

    Object.defineProperty(Model, name, {
      value: method.bind({ctx}),
      enumerable: false // do not expose as object key
    });
  }

  // attaching class virtuals
  for (let name in classVirtuals) {
    let {get, set} = classVirtuals[name];

    Object.defineProperty(Model, name, {
      get: get ? get.bind({ctx}) : undefined,
      set: set ? set.bind({ctx}) : undefined,
      enumerable: true // expose as object key
    });
  }

  // returning model class
  return Model;
}
