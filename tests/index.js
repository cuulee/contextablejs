import test from 'ava';
import * as contextable from '../dist';

test('exposed content', (t) => {
  t.is(!!contextable.Schema, true);
  t.is(!!contextable.Document, true);
  t.is(!!contextable.Context, true);
});
