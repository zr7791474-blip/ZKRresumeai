import { APP_NAME, APP_URL } from "@/constants";

function wrapper(bodyHtml: string): string {
  return `
  <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px;">
    <p style="font-size: 15px; font-weight: 700; color: #111827; margin: 0 0 24px;">${APP_NAME}</p>
    ${bodyHtml}
    <p style="font-size: 12px; color: #9ca3af; margin-top: 32px;">If you didn't request this, you can safely ignore this email.</p>
  </div>`;
}

export function verificationEmail(token: string) {
  const link = `${APP_URL}/verify-email?token=${token}`;
  return {
    subject: `Verify your email — ${APP_NAME}`,
    html: wrapper(`
      <h1 style="font-size: 20px; color: #111827; margin: 0 0 12px;">Confirm your email address</h1>
      <p style="font-size: 14px; color: #4b5563; line-height: 1.6;">Welcome to ${APP_NAME}! Click below to verify your email and activate your account.</p>
      <a href="${link}" style="display: inline-block; margin-top: 16px; padding: 10px 20px; background: #111827; color: #fff; text-decoration: none; border-radius: 8px; font-size: 14px;">Verify email</a>
      <p style="font-size: 12px; color: #9ca3af; margin-top: 16px;">Or paste this link into your browser: ${link}</p>
    `),
    text: `Verify your email for ${APP_NAME}: ${link}`,
  };
}

export function passwordResetEmail(token: string) {
  const link = `${APP_URL}/reset-password?token=${token}`;
  return {
    subject: `Reset your password — ${APP_NAME}`,
    html: wrapper(`
      <h1 style="font-size: 20px; color: #111827; margin: 0 0 12px;">Reset your password</h1>
      <p style="font-size: 14px; color: #4b5563; line-height: 1.6;">We received a request to reset your ${APP_NAME} password. This link expires in 1 hour.</p>
      <a href="${link}" style="display: inline-block; margin-top: 16px; padding: 10px 20px; background: #111827; color: #fff; text-decoration: none; border-radius: 8px; font-size: 14px;">Reset password</a>
      <p style="font-size: 12px; color: #9ca3af; margin-top: 16px;">Or paste this link into your browser: ${link}</p>
    `),
    text: `Reset your ${APP_NAME} password: ${link}`,
  };
}
