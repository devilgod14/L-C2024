"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const externalAPISourceSchema = new mongoose_1.Schema({
    name: { type: String, required: true, unique: true, trim: true },
    apiKey: { type: String, required: true },
    status: { type: String, enum: ['Active', 'Not Active'], required: true, default: 'Active' },
    lastAccessed: { type: Date }
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('ExternalAPISource', externalAPISourceSchema);
