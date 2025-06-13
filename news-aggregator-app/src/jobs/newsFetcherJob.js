const cron = require('node-cron');
const newsService = require('../services/newsService');
const notificationService = require('../services/notificationService');

module.exports = (emailTransporter) => {
  //const schedule = '0 */4 * * *'; 
  const schedule = '* * * * *'; 

  console.log(`Scheduling news fetch job with schedule: "${schedule}"`);

  cron.schedule(schedule, async () => {
    console.log('--- Running Scheduled News Fetch Job ---');
    try {
      const newArticles = await newsService.fetchAndStoreNews();

      if (newArticles && newArticles.length > 0) {
        // Now we use the transporter that was passed in
        await notificationService.generateNotificationsForArticles(newArticles, emailTransporter);
      } else {
        console.log('No new articles found. Skipping notification engine.');
      }
      console.log('--- Scheduled Job Finished ---');
    } catch (error) {
      console.error('Error during scheduled news fetch job:', error);
    }
  });
};