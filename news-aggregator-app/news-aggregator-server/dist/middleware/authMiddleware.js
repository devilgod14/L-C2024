"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userRepository_1 = __importDefault(require("../repositories/userRepository"));
const error_1 = require("../utils/error");
class AuthMiddleware {
    isAuthenticated = async (req, res, next) => {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            req.user = await userRepository_1.default.findById(decoded.user.id);
            return next();
        }
        throw new error_1.UnauthorizedError('Not authorized, no token');
    };
    isAdmin = (req, res, next) => {
        if (req.user && req.user.role === 'Admin') {
            return next();
        }
        throw new error_1.UnauthorizedError('Forbidden. Admin access required.');
    };
}
exports.default = new AuthMiddleware();
