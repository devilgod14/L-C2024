"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Notification_1 = __importDefault(require("../models/Notification"));
const NotificationSetting_1 = __importDefault(require("../models/NotificationSetting"));
class NotificationRepository {
    async findSettingsForUser(userId) {
        return NotificationSetting_1.default.findOne({ userId });
    }
    async findOrCreateSettingsForUser(userId) {
        return NotificationSetting_1.default.findOneAndUpdate({ userId }, { $setOnInsert: { userId, enabledCategories: [], keywords: [] } }, { upsert: true, new: true });
    }
    async updateSettingsForUser(userId, settings) {
        return NotificationSetting_1.default.findOneAndUpdate({ userId }, { $set: settings }, { new: true, upsert: true });
    }
    async findNotificationsForUser(userId) {
        return Notification_1.default.find({ userId })
            .sort({ createdAt: -1 })
            .populate('articleId', 'title url');
    }
    async findAllSettingsWithUserEmail() {
        return NotificationSetting_1.default.find({}).populate('userId', 'email');
    }
    async findExistingNotification(userId, articleId) {
        return Notification_1.default.findOne({ userId, articleId });
    }
    async createNotification(userId, articleId, message) {
        return Notification_1.default.create({ userId, articleId, message });
    }
}
exports.default = new NotificationRepository();
