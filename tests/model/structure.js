const test = require('ava');
const {Schema} = require('../../dist');
const {createModel} = require('../../dist/model');

test('static properties', (t) => {
  let ctx = {major: 1};

  let userSchema = new Schema({
    classVirtuals: {
      version: {
        get() {return `v${this.ctx.major}.0.0`}
      }
    }
  });
  let User = createModel(userSchema, ctx);

  t.deepEqual(User.ctx, ctx);
  t.is(User.version, 'v1.0.0');
  t.deepEqual(Object.keys(User), ['version']);
});

test('static methods', (t) => {
  let ctx = {id: '100'};

  let userSchema = new Schema({
    classMethods: {
      ping() {return `Hey #${this.ctx.id}`}
    },
  });
  let User = createModel(userSchema, ctx);

  t.is(User.ping(), 'Hey #100');
});

test('instance properties', (t) => {
  let ctx = {id: '100'};

  let userSchema = new Schema({
    fields: {
      name: {
        type: 'String'
      }
    },
    instanceVirtuals: {
      nickname: {
        get() {return `${this.name}-${this.ctx.id}`}
      }
    }
  });
  let User = createModel(userSchema, ctx);
  let user = new User({name: 'John'});

  t.is(user.name, 'John');
  t.is(user.nickname, 'John-100');
  t.deepEqual(Object.keys(user), ['name', 'nickname']);
});

test('instance methods', (t) => {
  let ctx = {now: 100};

  let userSchema = new Schema({
    instanceMethods: {
      getTime() {return this.ctx.now + 10}
    }
  });
  let User = createModel(userSchema, ctx);
  let user = new User();

  t.is(user.getTime(), 110);
});
