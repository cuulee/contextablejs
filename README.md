![Build Status](https://travis-ci.org/xpepermint/contextablejs.svg?branch=master)&nbsp;[![NPM Version](https://badge.fury.io/js/contextable.svg)](https://badge.fury.io/js/contextable)&nbsp;[![Dependency Status](https://gemnasium.com/xpepermint/contextablejs.svg)](https://gemnasium.com/xpepermint/contextablejs)

# contextable.js

> Simple, unopinionated and minimalist framework for creating context objects with support for unopinionated ORM, object schemas, type casting, validation and error handling.

This is a light weight open source package. It works on the server and in a browser. The source code is available on [GitHub](https://github.com/xpepermint/contextablejs) where you can also find our [issue tracker](https://github.com/xpepermint/contextablejs/issues).

<img src="giphy.gif" width="300" />

## Features

* Context object
* Model object
* Type casting
* Custom data types
* Field default value
* Field value transformation with custom getter and setter
* Strict and relaxed schemas
* Nesting with support for self referencing
* Field change tracking, data commit and rollback
* Field validation
* Enhanced error handling

## Related Projects

* [ObjectSchema.js](https://github.com/xpepermint/objectschemajs): Advanced schema enforced JavaScript objects.
* [Validatable.js](https://github.com/xpepermint/validatablejs): A library for synchronous and asynchronous validation.
* [Handleable.js](https://github.com/xpepermint/handleablejs): A library for synchronous and asynchronous error handling.
* [Typeable.js](https://github.com/xpepermint/typeablejs): A library for checking and casting types.

## Motivation

### Application Context

[Monolithic applications](https://en.wikipedia.org/wiki/Monolithic_application) usually have a single entry point where a project gets initialized, where a connection to a database is handled, where dependencies are loaded, where related services are started, where content is rendered and so on. All these parts usually share the same application context and we can use context-aware components (e.g. database models) anywhere in our code.

Node.js gives us freedom which allows for different applications and multiple instances of the same application to be started in the same process. This means that all services in this case share the same application context which is not desirable and many times seriously dangerous. This freedom doesn't come without sacrifices. Not having a unified application context is a very big problem and writing a long-term sustainable code becomes a challenge.

Wouldn't be nice if we could create an application context object for each application and we would simple send it down to application objects when the application is created and the application would magically work isolated from other applications in the process. The application in this case becomes a configurable component thus we can run multiple instances of the same application, with different contexts, within the same process.

This is one of the core features of *Contextable.js*. The idea is not drastically new but brings a different prospective of what an application is and how ti works. Did you know, that the JavaScript implementation of [GraphQL](https://github.com/graphql/graphql-js) adopts this concept - you send a context to GraphQL resolvers by passing it as an argument to the `graphql` method? There are other examples, for sure.

### Unopinionated ORM

Almost all monolithic frameworks provide some sort of ORM (e.g. ActiveRecord) for easy data manipulation where the magic does all the heavy database stuff. Good and flexible ORM is the crucial added value for a developer. Good JavaScript ORMs also handle data type casting for us thus the object values always have the desired data type. Beside that and all other goodies, things get complicated if multiple database adapters are needed. None of these solutions expect that a single model would need to use two or more different databases at the same time within the same model. All models are supposed to use a single database adapter.

In Node.js environment you can find super duper ORM packages like [mongoose](http://mongoosejs.com/), [sequelize](sequelizejs.com), [bookshelf](http://bookshelfjs.org/) and so on. You can get pretty good layer of functionality as with popular monolithic frameworks like Ruby on Rails, but you still don't have a unified ORM system and your models are always locked to a specific database adapter.

*Contextable.js* is unopinionated ORM, offering tools for building unopinionated, context-aware models. Models share the same (application) context and thus can use all features attached to a context. This means that if you attach [MongoDB](https://github.com/mongodb/node-mongodb-native) and [ElasticSearch](https://github.com/elastic/elasticsearch-js) connectors to a context your models will be able to use both of them at the same time. You can add whatever you need to a context and all that features are automagically available in all you models.

### Validation and Error Handling

Data validation and error handling is a common thing when writing API controllers, GraphQL mutations, before we try to write something into a database and in many other cases where we manipulate and mutate data. Every time you start writing validations, you ask yourself the same questions. You try hard finding the best way to get a clean and beautiful solution. At the end you desperately start googling for answers, searching best practices and possible conventions.

ORM frameworks usually provide object validation out of the box. What about error handling? Isn't that pretty similar thing? Validation happens before actual action and error handling happens afterwords thus validation and error handling go hand in hand. *Contextable.js* has been written with that in mind.

Let's take a real life use case where we are inserting books with unique names into a MongoDB collection. We validate each book before we write anything into a database. To be safe, we also validate that a book with the provided name does not exists in a database. If the book object isn't valid we show nicely formatted error message to a user telling what went wrong. When the object is valid we write it to the database. Will the operation always succeed? Maybe yes, sometimes no. We can expect at least the `E11000` MongoDB error. This is because validation and write operation do not execute in atomic way. In case of a database error, we again want to show a nicely formatted error message to a user. This means that we need to write two error handling mechanisms for pretty much the same thing.

*Contextable.js* unifies validation and error handling. We can handle validation and other field-related errors in a single way. We only need to tell *Contextable.js* which errors to be handled and how to be handled, *Contextable.js* will do the rest.

## Install

Run the command below to install the package.

```
$ npm install --save contextable
```

## Usage

Below, we create a simple example to show the benefit of using `Contextable.js` in your [Node.js](https://nodejs.org) project. In this tutorial we create a new context instance with a User model attached, then we insert a user document in a [MongoDB](https://www.mongodb.com) database. The example also explains the concept of validation and error handling.

To make things easy to read, we use [Babel](https://babeljs.io/), thus we can write ES6+ syntax and wrap our code into the `async` block.

```js
(async function() {
  // code here
})().catch(console.error);
```

Let's start by defining a simple user schema. Schema is a model definition where we define all model properties.

```js
import {Schema} from 'contextable';

let userSchema = new Schema({
  fields: {
    firstName: {
      type: 'String'
    },
    lastName: {
      type: 'String'
    },
    tags: [
      type: ['String']
    ]
  }
});
```

Each field in a schema must have a `type` attribute which defines how a model should cast field's value. *Contextable.js* supports common [data types](#schema) but we can define our own types if needed. Our schema now have two `string` fields and one field which is an `array of strings`.

Fields can be validated simply by adding the `validate` attribute to a field definition block. *Contextable.js* includes many [built-in validators](#schema) that we can use. For now we will only check if the fields are present.

```js
let userSchema = new Schema({
  fields: {
    firstName: {
      ...
      validate: {
        presence: {
          message: 'is required'
        }
      }
    },
    lastName: {
      ...
      validate: {
        presence: {
          message: 'is required'
        }
      }
    },
    tags: {
      ...
      validate: {
        presence: {
          message: 'is required'
        }
      }
    }
  }
});
```

Schema also supports computed fields, thus we can define class and instance virtual fields.

```js
let userSchema = new Schema({
  ...
  classVirtuals: {
    version: { // e.g. User.version
      get: (v) => `v0.0.1`
    }
  },
  instanceVirtuals: {
    name: { // e.g. user.name
      get: (v) => `${this.firstName} ${this.lastName}`
    }
  }
});
```

Schema holds information about class and instance methods. We can define whatever methods we need - synchronous or asynchronous. Let's add some useful methods for managing user data.

```js
let userSchema = new Schema({
  ...
  classMethods: {
    async count: (id) => {
      return await this.ctx.mongo.collection('users').count();
    }
  },
  instanceMethods: {
    async insert: (v) => {
      let res = await this.ctx.mongo.collection('users').insertOne(this);
      return this.populate(res[0]);
    }
  }
});
```

Where did the `this.ctx.mongo` came from? Models are context-aware documents and this is how you access application context to which a model belongs to. Before we create a context let's define some handlers for handling field-related errors.

It's not a coincident that we use [MongoDB](http://mongodb.github.io/node-mongodb-native/) in this tutorial. How to use the MongoDB driver and how to create a unique index is out of scope for this tutorial, but before you continue make sure, that you have a `unique` `sparse` index named `uniqueFirstName` for the `firstName` field defined on the `users` collection. When the `insert` method, which we defined earlier, is triggered for the second time, MongoDB will triggers the `E11000` error and our handler will catch it and convert it into a validation error. *Contextable.js* comes with some pre-build handlers and `mongoUniqueness` is one of them.

```js
let userSchema = new Schema({
  fields: {
    firstName: {
      ...
      handlers: {
        mongoUniqueness: {
          message: 'already exists',
          indexName: 'uniqueFirstName'
        }
      }
    },
    ...
  }
});
```

Continue by creating a context with a [MongoDB connector](http://mongodb.github.io/node-mongodb-native/) attached as `mongo` variab.

```js
import {MongoClient} from 'mongodb';
import {Context} from 'contextable';

let mongo = await MongoClient.connect('mongodb://localhost:27017/test');

let ctx = new Context({mongo});
```

We can now create a model from `userSchema`.

```js
ctx.defineModel('User', userSchema); // -> User
```

Let's take a common scenario and imagine that we write an [Express](http://expressjs.com) route handler, a [Koa](http://koajs.com) controller or maybe a [GraphQL](https://github.com/graphql/graphql-js) mutation, which will save user data into a database. We need to first validate the input, save the input data to a database and then respond with the created object or with a nicely formatted error. Here is how the code will look like.

```js
let User = ctx.getModel('User');

let user = new User({
  firstName: 'John',
  lastName: 'Smith',
  tags: ['admin']
});

let error = null;
let data = null;
try {
  await user.validate(); // throws a ValidationError when fields are invalid
  data = await user.insert(); // saves input data to a database
}
catch(e) {
  error = await user.handle(e); // creates a ValidationError from field-related errors or throws the original
}
// so something with data or error ...
```

## API

*Contextable.js* is built on top of [objectschema.js](https://github.com/xpepermint/objectschemajs) package which uses [typeable.js](https://github.com/xpepermint/typeablejs) for type casting, [validatable.js](https://github.com/xpepermint/validatablejs) for fields validation and [handleable.js](https://github.com/xpepermint/handleablejs) for handling field-related errors.

It provides two core classes. The `Schema` class represents a configuration object for defining context-aware models and the `Context` represents an unopinionated ORM framework.

### Schema

Schema represents a configuration object from which a Model class can be created. It holds information about fields, type casting, how fields are validated, how errors are handled and what the default values are. It also holds model's class methods, instance methods, class virtual fields and instance virtual fields.

A Schema can also be used as a custom type object. This way you can create a nested data structure by setting a schema instance for a field `type`. When a model is created, each schema in a tree of fields will become an instance of a Model - a tree of models.

**new Schema({fields, mode, validatorOptions, typeOptions, handlerOptions, classMethods, classVirtuals, instanceMethods, instanceVirtuals)**

> A class for defining model structure.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| fields | Object | Yes | - | An object with fields definition. You should pass a function which returns the definition object in case of self referencing.
| strict | Boolean | No | true | A schema type (set to false to allow dynamic fields not defined in schema).
| validatorOptions | Object | No | validatable.js defaults | Configuration options for the Validator class, provided by the [validatable.js](https://github.com/xpepermint/validatablejs), which is used for field validation.
| typeOptions | Object | No | typeable.js defaults | Configuration options for the cast method provided by the [typeable.js](https://github.com/xpepermint/typeablejs), which is used for data type casting.
| handlerOptions | Object | No | handleable.js defaults | Configuration options for the Handler class, provided by the [handleable.js](https://github.com/xpepermint/handleablejs), which is used for field error handling.
| classMethods | Object | No | - | An object defining model's class methods.
| classVirtuals | Object | No | - | An object defining model's enumerable class virtual properties.
| instanceMethods | Object | No | - | An object defining model's instance methods.
| instanceVirtuals | Object | No | - | An object defining model's  enumerable virtual properties.

```js
export const fields = {
  email: { // a field name holding a field definition
    type: 'String', // a field data type provided by typeable.js
    defaultValue: 'John Smith', // a default field value
    validate: { // field validations provided by validatable.js
      presence: { // validator name
        message: 'is required' // validator option
      }
    },
    handle: { // error handling provided by handle
      mongoUniqueness: { // handler name
        message: 'is already taken', // handler option
        indexName: 'uniqEmail' // handler option
      }
    }
  },
};

export const strict = true; // schema mode

export const validatorOptions = {}; // validatable.js configuration options (see the package's page for details)

export const typeOptions = {}; // typeable.js configuration options (see the package's page for details)

export const handlerOptions = {}; // handleable.js configuration options (see the package's page for details)

export const classMethods = {
  ping() { /* do something */ } // synchronous or asynchronous
};

export const classVirtuals = {
  version: {
    set(v) { /* setter */ }
    get() { /* getter */ }
  }
};

export const instanceMethods = {
  getTime() { /* do something */ } // synchronous or asynchronous
};

export const instanceVirtuals = {
  name: {
    set(v) { /* setter */ }
    get() { /* getter */ }
  }
};

export const schema = new Schema({
  fields,
  strict,
  validatorOptions,
  typeOptions,
  handlerOptions,
  classMethods,
  classVirtuals,
  instanceMethods,
  instanceVirtuals
});
```

This package uses [typeable.js](https://github.com/xpepermint/typeablejs) for data type casting. Many common data types and array types are supported but we can also define custom types or override existing types through a `typeOptions` key. Please check package's website for a list of supported types and further information.

By default, all fields in a schema are set to `null`. We can set a default value for a field by setting the `defaultValue` option.

Field validation is handled by the [validatable.js](https://github.com/xpepermint/validatablejs) package. We can configure the package by passing the `validatorOptions` option to our schema which will be passed directly to the `Validator` class. The package provides many built-in validators, allows adding custom validators and overriding existing ones. When a document is created all validator methods share document's context thus we can write context-aware checks. Please check package's website for details.

*Contextable.js* has a unique concept of handling field-related errors. It uses the [handleable.js](https://github.com/xpepermint/handleablejs) under the hood. We can configure the package by passing the `handlerOptions` key to our schema which will be passed directly to the `Handler` class. The package already provides some built-in handlers, it allows adding custom handlers and overriding existing ones. When a document is created all handlers share document's context thus we can write context-aware checks. Please check package's website for further information.

Schema also holds information about model's class methods, instance methods, class virtual fields and instance virtual fields. You can define synchronous or asynchronous, class and instance methods. All model properties are context-aware and you can access the context through the `this.ctx` getter.

### Context

Context is an object, holding application-related configuration data, data adapters and other information. It provides methods for creating unopinionated, context-aware, schema enforced models.

**new Context(props)**

> A class for creating contexts.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| props | Object | No | - | Enumerable properties which will be applied to a context.

```js
const ctx = new Context({
  version: '1.2.3', // example variable
  mongo: mongoose.connect('mongodb://localhost/test'), // example variable
  session: req.session // example variable
});
```

**ctx.defineModel('name', schema)**:Model

> Creates a new context-aware model.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| name | String | Yes | - | A name representing a name of a model.
| schema | Schema | Yes | - | An instance of the Schema class.

**ctx.getModel('name')**:Model

> Returns a Model class.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| name | String | Yes | - | Model name.

**ctx.deleteModel('name')**

> Deletes a Model class from a context.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| name | String | Yes | - | Model name.

### Model

A model is unopinionated, context-aware and schema enforced data object. It represents a class, which is dynamically built from a schema. A model is an upgraded [Document](https://github.com/xpepermint/objectschemajs#document) class, provided by the underlying [objectschema.js](https://github.com/xpepermint/objectschemajs) package, with custom class methods, enumerable class properties, instance methods and enumerable instance properties.

```js
let Model = ctx.defineModel('Model', schema);
```

A model provides a unified validation and error handling mechanism.

```js
let error = null;
try {
  await model.validate(); // throw an error when invalid
}
catch(e) {
  error = await model.handle(e); // creates a ValidationError from field-related errors or throws the original
}
error.toArray(); // returns array of validation errors (toObject() is also available)
```

**Model.$ctx**:Context

> Related context instance.

**Model.$schema**:Schema

> Related schema instance.

**Model.prototype.$ctx**:Context

> Related context instance.

**Model.prototype.$handler**:Handler

> Handler instance, used for handling field-related errors.

**Model.prototype.$parent**:Model

> Parent model instance.

**Model.prototype.$schema**:Schema

> Related schema instance.

**Model.prototype.$validator**:Validator

> Validator instance, used for validating fields.

**Model.prototype.approve()**:Model

> The same as `validate()` method but it throws the ValidationError when not all fields are valid.

```js
let error = null;
try {
  user.approve();
}
catch (e) {
  error = user.handle(e);
}
```

**Model.prototype.clear()**:Model

> Sets all model fields to `null`.

**Model.prototype.clone()**:Model

> Returns a new Model instance which is the exact copy of the original.

**Model.prototype.commit()**:Model

> Sets initial value of each model field to the current value of a field. This is how field change tracking is restarted.

**Model.prototype.equals(value)**:Boolean

> Returns `true` when the provided `value` represents an object with the same fields as the model itself.

**Model.prototype.hasPath(...keys)**:Boolean

> Returns `true` when a field path exists.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| keys | Array | Yes | - | List of object keys (e.g. `['book', 0, 'title']`).

**Model.prototype.handle(error)**:ValidationError

> If the error isn't an instance of ValidationError, then it tries to create one by using fields handlers. If the method is unable to handle the error, it throws the original error.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| error | Error | Yes | - | Instance of an Error object.

```js
let error = null;
try {
  user.approve();
}
catch (e) {
  error = user.handle(e);
}
```

**Model.prototype.isChanged()**:Boolean

> Returns `true` if at least one model field has been changed.

**Model.prototype.isValid()**:Promise

> Returns `true` when all model fields are valid.

**Model.prototype.populate(data)**:Model

> Applies data to a model.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| data | Object | Yes | - | Data object.

**Model.prototype.reset()**:Model

> Sets each model field to its default value.

**Model.prototype.rollback()**:Model

> Sets each model field to its initial value (last committed value). This is how you can discharge model changes.

**Model.prototype.toObject()**:Object

> Converts a model into serialized data object.

**Model.prototype.validate()**:Promise(Object)

> Validates all model fields and returns errors.

```js
{ // return value example
  name: { // field value is missing
    messages: [{validator: 'presence', message: 'is required'}]
  },
  book: { // nested object is missing
    messages: [{validator: 'presence', message: 'is required'}]
  },
  address: {
    messages: [],
    related: { // nested object errors
      post: {
        messages: [{validator: 'presence', message: 'is required'}]
      }
    }
  },
  friends: { // an array of nested objects has errors
    messages: [],
    related: [
      undefined, // the first item was valid
      { // the second item has errors
        name: {
          messages: [{validator: 'presence', message: 'is required'}]
        }
      }
    ]
  }
}
```

## Example

An example application is available in the `./example` folder. You can start the example by executing the `npm run example` command.

## License (MIT)

```
Copyright (c) 2016 Kristijan Sedlak <xpepermint@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```

## TO-DO

* reference to parent schema in validator
* track changes (dirty, pristine, previous)
* validate by field state (dirty, pristine)
