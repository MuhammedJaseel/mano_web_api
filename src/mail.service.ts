import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
// import { SendMailOptions } from './interfaces/mail-options.interface';

@Injectable()
export class MailService implements OnModuleInit {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(MailService.name);

  yelmasTemplate(data: any) {
    return `<!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f4f5f7; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; border: 1px solid #e1e4e8; overflow: hidden; }
            .header { background: #1f2937; color: #ffffff; padding: 20px 28px; }
            .header h2 { margin: 0; font-size: 18px; }
            .content { padding: 28px; }
            .label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.8px; color: #6b7280; font-weight: 700; margin-bottom: 4px; }
            .value { font-size: 15px; color: #111827; margin-bottom: 18px; }
            .value a { color: #2563eb; text-decoration: none; }
            .msg-box { background: #f9fafb; border-left: 4px solid #2563eb; padding: 14px; border-radius: 4px; font-size: 14px; color: #374151; white-space: pre-wrap; }
            .footer { background: #f9fafb; padding: 14px; border-top: 1px solid #e1e4e8; font-size: 12px; color: #9ca3af; text-align: center; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>📩 New Website Enquiry</h2>
            </div>
            <div class="content">
              <div class="label">Full Name</div>
              <div class="value">${data.name}</div>
        
              <div class="label">Email Address</div>
              <div class="value"><a href="mailto:${data.email}">${data.email}</a></div>
        
              <div class="label">Phone Number</div>
              <div class="value"><a href="tel:${data.phone}">${data.phone}</a></div>
        
              <div class="label">Message</div>
              <div class="msg-box">${data.note}</div>
            </div>
            <div class="footer">
              Submitted via Website Contact Form
            </div>
          </div>
        </body>
        </html>
        `;
  }

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.zoho.com',
      port: 465,
      secure: true, // true for 465, false for 587
      auth: {
        user: process.env.ZOHO_EMAIL,
        pass: process.env.ZOHO_APP_PASSWORD,
      },
    });
  }

  // Verify SMTP connection on application startup
  async onModuleInit() {
    try {
      await this.transporter.verify();
      this.logger.log('Successfully connected to Zoho SMTP server.');
    } catch (error) {
      this.logger.error('Failed to connect to Zoho SMTP server:', error);
    }
  }

  /**
   * Send email using configured Zoho SMTP
   */
  async sendMail(
    to: string,
    subject: string,
    text: string,
    html: string,
  ): Promise<nodemailer.SentMessageInfo> {
    const mailOptions: nodemailer.SendMailOptions = {
      from: 'me@jaseel.cloud',
      to,
      subject,
      text,
      html,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      this.logger.log(
        `Email sent successfully to ${to}. MessageId: ${info.messageId}`,
      );
      return info;
    } catch (error) {
      this.logger.error(`Error sending email to ${to}:`, error);
      throw error;
    }
  }
}
