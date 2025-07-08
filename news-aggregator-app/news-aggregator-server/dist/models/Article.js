"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const articleSchema = new mongoose_1.Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    url: { type: String, required: true, unique: true },
    publishedAt: { type: Date, required: true },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    isHidden: { type: Boolean, default: false, index: true },
    reportCount: { type: Number, default: 0 },
    categoryId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Category', required: true },
    sourceId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'ExternalAPISource', required: true }
}, { timestamps: true });
articleSchema.index({ title: 'text', description: 'text' });
exports.default = (0, mongoose_1.model)('Article', articleSchema);
