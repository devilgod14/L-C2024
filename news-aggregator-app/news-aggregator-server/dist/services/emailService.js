"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const logger_1 = __importDefault(require("../config/logger"));
class EmailService {
    transporter = null;
    async initialize() {
        try {
            const testAccount = await nodemailer_1.default.createTestAccount();
            logger_1.default.info('Ethereal test account created successfully.');
            logger_1.default.info(`User: ${testAccount.user} | Pass: ${testAccount.pass}`);
            this.transporter = nodemailer_1.default.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                secure: false,
                auth: {
                    user: testAccount.user,
                    pass: testAccount.pass,
                },
            });
        }
        catch (error) {
            logger_1.default.error('Failed to create Ethereal test account', error);
            throw error;
        }
    }
    async send(options) {
        if (!this.transporter) {
            throw new Error('Email service not initialized. Cannot send email.');
        }
        try {
            const info = await this.transporter.sendMail({
                from: '"News Aggregator" <noreply@newsaggregator.com>',
                to: options.to,
                subject: options.subject,
                html: options.html,
            });
            logger_1.default.info(`Email sent: ${info.messageId}`);
            logger_1.default.info(`Preview URL: ${nodemailer_1.default.getTestMessageUrl(info)}`);
        }
        catch (error) {
            logger_1.default.error('Error sending email', error);
            throw error;
        }
    }
}
exports.default = new EmailService();
