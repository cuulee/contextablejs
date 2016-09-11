import {ApplicationContext} from './context';

(async function() {

  // initializing and starting application context
  let ctx = new ApplicationContext();
  await ctx.start();

  // initializing data object
  let userData = {
    name: 'John Smith',
    email: 'john@smith.com'
  };

  // creating a new user
  let User = ctx.getModel('User');
  let user = await User.create(userData);

  // updating user's email field
  user.email = 'john.smith@google.com';
  await user.save();

  // displaying user
  console.log(
    JSON.stringify(user, null, 2)
  );

})().catch((error) => {

  // displaying error
  console.error(
    JSON.stringify(error, null, 2)
  );

});
