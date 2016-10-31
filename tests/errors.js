const test = require('ava');
const {ValidationError} = require('../dist/errors');

test('ValidationError.prototype.toObject should return error object', (t) => {
  let err = new ValidationError({
    email: {
      messages: [
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
      messages: [
        {validator: 'presence', message: 'is required'},
        {validator: 'presence', message: 'is not an email'}
      ]
    },
    server: {
      messages: [],
      related: {
        address: {
          messages: [
            {validator: 'presence', message: 'is required'}
          ]
        }
      }
    },
    friends: {
      messages: [],
      related: [
        {
          name: {
            messages: [
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
      messages: [
        {validator: 'presence', message: 'is required'},
        {validator: 'presence', message: 'is not an email'}
      ]
    },
    {
      path: 'server.address',
      messages: [
        {validator: 'presence', message: 'is required'}
      ]
    },
    {
      path: 'friends.0.name',
      messages: [
        {validator: 'presence', message: 'is required'}
      ]
    }
  ]);
});
