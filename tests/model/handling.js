const test = require('ava');
const {Schema} = require('../../dist');
const {createModel} = require('../../dist/model');
const {ValidationError} = require('../../dist/errors');

test('handle (fields definitions)', async (t) => {
  let handlerOptions = {
    handlers: {
      alreadyTaken: (e) => e.message === 'already taken',
      notFound: (e) => e.message === 'not found'
    }
  };

  let bookSchema = new Schema({
    handlerOptions,
    fields: {
      title: {
        type: 'String',
        handle: {
          notFound: {message: 'not found'},
          alreadyTaken: {message: 'already taken'}
        }
      },
      year: {
        type: 'Integer'
      }
    }
  });
  let userSchema = new Schema({
    handlerOptions,
    fields: {
      name: {
        type: 'String',
        handle: {
          notFound: {message: 'not found'},
          alreadyTaken: {message: 'already taken'}
        }
      },
      book: {
        type: bookSchema,
        handle: {
          notFound: {message: 'not found'}
        }
      },
      books: {
        type: [bookSchema],
        handle: {
          notFound: {message: 'not found'}
        }
      }
    }
  });

  let data = {
    books: [
      null,
      {
        title: 100
      }
    ]
  };

  let User = createModel(userSchema);
  let user = new User(data);

  let error = new Error('not found');
  let result = await user.handle(error);

  t.deepEqual(result.fields, {
    name: {
      messages: ['not found']
    },
    book: {
      messages: ['not found']
    },
    books: {
      messages: ['not found'],
      related: [
        undefined,
        {
          title: {
            messages: ['not found']
          }
        }
      ]
    }
  });
});

test('handle (ValidationError is passed through)', async (t) => {
  let User = createModel(new Schema());
  let user = new User();

  let error = new ValidationError();
  let result = await user.handle(error);

  t.is(result, error);
});

test('handle (unknown error si passed through)', async (t) => {
  let User = createModel(new Schema());
  let user = new User();

  let error = new Error();
  let result = await user.handle(error);

  t.is(result, error);
});
