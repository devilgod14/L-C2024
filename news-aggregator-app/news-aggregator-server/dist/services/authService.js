"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userRepository_1 = __importDefault(require("../repositories/userRepository"));
const error_1 = require("../utils/error");
class AuthService {
    async registerUser(userData) {
        const { username, email, password } = userData;
        const userExists = await userRepository_1.default.findByEmail(email);
        if (userExists) {
            throw new error_1.BadRequestError('User already exists with that email');
        }
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash(password, salt);
        return userRepository_1.default.create({ username, email, password: hashedPassword });
    }
    async loginUser({ email, password }) {
        const user = await userRepository_1.default.findByEmail(email);
        if (!user) {
            throw new error_1.UnauthorizedError('Invalid credentials');
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            throw new error_1.UnauthorizedError('Invalid credentials');
        }
        const payload = {
            user: {
                id: user.id, role: user.role, username: user.username, email: user.email,
            },
        };
        return jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    }
}
exports.default = new AuthService();
