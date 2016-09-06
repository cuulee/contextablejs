![Build Status](https://travis-ci.org/xpepermint/contextablejs.svg?branch=master)&nbsp;[![NPM Version](https://badge.fury.io/js/contextable.svg)](https://badge.fury.io/js/contextable)&nbsp;[![Dependency Status](https://gemnasium.com/xpepermint/contextablejs.svg)](https://gemnasium.com/xpepermint/contextablejs)

# contextable.js

> Simple, unopinionated and minimalist framework for creating ORM objects.

<img src="giphy.gif" width="300" />

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
