import test from 'ava';
import * as contextable from '../dist';

test('exposed content', (t) => {
  t.is(!!contextable.Schema, true);
  t.is(!!contextable.Context, true);
  t.is(!!contextable.ValidationError, true);
  t.is(!!contextable.ValidatorError, true);
  t.is(!!contextable.HandlerError, true);
});
