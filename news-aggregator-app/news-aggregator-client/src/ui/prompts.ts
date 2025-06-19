import inquirer from 'inquirer';

export const promptMainMenu = async () : Promise<string>  => {
  const { choice } = await inquirer.prompt([
    {
      type: 'list',
      name: 'choice',
      message: 'Welcome to the News Aggregator application.\nPlease choose the options below.',
      choices: ['Login', 'Sign up', 'Exit'],
    },
  ]);
  return choice;
};

export const promptForSignup = async () => {
  console.log('\n--- Create a New Account ---');
  const answers = await inquirer.prompt([
    { type: 'input', name: 'username', message: 'Enter a username:' },
    { type: 'input', name: 'email', message: 'Enter your email address:' },
    { type: 'password', name: 'password', message: 'Enter a password:', mask: '*' },
  ]);
  return answers;
};

export const promptForLogin = async () => {
  console.log('\n--- Please Login ---');
  const answers = await inquirer.prompt([
    { type: 'input', name: 'email', message: 'Enter your email address:' },
    { type: 'password', name: 'password', message: 'Enter a password:', mask: '*' },
  ]);
  return answers;
};

export const promptUserMenu = async (): Promise<string> => {
  const { choice } = await inquirer.prompt([
    {
      type: 'list',
      name: 'choice',
      message: 'Please choose an option:',
      choices: [
        'Headlines',      
        'Saved Articles', 
        'Search',         
        'Notifications',  
        'Logout',         
      ],
    },
  ]);
  return choice;
};

export const promptAdminMenu = async (): Promise<string> => {
  const { choice } = await inquirer.prompt([
    {
      type: 'list',
      name: 'choice',
      message: 'Admin Menu - Please choose an option:',
      choices: [
        'View the list of external servers and status', 
        'Add new News Category',                         
        'Logout',                                        
      ],
    },
  ]);
  return choice;
};

export const promptForDateOption = async (): Promise<string> => {
  const { choice } = await inquirer.prompt([
    {
      type: 'list',
      name: 'choice',
      message: 'Select a date range for headlines:',
      choices: ['Today', 'Date range', 'Go Back'],
    },
  ]);
  return choice;
};

export const promptForDate = async (message: string): Promise<string> => {
  const { date } = await inquirer.prompt([
    {
      type: 'input',
      name: 'date',
      message: message,
    },
  ]);
  return date;
};

export const promptForCategory = async (): Promise<string> => {
  const { choice } = await inquirer.prompt([
    {
      type: 'list',
      name: 'choice',
      message: 'Select a category:',
      choices: [
        'All',          
        'Business',     
        'Entertainment',
        'Sports',       
        'Technology',   
      ],
    },
  ]);
  return choice;
};

export const promptAfterArticles = async (): Promise<string> => {
  const { choice } = await inquirer.prompt([
    {
      type: 'list',
      name: 'choice',
      message: 'What would you like to do?',
      choices: ['Save Article', 'Back to Main Menu'],
    },
  ]);
  return choice;
};

export const promptForArticleId = async (): Promise<string> => {
  const { articleId } = await inquirer.prompt([
    {
      type: 'input',
      name: 'articleId',
      message: 'Enter the Article ID of the article you wish to save:',
    },
  ]);
  return articleId;
};

export const promptAfterSavedArticles = async (): Promise<string> => {
  const { choice } = await inquirer.prompt([
    {
      type: 'list',
      name: 'choice',
      message: 'What would you like to do?',
      choices: ['Delete Article', 'Back to Main Menu'],
    },
  ]);
  return choice;
};

export const promptForSavedArticleIdToDelete = async (): Promise<string> => {
  const { articleId } = await inquirer.prompt([
    {
      type: 'input',
      name: 'articleId',
      message: 'Enter the Saved Article ID you wish to delete:',
    },
  ]);
  return articleId;
};


export const promptForNotificationAction = async (): Promise<string> => {
  const { choice } = await inquirer.prompt([
    {
      type: 'list',
      name: 'choice',
      message: 'Notification Menu',
      choices: ['View Notifications', 'Configure Notifications', 'Back to Main Menu'],
    },
  ]);
  return choice;
};

export const promptToConfigureNotifications = async (currentSettings: any): Promise<any> => {
  const allCategories = ['Business', 'Entertainment', 'Sports', 'Technology'];

  const { newCategories } = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'newCategories',
      message: 'Select the categories you want to be notified about (Press <space> to select).',
      choices: allCategories,
      default: currentSettings.enabledCategories,
    },
  ]);
  
  const { keywords } = await inquirer.prompt([
    {
      type: 'input',
      name: 'keywords',
      message: 'Enter keywords to follow (comma-separated):',
      default: currentSettings.keywords.join(', '),
    }
  ]);

  return {
    enabledCategories: newCategories,
    keywords: keywords.split(',').map((k: string) => k.trim()).filter((k: string) => k)
  };
};