const test = require('ava');
const {ValidationError} = require('../dist/errors');

test('method `toObject` of ValidationError should return error object', (t) => {
  let err = new ValidationError({
    email: {
      errors: [
        {validator: 'presence', message: 'is required'},
        {validator: 'presence', message: 'is not an email'}
      ]
    }
  });

  t.deepEqual(err.toObject(), err.data);
});

test('method `toArray` of ValidationError should return a list of errors', (t) => {
  let err = new ValidationError({
    email: {
      errors: [
        {validator: 'presence', message: 'is required'},
        {validator: 'presence', message: 'is not an email'}
      ]
    },
    server: {
      errors: [],
      related: {
        address: {
          errors: [
            {validator: 'presence', message: 'is required'}
          ]
        }
      }
    },
    friends: {
      errors: [],
      related: [
        {
          name: {
            errors: [
              {validator: 'presence', message: 'is required'}
            ]
          }
        }
      ]
    }
  });

  t.deepEqual(err.toArray(), [
    {
      path: 'email',
      errors: [
        {validator: 'presence', message: 'is required'},
        {validator: 'presence', message: 'is not an email'}
      ]
    },
    {
      path: 'server.address',
      errors: [
        {validator: 'presence', message: 'is required'}
      ]
    },
    {
      path: 'friends.0.name',
      errors: [
        {validator: 'presence', message: 'is required'}
      ]
    }
  ]);
});

test('method `getErrors` of ValidationError should return field errors', (t) => {
  let err = new ValidationError({
    name: {
      errors: [
        {validator: 'foo', message: 'bar'}
      ]
    },
    friend: {
      errors: [],
      related: {
        name: {
          errors: [
            {validator: 'foo', message: 'bar'}
          ]
        }
      }
    },
    friends: {
      errors: [],
      related: [
        {
          name: {
            errors: [
              {validator: 'foo', message: 'bar'}
            ]
          }
        }
      ]
    }
  });

  t.deepEqual(err.getErrors('foo', 0, 'bar'), []);
  t.deepEqual(err.getErrors('name'), [{validator: 'foo', message: 'bar'}]);
  t.deepEqual(err.getErrors('friend', 'name'), [{validator: 'foo', message: 'bar'}]);
  t.deepEqual(err.getErrors('friends', 0, 'name'), [{validator: 'foo', message: 'bar'}]);
});

test('method `hasErrors` of ValidationError should return `true` if the provided path has errors', (t) => {
  let err = new ValidationError({
    name: {
      errors: [
        {validator: 'foo', message: 'bar'}
      ]
    },
    friend: {
      errors: [],
      related: {
        name: {
          errors: [
            {validator: 'foo', message: 'bar'}
          ]
        }
      }
    },
    friends: {
      errors: [],
      related: [
        {
          name: {
            errors: [
              {validator: 'foo', message: 'bar'}
            ]
          }
        }
      ]
    }
  });

  t.deepEqual(err.hasErrors('foo', 0, 'bar'), false);
  t.deepEqual(err.hasErrors('name'), true);
  t.deepEqual(err.hasErrors('friend', 'name'), true);
  t.deepEqual(err.hasErrors('friends', 0, 'name'), true);
});
