const test = require('ava');
const {Schema, Context} = require('../dist');
const {createModel} = require('../dist/models');
const {
  ValidationError,
  ValidatorError,
  HandlerError
} = require('../dist/errors');

test('should allow static properties', (t) => {
  let context = {major: 1};

  let userSchema = new Schema({
    classVirtuals: {
      version: {
        get() {return `v${this.$context.major}.0.0`}
      }
    }
  });
  let User = createModel(userSchema, context);

  t.deepEqual(User.$context, context);
  t.is(User.version, 'v1.0.0');
  t.deepEqual(Object.keys(User), ['version']);
});

test('should allow static methods', (t) => {
  let context = {id: '100'};

  let userSchema = new Schema({
    classMethods: {
      ping() {return `Hey #${this.$context.id}`}
    },
  });
  let User = createModel(userSchema, context);

  t.is(User.ping(), 'Hey #100');
});

test('should allow instance properties', (t) => {
  let context = {id: '100'};

  let userSchema = new Schema({
    fields: {
      name: {
        type: 'String'
      }
    },
    instanceVirtuals: {
      nickname: {
        get() {return `${this.name}-${this.$context.id}`}
      }
    }
  });
  let User = createModel(userSchema, context);
  let user = new User({name: 'John'});

  t.is(user.name, 'John');
  t.is(user.nickname, 'John-100');
  t.deepEqual(Object.keys(user), ['name', 'nickname']);
});

test('should allow instance methods', (t) => {
  let context = {now: 100};

  let userSchema = new Schema({
    instanceMethods: {
      getTime() {return this.$context.now + 10}
    }
  });
  let User = createModel(userSchema, context);
  let user = new User();

  t.is(user.getTime(), 110);
});

test('method `handle` should pass through a ValidationError', async (t) => {
  let User = createModel(new Schema());
  let user = new User();

  let error = new ValidationError();

  t.is(await user.handle(error, {quiet: false}), user);
});

test('method `handle` should throw the provided error when the error is unhandled', async (t) => {
  let User = createModel(new Schema());
  let user = new User();

  let error = new Error();

  t.throws(user.handle(error), Error);
});

test('method `handle` should handle fields', async (t) => {
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
        handle: [
          {handler: 'alreadyTaken', message: 'already taken'},
          {handler: 'notFound', message: 'not found'}
        ]
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
        handle: [
          {handler: 'alreadyTaken', message: 'already taken'},
          {handler: 'notFound', message: 'not found'}
        ]
      },
      book: {
        type: bookSchema,
        handle: [
          {handler: 'notFound', message: 'not found'}
        ]
      },
      books: {
        type: [bookSchema],
        handle: [
          {handler: 'notFound', message: 'not found'}
        ]
      }
    }
  });

  let data = {
    book: {},
    books: [null, {}]
  };
  let User = createModel(userSchema);
  let user = new User(data);
  let systemError = new Error('not found');
  let handlerError = {handler: 'notFound', message: 'not found', code: 422};

  // throws an error
  t.is(await user.handle(systemError), user);
  t.throws(user.handle(systemError, {quiet: false}), ValidationError);
  // error paths
  let error = null;
  try {
    await user.handle(systemError, {quiet: false});
  } catch (e) {
    error = e;
  }
  t.deepEqual(error.paths, [
    ['name'],
    ['book'],
    ['book', 'title'],
    ['books'],
    ['books', 1, 'title']
  ]);
  // errors are populated
  t.deepEqual(user.$name.errors[0], handlerError);
  t.deepEqual(user.$book.errors[0], handlerError);
  t.deepEqual(user.book.$title.errors[0], handlerError);
  t.deepEqual(user.$books.errors[0], handlerError);
  t.deepEqual(user.books[0], null);
  t.deepEqual(user.books[1].$title.errors[0], handlerError);
});

test('method `applyErrors` should set field `errors` property', async (t) => {
  let bookSchema = new Schema({
    fields: {
      title: {
        type: 'String'
      }
    }
  });
  let userSchema = new Schema({
    fields: {
      name: {
        type: 'String'
      },
      newBook: {
        type: bookSchema
      },
      newBooks: {
        type: [bookSchema]
      }
    }
  });
  let data = {
    newBook: {},
    newBooks: [{}, {}]
  };
  let User = createModel(userSchema);
  let user = new User(data);
  let validatorError = {validator: 'foo', message: 'bar', code: 422};
  let handlerError = {handler: 'foo', message: 'bar', code: 422};

  user.applyErrors([
    {path: ['name'], errors: [validatorError]},
    {path: ['newBook', 'title'], errors: [handlerError]},
    {path: ['newBooks', 1, 'title'], errors: [validatorError]}
  ]);

  t.deepEqual(user.$name.errors, [validatorError]);
  t.deepEqual(user.newBook.$title.errors, [handlerError]);
  t.deepEqual(user.newBooks[0].$title.errors, []);
  t.deepEqual(user.newBooks[1].$title.errors, [validatorError]);
});
