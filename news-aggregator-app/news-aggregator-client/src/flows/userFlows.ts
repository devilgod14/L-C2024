import { deleteSavedArticle, getHeadlines, getSavedArticles, saveArticle } from "../api/api.js";
import { promptAfterArticles, promptAfterSavedArticles, promptForArticleId, promptForCategory, promptForDate, promptForDateOption, promptForNotificationAction, promptForSavedArticleIdToDelete } from "../ui/prompts.js";
import { handleConfigure } from "./notificationFlows.js";

export const handleHeadlines = async () => {
  console.log('\n--- View Headlines ---');
  let filters: { category?: string; startDate?: string; endDate?: string } = {};

  const dateChoice = await promptForDateOption();

  if (dateChoice === 'Today') {
    const today = new Date().toISOString().split('T')[0]; 
    filters.startDate = today;
    filters.endDate = today;
  } else if (dateChoice === 'Date range') {
    filters.startDate = await promptForDate('Enter start date (YYYY-MM-DD):');
    filters.endDate = await promptForDate('Enter end date (YYYY-MM-DD):');
  } else { 
    return; 
  }

  const categoryChoice = await promptForCategory();
  if (categoryChoice !== 'All') {
    filters.category = categoryChoice;
  }

  try {
    console.log('\nFetching headlines...');
    const articles = await getHeadlines(filters);

    if (articles.length === 0) {
      console.log('No articles found matching your criteria.');
      return;
    }

    console.log('\n--- Top Headlines ---');
    articles.forEach((article: any) => {
      console.log(`\n----------------------------------------`);
      console.log(`Article ID: ${article._id}`);
      console.log(`Title: ${article.title}`);
      console.log(`Category: ${article.categoryId.name}`);
      console.log(`Source: ${article.sourceId.name}`);
      console.log(`Description: ${article.description.substring(0, 100)}...`);
      console.log(`URL: ${article.url}`);
    });
    console.log(`----------------------------------------`);

    const choice = await promptAfterArticles();

    if (choice === 'Save Article') {
      const articleIdToSave = await promptForArticleId();
      try {
        await saveArticle(articleIdToSave);
        console.log('\n✅ Article saved successfully!');
      } catch (error: any) {
        console.error(`\n❌ Error saving article: ${error.response?.data?.message}`);
      }
    }

  } catch (error: any) {
    console.error(`\n❌ Error fetching headlines: ${error.response?.data?.message}`);
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
      console.log(`URL: ${saved.articleId.url}`);
    });
    console.log(`----------------------------------------`);

    const choice = await promptAfterSavedArticles();

    if (choice === 'Delete Article') {
      const idToDelete = await promptForSavedArticleIdToDelete();
      try {
        await deleteSavedArticle(idToDelete);
        console.log('\n✅ Article successfully deleted from your saved list.');
      } catch (error: any) {
        console.error(`\n❌ Error deleting article: ${error.response?.data?.message}`);
      }
    }

  } catch (error: any) {
    console.error(`\n❌ Error fetching saved articles: ${error.response?.data?.message}`);
  }
};

export const handleSearch = async () => {
  console.log('\n--> Handling Search...');
};

