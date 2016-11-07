import test from 'ava';
import {
  Context,
  Schema
} from '../dist';

test('should define initial properties', (t) => {
  let context = new Context({version: 3});

  t.is(context.version, 3);
  t.deepEqual(Object.keys(context), ['version']);
});

test('method `defineProperty` should define a new property', (t) => {
  let context = new Context();
  context.defineProperty('version', {
    get () { return '1.0.0' }
  })

  t.is(context.version, '1.0.0');
});

test('method `defineModel` should define a new context-aware model', (t) => {
  let context = new Context();

  let userSchema = new Schema();
  let User = context.defineModel('User', userSchema);
  let user = new User();

  t.is(context.User, User);
  t.is(User.$context, context);
  t.is(user.$context, context);
});
