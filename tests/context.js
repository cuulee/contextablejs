const test = require('ava');
const {Context, Schema} = require('../dist');

test('initial properties', (t) => {
  let ctx = new Context({version: 3});

  t.is(ctx.version, 3);
  t.deepEqual(Object.keys(ctx), ['version']);
});

test('defineModel', (t) => {
  let userSchema = new Schema({
    fields: {
      name: {
        type: 'string',
        defaultValue: 'noname',
        validations: {
          presence: {
            message: 'is required'
          }
        }
      },
    }
  });

  let ctx = new Context();
  let User = ctx.defineModel('User', userSchema);
  let user = new User();

  t.is(User.ctx, ctx);
  t.is(user.ctx, ctx);
  t.is(user.name, 'noname');
});

test('getModel', (t) => {
  let userSchema = new Schema();
  let ctx = new Context();
  let User0 = ctx.defineModel('User', userSchema);
  let User1 = ctx.getModel('User');

  t.is(User0, User1);
});

test('deleteModel', (t) => {
  let userSchema = new Schema();
  let ctx = new Context();
  let User0 = ctx.defineModel('User', userSchema);
  ctx.deleteModel('User');
  let User1 = ctx.getModel('User');

  t.is(User1, undefined);
});
