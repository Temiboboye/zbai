"""
Email Notification Service using Resend API

Handles all email notifications for the application:
- Welcome emails
- Email verification
- Password reset
- Purchase confirmations
- Credit alerts
- Bulk job completion
"""

import os
import requests
from typing import Optional, Dict, List
from datetime import datetime


class EmailService:
    """Email notification service using Resend API"""
    
    def __init__(self):
        self.api_key = os.getenv('RESEND_API_KEY', '')
        self.from_email = os.getenv('FROM_EMAIL', 'noreply@zerobounceai.com')
        self.api_url = 'https://api.resend.com/emails'
        self.app_url = os.getenv('APP_URL', 'https://zerobounceai.com')
        
    def _send_email(
        self,
        to: str,
        subject: str,
        html: str,
        text: Optional[str] = None
    ) -> Dict:
        """
        Send email via Resend API
        
        Args:
            to: Recipient email address
            subject: Email subject
            html: HTML email body
            text: Plain text email body (optional)
            
        Returns:
            Dict with send status
        """
        if not self.api_key:
            print("Warning: RESEND_API_KEY not set. Email not sent.")
            return {"success": False, "error": "API key not configured"}
        
        headers = {
            'Authorization': f'Bearer {self.api_key}',
            'Content-Type': 'application/json'
        }
        
        payload = {
            'from': self.from_email,
            'to': [to],
            'subject': subject,
            'html': html
        }
        
        if text:
            payload['text'] = text
        
        try:
            response = requests.post(
                self.api_url,
                json=payload,
                headers=headers,
                timeout=10
            )
            
            if response.status_code == 200:
                return {
                    "success": True,
                    "message_id": response.json().get('id'),
                    "data": response.json()
                }
            else:
                return {
                    "success": False,
                    "error": response.text,
                    "status_code": response.status_code
                }
                
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    def send_welcome_email(self, to: str, name: str) -> Dict:
        """Send welcome email to new user"""
        subject = "Welcome to ZeroBounce AI! 🎉"
        
        html = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: linear-gradient(135deg, #B9FF66, #8BC34A); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
                .header h1 {{ color: #191A23; margin: 0; }}
                .content {{ background: #f9f9f9; padding: 30px; }}
                .button {{ display: inline-block; background: #B9FF66; color: #191A23; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }}
                .footer {{ background: #191A23; color: #fff; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; }}
                .feature {{ background: white; padding: 15px; margin: 10px 0; border-left: 4px solid #B9FF66; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Welcome to ZeroBounce AI!</h1>
                </div>
                <div class="content">
                    <h2>Hi {name},</h2>
                    <p>Thank you for joining ZeroBounce AI! We're excited to help you verify and validate your email lists with 99% accuracy.</p>
                    
                    <p><strong>You've received 100 free credits to get started!</strong></p>
                    
                    <div class="feature">
                        <h3>✅ Real-Time Verification</h3>
                        <p>Verify emails instantly with SMTP validation</p>
                    </div>
                    
                    <div class="feature">
                        <h3>📁 Bulk Processing</h3>
                        <p>Process up to 100,000 emails per batch</p>
                    </div>
                    
                    <div class="feature">
                        <h3>🔍 Email Finder</h3>
                        <p>Find email addresses for your prospects</p>
                    </div>
                    
                    <div class="feature">
                        <h3>📊 Analytics Dashboard</h3>
                        <p>Track your verification performance</p>
                    </div>
                    
                    <center>
                        <a href="{self.app_url}/dashboard" class="button">Go to Dashboard</a>
                    </center>
                    
                    <p>If you have any questions, feel free to reach out to our support team at support@zerobounceai.com</p>
                    
                    <p>Happy verifying!<br>
                    The ZeroBounce AI Team</p>
                </div>
                <div class="footer">
                    <p>&copy; 2026 ZeroBounce AI. All rights reserved.</p>
                    <p><a href="{self.app_url}" style="color: #B9FF66;">zerobounceai.com</a></p>
                </div>
            </div>
        </body>
        </html>
        """
        
        text = f"""
        Welcome to ZeroBounce AI!
        
        Hi {name},
        
        Thank you for joining ZeroBounce AI! We're excited to help you verify and validate your email lists with 99% accuracy.
        
        You've received 100 free credits to get started!
        
        Features:
        - Real-Time Verification
        - Bulk Processing (up to 100,000 emails)
        - Email Finder
        - Analytics Dashboard
        
        Get started: {self.app_url}/dashboard
        
        If you have any questions, contact us at support@zerobounceai.com
        
        Happy verifying!
        The ZeroBounce AI Team
        """
        
        return self._send_email(to, subject, html, text)
    
    def send_verification_email(self, to: str, verification_token: str) -> Dict:
        """Send email verification link"""
        verification_url = f"{self.app_url}/verify-email?token={verification_token}"
        subject = "Verify Your Email Address"
        
        html = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: #191A23; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
                .header h1 {{ color: #B9FF66; margin: 0; }}
                .content {{ background: #f9f9f9; padding: 30px; }}
                .button {{ display: inline-block; background: #B9FF66; color: #191A23; padding: 15px 40px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }}
                .footer {{ background: #191A23; color: #fff; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Verify Your Email</h1>
                </div>
                <div class="content">
                    <h2>Almost there!</h2>
                    <p>Click the button below to verify your email address and activate your account.</p>
                    
                    <center>
                        <a href="{verification_url}" class="button">Verify Email Address</a>
                    </center>
                    
                    <p>Or copy and paste this link into your browser:</p>
                    <p style="background: white; padding: 10px; border-radius: 5px; word-break: break-all;">{verification_url}</p>
                    
                    <p><strong>This link will expire in 24 hours.</strong></p>
                    
                    <p>If you didn't create an account with ZeroBounce AI, you can safely ignore this email.</p>
                </div>
                <div class="footer">
                    <p>&copy; 2026 ZeroBounce AI. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        text = f"""
        Verify Your Email Address
        
        Almost there! Click the link below to verify your email address and activate your account.
        
        {verification_url}
        
        This link will expire in 24 hours.
        
        If you didn't create an account with ZeroBounce AI, you can safely ignore this email.
        
        - ZeroBounce AI Team
        """
        
        return self._send_email(to, subject, html, text)
    
    def send_password_reset_email(self, to: str, reset_token: str) -> Dict:
        """Send password reset link"""
        reset_url = f"{self.app_url}/reset-password?token={reset_token}"
        subject = "Reset Your Password"
        
        html = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: #191A23; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
                .header h1 {{ color: #B9FF66; margin: 0; }}
                .content {{ background: #f9f9f9; padding: 30px; }}
                .button {{ display: inline-block; background: #B9FF66; color: #191A23; padding: 15px 40px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }}
                .warning {{ background: #fff3cd; border-left: 4px solid #ffaa00; padding: 15px; margin: 20px 0; }}
                .footer {{ background: #191A23; color: #fff; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Reset Your Password</h1>
                </div>
                <div class="content">
                    <h2>Password Reset Request</h2>
                    <p>We received a request to reset your password. Click the button below to create a new password.</p>
                    
                    <center>
                        <a href="{reset_url}" class="button">Reset Password</a>
                    </center>
                    
                    <p>Or copy and paste this link into your browser:</p>
                    <p style="background: white; padding: 10px; border-radius: 5px; word-break: break-all;">{reset_url}</p>
                    
                    <div class="warning">
                        <strong>⚠️ Security Notice:</strong>
                        <ul>
                            <li>This link will expire in 1 hour</li>
                            <li>If you didn't request this, please ignore this email</li>
                            <li>Your password won't change until you create a new one</li>
                        </ul>
                    </div>
                </div>
                <div class="footer">
                    <p>&copy; 2026 ZeroBounce AI. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        text = f"""
        Reset Your Password
        
        We received a request to reset your password. Click the link below to create a new password.
        
        {reset_url}
        
        This link will expire in 1 hour.
        
        If you didn't request this, please ignore this email. Your password won't change until you create a new one.
        
        - ZeroBounce AI Team
        """
        
        return self._send_email(to, subject, html, text)
    
    def send_purchase_confirmation(
        self,
        to: str,
        name: str,
        credits: int,
        amount: float,
        transaction_id: str,
        payment_method: str
    ) -> Dict:
        """Send purchase confirmation email"""
        subject = f"Purchase Confirmation - {credits:,} Credits"
        
        html = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: linear-gradient(135deg, #B9FF66, #8BC34A); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
                .header h1 {{ color: #191A23; margin: 0; }}
                .content {{ background: #f9f9f9; padding: 30px; }}
                .invoice {{ background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }}
                .invoice-row {{ display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }}
                .total {{ font-size: 1.2em; font-weight: bold; color: #B9FF66; }}
                .button {{ display: inline-block; background: #B9FF66; color: #191A23; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }}
                .footer {{ background: #191A23; color: #fff; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>✅ Purchase Successful!</h1>
                </div>
                <div class="content">
                    <h2>Thank you, {name}!</h2>
                    <p>Your purchase has been processed successfully. Your credits have been added to your account.</p>
                    
                    <div class="invoice">
                        <h3>Invoice Details</h3>
                        <div class="invoice-row">
                            <span>Transaction ID:</span>
                            <span><strong>{transaction_id}</strong></span>
                        </div>
                        <div class="invoice-row">
                            <span>Date:</span>
                            <span>{datetime.utcnow().strftime('%B %d, %Y at %I:%M %p UTC')}</span>
                        </div>
                        <div class="invoice-row">
                            <span>Payment Method:</span>
                            <span>{payment_method}</span>
                        </div>
                        <div class="invoice-row">
                            <span>Credits Purchased:</span>
                            <span><strong>{credits:,} credits</strong></span>
                        </div>
                        <div class="invoice-row total">
                            <span>Total Paid:</span>
                            <span>${amount:.2f}</span>
                        </div>
                    </div>
                    
                    <p>Your new credits are now available and ready to use!</p>
                    
                    <center>
                        <a href="{self.app_url}/dashboard" class="button">Go to Dashboard</a>
                    </center>
                    
                    <p>Need help? Contact us at support@zerobounceai.com</p>
                </div>
                <div class="footer">
                    <p>&copy; 2026 ZeroBounce AI. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        text = f"""
        Purchase Successful!
        
        Thank you, {name}!
        
        Your purchase has been processed successfully.
        
        Invoice Details:
        - Transaction ID: {transaction_id}
        - Date: {datetime.utcnow().strftime('%B %d, %Y at %I:%M %p UTC')}
        - Payment Method: {payment_method}
        - Credits Purchased: {credits:,} credits
        - Total Paid: ${amount:.2f}
        
        Your new credits are now available!
        
        Dashboard: {self.app_url}/dashboard
        
        - ZeroBounce AI Team
        """
        
        return self._send_email(to, subject, html, text)
    
    def send_low_credits_alert(self, to: str, name: str, credits_remaining: int) -> Dict:
        """Send low credits alert"""
        subject = "⚠️ Low Credits Alert"
        
        html = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: #ffaa00; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
                .header h1 {{ color: #191A23; margin: 0; }}
                .content {{ background: #f9f9f9; padding: 30px; }}
                .alert {{ background: #fff3cd; border-left: 4px solid #ffaa00; padding: 15px; margin: 20px 0; }}
                .button {{ display: inline-block; background: #B9FF66; color: #191A23; padding: 15px 40px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }}
                .footer {{ background: #191A23; color: #fff; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>⚠️ Low Credits Alert</h1>
                </div>
                <div class="content">
                    <h2>Hi {name},</h2>
                    
                    <div class="alert">
                        <p><strong>You have {credits_remaining} credits remaining.</strong></p>
                        <p>Your credits are running low. To continue verifying emails without interruption, we recommend purchasing more credits.</p>
                    </div>
                    
                    <p>Don't let your email verification stop! Get more credits now:</p>
                    
                    <center>
                        <a href="{self.app_url}/billing" class="button">Buy More Credits</a>
                    </center>
                    
                    <p>Need help choosing the right pack? Contact us at support@zerobounceai.com</p>
                </div>
                <div class="footer">
                    <p>&copy; 2026 ZeroBounce AI. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        text = f"""
        Low Credits Alert
        
        Hi {name},
        
        You have {credits_remaining} credits remaining.
        
        Your credits are running low. To continue verifying emails without interruption, we recommend purchasing more credits.
        
        Buy more credits: {self.app_url}/billing
        
        Need help? Contact support@zerobounceai.com
        
        - ZeroBounce AI Team
        """
        
        return self._send_email(to, subject, html, text)
    
    def send_bulk_job_complete(
        self,
        to: str,
        name: str,
        job_id: str,
        total_emails: int,
        valid_count: int,
        invalid_count: int
    ) -> Dict:
        """Send bulk job completion notification"""
        subject = f"✅ Bulk Verification Complete - {total_emails:,} Emails"
        results_url = f"{self.app_url}/bulk?job_id={job_id}"
        
        html = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: linear-gradient(135deg, #B9FF66, #8BC34A); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
                .header h1 {{ color: #191A23; margin: 0; }}
                .content {{ background: #f9f9f9; padding: 30px; }}
                .stats {{ background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }}
                .stat-row {{ display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }}
                .button {{ display: inline-block; background: #B9FF66; color: #191A23; padding: 15px 40px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }}
                .footer {{ background: #191A23; color: #fff; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>✅ Verification Complete!</h1>
                </div>
                <div class="content">
                    <h2>Hi {name},</h2>
                    <p>Your bulk email verification job has been completed successfully!</p>
                    
                    <div class="stats">
                        <h3>Results Summary</h3>
                        <div class="stat-row">
                            <span>Total Emails:</span>
                            <span><strong>{total_emails:,}</strong></span>
                        </div>
                        <div class="stat-row">
                            <span>Valid Emails:</span>
                            <span style="color: #27c93f;"><strong>{valid_count:,} ({(valid_count/total_emails*100):.1f}%)</strong></span>
                        </div>
                        <div class="stat-row">
                            <span>Invalid Emails:</span>
                            <span style="color: #ff3b30;"><strong>{invalid_count:,} ({(invalid_count/total_emails*100):.1f}%)</strong></span>
                        </div>
                    </div>
                    
                    <p>Your results are ready to download!</p>
                    
                    <center>
                        <a href="{results_url}" class="button">View Results</a>
                    </center>
                    
                    <p>Job ID: <code>{job_id}</code></p>
                </div>
                <div class="footer">
                    <p>&copy; 2026 ZeroBounce AI. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        text = f"""
        Verification Complete!
        
        Hi {name},
        
        Your bulk email verification job has been completed successfully!
        
        Results Summary:
        - Total Emails: {total_emails:,}
        - Valid Emails: {valid_count:,} ({(valid_count/total_emails*100):.1f}%)
        - Invalid Emails: {invalid_count:,} ({(invalid_count/total_emails*100):.1f}%)
        
        View results: {results_url}
        
        Job ID: {job_id}
        
        - ZeroBounce AI Team
        """
        
        return self._send_email(to, subject, html, text)


# Create singleton instance
email_service = EmailService()
