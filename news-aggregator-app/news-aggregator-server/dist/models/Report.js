"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const reportSchema = new mongoose_1.Schema({
    articleId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Article', required: true },
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    reason: { type: String, trim: true }
}, { timestamps: true });
reportSchema.index({ articleId: 1, userId: 1 }, { unique: true });
exports.default = (0, mongoose_1.model)('Report', reportSchema);
