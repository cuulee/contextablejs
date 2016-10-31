const test = require('ava');
const contextable = require('../dist');

test('exposed content', (t) => {
  t.is(!!contextable.Schema, true);
  t.is(!!contextable.Context, true);
  t.is(!!contextable.GeneralError, true);
  t.is(!!contextable.ValidationError, true);
});
