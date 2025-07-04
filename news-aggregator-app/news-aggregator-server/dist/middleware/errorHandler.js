"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../config/logger"));
const error_1 = require("../utils/error");
const errorHandler = (err, req, res, next) => {
    logger_1.default.error(err);
    if (err instanceof error_1.AppError && err.isOperational) {
        res.status(err.statusCode).json({
            message: err.message,
        });
    }
    res.status(500).json({
        message: 'An unexpected error occurred on the server.',
    });
};
exports.default = errorHandler;
