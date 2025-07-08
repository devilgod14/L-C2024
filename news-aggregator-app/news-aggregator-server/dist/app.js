"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./config/db"));
const logger_1 = __importDefault(require("./config/logger"));
const emailService_1 = __importDefault(require("./services/emailService"));
const errorHandler_1 = __importDefault(require("./middleware/errorHandler"));
const authRoutes_1 = __importDefault(require("./api/authRoutes"));
const newsRoutes_1 = __importDefault(require("./api/newsRoutes"));
const articleRoutes_1 = __importDefault(require("./api/articleRoutes"));
const userRoutes_1 = __importDefault(require("./api/userRoutes"));
const notificationRoutes_1 = __importDefault(require("./api/notificationRoutes"));
const categoryRoutes_1 = __importDefault(require("./api/categoryRoutes"));
const adminRoutes_1 = __importDefault(require("./api/adminRoutes"));
class Server {
    app;
    port;
    constructor() {
        this.app = (0, express_1.default)();
        this.port = parseInt(process.env.PORT || '3000', 10);
        this.initializeConfig();
        this.initializeRoutes();
        this.initializeErrorHandling();
    }
    initializeConfig() {
        dotenv_1.default.config();
        this.app.use((0, cors_1.default)());
        this.app.use(express_1.default.json());
    }
    initializeRoutes() {
        this.app.use('/api/auth', new authRoutes_1.default().router);
        this.app.use('/api/news', new newsRoutes_1.default().router);
        this.app.use('/api/articles', new articleRoutes_1.default().router);
        this.app.use('/api/users', new userRoutes_1.default().router);
        this.app.use('/api/notifications', new notificationRoutes_1.default().router);
        this.app.use('/api/categories', new categoryRoutes_1.default().router);
        this.app.use('/api/admin', new adminRoutes_1.default().router);
    }
    initializeErrorHandling() {
        this.app.use(errorHandler_1.default);
    }
    async start() {
        try {
            await db_1.default.connect();
            await emailService_1.default.initialize();
            require('./jobs/newsFetcherJob'); // Start the cron job
            this.app.listen(this.port, () => {
                logger_1.default.info(`Server is running on port ${this.port}`);
            });
        }
        catch (error) {
            logger_1.default.error('Failed to start server:', error);
            process.exit(1);
        }
    }
}
// Start the server
const server = new Server();
server.start();
// Export app for testing
exports.default = server.app;
