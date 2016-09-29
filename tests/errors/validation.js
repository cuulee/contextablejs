const test = require('ava');
const {ValidationError} = require('../../dist/errors');

test('toArray', (t) => {
  let err = new ValidationError({
    email: {
      messages: [
        'is required',
        'is not an email'
      ]
    },
    friends: {
      messages: [],
      related: {
        name: {
          messages: [
            'is required'
          ]
        }
      }
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
      path: 'friends.name',
      messages: [
        'is required'
      ]
    }
  ]);
});
