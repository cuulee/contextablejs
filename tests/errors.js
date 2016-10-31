const test = require('ava');
const {ValidationError} = require('../dist/errors');

test('method `toObject` of ValidationError should return error object', (t) => {
  let err = new ValidationError({
    email: {
      errors: [
        {validator: 'presence', message: 'is required'},
        {validator: 'presence', message: 'is not an email'}
      ],
      related: undefined
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
      ],
      related: undefined
    },
    server: {
      errors: [],
      related: {
        address: {
          errors: [
            {validator: 'presence', message: 'is required'}
          ],
          related: undefined
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
            ],
            related: undefined
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

test('method `get` of ValidationError should return field errors', (t) => {
  let err = new ValidationError({
    name: {
      errors: [
        {validator: 'foo', message: 'bar'}
      ],
      related: undefined
    },
    friend: {
      errors: [],
      related: {
        name: {
          errors: [
            {validator: 'foo', message: 'bar'}
          ],
          related: undefined
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
            ],
            related: undefined
          }
        }
      ]
    }
  });

  t.deepEqual(err.get('foo', 0, 'bar'), undefined);
  t.deepEqual(err.get('name'), {
    errors: [{validator: 'foo', message: 'bar'}],
    related: undefined
  });
  t.deepEqual(err.get('friend', 'name'), {
    errors: [{validator: 'foo', message: 'bar'}],
    related: undefined
  });
  t.deepEqual(err.get('friends', 0, 'name'), {
    errors: [{validator: 'foo', message: 'bar'}],
    related: undefined
  });
});

test('method `has` of ValidationError should return `true` if the provided path has errors', (t) => {
  let err = new ValidationError({
    name: {
      errors: [
        {validator: 'foo', message: 'bar'}
      ],
      related: undefined
    },
    friend: {
      errors: [],
      related: {
        name: {
          errors: [
            {validator: 'foo', message: 'bar'}
          ],
          related: undefined
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
            ],
            related: undefined
          }
        }
      ]
    }
  });

  t.deepEqual(err.has('foo', 0, 'bar'), false);
  t.deepEqual(err.has('name'), true);
  t.deepEqual(err.has('friend', 'name'), true);
  t.deepEqual(err.has('friends', 0, 'name'), true);
});
