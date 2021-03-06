![Build Status](https://travis-ci.org/xpepermint/contextablejs.svg?branch=master)&nbsp;[![NPM Version](https://badge.fury.io/js/contextable.svg)](https://badge.fury.io/js/contextable)&nbsp;[![Dependency Status](https://gemnasium.com/xpepermint/contextablejs.svg)](https://gemnasium.com/xpepermint/contextablejs)

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                   _            _        _     _         _       │
│    ___ ___  _ __ | |_ _____  _| |_ __ _| |__ | | ___   (_)___   │
│   / __/ _ \| '_ \| __/ _ \ \/ / __/ _` | '_ \| |/ _ \  | / __|  │
│  | (_| (_) | | | | ||  __/>  <| || (_| | |_) | |  __/_ | \__ \  │
│   \___\___/|_| |_|\__\___/_/\_\\__\__,_|_.__/|_|\___(_)/ |___/  │
│                                                      |__/       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

# contextable.js

> Simple, unopinionated and minimalist framework for creating context objects with support for unopinionated ORM, object schemas, type casting, validation and error handling.

This is a light weight open source package for use on **server** or in **browser** (using module bundler). It has a reach API which significantly simplifies server-side and client-side data validation and manipulation. The source code is available on [GitHub](https://github.com/xpepermint/contextablejs) where you can also find our [issue tracker](https://github.com/xpepermint/contextablejs/issues).

<img src="giphy.gif" width="300" />

## Features

* Context object
* Model object
* Type casting
* Custom data types
* Field default value
* Field fake value
* Field value transformation with getter and setter
* Strict and relaxed schemas
* Schema mixins for extending schemas
* Model serialization and filtering
* Model nesting with support for self referencing
* Change tracking, data commits and rollbacks
* Advanced field validation
* Enhanced error handling

## Projects

### Packages

* [vue-contextable.js](https://github.com/xpepermint/vue-contextable): [related] Contextable.js plugin for [Vue.js](https://vuejs.org/) v2.
* [objectSchema.js](https://github.com/xpepermint/objectschemajs): [dependency] Advanced schema enforced JavaScript objects.
* [validatable.js](https://github.com/xpepermint/validatablejs): [dependency] A library for synchronous and asynchronous validation.
* [handleable.js](https://github.com/xpepermint/handleablejs): [dependency] A library for synchronous and asynchronous error handling.
* [typeable.js](https://github.com/xpepermint/typeablejs): [dependency] A library for checking and casting types.

### Examples

An example application is available in the `./example` folder. You can start the example by executing the `npm run example` command from the command-line.

* [graphql-example](https://github.com/xpepermint/graphql-example): A GraphQL application example (intuitive rootValue resolvers using contextable.js)
* [vue-example](https://github.com/xpepermint/vue-example): Vue.js example application (server-side rendering, router, vuex store, forms validation with contextable.js)

## Motivation

### Application Context

[Monolithic applications](https://en.wikipedia.org/wiki/Monolithic_application) usually have a single entry point where a project gets initialized, where a connection to a database is handled, where dependencies are loaded, where related services are started, where content is rendered and so on. All these parts usually share the same application context and we can use context-aware components (e.g. database models) anywhere in our code.

Node.js gives us freedom which allows for different applications and multiple instances of the same application to be started in the same process. This means that all services in this case share the same application context which is not desirable and many times seriously dangerous. This freedom doesn't come without sacrifices. Not having a unified application context is a very big problem and writing a long-term sustainable code becomes a challenge.

Wouldn't be nice if we could create an application context object for each application and we would simple send it down to the application objects (when the application is created) and the application would magically work isolated from other applications in the process. The application in this case becomes a configurable component thus we can run multiple instances of the same application, with different contexts, within the same process.

This is one of the core features of *Contextable.js*. The idea is not drastically new but brings a different prospective of what an application is and how ti works. [GraphQL](https://github.com/graphql/graphql-js) also adopts this concept - you send a context to GraphQL resolvers by passing it as an argument to the `graphql` method. There are other examples, for sure.

### Unopinionated ORM

Almost all monolithic frameworks provide some sort of ORM (e.g. ActiveRecord) for easy data manipulation where the magic does all the heavy database stuff. Good and flexible ORM is the crucial added value for a developer. Good JavaScript ORMs also handle data type casting for us thus the object values always have the desired data type. Beside that and all other goodies, things get complicated if multiple database adapters are needed. None of these solutions expect that a single model would need to use two or more different databases at the same time within the same model. All models are supposed to use a single database adapter.

In Node.js environment you can find super duper ORM packages like [mongoose](http://mongoosejs.com/), [sequelize](sequelizejs.com) and  [bookshelf](http://bookshelfjs.org/). You can get pretty good layer of functionality as with popular monolithic frameworks like Ruby on Rails, but you still don't have a unified ORM system and your models are always locked to a specific database adapter.

*Contextable.js* is unopinionated ORM, offering tools for building unopinionated, context-aware models. Models share the same (application) context and thus can use all features attached to a context. This means that if you attach [MongoDB](https://github.com/mongodb/node-mongodb-native) and [ElasticSearch](https://github.com/elastic/elasticsearch-js) connectors to a context your models will be able to use both of them at the same time. You can add whatever you need to a context and all that features are automagically available in all you models.

### Validation and Error Handling

Data validation and error handling is a common thing when writing API controllers, GraphQL mutations, before we try to write something into a database and in many other cases where we manipulate and mutate data. Every time you start writing validations, you ask yourself the same questions. You try hard finding the best way to get a clean and beautiful solution. At the end you desperately start googling for answers, searching best practices and possible conventions.

ORM frameworks usually provide object validation out of the box. What about error handling? Isn't that pretty similar thing? Validation happens before actual action and error handling happens afterwords thus validation and error handling go hand in hand. *Contextable.js* has been written with that in mind.

Let's take a real life use case where we are inserting books with unique names into a MongoDB collection. We validate each book before we write anything into a database. To be safe, we also validate that a book with the provided name does not exists in a database. If the book object isn't valid we show a nicely formatted error message to a user telling what went wrong. When the object is valid we write it to the database. Will the operation always succeed? Maybe yes, sometimes no. We can expect at least the `E11000` MongoDB error. This is because validation and write operation do not execute in atomic way. In case of a database error, we again want to show a nicely formatted error message to a user. This means that we need to write two error handling mechanisms for pretty much the same thing.

*Contextable.js* unifies validation and error handling. We can handle validation and other field-related errors in a single way. We only need to tell *Contextable.js* which errors to be handled and how to be handled, *Contextable.js* will do the rest.

## Install

Run the command below to install the package.

```
$ npm install --save contextable
```

## Usage

### Detailed Tutorial

Below, we create a simple example to show the benefit of using `Contextable.js` in your [Node.js](https://nodejs.org) project. In this tutorial we create a new context instance with a User model attached, then we insert a user document in a [MongoDB](https://www.mongodb.com) database. The example also explains the concept of validation and error handling.

To make things easy to read, we use ES6+ syntax and wrap our code into the `async` block.

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
      type: ['String'],
      defaultValue: ['user']
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
      validate: [
        {
          validator: 'presence',  // validator name
          message: 'is required' // validator error message
        }
      ]
    },
    lastName: {
      ...
      validate: [
        {
          validator: 'presence',  // validator name
          message: 'is required' // validator error message
        }
      ]
    },
    tags: {
      ...
      validate: [
        {
          validator: 'presence',  // validator name
          message: 'is required' // validator error message
        }
      ]
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
      get () { return `v0.0.1` }
    }
  },
  instanceVirtuals: {
    name: { // e.g. user.name
      get () { return `${this.firstName} ${this.lastName}` }
    }
  }
});
```

Schema holds information about class and instance methods. We can define whatever methods we need - synchronous or asynchronous. Let's add some useful methods for managing user data.

```js
let userSchema = new Schema({
  ...
  classMethods: {
    async count (id) {
      return await this.$context.mongo.collection('users').count();
    }
  },
  instanceMethods: {
    async insert (v) {
      return await this.$context.mongo.collection('users').insertOne(this);
    }
  }
});
```

Where did the `this.$context.mongo` came from? Models are context-aware documents and this is how you access application context to which a model belongs to. Before we create a context, let's define some handlers for handling field-related errors.

It's not a coincident that we use [MongoDB](http://mongodb.github.io/node-mongodb-native/) in this tutorial. How to use the MongoDB driver and how to create a unique index is out of scope for this tutorial, but before you continue make sure, that you have a `unique`, `sparse` index named `uniqueFirstName` for the `firstName` field defined on the `users` collection. When the `insert` method, which we defined earlier, is triggered for the second time, MongoDB will triggers the `E11000` error and our handler will catch it and convert it into a validation error. *Contextable.js* comes with some pre-build handlers and `mongoUniqueness` is one of them.

```js
let userSchema = new Schema({
  fields: {
    firstName: {
      ...
      handle: [
        {
          handler: 'mongoUniqueness', // handler name
          message: 'already taken', // handler error message
          indexName: 'uniqueFirstName' // handler-specific property
        }
      ]
    },
    ...
  }
});
```

Continue by creating a context with a [MongoDB connector](http://mongodb.github.io/node-mongodb-native/) attached as `mongo` variable.

```js
import {MongoClient} from 'mongodb';
import {Context} from 'contextable';

let mongo = await MongoClient.connect('mongodb://localhost:27017/test');

let context = new Context({mongo});
```

We can now create a model from `userSchema`.

```js
context.defineModel('User', userSchema); // -> User
```

Let's take a common scenario and imagine that we are writing an [Express](http://expressjs.com) route handler, a [Koa](http://koajs.com) controller or maybe a [GraphQL](https://github.com/graphql/graphql-js) mutation, which will save user into a database. We need to first validate the input, save the input data to a database and then respond with the created object or with a nicely formatted error. Here is how the code will look like.

```js
let User = context.getModel('User');

let user = new User({
  firstName: 'John',
  lastName: 'Smith',
  tags: ['admin']
});

try {
  await user.validate(); // throws a validation error when fields are invalid
  await user.insert(); // our custom method which saves input data to a database
}
catch (e) {
  await user.handle(e); // handles the `e` or throws it if unhandled
}

user.firstName; // -> John
user.$firstName; // -> reference to a field class instance
user.$firstName.errors; // -> an array of field-specific errors
user.collectErrors(); // -> an array of all errors (including those deeply nested)
```

### GraphQL Root Resolver

Contextable.js can be used as a [GraphQL](http://graphql.org) `rootValue` resolver. Let's take an example from the official [GraphQL website](http://graphql.org).

```js
var {graphql, buildSchema} = require('graphql');

var schema = buildSchema(`
  type Query {
    hello: String
  }
`);

var root = {hello: () => 'Hello world!'}; // root resolver

graphql(schema, '{hello}', root).then((response) => {
  console.log(response);
});
```

The `root` variable above represents a GraphQL root resolver. We can easily replace it with a powerful and context-aware model.

```js
var {Context, Schema} = require('contextable');

var context = new Context();
context.defineModel('Root', new Schema({
  instanceMethods: {
    hello () { return 'Hello world!' }
  }
}));

var root = new context.Root();
```

By replacing the `root` variable line with the code above we get a powerful context-aware resolving system on steroids with all the available feature that are provided by the `contextable.js`.

The [graphql-example](https://github.com/xpepermint/graphql-example) project is a real-life implementation example where you will find all the details (nested schema, input validation, database implementation, project structure and more).

## API

*Contextable.js* is built on top of [objectSchema.js](https://github.com/xpepermint/objectschemajs) which uses [typeable.js](https://github.com/xpepermint/typeablejs) for type casting, [validatable.js](https://github.com/xpepermint/validatablejs) for fields validation and [handleable.js](https://github.com/xpepermint/handleablejs) for handling field-related errors.

It provides two core classes. The `Schema` class represents a configuration object for defining context-aware models and the `Context` represents the application context and an unopinionated ORM framework.

### Schema

Schema represents a configuration object from which a `Model` can be created. It holds information about fields, type casting, how fields are validated, how errors are handled and what the default values are. It also holds model's class methods, instance methods, class virtual fields and instance virtual fields.

A Schema can also be used as a custom type object. This way you can create a nested data structure by setting a schema instance for a field `type`. When a model is created, each schema in a tree of fields will become an instance of a Model - thus we get a tree of models.

**new Schema({mixins, fields, strict, validators, types, handlers, classMethods, classVirtuals, instanceMethods, instanceVirtuals)**

> A class for defining model structure.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| mixins | [] | No | [] | A list of schema instances from which to extend the schema.
| fields | Object | Yes | - | An object with fields definition. You should pass a function which returns the definition object in case of self referencing.
| strict | Boolean | No | true | A schema type (set to false to allow dynamic fields not defined by schema).
| validators | Object | No | validatable.js defaults | Custom validators for  [validatable.js](https://github.com/xpepermint/validatablejs).
| types | Object | No | typeable.js defaults | Custom types for  [typeable.js](https://github.com/xpepermint/typeablejs).
| handlers | Object | No | handleable.js defaults | Custom handlers for  [handleable.js](https://github.com/xpepermint/handleablejs).
| firstErrorOnly | Boolean | No | false | When set to true, the validation stops after the first error.
| classMethods | Object | No | - | An object defining model's class methods.
| classVirtuals | Object | No | - | An object defining model's enumerable class virtual properties.
| instanceMethods | Object | No | - | An object defining model's instance methods.
| instanceVirtuals | Object | No | - | An object defining model's  enumerable virtual properties.

```js
export const fields = {
  mixins: [animalSchema, catSchema], // schema extensions
  email: { // a field name holding a field definition
    type: 'String', // [required] a field data type provided by typeable.js
    defaultValue: 'John Smith', // a default field value (can be a value of a function)
    fakeValue: 'John Smith', // a fake field value (can be a value of a function)
    validate: [ // field validations provided by validatable.js
      { // validator recipe
        validator: 'presence',  // [required] validator name
        message: 'is required', // [required] validator error message
        condition () { return true } // condition to switch off the validator
      }
    ],
    handle: [ // error handling provided by handle
      { // handler recipe
        handler: 'mongoUniqueness', // [required] handler name
        message: 'already taken', // [required] handler error message
        indexName: 'uniqEmail' // handler-specific property
        condition () { return true }, // condition to switch off the validator
      }
    ]
  }
};

export const strict = true; // schema mode

export const validators = {}; // validatable.js configuration options (see the package's page for details)

export const types = {}; // typeable.js configuration options (see the package's page for details)

export const handlers = {}; // handleable.js configuration options (see the package's page for details)

export const firstErrorOnly = false; // validatable.js and handleable.js configuration option

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
  validators,
  types,
  handlers,
  firstErrorOnly,
  classMethods,
  classVirtuals,
  instanceMethods,
  instanceVirtuals
});
```

This package uses [typeable.js](https://github.com/xpepermint/typeablejs) for data type casting. Many common data types and array types are supported but we can also define custom types or override existing types through the `types` key. Please check package's website for a list of supported types and further information.

By default, all fields in a schema are set to `null`. We can set a default value for a field by setting the `defaultValue` option.

Field validation is handled by the [validatable.js](https://github.com/xpepermint/validatablejs) package. We can configure the package by setting `validators` and `firstErrorOnly` options. The package provides many built-in validators, allows adding custom validators and overriding existing ones. When a document is created all validator methods share document's context thus we can write context-aware checks. Please check package's website for details.

*Contextable.js* has a unique concept of handling field-related errors. It uses the [handleable.js](https://github.com/xpepermint/handleablejs) under the hood. We can configure the handler through the `handlers` and `firstErrorOnly` keys The package already provides some built-in handlers, it allows adding custom handlers and overriding existing ones. When a document is created all handlers share document's context thus we can write context-aware checks. Please check package's website for further information.

Schema also holds information about model's class methods, instance methods, class virtual fields and instance virtual fields. You can define synchronous or asynchronous, class and instance methods. All model properties are context-aware and you can access the context through the `this.$context` getter.

### Context

Context is an object, holding application-related configuration data, adapters and other information. It provides methods for creating unopinionated, context-aware, schema enforced models.

**new Context(props)**

> A class for creating contexts.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| props | Object | No | - | Enumerable properties which will be applied to a context.

```js
const context = new Context({
  version: '1.2.3', // example variable
  mongo: mongoose.connect('mongodb://localhost/test'), // example variable
  session: req.session // example variable
});
```

**context.defineProperty(name, descriptor)**:Any

> Defines a new property directly on the context object.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| name | String | Yes | - | A name representing a name of a model.
| descriptor | Object | Yes | - | The [descriptor](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty#Description) for the property being defined or modified.

```js
let memorize = context.defineProperty('memorize', {
  value: 'This is awesome.',
  enumerable: true
});
```

**context.defineModel(name, schema, options)**:Any

> Defines a new context-aware model directly on the context object.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| name | String | Yes | - | The name of a model.
| schema | Schema | Yes | - | An instance of Schema.
| options | Object | No | {} | The [descriptor](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty#Description) options for the property being defined or modified (except options `value`, `get` and `set`).

```js
let User = context.defineModel('User', new Schema({
  fields: {
    name: {
      type: 'String'
    }
  }
}));
```

### Model

A model is unopinionated, context-aware and schema enforced data object. It represents a class, which is dynamically built from a schema. A model is an upgraded [Document](https://github.com/xpepermint/objectschemajs#document) class, provided by the underlying [objectSchema.js](https://github.com/xpepermint/objectschemajs) package, with custom class methods, enumerable class properties, instance methods and enumerable instance properties.

```js
let Model = context.defineModel('Model', schema);
```

A model provides a unified validation and error handling mechanism.

```js
try {
  await model.validate(); // throws a validation error when fields are invalid
}
catch (e) {
  await model.handle(e); // creates a validation error from handlers, updates the `user.$error` or throws
}
model.$error; // holds the last validation error instance
```

**Model.$context**: Context

> Related context instance.

**Model.prototype.$context**:Context

> Related context instance.

**Model.prototype.$handler**:Handler

> Handler instance, used for handling field-related errors.

**Model.prototype.$parent**: Model

> Parent model instance.

**Model.prototype.$root**: Model

> The first model instance in a tree of models.

**Model.prototype.$schema**: Schema

> Schema instance.

**Model.prototype.$validator**: Validator

> Validator instance, used for validating fields.

**Model.prototype.applyErrors(errors)**: Model

> Deeply populates fields with the provided `errors`.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| errors | Array | No | [] | An array of errors.

```js
doc.applyErrors([
  {
    path: ['name'], // field path
    errors: [
      {
        validator: 'presence',  // validator name
        message: 'is required', // validator message
        code: 422 // error code
      }
    ]
  },
  {
    path: ['newBook', 'title'],
    errors: [
      {
        handler: 'fooHandler',
        message: 'is not foo',
        code: 422 // error code
      }
    ]
  },
  {
    path: ['newBooks', 1, 'title'],
    errors: [
      {
        validator: 'presence',
        message: 'is required',
        code: 422 // error code
      }
    ]
  }
]);
```

**Model.prototype.clear()**: Model

> Sets all model fields to `null`.

**Model.prototype.clone()**: Model

> Returns a new Model instance which is the exact copy of the original.

**Model.prototype.collect(handler)**: Array

> Scrolls through model fields and collects results.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| handler | Function | Yes | - | A handler method which is executed for each field.

**Model.prototype.collectErrors()**: Array

> Returns a list of errors for all the fields (e.g. [{path, errors}[]).

**Model.prototype.commit()**: Model

> Sets initial value of each model field to the current value of a field. This is how field change tracking is restarted.

**Model.prototype.equals(value)**: Boolean

> Returns `true` when the provided `value` represents an object with the same fields as the model itself.

**Model.prototype.fake()**: Model

> Sets each model field to its fake value if a fake value generator is registered, otherwise the default value is used.

**Model.prototype.filter(handler)**: Object

> Converts a model into serialized data object with only the keys that pass the test.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| handler | Function | Yes | - | A function to test each key value. If the function returns `true` then the key is included in the returned object.

**Model.prototype.flatten()**: Array

> Converts the model into an array of fields.

**Model.prototype.getPath(...keys)**: Field

> Returns a class instance of the field at path.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| keys | Array | Yes | - | Path to a field (e.g. `['book', 0, 'title']`).

**Model.prototype.handle(error, {quiet})**: Promise(Model)

> If the error isn't an instance of validation error, then it tries to handle it against fields handlers. If the method is unable to handle the error, the error is thrown.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| error | Error | Yes | - | Instance of an Error object.
| quiet | Boolean | No | true | When set to true, a handled validation error is thrown. This doesn't affect the unhandled errors (they are always thrown).

```js
try {
  await model.validate(); // throws a validation error when fields are invalid
}
catch (e) {
  await model.handle(e); // handles `e` or throws it if unhandled
}
user.$email.errors; // -> an array of field-specific errors
user.collectErrors(); // -> an array of all errors (including those deeply nested)
```

**Model.prototype.hasErrors()**: Boolean

> Returns `true` when no errors exist (inverse of `isValid()`). Make sure that you call the `validate()` method first.

**Model.prototype.hasPath(...keys)**: Boolean

> Returns `true` when a field path exists.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| keys | Array | Yes | - | Path to a field (e.g. `['book', 0, 'title']`).

**Model.prototype.isChanged()**: Boolean

> Returns `true` if at least one model field has been changed.

**Model.prototype.isNested()**: Boolean

> Returns `true` if nested fields exist.

**Model.prototype.isValid()**: Boolean

> Returns `true` when all model fields are valid (inverse of `hasErrors()`). Make sure that you call the `validate()` method first.

**Model.prototype.invalidate()**: Model

> Clears `errors` on all fields (the reverse of `validate()`).

**Model.prototype.populate(data)**: Model

> Applies data to a model.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| data | Object | Yes | - | Data object.

**Model.prototype.reset()**: Model

> Sets each model field to its default value.

**Model.prototype.rollback()**: Model

> Sets each model field to its initial value (last committed value). This is how you can discharge model changes.

**Model.prototype.scroll(handler)**: Integer

> Scrolls through model fields and executes a handler on each field.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| handler | Function | Yes | - | A handler method which is executed for each field.

**Model.prototype.serialize()**: Object

> Converts a model into serialized data object.

**Model.prototype.validate({quiet})**: Promise(Model)

> Validates model fields and throws a validation error if not all fields are valid unless the `quiet` is set to `true`.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| quiet | Boolean | No | false | When set to `true`, a validation error is thrown.

```js
try {
  await doc.validate(); // throws a validation error when fields are invalid
}
catch (e) {
  // `e` is an instance of validation error, which holds errors for all invalid fields (including those deeply nested)
}
```

### Field

When a field is defined on a model, another field with the same name but prefixed with the `$` is set (e.g. `$name` for field `name`). This special read-only field holds a reference to the actual field's class instance.

```js

let User = context.getModel('user');
let user = new User();

user.name = 'John'; // actual model field
user.$name; // reference to model field instance
user.$name.isChanged(); // calling field instance method
```

**Field(owner, name)**

> A field class which represents each field on a model.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| owner | Model | Yes | - | An instance of a Model which owns the field.
| name | String | Yes | - | Field name (the same name as used in schema).

**Field.prototype.$owner**: Model

> A reference to a Model instance on which the field is defined.

**Field.prototype.clear()**: Field

> Sets field and related sub fields to `null`.

**Field.prototype.commit()**: Field

> Sets initial value to the current value. This is how field change tracking is restarted.

**Field.prototype.defaultValue**: Any

> A getter which returns the default field value.

**Field.prototype.equals(value)**: Boolean

> Returns `true` when the provided `value` represents an object that looks the same.

**Field.prototype.fake()**: Field

> Sets field to a generated fake value.

**Field.prototype.fakeValue**: Any

> A getter which returns a fake field value.

**Field.prototype.handle(error)**: Promise(Field)

> Handles the `error` and populates the `errors` property with errors.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| error | Error | Yes | - | Error object to be handled.

**Field.prototype.hasErrors()**: Boolean

> Returns `true` when no errors exist (inverse of `isValid()`). Make sure that you call the `validate()` method first.

**Field.prototype.initialValue**: Any

> A getter which returns the initial field value (last committed value).

**Field.prototype.isChanged()**: Boolean

> Returns `true` if the field or at least one sub field have been changed.

**Field.prototype.isNested()**: Boolean

> Returns `true` if the field is a nested model.

**Field.prototype.isValid()**: Boolean

> Returns `true` if the field and all sub fields are valid (inverse of `hasErrors()`). Make sure that you call the `validate()` method first.

**Field.prototype.invalidate()**: Field

> Clears the `errors` field on all fields (the reverse of `validate()`).

**Field.prototype.name**: String

> A getter which returns a name of a field.

**Field.prototype.reset()**: Field

> Sets the field to its default value.

**Field.prototype.rollback()**: Field

> Sets the field to its initial value (last committed value). This is how you can discharge field's changes.

**Field.prototype.validate()**: Promise(Field)

> Validates the `value` and populates the `errors` property with errors.

**Field.prototype.value**: Any

> A getter and setter for the value of the field.

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
