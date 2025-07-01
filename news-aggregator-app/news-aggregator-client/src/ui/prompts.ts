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
        'Manage Reported Articles',
        'Manage Categories',
        'Manage Blocked Keywords',
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

export const promptAfterArticleList = async (): Promise<string> => {
  const { choice } = await inquirer.prompt([
    {
      type: 'list',
      name: 'choice',
      message: 'What would you like to do?',
      choices: ['Like an Article', 'Dislike an Article', 'Report an Article', 'Save an Article', 'Back to Main Menu'],
    },
  ]);
  return choice;
};

export const promptForArticleId = async (message: string): Promise<string> => {
  const { articleId } = await inquirer.prompt([
    {
      type: 'input',
      name: 'articleId',
      message: message,
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

export const promptToConfigureNotifications = async (currentSettings: any, allCategories: any[]): Promise<any> => {

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

export const promptForSearchQuery = async (): Promise<string> => {
  const { query } = await inquirer.prompt([
    {
      type: 'input',
      name: 'query',
      message: 'Enter your search query:',
    },
  ]);
  return query;
};

export const promptForSortOption = async (): Promise<string> => {
  const { choice } = await inquirer.prompt([
    {
      type: 'list',
      name: 'choice',
      message: 'How would you like to sort the results?',
      choices: [
        { name: 'Newest First', value: 'publishedAt' },
        { name: 'Most Likes', value: 'likes' },
        { name: 'Most Dislikes', value: 'dislikes' },
      ],
    },
  ]);
  return choice;
};

export const promptForSourceUpdate = async (): Promise<{ sourceId: string, apiKey: string }> => {
  return inquirer.prompt([
    { type: 'input', name: 'sourceId', message: 'Enter the Source ID to update:' },
    { type: 'input', name: 'apiKey', message: 'Enter the new API Key:' },
  ]);
};

export const promptForNewCategory = async (): Promise<string> => {
    const { name } = await inquirer.prompt([
      { type: 'input', name: 'name', message: 'Enter the new category name:'}
    ]);
    return name;
};

export const promptAdminAfterSources = async (): Promise<string> => {
  const { choice } = await inquirer.prompt([
    {
      type: 'list',
      name: 'choice',
      message: 'What would you like to do?',
      choices: ['View Server Details', 'Update an API Key', 'Back to Main Menu'],
    },
  ]);
  return choice;
};

export const promptForSourceId = async (message: string): Promise<string> => {
    const { sourceId } = await inquirer.prompt([
        { type: 'input', name: 'sourceId', message: message }
    ]);
    return sourceId;
};

export const promptForReportAction = async (): Promise<string> => {
  const { choice } = await inquirer.prompt([
    {
      type: 'list',
      name: 'choice',
      message: 'Report Management - What would you like to do?',
      choices: ['Hide an Article', 'Back to Admin Menu'],
    },
  ]);
  return choice;
};

export const promptForArticleIdToHide = async (): Promise<string> => {
    const { articleId } = await inquirer.prompt([
        { type: 'input', name: 'articleId', message: 'Enter the Article ID to HIDE:'}
    ]);
    return articleId;
};

export const promptForCategoryManagement = async (): Promise<string> => {
  const { choice } = await inquirer.prompt([
    {
      type: 'list',
      name: 'choice',
      message: 'Category Management - What would you like to do?',
      choices: ['Hide a Category', 'Unhide a Category', 'Back to Admin Menu'],
    },
  ]);
  return choice;
};

export const promptForCategoryId = async (message: string): Promise<string> => {
    const { categoryId } = await inquirer.prompt([
        { type: 'input', name: 'categoryId', message: message }
    ]);
    return categoryId;
};

export const promptForKeywordManagement = async (): Promise<string> => {
  const { choice } = await inquirer.prompt([
    {
      type: 'list',
      name: 'choice',
      message: 'Blocked Keywords - What would you like to do?',
      choices: ['View Blocked Keywords', 'Add a Keyword', 'Remove a Keyword', 'Back to Admin Menu'],
    },
  ]);
  return choice;
};

export const promptForNewKeyword = async (): Promise<string> => {
    const { keyword } = await inquirer.prompt([
        { type: 'input', name: 'keyword', message: 'Enter the keyword to block:' }
    ]);
    return keyword;
};

export const promptForKeywordIdToRemove = async (): Promise<string> => {
    const { keywordId } = await inquirer.prompt([
        { type: 'input', name: 'keywordId', message: 'Enter the ID of the keyword to remove:' }
    ]);
    return keywordId;
};

