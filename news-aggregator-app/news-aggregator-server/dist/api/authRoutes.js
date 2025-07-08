"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authService_1 = __importDefault(require("../services/authService"));
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
class AuthRoutes {
    router = (0, express_1.Router)();
    constructor() {
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post('/signup', this.signup);
        this.router.post('/login', this.login);
        this.router.get('/me', authMiddleware_1.default.isAuthenticated, this.getMe);
    }
    signup = async (req, res, next) => {
        try {
            const newUser = await authService_1.default.registerUser(req.body);
            const userToReturn = {
                _id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role,
                createdAt: newUser.createdAt,
            };
            res.status(201).json(userToReturn);
        }
        catch (error) {
            next(error);
        }
    };
    login = async (req, res, next) => {
        try {
            const { email, password } = req.body;
            const token = await authService_1.default.loginUser({ email, password });
            res.json({ token });
        }
        catch (error) {
            next(error);
        }
    };
    getMe = (req, res, next) => {
        try {
            res.status(200).json(req.user);
        }
        catch (error) {
            next(error);
        }
    };
}
exports.default = AuthRoutes;
