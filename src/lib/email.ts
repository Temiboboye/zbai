import { Resend } from 'resend';

// Lazy initialization to avoid build-time errors
let resendClient: Resend | null = null;

function getResendClient(): Resend | null {
    if (!process.env.RESEND_API_KEY) {
        return null;
    }
    if (!resendClient) {
        resendClient = new Resend(process.env.RESEND_API_KEY);
    }
    return resendClient;
}

const FROM_EMAIL = process.env.FROM_EMAIL || 'ZeroBounce AI <noreply@zerobounce.ai>';

export interface EmailOptions {
    to: string;
    subject: string;
    html: string;
    text?: string;
}

/**
 * Send an email using Resend
 */
export async function sendEmail(options: EmailOptions): Promise<{ success: boolean; error?: string }> {
    const client = getResendClient();

    // In development without API key, just log
    if (!client) {
        console.log(`[EMAIL DEV MODE] Would send to: ${options.to}`);
        console.log(`[EMAIL DEV MODE] Subject: ${options.subject}`);
        console.log(`[EMAIL DEV MODE] Body preview: ${options.html.substring(0, 100)}...`);
        return { success: true };
    }

    try {
        const { error } = await client.emails.send({
            from: FROM_EMAIL,
            to: options.to,
            subject: options.subject,
            html: options.html,
            text: options.text
        });

        if (error) {
            console.error('[EMAIL ERROR]', error);
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (err: any) {
        console.error('[EMAIL ERROR]', err);
        return { success: false, error: err.message };
    }
}

/**
 * Send verification code email
 */
export async function sendVerificationEmail(email: string, code: string): Promise<boolean> {
    const result = await sendEmail({
        to: email,
        subject: 'Verify your email - ZeroBounce AI',
        html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #0a0b0d; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0b0d; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table width="100%" max-width="480" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #1a1b23 0%, #0a0b0d 100%); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 40px;">
                    <tr>
                        <td align="center" style="padding-bottom: 24px;">
                            <span style="font-size: 32px; font-weight: 800; color: #B9FF66;">ZB</span>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding-bottom: 16px;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">Verify Your Email</h1>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding-bottom: 32px;">
                            <p style="margin: 0; color: #888888; font-size: 16px;">Enter this code to complete your registration:</p>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding-bottom: 32px;">
                            <div style="background: rgba(185, 255, 102, 0.1); border: 2px solid #B9FF66; border-radius: 12px; padding: 20px 40px; display: inline-block;">
                                <span style="font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #B9FF66;">${code}</span>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding-bottom: 24px;">
                            <p style="margin: 0; color: #666666; font-size: 14px;">This code expires in 15 minutes.</p>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 24px;">
                            <p style="margin: 0; color: #666666; font-size: 12px;">If you didn't request this code, you can safely ignore this email.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
        `,
        text: `Your ZeroBounce AI verification code is: ${code}\n\nThis code expires in 15 minutes.\n\nIf you didn't request this code, you can safely ignore this email.`
    });

    return result.success;
}

/**
 * Send welcome email after verification
 */
export async function sendWelcomeEmail(email: string, name: string): Promise<boolean> {
    const result = await sendEmail({
        to: email,
        subject: 'Welcome to ZeroBounce AI! 🎉',
        html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #0a0b0d; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0b0d; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table width="100%" max-width="480" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #1a1b23 0%, #0a0b0d 100%); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 40px;">
                    <tr>
                        <td align="center" style="padding-bottom: 24px;">
                            <span style="font-size: 32px; font-weight: 800; color: #B9FF66;">ZB</span>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding-bottom: 16px;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">Welcome, ${name}! 🎉</h1>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding-bottom: 24px;">
                            <p style="margin: 0; color: #888888; font-size: 16px;">Your account is now verified and ready to use.</p>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding-bottom: 32px;">
                            <div style="background: rgba(185, 255, 102, 0.1); border: 1px solid rgba(185, 255, 102, 0.3); border-radius: 12px; padding: 20px;">
                                <p style="margin: 0 0 8px 0; color: #B9FF66; font-size: 14px; font-weight: 600;">🎁 Your Free Credits</p>
                                <span style="font-size: 48px; font-weight: 700; color: #B9FF66;">49</span>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding-bottom: 24px;">
                            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://zerobounce.ai'}/dashboard" style="display: inline-block; background: #B9FF66; color: #000; font-size: 16px; font-weight: 600; padding: 14px 32px; border-radius: 8px; text-decoration: none;">Go to Dashboard →</a>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 24px;">
                            <p style="margin: 0; color: #666666; font-size: 12px;">Need help? Reply to this email or visit our docs.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
        `,
        text: `Welcome to ZeroBounce AI, ${name}!\n\nYour account is verified. You have 49 free credits to start.\n\nGo to your dashboard: ${process.env.NEXT_PUBLIC_APP_URL || 'https://zerobounce.ai'}/dashboard`
    });

    return result.success;
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(email: string, resetLink: string): Promise<boolean> {
    const result = await sendEmail({
        to: email,
        subject: 'Reset your password - ZeroBounce AI',
        html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #0a0b0d; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0b0d; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table width="100%" max-width="480" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #1a1b23 0%, #0a0b0d 100%); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 40px;">
                    <tr>
                        <td align="center" style="padding-bottom: 24px;">
                            <span style="font-size: 32px; font-weight: 800; color: #B9FF66;">ZB</span>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding-bottom: 16px;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">Reset Your Password</h1>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding-bottom: 32px;">
                            <p style="margin: 0; color: #888888; font-size: 16px;">Click the button below to reset your password:</p>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding-bottom: 24px;">
                            <a href="${resetLink}" style="display: inline-block; background: #B9FF66; color: #000; font-size: 16px; font-weight: 600; padding: 14px 32px; border-radius: 8px; text-decoration: none;">Reset Password</a>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding-bottom: 24px;">
                            <p style="margin: 0; color: #666666; font-size: 14px;">This link expires in 1 hour.</p>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 24px;">
                            <p style="margin: 0; color: #666666; font-size: 12px;">If you didn't request this, you can safely ignore this email.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
        `,
        text: `Reset your ZeroBounce AI password:\n\n${resetLink}\n\nThis link expires in 1 hour.\n\nIf you didn't request this, you can safely ignore this email.`
    });

    return result.success;
}
