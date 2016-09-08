![Build Status](https://travis-ci.org/xpepermint/contextablejs.svg?branch=master)&nbsp;[![NPM Version](https://badge.fury.io/js/contextable.svg)](https://badge.fury.io/js/contextable)&nbsp;[![Dependency Status](https://gemnasium.com/xpepermint/contextablejs.svg)](https://gemnasium.com/xpepermint/contextablejs)

# contextable.js

> Simple, unopinionated and minimalist framework for creating context objects with support for unopinionated ORM, object schemas, type casting, validation and error handling.

This is an open source package. The source code is available on [GitHub](https://github.com/xpepermint/contextablejs) where you can also find our [issue tracker](https://github.com/xpepermint/contextablejs/issues).

<img src="giphy.gif" width="300" />

## Motivation

### Application Context

[Monolithic applications](https://en.wikipedia.org/wiki/Monolithic_application) usually have a single entry point where project gets initialized, where connection to a database is handled, where dependencies are loaded, where related services are started, where content is rendered and so on. All these parts usually share the same application context and we can use context-aware components (e.g. database models) anywhere in our code.

Node.js gives us freedom which allows for different applications and multiple instances of the same application to be started in the same process. This means that all services in this case share the same application context which is not desirable and many times seriously dangerous. This freedom doesn't come without sacrifices. Not having a unified application context is a very big problem and writing a long-term sustainable code becomes a challenge.

Wouldn't be nice if we could create an application context object for each application and we would simple send a desired context down to all application objects when the application is created and the application would magically work isolated from other applications in the process. The application in this case becomes a configurable component thus we can run multiple instances of the same application, with different contexts, within the same process.

This is one of the core features of *Contextable.js*. The idea is not drastically new but  brings a different prospective of what an application is and how ti works. Did you know, that the JavaScript implementation of [GraphQL](https://github.com/graphql/graphql-js) adopts this concept - you send a context to GraphQL resolvers by passing it as an argument to the `graphql` method? There are other examples, for sure.

### Unopinionated ORM

Almost all monolithic frameworks provide some sort of ORM (e.g. ActiveRecord) for easy data manipulation where the magic does all the heavy database stuff. A good and flexible ORM is actually the crucial added value for a developer. Good JavaScript ORMs also handle data type casting for us thus the object values always have the desired data type. Beside that and all other goodies, things get complicated if multiple database adapters are needed. None of these solutions expect that a single model would need to use two or more different databases at the same time within the same model. All models are supposed to use a single database adapter.

In Node.js environment you can find super duper ORM packages like [mongoose](http://mongoosejs.com/), [sequelize](sequelizejs.com), [bookshelf](http://bookshelfjs.org/) and so on. You can get pretty cool layer of functionality as with popular monolithic frameworks like Ruby on Rails but you still don't have a unified ORM system and your models are always locked to a specific database adapter.

*Contextable.js* is unopinionated ORM offering tools for building unopinionated models withing a context. Models share the same (application) context and thus can use all features attached to a context. This means that if you attach [MongoDB](https://github.com/mongodb/node-mongodb-native) and [ElasticSearch](https://github.com/elastic/elasticsearch-js) connectors to a context your models will be able to use both of them at the same time. You can add whatever you need to a context and all that features are automagically available in all you models. Pretty cool right?

### Validation and Error Handling

Data validation and error handling is a common thing when writing API controllers, GraphQL mutations, before we try to write something into a database and in many other cases where we manipulate and mutate data. Every time you start writing validations, you ask yourself the same questions. You try hard finding the best way to get a clean and beautiful solution. At the end you desperately start googling for answers, searching best practices and possible conventions.

ORM frameworks usually provide object validation out of the box. What about error handling? Isn't that pretty similar thing? Validation happens before actual action and error handling happens afterwords thus validation and error handling go hand in hand. *Contextable.js* has been written with that in mind.

Let's take a real life use case where we are inserting books with unique names into a MongoDB collection. We validate each book before we write anything into a database. To be safe, we also validate if a book with the provided name already exists. If the book object isn't valid we show nicely formatted error messages to a user telling what went wrong. When the object is valid we write it to the database. Will the operation succeed? Maybe yes, sometimes no. We can expect at least the `E11000` MongoDB error, for sure. This is because validation and write operation do not execute in atomic way. In case of an error we again want to show a nicely formatted error message to a user. This means that we need to write two error handling mechanisms for pretty much the same thing.

*Contextable.js* unifies validation and error handling. We can handle validation and other errors in a single way thus we can show unified error messages to a user. We only need to tell *Contextable.js* which errors to be handled and how to be handled, *Contextable.js* will do the rest.

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

Fields can be validated simply by adding the `validations` attribute to each field definition block. *Contextable.js* includes many [built-in validators](#schema) that we can use. For now we will only check if the fields are present.

```js
let userSchema = new Schema({
  fields: {
    firstName: {
      ...
      validations: {
        presence: {
          message: 'is required'
        }
      }
    },
    lastName: {
      ...
      validations: {
        presence: {
          message: 'is required'
        }
      }
    },
    tags: [
      ...
    ]
  }
});
```

Schema also supports computed fields, thus we can define class and instance virtual fields as well.

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

Where did the `this.ctx.mongo` came from? Models are context-aware documents and this is how you access application context. Before we create a context let's define some handlers for handling errors.

It's not a coincident that we use [MongoDB](http://mongodb.github.io/node-mongodb-native/) in this tutorial. How to use the MongoDB driver and how to create a unique index is out of scope for this tutorial, but before you continue make sure, that you have a unique index with name `uniqueFirstName` for the `firstName` field defined on the `users` collection. When the `insert` method, which we defined earlier, is triggered for the second time, MongoDB will triggers the `E11000` error and our handler will catch it and parse it into a nicely formatted validation error format. *Contextable.js* comes with some pre-build handlers and `mongoUniqueness` is one of them.

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

The context with [MongoDB connector](http://mongodb.github.io/node-mongodb-native/) is what we need to create as our next step.

```js
import {MongoClient} from 'mongodb';
import {Context} from 'contextable';

let mongo = await MongoClient.connect('mongodb://localhost:27017/test');

let ctx = new Context({mongo});
```

We can now create a model from our schema above.

```js
ctx.createModel('User', userSchema); // -> User
```

Let's take a common scenario and imagine that we write an [Express](http://expressjs.com) route handler, a [Koa](http://koajs.com) controller or maybe a [GraphQL](https://github.com/graphql/graphql-js) mutation which will save user data into a database. We need to first validate the input, save the input to a database and then respond with the created object or with a nicely formatted error. Here is how the code will look like.

```js
let User = ctx.getModel('User');

let user = new User({
  firstName: 'John',
  lastName: 'Smith',
  tags: ['admin']
});

try {
  await user.approve(); // throw an error when invalid
  await user.save(); // save to database
} catch(e) {
  if (await user.handle(e)) throw e; // parse errors
}
let errors = user.getValidationErrors(); // nicely formatted error messages
let data = user.toObject(); // nicely formatted data object
```

That's it.

## API

*Contextable.js* is built on top of [objectschema.js](https://github.com/xpepermint/objectschemajs) package which uses [typeable.js](https://github.com/xpepermint/typeablejs) for type casting and [validatable.js](https://github.com/xpepermint/validatablejs) for fields validation.

It provides two core classes. The `Schema` class represents a configuration object for defining context-aware models and the `Context` represents an unopinionated ORM framework.

### Schema

Schema represents a configuration object from which a Model class is created. It holds information about fields, type casting, how fields are validated, what the default values are. It also holds class methods, instance methods, class virtual fields and instance virtual fields.

A Schema can also be used as a custom type object. This means that you can create a nested data structure by setting a schema instance for a field type.

**new Schema({fields, mode, validator, classMethods, classVirtuals, instanceMethods, instanceVirtuals)**

> A class for defining document structure.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| fields | Object | Yes | - | An object with fields definition.
| mode | String | No | strict | A schema type (use `relaxed` to allow dynamic fields not defined by the schema).
| validator | Object | No | validatable.js defaults | Configuration options for the Validator class, provided by the [validatable.js](https://github.com/xpepermint/validatablejs), which are used by this package for field validation.
| type | Object | No | typeable.js defaults | Configuration options which are passed directly to the the `cast` method of the [typeable.js](https://github.com/xpepermint/typeablejs) package which is used for type casting.
| classMethods | Object | No | - | An object defining model's class methods.
| classVirtuals | Object | No | - | An object defining model's enumerable class virtual properties.
| instanceMethods | Object | No | - | An object defining model's instance methods.
| instanceVirtuals | Object | No | - | An object defining model's  enumerable virtual properties.

```js
export const mode = 'strict'; // schema mode

export const fields = {
  email: { // a field name holding a field definition
    type: 'String', // a field data type provided by typeable.js
    defaultValue: 'John Smith', // a default field value
    validations: { // field validations provided by validatable.js
      presence: { // validator name
        message: 'is required' // validator option
      }
    },
    handlers: { // error handling provided by handle
      mongoUniqueness: { // handler name
        message: 'is already taken', // handler option
        indexName: 'uniqEmail' // handler option
      }
    }
  },
};

export const validator = {}; // validatable.js configuration options (see the package's page for details)

export const type = {}; // typeable.js configuration options (see the package's page for details)

export const handler = {}; // handlable.js configuration options (see the package's page for details)

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

export new Schema({
  mode,
  fields,
  validator,
  classMethods,
  classVirtuals,
  instanceMethods,
  instanceVirtuals
});
```

As mentioned before, this package uses [typeable.js](https://github.com/xpepermint/typeablejs) for data type casting. Many common data types and array types are supported. Please check package's website for a list of supported types and further information.

By default, all fields in a schema are set to `null`. We can set a default value for a field by setting the `defaultValue` option.

Field validation is handled by the [validatable.js](https://github.com/xpepermint/validatablejs) package. We can configure the validator by passing the validator option to the Schema class, which will be passed directly to the Validator class. The package provides many built-in validators, allows adding custom validators and overriding existing ones. Please check package's website for details.

Schema also holds information about class methods, instance methods, class virtual fields and instance virtual fields of a model. Note that you can define any type of method - synchronous or asynchronous, with callbacks or promises.

### Context

Context is an object on which we attach application-related configuration, data adapters and other information. It provides methods for creating context-aware documents which we call models.

**new Context(props)**

> A class for creating contexts.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| props | Object | No | - | Enumerable properties which will be applied to a context.

```js
const ctx = new Context({
  key: '8090913k12k3j1lk5j23k4',
  mongo: mongoose.connect('mongodb://localhost/test'),
  session: req.session
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

A model is a class which is dynamically built from a schema. A model is an upgraded and context-aware [Document](https://github.com/xpepermint/objectschemajs#document) class, provided by the underlying [objectschema.js](https://github.com/xpepermint/objectschemajs) package, with custom class methods, enumerable class properties, instance methods and enumerable instance properties.

A model also provides a unique unified validation and error handling mechanism where where validation and other errors are handled in a single way thus we can show unified error messages to a user.

```js
let Model = ctx.defineModel('Model', schema);
```

**model.approve()**

> Validates model fields and throws a ValidationError when fields are not valid.

**model.handle(error)**

> Parses an error into a friendly error message which can be shown to a user.

**model.populate(data)**:Model

> Assigns data to a model.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| data | Object | Yes | - | Data object.

**model.populateField(name, value)**:Any

> Sets a value of a model field.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| name | String | Yes | - | Model field name.
| value | Any | Yes | - | Data object.

**model.clear()**:Model

> Sets all model fields to `null`.

**model.clearField(name)**:Model

> Sets a model field to `null`.

**model.clone()**:Model

> Returns a new model instance which is the exact copy of the original.

**model.toObject()**:Object

> Converts a model into serialized data object.

**model.validate()**:Promise

> Validates all model fields and returns errors.

```js
{ // return value example
  name: { // field value is missing
    messages: ['is required'],
    isValid: false
  },
  book: { // nested object is missing
    messages: ['is required'],
    isValid: false
  },
  address: {
    messages: [],
    related: { // nested object errors
      post: {
        messages: ['is required'],
        isValid: false
      }
    },
    isValid: false
  },
  friends: { // an array of nested objects has errors
    messages: [],
    related: [
      undefined, // the first item was valid
      { // the second item has errors
        name: {
          messages: ['is required'],
          isValid: false
        }
      }
    ],
    isValid: false
  }
}
```

**model.validateField(name)**:Promise

> Validates a model field and returns errors.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| name | String | Yes | - | Document field name.

**model.isValid()**:Promise

> Returns `true` when all model fields are valid.

**model.equalsTo(value)**:Boolean

> Returns `true` when the provided `value` represents an object with the same field values as the original model.

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
