"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const notificationSettingSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    enabledCategories: { type: [String], default: [] },
    keywords: { type: [String], default: [] }
});
exports.default = (0, mongoose_1.model)('NotificationSetting', notificationSettingSchema);
