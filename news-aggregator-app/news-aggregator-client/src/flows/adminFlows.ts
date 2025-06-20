import { addCategory, getSourceDetails, getSources, updateSourceApiKey } from "../api/adminApi.js";
import { promptAdminAfterSources, promptForNewCategory, promptForSourceId, promptForSourceUpdate } from "../ui/prompts.js";

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