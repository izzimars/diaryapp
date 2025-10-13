import nodemailer from 'nodemailer';
import Logger from '../../config/logger';
import Env from '../utils/env';

const logger = new Logger('EmailService');

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

interface SMTPConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

export class EmailService {
  private transporter: nodemailer.Transporter;
  private config: SMTPConfig;

  constructor() {
    this.config = {
      host: Env.get('EMAIL_HOST') || 'smtp.gmail.com',
      port: parseInt(Env.get('EMAIL_PORT') || '465'),
      secure: true,
      auth: {
        user: Env.get('EMAIL_USER') || '',
        pass: Env.get('EMAIL_PASS') || '',
      },
    };

    this.transporter = nodemailer.createTransporter(this.config);
  }

  /**
   * Send email with custom options
   * @param options Email options including recipient, subject, and HTML content
   */
  public async sendEmail(options: EmailOptions): Promise<void> {
    try {
      const mailOptions = {
        from: options.from || Env.get('EMAIL_USER'),
        to: options.to,
        subject: options.subject,
        html: options.html,
      };

      await this.transporter.sendMail(mailOptions);
      logger.log(`Email successfully sent to ${options.to}`);
    } catch (error) {
      logger.error(error);
      const emailError = new Error('Failed to send email');
      (emailError as any).status = 500;
      throw emailError;
    }
  }

