const test = require('ava');
const {Context, Schema} = require('../../dist');

test('initial properties', (t) => {
  let ctx = new Context({version: 3});

  t.is(ctx.version, 3);
  t.deepEqual(Object.keys(ctx), ['version']);
});
