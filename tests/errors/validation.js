const test = require('ava');
const {ValidationError} = require('../../dist/errors');

test('toObject', (t) => {
  let err = new ValidationError({
    email: {
      messages: [
        'is required',
        'is not an email'
      ]
    }
  });

  t.deepEqual(err.toObject(), err.fields);
});

test('toArray', (t) => {
  let err = new ValidationError({
    email: {
      messages: [
        'is required',
        'is not an email'
      ]
    },
    server: {
      messages: [],
      related: {
        address: {
          messages: [
            'is required'
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
              'is required'
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
        'is required',
        'is not an email'
      ]
    },
    {
      path: 'server.address',
      messages: [
        'is required'
      ]
    },
    {
      path: 'friends.0.name',
      messages: [
        'is required'
      ]
    }
  ]);
});
