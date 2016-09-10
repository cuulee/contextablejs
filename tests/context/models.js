const test = require('ava');
const {Context, Schema} = require('../../dist');

test('defineModel', (t) => {
  let ctx = new Context();

  let userSchema = new Schema();
  let User = ctx.defineModel('User', userSchema);
  let user = new User();

  t.is(User.ctx, ctx);
  t.is(user.ctx, ctx);
});

test('getModel', (t) => {
  let ctx = new Context();

  let userSchema = new Schema();
  let User0 = ctx.defineModel('User', userSchema);
  let User1 = ctx.getModel('User');

  t.is(User0, User1);
});

test('deleteModel', (t) => {
  let ctx = new Context();

  let userSchema = new Schema();
  let User0 = ctx.defineModel('User', userSchema);
  ctx.deleteModel('User');
  let User1 = ctx.getModel('User');

  t.is(User1, undefined);
});
