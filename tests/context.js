const test = require('ava');
const {Context, Schema} = require('../dist');

test('should define initial properties', (t) => {
  let context = new Context({version: 3});

  t.is(context.version, 3);
  t.deepEqual(Object.keys(context), ['version']);
});

test('method `defineModel` should initialize a new model', (t) => {
  let context = new Context();

  let userSchema = new Schema();
  let User = context.defineModel('User', userSchema);
  let user = new User();

  t.is(User.$context, context);
  t.is(user.$context, context);
});

test('method `getModel` should return a model', (t) => {
  let context = new Context();

  let userSchema = new Schema();
  let User0 = context.defineModel('User', userSchema);
  let User1 = context.getModel('User');

  t.is(User0, User1);
});

test('method `deleteModel` should destroy a model', (t) => {
  let context = new Context();

  let userSchema = new Schema();
  let User0 = context.defineModel('User', userSchema);
  context.deleteModel('User');
  let User1 = context.getModel('User');

  t.is(User1, undefined);
});
