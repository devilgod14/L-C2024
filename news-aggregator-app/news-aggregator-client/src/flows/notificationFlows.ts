import { getAllCategories } from '../api/categoryApi.js';
import { getNotificationSettings, getViewableNotifications, updateNotificationSettings } from '../api/notificationApi.js';
import {  promptForNotificationAction, promptToConfigureNotifications } from '../ui/prompts.js';


export const handleNotifications = async () => {
  console.log('\n--- Notifications ---');
  const choice = await promptForNotificationAction();
  switch (choice) {
    case 'View Notifications':
     handleViewNotications();
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
      const [currentSettings, allCategories] = await Promise.all([
      getNotificationSettings(),
      getAllCategories()
    ]);
    const newSettings = await promptToConfigureNotifications(currentSettings,allCategories);

    await updateNotificationSettings(newSettings);
    console.log('\n Notification settings updated successfully!');
  } catch (error: any) {
    console.error(`\n Error configuring notifications: ${error.response?.data?.message}`);
  }
};

export const handleViewNotications = async () => {
  console.log('\nFetching your notifications...');
  try {
    const notifications = await getViewableNotifications();

    if (notifications.length === 0) {
      console.log('You have no new notifications.');
      return;
    }

    console.log('\n--- Your Notifications ---');
    notifications.forEach((notif: any) => {
      const articleTitle = notif.articleId ? notif.articleId.title : 'Article not found';
      const date = new Date(notif.createdAt).toLocaleString();
      
      console.log(`\n----------------------------------------`);
      console.log(`[${date}]`);
      console.log(`Message: ${notif.message}`);
      console.log(`Article: ${articleTitle}`);
    });
    console.log(`----------------------------------------`);

  } catch (error: any) {
    console.error(`\n Error fetching notifications: ${error.response?.data?.message}`);
  }
};