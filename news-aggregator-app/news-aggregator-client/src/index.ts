import { promptMainMenu, promptUserMenu, promptAdminMenu } from './ui/prompts.js';
import { handleLogin, handleSignup } from './flows/auth.js';
import { getState, setState } from './state.js';
import { handleHeadlines, handleSavedArticles, handleSearch } from './flows/userFlows.js';
import { handleViewServers, handleAddCategory } from './flows/adminFlows.js';
import { handleNotifications } from './flows/notificationFlows.js';

const showAdminMenu = async () => {
  let inMenu = true;
  while (inMenu) {
    const choice = await promptAdminMenu();
    switch (choice) {
      case 'View the list of external servers and status':
        await handleViewServers();
        break;
      case 'Add new News Category':
        await handleAddCategory();
        break;
      case 'Logout':
        inMenu = false;
        break;
    }
    if (inMenu) console.log('\n');
  }
};

const showUserMenu = async () => {
  let inMenu = true;
  while (inMenu) {
    const choice = await promptUserMenu();
    switch (choice) {
      case 'Headlines':
        await handleHeadlines();
        break;
      case 'Saved Articles':
        await handleSavedArticles();
        break;
      case 'Search':
        await handleSearch();
        break;
      case 'Notifications':
        await handleNotifications();
        break;
      case 'Logout':
        inMenu = false;
        break;
    }
    if (inMenu) console.log('\n');
  }
};

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