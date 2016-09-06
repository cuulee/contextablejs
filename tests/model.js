const test = require('ava');
const {Schema} = require('../dist');
const {createModel} = require('../dist/model');

/*
* Model configuration.
*/

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
    ping() {return `Session ID: ${this.ctx.sessionID}`}
  },
  classVirtuals: {
    version: {
      get() {return 'v1.0.0'}
    }
  },
  instanceMethods: {
    getTime() {return 1231200000}
  },
  instanceVirtuals: {
    name: {
      get() {return `${this.firstName} ${this.lastName}`}
    }
  }
});

let ctx = {sessionID: 'asdf987as9d8f798fdg6s78'};
let User = createModel(userSchema, ctx);

let user = new User({
  firstName: 'John',
  lastName: 'Smith'
});

/*
* Model tests.
*/

test('static properties', (t) => {
  t.deepEqual(User.ctx, ctx);
  t.is(User.version, 'v1.0.0');
  t.deepEqual(Object.keys(User), ['version']);
});

test('static methods', (t) => {
  t.is(User.ping(), 'Session ID: asdf987as9d8f798fdg6s78');
});

test('instance properties', (t) => {
  t.is(user.firstName, 'John');
  t.is(user.name, 'John Smith');
  t.deepEqual(Object.keys(user), ['firstName', 'lastName', 'name']);
});

test('instance methods', (t) => {
  t.is(user.getTime(), 1231200000);
});
