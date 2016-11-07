import {ApplicationContext} from './context';

(async function () {

  // initializing and starting application context
  let context = new ApplicationContext();
  await context.start();

  // initializing data object
  let userData = {
    name: 'John Smith',
    email: 'john@smith.com'
  };

  // creating a new user
  let {User} = context;
  let user = null;
  try {
    user = await User.create(userData);
  }
  catch (error) {
    return console.error(error);
  }

  // updating user's email field
  user.email = 'john.smith@google.com';
  try {
    await user.save();
  }
  catch (error) {
    return console.error(error);
  }

  // displaying user
  if (!user.isValid()) {
    console.log('Mongo Error:', user.collectErrors()[0].errors.map((e) => e.toObject()));
  }

  console.log('User Object:', JSON.stringify(user, null, 2));

})().catch(console.error);
