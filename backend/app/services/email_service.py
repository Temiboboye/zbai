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
        self.from_email = os.getenv('FROM_EMAIL', 'ZeroBounce AI <noreply@notify.zerobounceai.com>')
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


    def send_service_receipt(
        self,
        to: str,
        service_name: str,
        amount: float,
        transaction_id: str
    ) -> Dict:
        """Send receipt for service purchase (e.g. YC Lead Gen)"""
        subject = f"Receipt: {service_name}"
        
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
                .invoice {{ background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }}
                .invoice-row {{ display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }}
                .total {{ font-size: 1.2em; font-weight: bold; color: #191A23; }}
                .footer {{ background: #191A23; color: #fff; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Order Confirmed</h1>
                </div>
                <div class="content">
                    <h2>Thank you for your order!</h2>
                    <p>We've received your payment regarding <strong>{service_name}</strong>. Our team will be in touch shortly to kick off the process.</p>
                    
                    <div class="invoice">
                        <h3>Order Details</h3>
                        <div class="invoice-row">
                            <span>Order ID:</span>
                            <span><strong>{transaction_id}</strong></span>
                        </div>
                        <div class="invoice-row">
                            <span>Date:</span>
                            <span>{datetime.utcnow().strftime('%B %d, %Y')}</span>
                        </div>
                        <div class="invoice-row">
                            <span>Service:</span>
                            <span>{service_name}</span>
                        </div>
                        <div class="invoice-row total">
                            <span>Total Paid:</span>
                            <span>${amount:.2f}</span>
                        </div>
                    </div>
                    
                    <p>Next Steps: Look out for an email from our onboarding team within 24 hours.</p>
                </div>
                <div class="footer">
                    <p>&copy; 2026 ZeroBounce AI. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        text = f"""
        Order Confirmed: {service_name}
        
        Thank you for your order!
        
        Order Details:
        - Order ID: {transaction_id}
        - Date: {datetime.utcnow().strftime('%B %d, %Y')}
        - Service: {service_name}
        - Total Paid: ${amount:.2f}
        
        We will be in touch shortly to kick off the process.
        
        - ZeroBounce AI Team
        """
        
        return self._send_email(to, subject, html, text)

    def send_new_service_order_alert(
        self,
        admin_email: str,
        customer_email: str,
        service_name: str,
        amount: float,
        transaction_id: str
    ) -> Dict:
        """Alert admin of new service order"""
        subject = f"🔔 New Order: {service_name} (${amount:.0f})"
        
        html = f"""
        <!DOCTYPE html>
        <html>
        <body>
            <h2>New Service Order Received!</h2>
            <ul>
                <li><strong>Service:</strong> {service_name}</li>
                <li><strong>Customer:</strong> {customer_email}</li>
                <li><strong>Amount:</strong> ${amount:.2f}</li>
                <li><strong>Transaction ID:</strong> {transaction_id}</li>
                <li><strong>Date:</strong> {datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S UTC')}</li>
            </ul>
            <p>Action Required: Contact the customer to begin onboarding.</p>
        </body>
        </html>
        """
        
        text = f"""
        New Service Order Received!
        
        Service: {service_name}
        Customer: {customer_email}
        Amount: ${amount:.2f}
        Transaction ID: {transaction_id}
        
        Action Required: Contact the customer to begin onboarding.
        """
        
        return self._send_email(admin_email, subject, html, text)


    def send_onboarding_welcome(
        self,
        to: str,
        name: str
    ) -> Dict:
        """Send onboarding welcome email with next steps"""
        subject = "Welcome to the YC Growth Program! 🚀"
        
        # Placeholder links - User should update these
        calendly_url = "https://calendly.com/zerobounce-ai/strategy" 
        welcome_packet_url = "https://zerobounceai.com/onboarding/welcome-packet.pdf"
        
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
                .action-box {{ background: white; padding: 20px; border-left: 4px solid #B9FF66; margin: 20px 0; }}
                .footer {{ background: #191A23; color: #fff; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Welcome Aboard! 🚀</h1>
                </div>
                <div class="content">
                    <h2>Hi {name},</h2>
                    <p>Thrilled to have you in the YC Outbound Growth Program. We're ready to start building your predictable revenue engine.</p>
                    
                    <div class="action-box">
                        <h3>Step 1: Book Your Strategy Call</h3>
                        <p>Let's align on your ICP and growth targets. Please pick a time that works for you:</p>
                        <center>
                            <a href="{calendly_url}" class="button">Book Kickoff Call</a>
                        </center>
                    </div>

                    <div class="action-box">
                        <h3>Step 2: Review Welcome Packet</h3>
                        <p>We've prepared a brief guide on what to expect over the next 4 weeks.</p>
                        <p><a href="{welcome_packet_url}" style="color: #191A23; font-weight: bold;">Download Welcome Packet &rarr;</a></p>
                    </div>
                    
                    <p>If you have any immediate questions before our call, just reply to this email.</p>
                    
                    <p>Let's grow!<br>
                    The ZeroBounce AI Team</p>
                </div>
                <div class="footer">
                    <p>&copy; 2026 ZeroBounce AI. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        text = f"""
        Welcome to the YC Growth Program! 🚀
        
        Hi {name},
        
        Thrilled to have you in the YC Outbound Growth Program.
        
        Step 1: Book Your Strategy Call
        {calendly_url}
        
        Step 2: Review Welcome Packet
        {welcome_packet_url}
        
        If you have any immediate questions before our call, just reply to this email.
        
        Let's grow!
        The ZeroBounce AI Team
        """
        
        return self._send_email(to, subject, html, text)

    # ── Onboarding Drip Emails ──────────────────────────────────────────

    def _drip_wrapper(self, inner_html: str) -> str:
        """Wrap drip email content in the standard brand shell."""
        return f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #0f1012; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: #191A23; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; border-bottom: 3px solid #B9FF66; }}
                .header h1 {{ color: #B9FF66; margin: 0; font-size: 22px; }}
                .content {{ background: #1a1b23; padding: 30px; color: #e0e0e0; }}
                .content h2 {{ color: #ffffff; }}
                .content p {{ color: #cccccc; font-size: 15px; }}
                .content a {{ color: #B9FF66; }}
                .button {{ display: inline-block; background: #B9FF66; color: #191A23 !important; padding: 14px 36px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; font-size: 16px; }}
                .feature-box {{ background: rgba(185,255,102,0.08); border-left: 4px solid #B9FF66; padding: 16px 20px; margin: 16px 0; border-radius: 0 8px 8px 0; }}
                .feature-box h3 {{ color: #B9FF66; margin: 0 0 6px 0; font-size: 15px; }}
                .feature-box p {{ color: #cccccc; margin: 0; font-size: 14px; }}
                .highlight {{ background: rgba(185,255,102,0.12); border: 1px solid rgba(185,255,102,0.3); border-radius: 10px; padding: 20px; margin: 20px 0; text-align: center; }}
                .highlight .big {{ font-size: 32px; font-weight: 800; color: #B9FF66; }}
                .footer {{ background: #191A23; color: #888; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px; }}
                .footer a {{ color: #B9FF66; text-decoration: none; }}
                .divider {{ border: none; border-top: 1px solid rgba(255,255,255,0.1); margin: 24px 0; }}
            </style>
        </head>
        <body>
            <div class="container">
                {inner_html}
                <div class="footer">
                    <p>&copy; 2026 ZeroBounce AI &bull; <a href="{self.app_url}">zerobounceai.com</a></p>
                    <p style="margin-top:8px;font-size:11px;color:#666;">You're receiving this because you signed up at ZeroBounce AI.<br>
                    <a href="{self.app_url}" style="color:#666;">Unsubscribe</a></p>
                </div>
            </div>
        </body>
        </html>
        """

    def send_drip_1_welcome_quickwin(self, to: str, name: str) -> Dict:
        """Drip #1 — Welcome + Quick Win: get them to verify 1 email right now"""
        subject = "Welcome to ZeroBounce AI — verify your first email in 10 seconds ⚡"
        display_name = name or "there"

        inner = f"""
        <div class="header">
            <h1>Welcome to ZeroBounce AI ⚡</h1>
        </div>
        <div class="content">
            <h2>Hi {display_name},</h2>
            <p>Thanks for signing up! You just joined <strong>the fastest-growing AI email verification platform</strong>.</p>

            <p>Before anything else — let's prove it works. Try verifying one email right now (takes 10 seconds):</p>

            <center>
                <a href="{self.app_url}/dashboard" class="button">Verify Your First Email →</a>
            </center>

            <hr class="divider">

            <p><strong>Here's what makes ZeroBounce AI different:</strong></p>

            <div class="feature-box">
                <h3>🤖 AI-Powered Accuracy (98%+)</h3>
                <p>Not just SMTP pings — our AI analyzes patterns, reputation, and history.</p>
            </div>

            <div class="feature-box">
                <h3>📊 Catch-All Confidence Scoring</h3>
                <p>Instead of "maybe valid," get a 0-100 confidence score on risky domains.</p>
            </div>

            <div class="feature-box">
                <h3>🔍 Built-In Email Finder</h3>
                <p>Find + verify emails in one platform. No need for separate tools.</p>
            </div>

            <p>We'll send you a few tips over the next week to help you get the most out of ZeroBounce AI. Keep an eye on your inbox!</p>

            <p>— The ZeroBounce AI Team</p>
        </div>
        """

        text = f"""Welcome to ZeroBounce AI!

Hi {display_name},

Thanks for signing up! Try verifying your first email now: {self.app_url}/dashboard

What makes us different:
- AI-Powered Accuracy (98%+)
- Catch-All Confidence Scoring (0-100)
- Built-In Email Finder

— The ZeroBounce AI Team"""

        return self._send_email(to, subject, self._drip_wrapper(inner), text)

    def send_drip_2_feature_showcase(self, to: str, name: str) -> Dict:
        """Drip #2 — Feature Showcase: educate on AI features competitors lack"""
        subject = "3 features your current email verifier doesn't have 🧠"
        display_name = name or "there"

        inner = f"""
        <div class="header">
            <h1>Features That Change Everything 🧠</h1>
        </div>
        <div class="content">
            <h2>Hi {display_name},</h2>
            <p>Most email verification tools do one thing: ping an SMTP server and hope for the best. That gives you ~90% accuracy.</p>

            <p><strong>ZeroBounce AI does three things no one else does:</strong></p>

            <div class="feature-box">
                <h3>1. 🎯 AI Pattern Recognition</h3>
                <p>Our AI learns email patterns across companies. Verified john@acme.com? We can predict that jane@acme.com and mike@acme.com are likely valid too — saving you hours of manual research.</p>
            </div>

            <div class="feature-box">
                <h3>2. 📈 Catch-All Confidence Scoring</h3>
                <p>Other tools just say "catch-all detected" and leave you guessing. We give you a <strong>0-100 confidence score</strong> based on SMTP responsiveness, MX strength, and domain reputation — so you can make informed decisions.</p>
            </div>

            <div class="feature-box">
                <h3>3. 🛡️ Domain Reputation Intelligence</h3>
                <p>Every domain gets a reputation score based on spam history, blacklist status, and age. gmail.com scores 98/100. sketchy-domain-2024.com scores 12/100. <strong>Know which domains to trust before you send.</strong></p>
            </div>

            <hr class="divider">

            <p>These aren't "nice to haves." <strong>They're the difference between 90% and 98%+ accuracy</strong> — and that 8% can mean thousands of bounced emails, damaged sender reputation, and wasted ad spend.</p>

            <center>
                <a href="{self.app_url}/dashboard" class="button">Try These Features Now →</a>
            </center>

            <p>Tomorrow: We'll show you exactly how much money clean email lists save.</p>

            <p>— The ZeroBounce AI Team</p>
        </div>
        """

        text = f"""3 features your current email verifier doesn't have

Hi {display_name},

Most email verification tools do one thing: ping an SMTP server. That gives ~90% accuracy.

ZeroBounce AI does three things no one else does:

1. AI Pattern Recognition — learns email patterns across companies
2. Catch-All Confidence Scoring — 0-100 score instead of just "maybe"
3. Domain Reputation Intelligence — trust scores for every domain

These features mean 98%+ accuracy vs 90%. That gap = thousands of bounces avoided.

Try them: {self.app_url}/dashboard

— The ZeroBounce AI Team"""

        return self._send_email(to, subject, self._drip_wrapper(inner), text)

    def send_drip_3_social_proof(self, to: str, name: str) -> Dict:
        """Drip #3 — Social Proof + ROI: create FOMO with real numbers"""
        subject = "How companies save $2,000+/month with clean email lists 💰"
        display_name = name or "there"

        inner = f"""
        <div class="header">
            <h1>The ROI of Clean Email Lists 💰</h1>
        </div>
        <div class="content">
            <h2>Hi {display_name},</h2>
            <p>Let's talk numbers — because this is where email verification pays for itself 10x over.</p>

            <div class="highlight">
                <p style="color:#888;margin:0 0 8px 0;font-size:13px;">AVERAGE SAVINGS PER MONTH</p>
                <div class="big">$2,340</div>
                <p style="color:#aaa;margin:8px 0 0 0;font-size:13px;">for companies verifying 50,000+ emails</p>
            </div>

            <p><strong>Here's the math:</strong></p>

            <div class="feature-box">
                <h3>📧 12% of emails are typically invalid</h3>
                <p>On a 50K list, that's 6,000 bad emails. At $0.05 per email sent (ESP cost), you're wasting <strong>$300/month</strong> sending to addresses that bounce.</p>
            </div>

            <div class="feature-box">
                <h3>🚫 High bounce rates damage sender reputation</h3>
                <p>ISPs flag senders with >2% bounce rates. This tanks your deliverability — meaning your <em>valid</em> emails land in spam too. The cascade cost: <strong>$1,500+/month</strong> in lost conversions.</p>
            </div>

            <div class="feature-box">
                <h3>⚡ Verification cost: ~$40 for 50K emails</h3>
                <p>Spend $40 to save $2,000+. That's a <strong>50x return</strong>.</p>
            </div>

            <hr class="divider">

            <p><strong>Companies using ZeroBounce AI report:</strong></p>
            <ul style="color:#ccc;">
                <li>47% improvement in email deliverability</li>
                <li>3.2x higher open rates after list cleaning</li>
                <li>89% reduction in hard bounces</li>
            </ul>

            <center>
                <a href="{self.app_url}/dashboard" class="button">Start Saving Now →</a>
            </center>

            <p>Coming up next: An exclusive offer you won't want to miss. 👀</p>

            <p>— The ZeroBounce AI Team</p>
        </div>
        """

        text = f"""How companies save $2,000+/month with clean email lists

Hi {display_name},

The math:
- 12% of emails are typically invalid
- On a 50K list = 6,000 bad emails = $300/month wasted on ESP costs
- High bounce rates damage sender reputation = $1,500+/month in lost conversions
- Verification cost: ~$40 for 50K emails = 50x ROI

Companies using ZeroBounce AI report:
- 47% improvement in email deliverability
- 3.2x higher open rates after list cleaning
- 89% reduction in hard bounces

Start saving: {self.app_url}/dashboard

— The ZeroBounce AI Team"""

        return self._send_email(to, subject, self._drip_wrapper(inner), text)

    def send_drip_4_limited_offer(self, to: str, name: str) -> Dict:
        """Drip #4 — Limited-Time Offer: 30% Founding Member discount"""
        subject = "🔒 Founding Member Offer: 30% off forever (48 hours only)"
        display_name = name or "there"

        inner = f"""
        <div class="header">
            <h1>🔒 Founding Member Exclusive</h1>
        </div>
        <div class="content">
            <h2>Hi {display_name},</h2>
            <p>By now you've seen what ZeroBounce AI can do. Today, I want to make you an offer we'll <strong>never repeat</strong>.</p>

            <div class="highlight">
                <p style="color:#888;margin:0 0 4px 0;font-size:13px;">FOUNDING MEMBER PRICING</p>
                <div class="big">30% OFF</div>
                <p style="color:#B9FF66;margin:8px 0 0 0;font-size:15px;font-weight:bold;">Locked in forever. Price never increases.</p>
            </div>

            <p><strong>What this means for you:</strong></p>

            <table width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0;">
                <tr>
                    <td style="background:rgba(185,255,102,0.08);padding:14px 18px;border-radius:8px 8px 0 0;border-bottom:1px solid rgba(255,255,255,0.05);">
                        <span style="color:#B9FF66;font-weight:bold;">Starter</span>
                        <span style="color:#666;text-decoration:line-through;margin-left:12px;">$12</span>
                        <span style="color:#fff;font-weight:bold;margin-left:8px;font-size:18px;">$8.40</span>
                        <span style="color:#888;font-size:13px;"> / 1,000 credits</span>
                    </td>
                </tr>
                <tr>
                    <td style="background:rgba(185,255,102,0.15);padding:14px 18px;border-bottom:1px solid rgba(255,255,255,0.05);">
                        <span style="color:#B9FF66;font-weight:bold;">Professional ⭐</span>
                        <span style="color:#666;text-decoration:line-through;margin-left:12px;">$79</span>
                        <span style="color:#fff;font-weight:bold;margin-left:8px;font-size:18px;">$55.30</span>
                        <span style="color:#888;font-size:13px;"> / 10,000 credits</span>
                    </td>
                </tr>
                <tr>
                    <td style="background:rgba(185,255,102,0.08);padding:14px 18px;border-radius:0 0 8px 8px;">
                        <span style="color:#B9FF66;font-weight:bold;">Business</span>
                        <span style="color:#666;text-decoration:line-through;margin-left:12px;">$299</span>
                        <span style="color:#fff;font-weight:bold;margin-left:8px;font-size:18px;">$209.30</span>
                        <span style="color:#888;font-size:13px;"> / 50,000 credits</span>
                    </td>
                </tr>
            </table>

            <p style="color:#ff6b6b;font-weight:bold;text-align:center;">⏰ This offer expires in 48 hours</p>

            <center>
                <a href="{self.app_url}/dashboard" class="button">Lock In Your Founding Member Price →</a>
            </center>

            <hr class="divider">

            <p><strong>Why "Founding Member"?</strong></p>
            <p>We're building ZeroBounce AI into the #1 email intelligence platform. Early supporters get rewarded with pricing that <em>never</em> increases — even as we add more features and raise prices for new customers.</p>

            <p>This isn't a gimmick. Once the founding member spots are filled, this discount is gone.</p>

            <p>— The ZeroBounce AI Team</p>
        </div>
        """

        text = f"""Founding Member Offer: 30% off forever (48 hours only)

Hi {display_name},

As a Founding Member, lock in 30% off forever:

- Starter: $12 → $8.40 / 1,000 credits
- Professional: $79 → $55.30 / 10,000 credits  (Most Popular)
- Business: $299 → $209.30 / 50,000 credits

This price is locked forever — it never increases.

Offer expires in 48 hours.

Claim your price: {self.app_url}/dashboard

— The ZeroBounce AI Team"""

        return self._send_email(to, subject, self._drip_wrapper(inner), text)

    def send_drip_5_final_nudge(self, to: str, name: str) -> Dict:
        """Drip #5 — Final Nudge / Breakup: last chance + scarcity"""
        subject = "Last call — your Founding Member spot is expiring"
        display_name = name or "there"

        inner = f"""
        <div class="header">
            <h1>Last Call ⏳</h1>
        </div>
        <div class="content">
            <h2>Hi {display_name},</h2>
            <p>This is the last email I'll send about the Founding Member offer.</p>

            <p>Quick recap of what you'd get:</p>

            <div class="feature-box">
                <h3>✅ 30% off every purchase — forever</h3>
                <p>Your price never increases, even when we raise rates for new customers.</p>
            </div>

            <div class="feature-box">
                <h3>✅ Full AI-powered verification suite</h3>
                <p>Catch-all scoring, pattern recognition, domain intelligence, email finder — all included.</p>
            </div>

            <div class="feature-box">
                <h3>✅ Early access to new features</h3>
                <p>Founding Members get first access to everything we build next.</p>
            </div>

            <div class="highlight">
                <p style="color:#ff6b6b;font-weight:bold;margin:0;font-size:16px;">⏰ Founding Member pricing ends today</p>
                <p style="color:#aaa;margin:8px 0 0 0;font-size:13px;">After this, all plans go to full price.</p>
            </div>

            <center>
                <a href="{self.app_url}/dashboard" class="button">Claim Your Spot Before It's Gone →</a>
            </center>

            <hr class="divider">

            <p>If ZeroBounce AI isn't for you right now, no hard feelings at all. Your free account stays active and you can always come back.</p>

            <p>But if you think you'll ever need to verify emails, clean a list, or find prospect contacts — locking in 30% off <em>forever</em> right now is a no-brainer.</p>

            <p>Either way, thanks for checking us out. 🤝</p>

            <p>— The ZeroBounce AI Team</p>
        </div>
        """

        text = f"""Last call — your Founding Member spot is expiring

Hi {display_name},

This is my last email about the Founding Member offer.

What you'd get:
- 30% off every purchase — forever
- Full AI verification suite (catch-all scoring, pattern recognition, domain intel)
- Early access to new features

Founding Member pricing ends today. After this, all plans go to full price.

Claim your spot: {self.app_url}/dashboard

If not now, no worries — your free account stays active.

— The ZeroBounce AI Team"""

        return self._send_email(to, subject, self._drip_wrapper(inner), text)


# Create singleton instance
email_service = EmailService()
