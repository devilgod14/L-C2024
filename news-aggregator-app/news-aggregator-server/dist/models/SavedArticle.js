"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const savedArticleSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    articleId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Article', required: true },
}, { timestamps: true });
savedArticleSchema.index({ userId: 1, articleId: 1 }, { unique: true });
exports.default = (0, mongoose_1.model)('SavedArticle', savedArticleSchema);
