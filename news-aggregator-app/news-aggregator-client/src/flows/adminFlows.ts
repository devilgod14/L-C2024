import { addBlockedKeyword, addCategory, getBlockedKeywords, getReportedArticles, getSourceDetails, getSources, hideArticle, hideCategory, removeBlockedKeyword, unhideCategory, updateSourceApiKey } from "../api/adminApi.js";
import { getAllCategories } from "../api/categoryApi.js";
import { promptAdminAfterSources, promptForArticleIdToHide, promptForCategoryId, promptForCategoryManagement, promptForKeywordIdToRemove, promptForKeywordManagement, promptForNewCategory, promptForNewKeyword, promptForReportAction, promptForSourceId, promptForSourceUpdate } from "../ui/prompts.js";

const maskApiKey = (key: string): string => {
  if (key.length <= 8) {
    return '****';
  }

  return `${key.substring(0, 4)}...${key.substring(key.length - 4)}`;
};

export const handleViewServers = async () => {
  while (true) {
    console.log('\n--- External API Sources ---');
    try {
      const sources = await getSources();
      if (sources.length === 0) { /* ... same as before ... */ }

      console.table(sources.map((s: any) => ({
        ID: s._id, Name: s.name, Status: s.status,
      })));

      const choice = await promptAdminAfterSources();

      if (choice === 'View Server Details') {
        const sourceId = await promptForSourceId('Enter the Source ID to view details:');
        const details = await getSourceDetails(sourceId);
        console.log('\n--- Source Details ---');
        console.table([
            { Label: 'ID', Value: details._id },
            { Label: 'Name', Value: details.name },
            { Label: 'API Key', Value: maskApiKey(details.apiKey) },
            { Label: 'Status', Value: details.status },
        ]);
      } else if (choice === 'Update an API Key') {
        const { sourceId, apiKey } = await promptForSourceUpdate();
        await updateSourceApiKey(sourceId, apiKey);
        console.log('\n Source API Key updated successfully!');
      } else { 
        break;
      }
    } catch (error: any) {
      console.error(`\n Error: ${error.response?.data?.message}`);
    }
  }
};

export const handleAddCategory = async () => {
  console.log('\n--- Add New Category ---');
  try {
    const categoryName = await promptForNewCategory();
    if (!categoryName) {
      console.log('Category name cannot be empty.');
      return;
    }
    await addCategory(categoryName);
    console.log(`\n Category '${categoryName}' added successfully!`);
  } catch (error: any) {
    console.error(`\n Error: ${error.response?.data?.message}`);
  }
};

export const handleReportedArticles = async () => {
  console.log('\n--- Manage Reported Articles ---');
  try {
    const reportedArticles = await getReportedArticles();
    if (reportedArticles.length === 0) {
      console.log('There are currently no articles with active reports.');
      return;
    }

    console.log('The following articles have been reported:');
    console.table(reportedArticles.map((a: any) => ({
      ID: a._id,
      Title: a.title,
      Reports: a.reportCount,
    })));

    const choice = await promptForReportAction();
    if (choice === 'Hide an Article') {
      const articleId = await promptForArticleIdToHide();
      await hideArticle(articleId);
      console.log('\n Article has been successfully hidden from public view.');
    }
  } catch (error: any) {
    console.error(`\n Error: ${error.response?.data?.message}`);
  }
};

export const handleManageCategories = async () => {
  while(true) {
    console.log('\n--- Manage Categories ---');
    try {
      const categories = await getAllCategories();
      console.table(categories.map((c: any) => ({
        ID: c._id,
        Name: c.name,
        Is_Hidden: c.isHidden
      })));

      const choice = await promptForCategoryManagement();

      if (choice === 'Back to Admin Menu') break;

      const categoryId = await promptForCategoryId(`Enter the Category ID to ${choice.split(' ')[0].toUpperCase()}:`);

      if (choice === 'Hide a Category') {
        await hideCategory(categoryId);
        console.log('\n Category has been hidden.');
      } else if (choice === 'Unhide a Category') {
        await unhideCategory(categoryId);
        console.log('\n Category is now visible.');
      }

    } catch (error: any) {
      console.error(`\n Error: ${error.response?.data?.message}`);
    }
  }
};

export const handleManageKeywords = async () => {
  while (true) {
    const choice = await promptForKeywordManagement();
    try {
      switch (choice) {
        case 'View Blocked Keywords':
          const keywords = await getBlockedKeywords();
          console.log('\n--- Currently Blocked Keywords ---');
          if (keywords.length === 0) console.log('No keywords are currently blocked.');
          else console.table(keywords.map((k: any) => ({ ID: k._id, Keyword: k.keyword })));
          break;
        case 'Add a Keyword':
          const newKeyword = await promptForNewKeyword();
          await addBlockedKeyword(newKeyword);
          console.log(`\n✅ Keyword '${newKeyword}' has been added to the blocklist.`);
          break;
        case 'Remove a Keyword':
          const keywordId = await promptForKeywordIdToRemove();
          await removeBlockedKeyword(keywordId);
          console.log('\n✅ Keyword has been removed from the blocklist.');
          break;
        case 'Back to Admin Menu':
          return;
      }
    } catch (error: any) {
      console.error(`\n❌ Error: ${error.response?.data?.message}`);
    }
  }
};