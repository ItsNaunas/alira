# 📧 Supabase Email Template Customization Guide

**Date:** October 20, 2025  
**Purpose:** Customize Supabase authentication emails to match ALIRA branding

---

## 🎨 Overview

Supabase allows you to customize email templates for:
- ✉️ Email verification/confirmation
- 🔐 Password reset
- 🔑 Magic link authentication
- ✨ Email change confirmation

---

## 📍 Where to Customize

### In Supabase Dashboard:

1. Go to **Authentication** → **Email Templates**
2. You'll see 4 email types:
   - Confirm signup
   - Magic Link
   - Change Email Address
   - Reset Password

---

## 🎨 Custom ALIRA Email Template

### HTML Email Template (Confirm Signup)

Replace the default template with this branded version:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your ALIRA Account</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif;
      background-color: #0A0E18;
      color: #ffffff;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #0A0E18;
    }
    .email-header {
      text-align: center;
      padding: 40px 20px 20px;
    }
    .logo {
      font-family: Georgia, serif;
      font-size: 32px;
      font-weight: 400;
      letter-spacing: 2px;
      color: #A06B00;
      text-decoration: none;
    }
    .email-body {
      padding: 20px 40px;
      background-color: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      margin: 0 20px;
    }
    .greeting {
      font-size: 24px;
      font-weight: 300;
      margin-bottom: 20px;
      color: #ffffff;
    }
    .message {
      font-size: 16px;
      line-height: 1.6;
      color: rgba(255, 255, 255, 0.85);
      margin-bottom: 30px;
    }
    .cta-button {
      display: inline-block;
      padding: 16px 48px;
      background: linear-gradient(to right, #A06B00, #8B5A00);
      color: #0A0E18;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 16px;
      text-align: center;
      transition: all 0.3s ease;
    }
    .cta-container {
      text-align: center;
      margin: 30px 0;
    }
    .alternative-link {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.6);
      margin-top: 30px;
      padding-top: 30px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }
    .alternative-link a {
      color: #A06B00;
      text-decoration: none;
      word-break: break-all;
    }
    .email-footer {
      text-align: center;
      padding: 40px 20px;
      font-size: 14px;
      color: rgba(255, 255, 255, 0.5);
    }
    .footer-links {
      margin-top: 20px;
    }
    .footer-links a {
      color: rgba(255, 255, 255, 0.6);
      text-decoration: none;
      margin: 0 10px;
    }
    .divider {
      height: 1px;
      background: rgba(255, 255, 255, 0.1);
      margin: 30px 0;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <!-- Header -->
    <div class="email-header">
      <a href="https://alira.com" class="logo">ALIRA.</a>
    </div>

    <!-- Body -->
    <div class="email-body">
      <h1 class="greeting">Welcome to ALIRA! 👋</h1>
      
      <p class="message">
        Thank you for signing up. We're excited to help you transform your business vision into reality.
      </p>

      <p class="message">
        To get started, please verify your email address by clicking the button below:
      </p>

      <!-- CTA Button -->
      <div class="cta-container">
        <a href="{{ .ConfirmationURL }}" class="cta-button">
          Verify Your Email
        </a>
      </div>

      <p class="message" style="margin-top: 30px;">
        Once verified, you'll have full access to create and manage your personalized business plans.
      </p>

      <!-- Alternative Link -->
      <div class="alternative-link">
        <p>Button not working? Copy and paste this link into your browser:</p>
        <a href="{{ .ConfirmationURL }}">{{ .ConfirmationURL }}</a>
      </div>

      <div class="divider"></div>

      <p style="font-size: 14px; color: rgba(255, 255, 255, 0.6); margin-bottom: 0;">
        If you didn't create an account with ALIRA, you can safely ignore this email.
      </p>
    </div>

    <!-- Footer -->
    <div class="email-footer">
      <p>© 2025 ALIRA. All rights reserved.</p>
      <div class="footer-links">
        <a href="https://alira.com/about">About</a>
        <a href="https://alira.com/services">Services</a>
        <a href="https://alira.com/contact">Contact</a>
      </div>
      <p style="margin-top: 20px; font-size: 12px;">
        ALIRA - Transforming Business Visions into Strategic Plans
      </p>
    </div>
  </div>
</body>
</html>
```

---

## 🔐 Password Reset Template

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your ALIRA Password</title>
  <!-- Same styles as above -->
</head>
<body>
  <div class="email-container">
    <div class="email-header">
      <a href="https://alira.com" class="logo">ALIRA.</a>
    </div>

    <div class="email-body">
      <h1 class="greeting">Password Reset Request 🔐</h1>
      
      <p class="message">
        We received a request to reset your ALIRA account password.
      </p>

      <p class="message">
        If you made this request, click the button below to choose a new password:
      </p>

      <div class="cta-container">
        <a href="{{ .ConfirmationURL }}" class="cta-button">
          Reset Password
        </a>
      </div>

      <p class="message" style="margin-top: 30px; color: rgba(255, 255, 255, 0.7);">
        This link will expire in 1 hour for security reasons.
      </p>

      <div class="alternative-link">
        <p>Button not working? Copy and paste this link:</p>
        <a href="{{ .ConfirmationURL }}">{{ .ConfirmationURL }}</a>
      </div>

      <div class="divider"></div>

      <p style="font-size: 14px; color: rgba(255, 255, 255, 0.6); margin-bottom: 0;">
        <strong>Didn't request this?</strong><br>
        You can safely ignore this email. Your password won't be changed.
      </p>
    </div>

    <div class="email-footer">
      <p>© 2025 ALIRA. All rights reserved.</p>
      <p style="margin-top: 10px; font-size: 12px;">
        For security questions, contact us at support@alira.com
      </p>
    </div>
  </div>
</body>
</html>
```

---

## ✨ Magic Link Template

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sign in to ALIRA</title>
  <!-- Same styles as above -->
</head>
<body>
  <div class="email-container">
    <div class="email-header">
      <a href="https://alira.com" class="logo">ALIRA.</a>
    </div>

    <div class="email-body">
      <h1 class="greeting">Your Sign-In Link ✨</h1>
      
      <p class="message">
        Click the button below to securely sign in to your ALIRA account:
      </p>

      <div class="cta-container">
        <a href="{{ .ConfirmationURL }}" class="cta-button">
          Sign In to ALIRA
        </a>
      </div>

      <p class="message" style="margin-top: 30px; color: rgba(255, 255, 255, 0.7);">
        This link will expire in 1 hour and can only be used once.
      </p>

      <div class="alternative-link">
        <p>Button not working? Copy and paste this link:</p>
        <a href="{{ .ConfirmationURL }}">{{ .ConfirmationURL }}</a>
      </div>

      <div class="divider"></div>

      <p style="font-size: 14px; color: rgba(255, 255, 255, 0.6); margin-bottom: 0;">
        If you didn't request this link, someone may be trying to access your account. Please ignore this email.
      </p>
    </div>

    <div class="email-footer">
      <p>© 2025 ALIRA. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
```

---

## 📝 How to Apply

### Step 1: Access Supabase Dashboard
1. Go to https://app.supabase.com
2. Select your ALIRA project
3. Navigate to **Authentication** → **Email Templates**

### Step 2: Update Each Template
1. **Confirm signup** - Use the first template
2. **Reset Password** - Use the second template
3. **Magic Link** - Use the third template
4. **Change Email** - Adapt the first template

### Step 3: Configure Email Settings
Go to **Authentication** → **Settings**:
- **Site URL**: https://your-domain.com
- **Redirect URLs**: Add your production URLs

### Step 4: Test Emails
1. Create a test account
2. Check email appearance in different clients:
   - Gmail
   - Outlook
   - Apple Mail
   - Mobile devices

---

## 🎨 Customization Tips

### Colors
- Background: `#0A0E18` (ALIRA dark blue)
- Gold accent: `#A06B00`
- Text: `#ffffff` with opacity for hierarchy

### Typography
- Headers: Georgia serif
- Body: System font stack (-apple-system, etc.)
- Gold logo matches website branding

### Mobile Responsive
- Max-width: 600px
- Padding scales down on mobile
- Button remains tappable (48px min height)

---

## 🔍 Testing Checklist

- [ ] Verify link works in all email clients
- [ ] Check mobile rendering
- [ ] Test dark mode appearance
- [ ] Ensure brand consistency
- [ ] Verify links aren't broken
- [ ] Check spam score (use mail-tester.com)

---

## 🚀 Advanced: Use SendGrid/Resend

For even better email deliverability and analytics, consider using:

### SendGrid Integration
```typescript
// In Supabase Dashboard → Settings → Auth
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your_sendgrid_api_key
SMTP_SENDER=noreply@alira.com
```

### Resend Integration (Recommended)
```typescript
SMTP_HOST=smtp.resend.com
SMTP_PORT=587
SMTP_USER=resend
SMTP_PASS=your_resend_api_key
SMTP_SENDER=noreply@alira.com
```

---

## 📊 Email Best Practices

1. **Subject Lines** (configure in Supabase):
   - ✅ "Verify your ALIRA account"
   - ✅ "Reset your ALIRA password"
   - ✅ "Sign in to ALIRA"

2. **From Name**: "ALIRA" or "ALIRA Team"

3. **Reply-To**: support@alira.com

4. **Preheader Text**: First line of email body (make it compelling)

---

## 🎯 Result

After applying these templates, your emails will:
- ✅ Match ALIRA brand identity
- ✅ Look professional across all email clients
- ✅ Be mobile-responsive
- ✅ Have clear call-to-action buttons
- ✅ Provide alternative text links
- ✅ Include security information

---

**Next Step:** Now let's build the AI-driven follow-up question system! 🤖