  /**
   * Send OTP verification email to user
   * @param userEmail User's email address
   * @param otp One-time password code
   */
  public async sendOtpEmail(userEmail: string, otp: string): Promise<void> {
    try {
      const subject = 'Verify Your Email - DiaryApp';
      const html = this.generateOtpEmailTemplate(otp);

      await this.sendEmail({
        to: userEmail,
        subject,
        html,
      });

      logger.log(`OTP email sent successfully to ${userEmail}`);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  /**
   * Send welcome email to new user
   * @param userEmail User's email address
   * @param userName User's name (optional)
   */
  public async sendWelcomeEmail(
    userEmail: string,
    userName?: string
  ): Promise<void> {
    try {
      const subject = 'Welcome to DiaryApp!';
      const html = this.generateWelcomeEmailTemplate(userName || 'User');

      await this.sendEmail({
        to: userEmail,
        subject,
        html,
      });

      logger.log(`Welcome email sent successfully to ${userEmail}`);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  /**
   * Send password reset email
   * @param userEmail User's email address
   * @param resetToken Password reset token
   */
  public async sendPasswordResetEmail(
    userEmail: string,
    resetToken: string
  ): Promise<void> {
    try {
      const subject = 'Reset Your Password - DiaryApp';
      const html = this.generatePasswordResetEmailTemplate(resetToken);

      await this.sendEmail({
        to: userEmail,
        subject,
        html,
      });

      logger.log(`Password reset email sent successfully to ${userEmail}`);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  /**
   * Generate OTP email HTML template
   * @param otp One-time password code
   * @returns HTML string
   */
  private generateOtpEmailTemplate(otp: string): string {
    return `
      <div style="background-color: #f0f0f0; padding: 20px; max-width: 640px; margin: auto; font-family: Arial, sans-serif;">
        <section style="max-width: 600px; margin: auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; display: inline; font-size: 28px; margin: 0;">DiaryApp</h1>
          </div>
          
          <h2 style="color: #1f2937; margin-bottom: 20px;">Email Verification</h2>
          
          <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            Thank you for signing up with DiaryApp! To complete your registration, please verify your email address using the code below:
          </p>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center; margin: 30px 0;">
            <h3 style="color: #1f2937; margin-bottom: 10px;">Verification Code</h3>
            <div style="font-size: 32px; font-weight: bold; color: #2563eb; letter-spacing: 4px; font-family: 'Courier New', monospace;">
              ${otp}
            </div>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; line-height: 1.5;">
            <strong>Important:</strong> This verification code will expire in <strong>5 minutes</strong>. 
            Do not share this code with anyone to ensure the security of your account.
          </p>
          
          <p style="color: #6b7280; font-size: 14px; line-height: 1.5; margin-top: 20px;">
            If you didn't request this verification, please ignore this email.
          </p>
          
          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center;">
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">
              © 2025 DiaryApp. All rights reserved.
            </p>
          </div>
        </section>
      </div>
    `;
  }

  /**
   * Generate welcome email HTML template
   * @param userName User's name
   * @returns HTML string
   */
  private generateWelcomeEmailTemplate(userName: string): string {
    return `
      <div style="background-color: #f0f0f0; padding: 20px; max-width: 640px; margin: auto; font-family: Arial, sans-serif;">
        <section style="max-width: 600px; margin: auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; display: inline; font-size: 28px; margin: 0;">DiaryApp</h1>
          </div>
          
          <h2 style="color: #1f2937; margin-bottom: 20px;">Welcome to DiaryApp!</h2>
          
          <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            Hi ${userName},
          </p>
          
          <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            Welcome to DiaryApp! We're excited to have you join our community of diary writers. 
            Your personal digital diary is now ready to capture your thoughts, memories, and experiences.
          </p>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 30px 0;">
            <h3 style="color: #1f2937; margin-bottom: 15px;">Getting Started</h3>
            <ul style="color: #4b5563; margin: 0; padding-left: 20px;">
              <li style="margin-bottom: 8px;">Create your first diary entry</li>
              <li style="margin-bottom: 8px;">Express your daily moods and weather</li>
              <li style="margin-bottom: 8px;">Keep your memories safe and secure</li>
              <li>Reflect on your personal journey</li>
            </ul>
          </div>
          
          <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            If you have any questions or need assistance, feel free to reach out to our support team.
          </p>
          
          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center;">
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">
              © 2025 DiaryApp. All rights reserved.
            </p>
          </div>
        </section>
      </div>
    `;
  }

  /**
   * Generate password reset email HTML template
   * @param resetToken Password reset token
   * @returns HTML string
   */
  private generatePasswordResetEmailTemplate(resetToken: string): string {
    const resetUrl = `${
      Env.get('FRONTEND_URL') || 'http://localhost:3000'
    }/reset-password?token=${resetToken}`;

    return `
      <div style="background-color: #f0f0f0; padding: 20px; max-width: 640px; margin: auto; font-family: Arial, sans-serif;">
        <section style="max-width: 600px; margin: auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; display: inline; font-size: 28px; margin: 0;">DiaryApp</h1>
          </div>
          
          <h2 style="color: #1f2937; margin-bottom: 20px;">Password Reset Request</h2>
          
          <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            We received a request to reset your password for your DiaryApp account. 
            If you made this request, click the button below to reset your password:
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #2563eb; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              Reset Password
            </a>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; line-height: 1.5;">
            <strong>Important:</strong> This reset link will expire in <strong>1 hour</strong> for security reasons.
          </p>
          
          <p style="color: #6b7280; font-size: 14px; line-height: 1.5; margin-top: 20px;">
            If you didn't request a password reset, please ignore this email. Your password will remain unchanged.
          </p>
          
          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 12px; line-height: 1.5;">
              If the button above doesn't work, copy and paste this link into your browser:
              <br>
              <span style="word-break: break-all;">${resetUrl}</span>
            </p>
          </div>
          
          <div style="margin-top: 20px; text-align: center;">
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">
              © 2025 DiaryApp. All rights reserved.
            </p>
          </div>
        </section>
      </div>
    `;
  }

  /**
   * Test email configuration
   * @returns Promise<boolean> True if configuration is valid
   */
  public async testConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      logger.log('Email service connection verified successfully');
      return true;
    } catch (error) {
      logger.error(error);
      return false;
    }
  }
}

// Export singleton instance
export const emailService = new EmailService();

export default emailService;
