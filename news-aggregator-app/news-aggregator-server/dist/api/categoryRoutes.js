"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const newsRepository_1 = __importDefault(require("../repositories/newsRepository"));
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
class CategoryRoutes {
    router = (0, express_1.Router)();
    constructor() {
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get('/', authMiddleware_1.default.isAuthenticated, this.getAllCategories);
    }
    getAllCategories = async (req, res, next) => {
        try {
            // Logic to get all categories, likely from a repository
            const categories = await newsRepository_1.default.findAllCategories(); // Assumes this method exists
            res.json(categories);
        }
        catch (error) {
            next(error);
        }
    };
}
exports.default = CategoryRoutes;
