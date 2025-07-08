import nodemailer, { Transporter } from 'nodemailer';
import logger from '../config/logger';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

class EmailService {
  private transporter: Transporter | null = null;

  public async initialize(): Promise<void> {
    try {
      const testAccount = await nodemailer.createTestAccount();
      logger.info('Ethereal test account created successfully.');
      logger.info(`User: ${testAccount.user} | Pass: ${testAccount.pass}`);

      this.transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    } catch (error) {
      logger.error('Failed to create Ethereal test account', error);
      throw error;
    }
  }

  public async send(options: EmailOptions): Promise<void> {
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

      logger.info(`Email sent: ${info.messageId}`);
      logger.info(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    } catch (error) {
      logger.error('Error sending email', error);
      throw error;
    }
  }
}

export default new EmailService();