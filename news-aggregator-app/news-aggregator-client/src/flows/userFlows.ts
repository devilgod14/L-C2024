import { getHeadlines, searchArticles } from "../api/newsApi.js";
import { deleteSavedArticle, getSavedArticles, reportArticle, saveArticle, voteOnArticle } from "../api/userApi.js";
import { promptAdminMenu, promptAfterArticleList, promptAfterSavedArticles, promptForArticleId, promptForCategory, promptForDate, promptForDateOption, promptForSavedArticleIdToDelete, promptForSearchQuery, promptForSortOption, promptUserMenu } from "../ui/prompts.js";
import { handleAddCategory, handleManageCategories, handleManageKeywords, handleReportedArticles, handleViewServers } from "./adminFlows.js";
import { handleNotifications } from "./notificationFlows.js";


export const showAdminMenu = async () => {
  let inMenu = true;
  while (inMenu) {
    const choice = await promptAdminMenu();
    switch (choice) {
      case 'View the list of external servers and status':
        await handleViewServers();
        break;
      case 'Manage Reported Articles':
        await handleReportedArticles();
        break;
      case 'Manage Categories':
        await handleManageCategories();
        break;
      case 'Manage Blocked Keywords':
        await handleManageKeywords();
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

export const showUserMenu = async () => {
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

async function displayAndInteractWithArticles(articles: any[]) {
  if (articles.length === 0) {
    console.log('No articles found matching your criteria.');
    return;
  }

  console.log('\n--- Articles ---');
  articles.forEach((article: any) => {
    console.log(`\n----------------------------------------`);
    console.log(`Article ID: ${article._id}`);
    console.log(`Title: ${article.title}`);
    console.log(`Category: ${article.categoryId.name}`);
    console.log(`Likes: ${article.likes} | Dislikes: ${article.dislikes}`);
    console.log(`URL: ${article.url}`);
  });
  console.log(`----------------------------------------`);

  while (true) {
    const choice = await promptAfterArticleList();
    let articleId = '';

    try {
      switch (choice) {
        case 'Like an Article':
          articleId = await promptForArticleId('Enter the Article ID to LIKE:');
          await voteOnArticle(articleId, 'like');
          console.log('\n Vote registered successfully!');
          break;

        case 'Dislike an Article':
          articleId = await promptForArticleId('Enter the Article ID to DISLIKE:');
          await voteOnArticle(articleId, 'dislike');
          console.log('\n Vote registered successfully!');
          break;

        case 'Report an Article':
          articleId  =await promptForArticleId('Enter the Article ID to Report');
          await reportArticle(articleId);
          console.log('\n Article Reported successfully');
          break;

        case 'Save an Article':
          articleId = await promptForArticleId('Enter the Article ID to SAVE:');
          await saveArticle(articleId);
          console.log('\n Article saved successfully!');
          break;
        
        case 'Back to Main Menu':
          return; 
      }
    } catch (error: any) {
      console.error(`\n Error: ${error.response?.data?.message || 'An unknown error occurred.'}`);
    }
  }
}

export const handleHeadlines = async () => {
  console.log('\n--- View Headlines ---');
  let filters: { category?: string; startDate?: string; endDate?: string } = {};

  const dateChoice = await promptForDateOption();
  if (dateChoice === 'Today') { 
    const today = new Date().toISOString().split('T')[0]; 
    filters.startDate = today;
    filters.endDate = today;
  } 
  else if (dateChoice === 'Date range') { 
    filters.startDate = await promptForDate('Enter start date (YYYY-MM-DD):');
    filters.endDate = await promptForDate('Enter end date (YYYY-MM-DD):');
  } 
  else { return; }
  const categoryChoice = await promptForCategory();
  if (categoryChoice !== 'All') { filters.category = categoryChoice; }
  
  try {
    console.log('\nFetching headlines...');
    const articles = await getHeadlines(filters);
    await displayAndInteractWithArticles(articles);
  } catch (error: any) {
    console.error(`\n Error fetching headlines: ${error.response?.data?.message}`);
  }
};

export const handleSearch = async () => {
  console.log('\n--- Search for Articles ---');
  let filters: { query: string; startDate?: string; endDate?: string; sortBy?: string; };

  const query = await promptForSearchQuery();
  if (!query) { console.log('Search query cannot be empty.'); return; }
  filters = { query };
  
  const dateChoice = await promptForDateOption();
  if (dateChoice === 'Today') { 
    const today = new Date().toISOString().split('T')[0]; 
    filters.startDate = today;
    filters.endDate = today;
  } 
  else if (dateChoice === 'Date range') { 
    filters.startDate = await promptForDate('Enter start date (YYYY-MM-DD):');
    filters.endDate = await promptForDate('Enter end date (YYYY-MM-DD):');
  } 
  
  const sortBy = await promptForSortOption();
  if (sortBy !== 'publishedAt') { filters.sortBy = sortBy; }

  try {
    console.log('\nSearching for articles...');
    const articles = await searchArticles(filters);
    await displayAndInteractWithArticles(articles); 
  } catch (error: any) {
    console.error(`\n Error searching for articles: ${error.response?.data?.message}`);
  }
};

export const handleSavedArticles = async () => {
  console.log('\n--- Your Saved Articles ---');
  try {
    const savedArticles = await getSavedArticles();

    if (savedArticles.length === 0) {
      console.log('You have no saved articles.');
      return;
    }

    savedArticles.forEach((saved: any) => {
      console.log(`\n----------------------------------------`);
      console.log(`Saved Article ID: ${saved._id}`); 
      console.log(`Title: ${saved.articleId.title}`);
      console.log(`Category: ${saved.articleId.categoryId.name}`);
      console.log(`Likes: ${saved.articleId.likes} | Dislikes: ${saved.articleId.dislikes}`);
      console.log(`URL: ${saved.articleId.url}`);
    });
    console.log(`----------------------------------------`);

    const choice = await promptAfterSavedArticles();

    if (choice === 'Delete Article') {
      const idToDelete = await promptForSavedArticleIdToDelete();
      try {
        await deleteSavedArticle(idToDelete);
        console.log('\n Article successfully deleted from your saved list.');
      } catch (error: any) {
        console.error(`\n Error deleting article: ${error.response?.data?.message}`);
      }
    }

  } catch (error: any) {
    console.error(`\n Error fetching saved articles: ${error.response?.data?.message}`);
  }
};

