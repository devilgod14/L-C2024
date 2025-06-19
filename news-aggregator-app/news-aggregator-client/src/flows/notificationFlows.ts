import { getNotificationSettings, updateNotificationSettings } from '../api/api.js';
import {  promptForNotificationAction, promptToConfigureNotifications } from '../ui/prompts.js';


export const handleNotifications = async () => {
  console.log('\n--- Notifications ---');
  const choice = await promptForNotificationAction();
  switch (choice) {
    case 'View Notifications':
      break;
    case 'Configure Notifications':
      await handleConfigure();
      break;
    case 'Back to Main Menu':
      return;
  }
};

export const handleConfigure = async () => {
  try {
    console.log('\nFetching your current notification settings...');
    const currentSettings = await getNotificationSettings();

    const newSettings = await promptToConfigureNotifications(currentSettings);

    await updateNotificationSettings(newSettings);
    console.log('\n✅ Notification settings updated successfully!');
  } catch (error: any) {
    console.error(`\n❌ Error configuring notifications: ${error.response?.data?.message}`);
  }
};

export const handleViewNotifications = async () => {
  console.log('\n--> Feature to view notifications coming soon...');
};