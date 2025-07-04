"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notificationService_1 = __importDefault(require("../services/notificationService"));
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
class NotificationRoutes {
    router = (0, express_1.Router)();
    constructor() {
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.use(authMiddleware_1.default.isAuthenticated);
        this.router.get('/', this.getNotifications);
        this.router.get('/settings', this.getSettings);
        this.router.put('/settings', this.updateSettings);
    }
    getNotifications = async (req, res, next) => {
        try {
            const notifications = await notificationService_1.default.getNotificationsForUser(req.user.id);
            res.json(notifications);
        }
        catch (error) {
            next(error);
        }
    };
    getSettings = async (req, res, next) => {
        try {
            const settings = await notificationService_1.default.getSettings(req.user.id);
            res.json(settings);
        }
        catch (error) {
            next(error);
        }
    };
    updateSettings = async (req, res, next) => {
        try {
            const updatedSettings = await notificationService_1.default.updateSettings(req.user.id, req.body);
            res.json(updatedSettings);
        }
        catch (error) {
            next(error);
        }
    };
}
exports.default = NotificationRoutes;
