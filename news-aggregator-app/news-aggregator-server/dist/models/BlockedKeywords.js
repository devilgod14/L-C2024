"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const blockedKeywordSchema = new mongoose_1.Schema({
    keyword: { type: String, required: true, unique: true, trim: true, lowercase: true },
    addedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('BlockedKeyword', blockedKeywordSchema);
