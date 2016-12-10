const {Context} = require('./context');

(async function () {
  // initializing and starting application context
  let context = new Context();
  await context.start();

  // initializing model
  let {User} = context;
  let user = new User({
    name: 'John Smith',
    email: 'john@smith.com'
  });

  // create new record
  try {
    await user.validate();
    await user.insert();
  }
  catch (e) {
    await user.handle(e);
  }

  // displaying stats
  console.log('object:', JSON.stringify(user, null, 2));
  console.log('valid:', user.isValid());
  console.log('errors:', JSON.stringify(user.collectErrors(), null, 2));

})().catch(console.error);
