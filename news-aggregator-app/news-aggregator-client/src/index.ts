import { promptMainMenu } from './ui/prompts.js';
import { handleLogin, handleSignup } from './flows/authFlows.js';
import { getState, setState } from './state.js';
import { showAdminMenu, showUserMenu } from './flows/userFlows.js';

const startApp = async () => {
 
  while (!getState().token) {
    const choice = await promptMainMenu();
    switch (choice) {
      case 'Login':
        await handleLogin();
        break;
      case 'Sign up':
        await handleSignup();
        break;
      case 'Exit':
        console.log('Thank you for using the News Aggregator. Goodbye!');
        process.exit(0);
    }
    if (!getState().token) console.log('\n');
  }

  const { user } = getState();

  if (user) {
    console.log(`\n--- Welcome, ${user.username}! ---`);
    if (user.role === 'Admin') {
      await showAdminMenu();
    } else {
      await showUserMenu();
    }
  }
  
  setState({ token: null, user: null });
  console.log('\nYou have been logged out.');
  await startApp();
};

startApp();