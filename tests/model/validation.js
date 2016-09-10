const test = require('ava');
const {Schema} = require('../../dist');
const {createModel} = require('../../dist/model');
const {ValidationError} = require('../../dist/errors');

test('validate', async (t) => {
  let bookSchema = new Schema({
    fields: {
      title: {
        type: 'String',
        validate: {
          presence: {message: 'is required'}
        }
      },
      year: {
        type: 'Integer'
      }
    }
  });
  let userSchema = new Schema({
    fields: {
      name: {
        type: 'String',
        validate: {
          presence: {message: 'is required'}
        }
      },
      newBook: {
        type: bookSchema,
        validate: {
          presence: {message: 'is required'}
        }
      },
      newBooks: {
        type: [bookSchema],
        validate: {
          presence: {message: 'is required'}
        }
      },
      oldBook: {
        type: bookSchema,
        validate: {
          presence: {message: 'is required'}
        }
      },
      oldBooks: {
        type: [bookSchema],
        validate: {
          presence: {message: 'is required'}
        }
      }
    }
  });

  let data = {
    oldBook: {
      title: ''
    },
    oldBooks: [
      null,
      {
        title: ''
      }
    ]
  };

  let User = createModel(userSchema);
  let user = new User(data);

  t.throws(user.validate(), ValidationError);

  try {
    await user.validate();
  } catch(e) {
    t.deepEqual(e.fields, {
      name: {
        messages: ['is required']
      },
      newBook: {
        messages: ['is required']
      },
      newBooks: {
        messages: ['is required']
      },
      oldBook: {
        messages: [],
        related: {
          title: {
            messages: ['is required']
          }
        }
      },
      oldBooks: {
        messages: [],
        related: [
          undefined,
          {
            title: {
              messages: ['is required']
            }
          }
        ]
      }
    });
  }
});
