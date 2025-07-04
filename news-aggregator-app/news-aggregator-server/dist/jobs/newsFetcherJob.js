"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cron_1 = __importDefault(require("node-cron"));
const newsService_1 = __importDefault(require("../services/newsService"));
const notificationService_1 = __importDefault(require("../services/notificationService"));
const logger_1 = __importDefault(require("../config/logger"));
module.exports = () => {
    const schedule = '0 */4 * * *';
    logger_1.default.info(`Scheduling news fetch job with schedule: "${schedule}"`);
    node_cron_1.default.schedule(schedule, async () => {
        logger_1.default.info('--- Running Scheduled News Fetch Job ---');
        try {
            const newArticles = await newsService_1.default.fetchAndStoreNews();
            if (newArticles && newArticles.length > 0) {
                // The transporter is no longer passed here
                await notificationService_1.default.generateNotificationsForArticles(newArticles);
            }
            else {
                logger_1.default.info('No new articles found. Skipping notification engine.');
            }
            logger_1.default.info('--- Scheduled Job Finished ---');
        }
        catch (error) {
            logger_1.default.error('Error during scheduled news fetch job:', error);
        }
    });
};
