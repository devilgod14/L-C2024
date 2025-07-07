import cron from 'node-cron';
import newsService from '../services/newsService';
import notificationService from '../services/notificationService';
import logger from '../config/logger';

module.exports = () => {
  const schedule = '0 */4 * * *';
  //const schedule = '* * * * *';
  logger.info(`Scheduling news fetch job with schedule: "${schedule}"`);

  cron.schedule(schedule, async () => {
    logger.info('--- Running Scheduled News Fetch Job ---');
    try {
      const newArticles = await newsService.fetchAndStoreNews();

      if (newArticles && newArticles.length > 0) {
        // The transporter is no longer passed here
        await notificationService.generateNotificationsForArticles(newArticles);
      } else {
        logger.info('No new articles found. Skipping notification engine.');
      }
      logger.info('--- Scheduled Job Finished ---');
    } catch (error) {
      logger.error('Error during scheduled news fetch job:', error);
    }
  });
};