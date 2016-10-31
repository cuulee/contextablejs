const test = require('ava');
const {Schema, Context} = require('../dist');
const {createModel} = require('../dist/model');
const {ValidationError} = require('../dist/errors');

test('should allow static properties', (t) => {
  let ctx = {major: 1};

  let userSchema = new Schema({
    classVirtuals: {
      version: {
        get() {return `v${this.$ctx.major}.0.0`}
      }
    }
  });
  let User = createModel(userSchema, ctx);

  t.deepEqual(User.$ctx, ctx);
  t.is(User.version, 'v1.0.0');
  t.deepEqual(Object.keys(User), ['version']);
});

test('should allow static methods', (t) => {
  let ctx = {id: '100'};

  let userSchema = new Schema({
    classMethods: {
      ping() {return `Hey #${this.$ctx.id}`}
    },
  });
  let User = createModel(userSchema, ctx);

  t.is(User.ping(), 'Hey #100');
});

test('should allow instance properties', (t) => {
  let ctx = {id: '100'};

  let userSchema = new Schema({
    fields: {
      name: {
        type: 'String'
      }
    },
    instanceVirtuals: {
      nickname: {
        get() {return `${this.name}-${this.$ctx.id}`}
      }
    }
  });
  let User = createModel(userSchema, ctx);
  let user = new User({name: 'John'});

  t.is(user.name, 'John');
  t.is(user.nickname, 'John-100');
  t.deepEqual(Object.keys(user), ['name', 'nickname']);
});

test('should allow instance methods', (t) => {
  let ctx = {now: 100};

  let userSchema = new Schema({
    instanceMethods: {
      getTime() {return this.$ctx.now + 10}
    }
  });
  let User = createModel(userSchema, ctx);
  let user = new User();

  t.is(user.getTime(), 110);
});

test('method `approve` should throw ValidationError when not all fields are valid', async (t) => {
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

  t.throws(user.approve(), ValidationError);

  try {
    await user.approve();
  }
  catch(e) {
    t.deepEqual(e.fields, {
      name: {
        errors: [{validator: 'presence', message: 'is required'}]
      },
      newBook: {
        errors: [{validator: 'presence', message: 'is required'}]
      },
      newBooks: {
        errors: [{validator: 'presence', message: 'is required'}]
      },
      oldBook: {
        errors: [],
        related: {
          title: {
            errors: [{validator: 'presence', message: 'is required'}]
          }
        }
      },
      oldBooks: {
        errors: [],
        related: [
          undefined,
          {
            title: {
              errors: [{validator: 'presence', message: 'is required'}]
            }
          }
        ]
      }
    });
  }
});

test('method `handle` should handled error', async (t) => {
  let User = createModel(new Schema());
  let user = new User();

  let error = new ValidationError();

  t.is(await user.handle(error), error);
});

test('method `handle` should throw on unhandled error', async (t) => {
  let User = createModel(new Schema());
  let user = new User();

  let error = new Error();

  t.throws(user.handle(error), Error);
});

test('method `handle` should return ValidationError', async (t) => {
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
      errors: [{handler: 'notFound', message: 'not found'}]
    },
    book: {
      errors: [{handler: 'notFound', message: 'not found'}]
    },
    books: {
      errors: [{handler: 'notFound', message: 'not found'}],
      related: [
        undefined,
        {
          title: {
            errors: [{handler: 'notFound', message: 'not found'}]
          }
        }
      ]
    }
  });
});
