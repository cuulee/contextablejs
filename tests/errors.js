const test = require('ava');
const {ValidationError} = require('../dist/errors');

test('ValidationError.prototype.toObject should return error object', (t) => {
  let err = new ValidationError({
    email: {
      errors: [
        {validator: 'presence', message: 'is required'},
        {validator: 'presence', message: 'is not an email'}
      ]
    }
  });

  t.deepEqual(err.toObject(), err.fields);
});

test('ValidationError.prototype.toArray should return a list of errors', (t) => {
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
