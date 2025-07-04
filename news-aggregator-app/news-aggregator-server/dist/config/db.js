"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = __importDefault(require("./logger"));
class DatabaseService {
    async connect() {
        try {
            const conn = await mongoose_1.default.connect(process.env.MONGO_URI);
            logger_1.default.info(`MongoDB Connected: ${conn.connection.host}`);
        }
        catch (error) {
            logger_1.default.error('Database connection failed', error);
            process.exit(1);
        }
    }
}
exports.default = new DatabaseService();
