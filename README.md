![Build Status](https://travis-ci.org/xpepermint/contextablejs.svg?branch=master)&nbsp;[![NPM Version](https://badge.fury.io/js/contextable.svg)](https://badge.fury.io/js/contextable)&nbsp;[![Dependency Status](https://gemnasium.com/xpepermint/contextablejs.svg)](https://gemnasium.com/xpepermint/contextablejs)

# contextable.js

> Simple unopinionated and minimalist framework for creating context objects supporting dynamic ORM, object schemas, data filtering, validation and error handling.

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

#### Validation and Error Handling

Data validation and error handling is a common thing when writing API controllers, GraphQL mutations, before we try to write something into a database and in many other cases where we manipulate and mutate data. Every time you start writing validations, you ask yourself the same questions. You try hard finding the best way to get a clean and beautiful solution. At the end you desperately start googling for answers, searching best practices and possible conventions.

ORM frameworks usually provide object validation out of the box. What about error handling? Isn't that pretty similar thing? Validation happens before actual action and error handling happens afterwords thus validation and error handling go hand in hand. *Contextable.js* has been written with that in mind.

Let's take a real life use case where we are inserting books with unique names into a MongoDB collection. We validate each book before we write anything into a database. To be safe, we also validate if a book with the provided name already exists. If the book object isn't valid we show nicely formatted error messages to a user telling what went wrong. When the object is valid we write it to the database. Will the operation succeed? Maybe yes, sometimes no. We can expect at least the `E11000` MongoDB error, for sure. This is because validation and write operation do not execute in atomic way. In case of an error we again want to show a nicely formatted error message to a user. This means that we need to write two error handling mechanisms for pretty much the same thing.

*Contextable.js* unifies validation and error handling. We can handle validation and other errors in a single way thus we can show unified error messages to a user. We only need to tell *Contextable.js* which errors to be handled and how to be handled, *Contextable.js* will do the rest.

## Install

```
$ npm install --save contextable
```

## Example

```js
// ElasticSearch connection

import elasticsearch from 'elasticsearch';

const es = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace'
});

// ORM context

import {
  Context,
  Schema
} from 'contextable';

const ctx = new Context({es});

let userSchema = new Schema({
  fields: {
    firstName: {
      type: 'string',
      validations: {
        presence: {
          message: 'is required'
        }
      }
    },
    lastName: {
      type: 'string',
      validations: {
        presence: {
          message: 'is required'
        }
      }
    }
  },
  classMethods: {
    ping: async () => await this.es.ping({hello: 'elasticsearch'})
  },
  instanceMethods: {
    name: () => `${this.firstName} ${this.lastName}`
  }
});

let User = ctx.defineModel(userSchema);
User.ping() // -> Promise

let user = new User({
  firstName: 'John',
  lastName: 'Smith'
});
user.name // -> 'John Smith'
```

## API

### Schema

**new Schema({mode, validator, fields, classMethods, classVirtuals, instanceMethods, instanceVirtuals)**

> A class for defining document structure.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| mode | String | No | strict | Type of schema (use `relaxed` to allow dynamic fields).
| validator | Object | No | using [validatablejs](https://github.com/xpepermint/validatablejs) defaults | Object with custom validators (this variable is merged with built-in validators thus you can override a validator key if you need to).
| fields | Object | Yes | - | An object with fields definition.
| classMethods | Object | No | - | An object defining static class methods.
| classVirtuals | Object | No | - | An object defining static enumerable virtual properties of a class.
| instanceMethods | Object | No | - | An object defining instance methods of a class.
| instanceVirtuals | Object | No | - | An object defining enumerable virtual properties of a class instance.

```js
// schema fields example
let fields = {
  name: { // field name holding a field definition
    type: 'string', // field type
    defaultValue: 'John Smith', // default field value
    validations: { // field validations
      presence: { // validator name
        message: 'is required' // validator options
      }
    }
  }
};

// schema classMethods example
let classMethods = {
  ping() { /* do something */ }
};

// schema classVirtuals example
let classVirtuals = {
  version: {
    set(v) { /* setter */ }
    get() { /* getter */ }
  }
};

// schema instanceMethods example
let instanceMethods = {
  getTime() { /* do something */ }
};

// schema instanceVirtuals example
let instanceVirtuals = {
  name: {
    set(v) { /* setter */ }
    get() { /* getter */ }
  }
};
```

This Schema class originates in the [objectschemajs](https://github.com/xpepermint/objectschemajs) package which integrates [typeablejs](https://github.com/xpepermint/typeablejs) module for type casting and [validatablejs](https://github.com/xpepermint/validatablejs) for field value validation. See these packages for available configuration options and further details.

### Context

**new Context(fields)**

> A class for creating a context.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| fields | Object | No | - | Enumerable properties which will be applied to the context.

**ctx.defineModel('name', schema)**:Model

> Creates a new model on the context.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| name | String | Yes | - | A name representing a name of a model.
| schema | Schema | Yes | - | An instance of the Schema class.

The method creates and returns a new Model class which is a contextual wrapper around the [Document](https://github.com/xpepermint/objectschemajs#document) class. Check the [objectschema](https://github.com/xpepermint/objectschemajs) package for list of available functions and other details.

**ctx.getModel('name')**:Model

> Returns a Model class.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| name | String | Yes | - | Model name.

**ctx.deleteModel('name')**

> Deletes a Model class from context.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| name | String | Yes | - | Model name.

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
