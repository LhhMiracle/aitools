import { Resend } from 'resend';

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@lwu.ai';
const APP_NAME = 'LWU.AI';
const APP_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000';

// Email templates
export const emailTemplates = {
  // Welcome email after registration
  welcome: (name: string) => ({
    subject: `Welcome to ${APP_NAME}!`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; padding: 20px 0; }
            .logo { font-size: 24px; font-weight: bold; color: #6366f1; }
            .content { padding: 20px 0; }
            .button { display: inline-block; padding: 12px 24px; background: linear-gradient(to right, #6366f1, #a855f7); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; }
            .footer { padding: 20px 0; text-align: center; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">${APP_NAME}</div>
            </div>
            <div class="content">
              <h2>Welcome, ${name}!</h2>
              <p>Thank you for joining ${APP_NAME}. We're excited to have you on board!</p>
              <p>You now have access to our powerful AI tools to transform your creative ideas into stunning visuals.</p>
              <p>Here's what you can do:</p>
              <ul>
                <li>Generate images from text descriptions</li>
                <li>Remove backgrounds instantly</li>
                <li>Enhance and upscale photos</li>
                <li>And much more!</li>
              </ul>
              <p style="text-align: center; padding: 20px 0;">
                <a href="${APP_URL}/tools" class="button">Start Creating</a>
              </p>
              <p>You've received 10 free credits to get started. Enjoy!</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.</p>
              <p>If you didn't create this account, please ignore this email.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  // Email verification
  verifyEmail: (name: string, verificationUrl: string) => ({
    subject: `Verify your email for ${APP_NAME}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; padding: 20px 0; }
            .logo { font-size: 24px; font-weight: bold; color: #6366f1; }
            .content { padding: 20px 0; }
            .button { display: inline-block; padding: 12px 24px; background: linear-gradient(to right, #6366f1, #a855f7); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; }
            .footer { padding: 20px 0; text-align: center; color: #666; font-size: 12px; }
            .code { background: #f3f4f6; padding: 10px 20px; border-radius: 8px; font-family: monospace; font-size: 18px; letter-spacing: 2px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">${APP_NAME}</div>
            </div>
            <div class="content">
              <h2>Verify your email</h2>
              <p>Hi ${name},</p>
              <p>Please click the button below to verify your email address:</p>
              <p style="text-align: center; padding: 20px 0;">
                <a href="${verificationUrl}" class="button">Verify Email</a>
              </p>
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #6366f1;">${verificationUrl}</p>
              <p>This link will expire in 24 hours.</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.</p>
              <p>If you didn't request this, please ignore this email.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  // Password reset
  resetPassword: (name: string, resetUrl: string) => ({
    subject: `Reset your ${APP_NAME} password`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; padding: 20px 0; }
            .logo { font-size: 24px; font-weight: bold; color: #6366f1; }
            .content { padding: 20px 0; }
            .button { display: inline-block; padding: 12px 24px; background: linear-gradient(to right, #6366f1, #a855f7); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; }
            .footer { padding: 20px 0; text-align: center; color: #666; font-size: 12px; }
            .warning { background: #fef3c7; border: 1px solid #f59e0b; padding: 12px; border-radius: 8px; color: #92400e; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">${APP_NAME}</div>
            </div>
            <div class="content">
              <h2>Reset your password</h2>
              <p>Hi ${name},</p>
              <p>We received a request to reset your password. Click the button below to create a new password:</p>
              <p style="text-align: center; padding: 20px 0;">
                <a href="${resetUrl}" class="button">Reset Password</a>
              </p>
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #6366f1;">${resetUrl}</p>
              <p>This link will expire in 1 hour.</p>
              <div class="warning">
                <strong>Security tip:</strong> If you didn't request this password reset, please ignore this email or contact support if you have concerns.
              </div>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  // Subscription confirmation
  subscriptionConfirm: (name: string, planName: string, credits: number) => ({
    subject: `Your ${APP_NAME} ${planName} subscription is active!`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; padding: 20px 0; }
            .logo { font-size: 24px; font-weight: bold; color: #6366f1; }
            .content { padding: 20px 0; }
            .button { display: inline-block; padding: 12px 24px; background: linear-gradient(to right, #6366f1, #a855f7); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; }
            .footer { padding: 20px 0; text-align: center; color: #666; font-size: 12px; }
            .plan-box { background: linear-gradient(to right, #6366f1, #a855f7); color: white; padding: 20px; border-radius: 12px; text-align: center; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">${APP_NAME}</div>
            </div>
            <div class="content">
              <h2>Subscription Confirmed!</h2>
              <p>Hi ${name},</p>
              <p>Thank you for subscribing to ${APP_NAME}. Your subscription is now active!</p>
              <div class="plan-box">
                <h3 style="margin: 0 0 10px 0;">${planName} Plan</h3>
                <p style="margin: 0; font-size: 24px; font-weight: bold;">${credits} credits/month</p>
              </div>
              <p>Your credits have been added to your account. Start creating amazing content!</p>
              <p style="text-align: center; padding: 20px 0;">
                <a href="${APP_URL}/dashboard" class="button">Go to Dashboard</a>
              </p>
              <p>Need help? Contact our support team at support@lwu.ai</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.</p>
              <p><a href="${APP_URL}/dashboard/billing" style="color: #6366f1;">Manage your subscription</a></p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  // Credits low warning
  creditsLow: (name: string, remainingCredits: number) => ({
    subject: `Your ${APP_NAME} credits are running low`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; padding: 20px 0; }
            .logo { font-size: 24px; font-weight: bold; color: #6366f1; }
            .content { padding: 20px 0; }
            .button { display: inline-block; padding: 12px 24px; background: linear-gradient(to right, #6366f1, #a855f7); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; }
            .footer { padding: 20px 0; text-align: center; color: #666; font-size: 12px; }
            .warning-box { background: #fef3c7; border: 1px solid #f59e0b; padding: 20px; border-radius: 12px; text-align: center; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">${APP_NAME}</div>
            </div>
            <div class="content">
              <h2>Credits Running Low</h2>
              <p>Hi ${name},</p>
              <div class="warning-box">
                <p style="margin: 0; color: #92400e;">You have <strong>${remainingCredits}</strong> credits remaining</p>
              </div>
              <p>Don't let your creativity stop! Upgrade your plan or purchase more credits to continue creating.</p>
              <p style="text-align: center; padding: 20px 0;">
                <a href="${APP_URL}/pricing" class="button">Get More Credits</a>
              </p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),
};

// Email sending functions
export async function sendWelcomeEmail(email: string, name: string) {
  const template = emailTemplates.welcome(name);

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: template.subject,
      html: template.html,
    });

    if (error) {
      console.error('Failed to send welcome email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    return { success: false, error };
  }
}

export async function sendVerificationEmail(email: string, name: string, token: string) {
  const verificationUrl = `${APP_URL}/auth/verify-email?token=${token}`;
  const template = emailTemplates.verifyEmail(name, verificationUrl);

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: template.subject,
      html: template.html,
    });

    if (error) {
      console.error('Failed to send verification email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Failed to send verification email:', error);
    return { success: false, error };
  }
}

export async function sendPasswordResetEmail(email: string, name: string, token: string) {
  const resetUrl = `${APP_URL}/auth/reset-password?token=${token}`;
  const template = emailTemplates.resetPassword(name, resetUrl);

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: template.subject,
      html: template.html,
    });

    if (error) {
      console.error('Failed to send password reset email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Failed to send password reset email:', error);
    return { success: false, error };
  }
}

export async function sendSubscriptionConfirmEmail(
  email: string,
  name: string,
  planName: string,
  credits: number
) {
  const template = emailTemplates.subscriptionConfirm(name, planName, credits);

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: template.subject,
      html: template.html,
    });

    if (error) {
      console.error('Failed to send subscription confirmation email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Failed to send subscription confirmation email:', error);
    return { success: false, error };
  }
}

export async function sendCreditsLowEmail(email: string, name: string, remainingCredits: number) {
  const template = emailTemplates.creditsLow(name, remainingCredits);

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: template.subject,
      html: template.html,
    });

    if (error) {
      console.error('Failed to send credits low email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Failed to send credits low email:', error);
    return { success: false, error };
  }
}
