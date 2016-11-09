import test from 'ava';
import {Schema} from '../dist/index';

test('can be extended through mixins', async (t) => {
  let animalSchema = new Schema({
    fields: () => ({
      kind: {
        type: 'String'
      },
      relatives: {
        type: [animalSchema]
      }
    }),
    handlerOptions: {foo: 'foo'},
    classMethods: {foo: 'foo'},
    classVirtuals: {foo: 'foo'},
    instanceMethods: {foo: 'foo'},
    instanceVirtuals: {foo: 'foo'}
  });
  let dogSchema = new Schema({
    mixins: [
      animalSchema
    ],
    fields: () => ({
      name: {
        type: 'String'
      }
    }),
    strict: false,
    handlerOptions: {bar: 'bar'},
    classMethods: {bar: 'bar'},
    classVirtuals: {bar: 'bar'},
    instanceMethods: {bar: 'bar'},
    instanceVirtuals: {bar: 'bar'}
  });
  let catSchema = new Schema({
    mixins: [
      dogSchema
    ],
    fields: () => ({
      dislikes: {
        type: [dogSchema]
      }
    }),
    handlerOptions: {baz: 'baz'},
    classMethods: {baz: 'baz'},
    classVirtuals: {baz: 'baz'},
    instanceMethods: {baz: 'baz'},
    instanceVirtuals: {baz: 'baz'}
  });

  let keys = [];
  // handlerOptions
  keys = Object.keys(catSchema.handlerOptions)
  t.deepEqual(keys, ['foo', 'bar', 'baz']);
  // classMethods
  keys = Object.keys(catSchema.classMethods)
  t.deepEqual(keys, ['foo', 'bar', 'baz']);
  // classVirtuals
  keys = Object.keys(catSchema.classVirtuals)
  t.deepEqual(keys, ['foo', 'bar', 'baz']);
  // instanceMethods
  keys = Object.keys(catSchema.instanceMethods)
  t.deepEqual(keys, ['foo', 'bar', 'baz']);
  // instanceVirtuals
  keys = Object.keys(catSchema.instanceVirtuals)
  t.deepEqual(keys, ['foo', 'bar', 'baz']);
});
