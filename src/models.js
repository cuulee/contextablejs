/*
* Compiles a schema into a model class.
*/

export function createModel (Document, schema, context = null) {
  let {classMethods, classVirtuals, instanceMethods, instanceVirtuals} = schema;

  class Model extends Document {
    constructor (_data, _schema, _parent) {
      super(_data, _schema || schema, _parent);

      Object.defineProperty(this, '$context', { // context object
        get: () => context || this.$root.$context
      });

      for (let name in instanceMethods) {
        Object.defineProperty(this, name, {
          value: instanceMethods[name]
        });
      }

      for (let name in instanceVirtuals) {
        Object.defineProperty(this, name, {
          get: instanceVirtuals[name].get,
          set: instanceVirtuals[name].set,
          enumerable: true // expose as object key
        });
      }
    }
  }

  Object.defineProperty(Model, '$context', {
    value: context
  });

  for (let name in classMethods) {
    Object.defineProperty(Model, name, {
      value: classMethods[name].bind(Model)
    });
  }

  for (let name in classVirtuals) {
    Object.defineProperty(Model, name, {
      get: classVirtuals[name].get ? classVirtuals[name].get.bind(Model) : undefined,
      set: classVirtuals[name].set ? classVirtuals[name].set.bind(Model) : undefined,
      enumerable: true // expose as object key
    });
  }

  return Model;
}
