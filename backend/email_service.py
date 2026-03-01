"""
Email service for FoodExpress
Sends registration, approval, and denial emails to all users
Uses SMTP (Gmail App Password)
"""
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os

# Configure these in .env
SMTP_EMAIL = os.getenv("SMTP_EMAIL", "foodexpress.noreply@gmail.com")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")  # Gmail App Password
SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))

ROLE_LABELS = {
    "user": "Customer",
    "hotel": "Restaurant Owner",
    "delivery": "Delivery Partner",
    "admin": "Administrator"
}

def send_email(to_email, subject, html_body):
    """Send an email using SMTP"""
    if not SMTP_PASSWORD:
        print(f"[EMAIL MOCK] To: {to_email} | Subject: {subject}")
        print(f"[EMAIL MOCK] Body preview: {html_body[:200]}...")
        return True

    try:
        msg = MIMEMultipart("alternative")
        msg["From"] = f"FoodExpress <{SMTP_EMAIL}>"
        msg["To"] = to_email
        msg["Subject"] = subject
        msg.attach(MIMEText(html_body, "html"))

        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_EMAIL, SMTP_PASSWORD)
            server.sendmail(SMTP_EMAIL, to_email, msg.as_string())
        
        print(f"[EMAIL SENT] To: {to_email} | Subject: {subject}")
        return True
    except Exception as e:
        print(f"[EMAIL ERROR] {e}")
        return False


def send_registration_email(email, name, role):
    """Send registration confirmation email - mentions role"""
    role_label = ROLE_LABELS.get(role, "User")
    
    if role == "delivery":
        status_note = """
        <div style="background: #fff3cd; border: 1px solid #ffc107; border-radius: 12px; padding: 16px; margin: 20px 0;">
            <p style="margin: 0; color: #856404; font-weight: bold;">⏳ Pending Admin Approval</p>
            <p style="margin: 8px 0 0 0; color: #856404; font-size: 14px;">
                Your Delivery Partner account requires admin verification of your driving license. 
                You will receive another email once your account is approved or denied.
            </p>
        </div>
        """
    elif role == "hotel":
        status_note = """
        <div style="background: #fff3cd; border: 1px solid #ffc107; border-radius: 12px; padding: 16px; margin: 20px 0;">
            <p style="margin: 0; color: #856404; font-weight: bold;">⏳ Pending Admin Approval</p>
            <p style="margin: 8px 0 0 0; color: #856404; font-size: 14px;">
                Your Restaurant account requires admin verification. 
                You will receive another email once your account is approved.
            </p>
        </div>
        """
    else:
        status_note = """
        <div style="background: #d4edda; border: 1px solid #28a745; border-radius: 12px; padding: 16px; margin: 20px 0;">
            <p style="margin: 0; color: #155724; font-weight: bold;">✅ Account Active</p>
            <p style="margin: 8px 0 0 0; color: #155724; font-size: 14px;">
                Your account is active and ready to use. You can now login and start ordering!
            </p>
        </div>
        """

    html = f"""
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #0d0d0d; border-radius: 24px; overflow: hidden; border: 1px solid #2a2a2a;">
        <div style="background: linear-gradient(135deg, #c9a84c, #b8943d); padding: 40px 30px; text-align: center;">
            <h1 style="margin: 0; color: #000; font-size: 28px; font-weight: 900; letter-spacing: -1px;">🥙 FoodExpress</h1>
            <p style="margin: 8px 0 0 0; color: #000; font-size: 14px; font-weight: 600;">Registration Confirmation</p>
        </div>
        
        <div style="padding: 30px;">
            <h2 style="color: #fff; font-size: 22px; margin: 0 0 8px 0;">Welcome, {name or 'there'}! 👋</h2>
            <p style="color: #999; font-size: 14px; margin: 0 0 20px 0;">
                Your account has been created successfully on FoodExpress.
            </p>
            
            <div style="background: #111; border: 1px solid #2a2a2a; border-radius: 12px; padding: 20px; margin: 20px 0;">
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="color: #666; font-size: 12px; padding: 8px 0; text-transform: uppercase; letter-spacing: 1px; font-weight: 700;">Account Type</td>
                        <td style="color: #c9a84c; font-size: 14px; padding: 8px 0; font-weight: 800; text-align: right;">{role_label}</td>
                    </tr>
                    <tr>
                        <td style="color: #666; font-size: 12px; padding: 8px 0; text-transform: uppercase; letter-spacing: 1px; font-weight: 700;">Email</td>
                        <td style="color: #fff; font-size: 14px; padding: 8px 0; text-align: right;">{email}</td>
                    </tr>
                </table>
            </div>
            
            {status_note}
            
            <p style="color: #666; font-size: 12px; text-align: center; margin-top: 30px;">
                © 2026 FoodExpress. All rights reserved.
            </p>
        </div>
    </div>
    """
    
    return send_email(email, f"Welcome to FoodExpress — {role_label} Registration", html)


def send_approval_email(email, name, role, approved=True):
    """Send approval/denial email to delivery partner or restaurant"""
    role_label = ROLE_LABELS.get(role, "User")
    
    if approved:
        status_html = """
        <div style="background: #d4edda; border: 1px solid #28a745; border-radius: 12px; padding: 20px; margin: 20px 0; text-align: center;">
            <p style="margin: 0; color: #155724; font-size: 32px;">✅</p>
            <h3 style="margin: 10px 0 5px 0; color: #155724; font-weight: 800;">Account Approved!</h3>
            <p style="margin: 0; color: #155724; font-size: 14px;">
                Your account has been verified and approved by our admin team.
                You can now login and start using your dashboard.
            </p>
        </div>
        """
        subject = f"🎉 Account Approved — {role_label} | FoodExpress"
    else:
        status_html = """
        <div style="background: #f8d7da; border: 1px solid #dc3545; border-radius: 12px; padding: 20px; margin: 20px 0; text-align: center;">
            <p style="margin: 0; color: #721c24; font-size: 32px;">❌</p>
            <h3 style="margin: 10px 0 5px 0; color: #721c24; font-weight: 800;">Registration Denied</h3>
            <p style="margin: 0; color: #721c24; font-size: 14px;">
                Unfortunately, your account registration has been denied by our admin team.
                Please contact support for more information or re-apply with valid documents.
            </p>
        </div>
        """
        subject = f"❌ Registration Denied — {role_label} | FoodExpress"

    html = f"""
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #0d0d0d; border-radius: 24px; overflow: hidden; border: 1px solid #2a2a2a;">
        <div style="background: linear-gradient(135deg, #c9a84c, #b8943d); padding: 40px 30px; text-align: center;">
            <h1 style="margin: 0; color: #000; font-size: 28px; font-weight: 900;">🥙 FoodExpress</h1>
            <p style="margin: 8px 0 0 0; color: #000; font-size: 14px; font-weight: 600;">Account Status Update</p>
        </div>
        
        <div style="padding: 30px;">
            <h2 style="color: #fff; font-size: 22px; margin: 0 0 8px 0;">Hello, {name or 'Partner'}!</h2>
            <p style="color: #999; font-size: 14px; margin: 0 0 10px 0;">
                We have an update regarding your <strong style="color: #c9a84c;">{role_label}</strong> registration.
            </p>
            
            {status_html}
            
            <p style="color: #666; font-size: 12px; text-align: center; margin-top: 30px;">
                © 2026 FoodExpress. All rights reserved.
            </p>
        </div>
    </div>
    """
    
    return send_email(email, subject, html)
