const test = require('ava');
const {Context, Schema} = require('../dist');

test('should define initial properties', (t) => {
  let ctx = new Context({version: 3});

  t.is(ctx.version, 3);
  t.deepEqual(Object.keys(ctx), ['version']);
});

test('method `defineModel` should initialize a new model', (t) => {
  let ctx = new Context();

  let userSchema = new Schema();
  let User = ctx.defineModel('User', userSchema);
  let user = new User();

  t.is(User.$ctx, ctx);
  t.is(user.$ctx, ctx);
});

test('method `getModel` should return a model', (t) => {
  let ctx = new Context();

  let userSchema = new Schema();
  let User0 = ctx.defineModel('User', userSchema);
  let User1 = ctx.getModel('User');

  t.is(User0, User1);
});

test('method `deleteModel` should destroy a model', (t) => {
  let ctx = new Context();

  let userSchema = new Schema();
  let User0 = ctx.defineModel('User', userSchema);
  ctx.deleteModel('User');
  let User1 = ctx.getModel('User');

  t.is(User1, undefined);
});
