# EmailJS Setup Guide for Vconstech Website

## 🚨 Current Issue: Email Not Sending

If you're getting "Failed to submit demo request. Please try again.", follow these steps to fix it:

### Quick Fix:
1. Open browser console (F12) when the error occurs
2. Look for detailed error messages
3. Check if the credentials are correct

### Test EmailJS:
1. Open browser console on your website
2. Run: `import('./utils/testEmailJS.js').then(module => module.testEmailJS())`
3. This will test EmailJS with sample data

## Step 1: Create EmailJS Account
1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email

## Step 2: Create Email Service
1. In your EmailJS dashboard, go to "Email Services"
2. Click "Add New Service"
3. Choose your email provider (Gmail, Outlook, etc.)
4. Connect your email account
5. Give it a name (e.g., "Vconstech Contact")
6. Copy the **Service ID**

## Step 3: Create Email Templates

### Template 1: Customer Auto-Reply Template
Use this updated branded customer confirmation template in EmailJS.

**Subject:**
```
🎉 Demo Request Received | Vconstech ERP
```

**Content:**
```html
<div style="margin:0; padding:0; background:#f6f7f9; font-family:Arial, Helvetica, sans-serif; color:#1f2937;">
  <div style="max-width:640px; margin:0 auto; padding:24px 14px;">
    <div style="background:#ffffff; border:1px solid #eceff3; border-radius:18px; overflow:hidden;">
      <div style="padding:28px 28px 22px; text-align:center; border-bottom:4px solid #ffbe01;">
        <img src="https://www.vconstech.in/assets/constech-logo.png" alt="Vconstech" style="max-width:180px; height:auto; margin:0 auto 18px; display:block;" />
        <h1 style="margin:0; font-size:26px; line-height:1.25; color:#111827;">Demo Request Received</h1>
      </div>

      <div style="padding:28px;">
        <p style="margin:0 0 16px; font-size:16px; line-height:1.6;">Hello <strong>{{customer_name}}</strong>,</p>
        <p style="margin:0 0 14px; font-size:15px; line-height:1.7;">Thank you for your interest in <strong>Vconstech ERP</strong>.</p>
        <p style="margin:0 0 14px; font-size:15px; line-height:1.7;">We have successfully received your request for a live ERP demonstration.</p>
        <p style="margin:0 0 24px; font-size:15px; line-height:1.7;">Our ERP specialists will review your request and contact you within the next 24 hours to schedule your personalized live demo.</p>

        <div style="margin:0 0 24px; padding:20px; background:#fff9e7; border:1px solid #ffe19a; border-radius:14px;">
          <h2 style="margin:0 0 16px; font-size:13px; line-height:1.4; letter-spacing:0.08em; color:#8a6400;">YOUR DEMO REQUEST</h2>
          <p style="margin:0 0 12px; font-size:14px; line-height:1.6;"><strong>Company Name:</strong><br/>{{customer_company}}</p>
          <p style="margin:0 0 12px; font-size:14px; line-height:1.6;"><strong>Subject:</strong><br/>{{customer_subject}}</p>
          <p style="margin:0; font-size:14px; line-height:1.6;"><strong>Message:</strong><br/>{{customer_message}}</p>
        </div>

        <div style="margin:0 0 24px;">
          <h2 style="margin:0 0 14px; font-size:18px; line-height:1.4; color:#111827;">WHAT HAPPENS NEXT?</h2>
          <p style="margin:0 0 10px; font-size:14px; line-height:1.6;">✔ Our ERP consultant will review your request.</p>
          <p style="margin:0 0 10px; font-size:14px; line-height:1.6;">✔ We will contact you within 24 hours.</p>
          <p style="margin:0 0 10px; font-size:14px; line-height:1.6;">✔ A personalized live ERP demonstration will be scheduled.</p>
          <p style="margin:0; font-size:14px; line-height:1.6;">✔ We will answer all your questions and explain every ERP module.</p>
        </div>

        <div style="margin:0 0 24px; padding:20px; background:#ffffff; border:1px solid #edf0f3; border-radius:14px;">
          <h2 style="margin:0 0 14px; font-size:18px; line-height:1.4; color:#111827;">WHY VCONSTECH ERP?</h2>
          <p style="margin:0 0 10px; font-size:14px; line-height:1.6;">✔ Project Management</p>
          <p style="margin:0 0 10px; font-size:14px; line-height:1.6;">✔ Material Management</p>
          <p style="margin:0 0 10px; font-size:14px; line-height:1.6;">✔ Labour Management</p>
          <p style="margin:0 0 10px; font-size:14px; line-height:1.6;">✔ Financial Management</p>
          <p style="margin:0 0 10px; font-size:14px; line-height:1.6;">✔ Contract Management</p>
          <p style="margin:0 0 10px; font-size:14px; line-height:1.6;">✔ Employee Management</p>
          <p style="margin:0; font-size:14px; line-height:1.6;">✔ Reports &amp; Analytics</p>
        </div>

        <div style="margin:0 0 24px; padding:18px; background:#f9fafb; border:1px solid #edf0f3; border-radius:14px;">
          <h2 style="margin:0 0 12px; font-size:18px; line-height:1.4; color:#111827;">Need immediate assistance?</h2>
          <p style="margin:0 0 8px; font-size:14px; line-height:1.6;">🌐 <strong>Website:</strong><br/><a href="https://www.vconstech.in" style="color:#111827; text-decoration:none;">https://www.vconstech.in</a></p>
          <p style="margin:0; font-size:14px; line-height:1.6;">📧 <strong>Email:</strong><br/><a href="mailto:support@vconstech.in" style="color:#111827; text-decoration:none;">support@vconstech.in</a></p>
        </div>

        <p style="margin:0 0 16px; font-size:15px; line-height:1.7;">Thank you for choosing Vconstech ERP.</p>
        <p style="margin:0; font-size:15px; line-height:1.7;">Best Regards,<br/><strong>Vconstech ERP Team</strong><br/><a href="https://www.vconstech.in" style="color:#111827; text-decoration:none;">https://www.vconstech.in</a></p>
      </div>
    </div>
  </div>
</div>
```


4. Save the template and copy the **Template ID**

### Template 2: Admin Notification Template
1. Create another template for admin notifications:

**To:** `vconstecherp@gmail.com` (or your admin email)

**Subject:**
```
New Demo Request
```

**Content:**
```html
<div style="font-family: system-ui, sans-serif; font-size: 14px; color:#333">

  <h2 style="margin-bottom:10px;"> New Demo Request</h2>

  <div style="margin-top:15px; padding:15px; border:1px solid #eee; border-radius:8px; background:#fafafa;">
    
    <p><strong>👤 Name:</strong> {{customer_name}}</p>
    <p><strong>📧 Email:</strong> {{customer_email}}</p>
    <p><strong>📞 Phone:</strong> {{customer_phone}}</p>
    <p><strong>🏢 Company:</strong> {{customer_company}}</p>
    <p><strong>📌 Subject:</strong> {{customer_subject}}</p>

    <div style="margin-top:10px;">
      <strong>📝 Message:</strong>
      <p style="margin-top:5px;">{{customer_message}}</p>
    </div>

  </div>

  <p style="margin-top:20px; font-size:12px; color:#777;">
    This request was submitted from the Get Demo page.
  </p>

</div>
```

### Template 3: Contact Form Template
1. Create another template for general contact form submissions:

**To:** `vconstecherp@gmail.com` (or your admin email)

**Subject:**
```
New Contact Form Message - {{contact_subject}} - Vconstech
```

**Content:**
```
New Contact Form Submission - Vconstech

Customer Details:
- Name: {{customer_name}}
- Email: {{customer_email}}
- Company: {{customer_company}}
- Phone: {{customer_phone}}
- Subject: {{contact_subject}}

Message:
{{customer_message}}

Contact Type: {{contact_type}}
Submission Date: {{contact_date}}

Please respond to this inquiry within 24 hours.

Best regards,
Vconstech Contact System
```

### Template 4: Payment Confirmation Template
1. Create another template for payment confirmations:

**To:** `{{customer_email}}`

**Subject:**
```
Payment Confirmation - {{plan_name}} Plan - Vconstech ERP
```

**Content:**
```
Dear {{customer_name}},

Thank you for purchasing Vconstech ERP Software!

Purchase Details:
- Plan: {{plan_name}}
- Price: {{plan_price}}
- Payment ID: {{payment_id}}
- Purchase Date: {{purchase_date}}

Company: {{customer_company}}
Email: {{customer_email}}

Your account will be activated within 24 hours. You will receive login credentials via email.

For support, contact us at:
Email: support@vconstech.com
Phone: (555) 123-4567

Thank you for choosing Vconstech!

Best regards,
Vconstech Team
```

## Step 4: Get Public Key
1. In EmailJS dashboard, go to "Account" → "General"
2. Copy your **Public Key**

## Step 5: Configure Environment Variables

Create a `.env` file in your project root:

```env
# EmailJS Configuration
VITE_EMAILJS_SERVICE_ID=your_actual_service_id
VITE_EMAILJS_CUSTOMER_REPLY_TEMPLATE_ID=your_customer_reply_template_id
VITE_EMAILJS_ADMIN_NOTIFICATION_TEMPLATE_ID=your_admin_notification_template_id
VITE_EMAILJS_CONTACT_TEMPLATE_ID=your_contact_template_id
VITE_EMAILJS_PAYMENT_TEMPLATE_ID=your_payment_template_id
VITE_EMAILJS_PUBLIC_KEY=your_actual_public_key
```

## Step 6: Update Config File

Update `src/config/emailjs.js`:

```javascript
export const EMAILJS_CONFIG = {
  SERVICE_ID: import.meta.env.VITE_EMAILJS_SERVICE_ID,
  CUSTOMER_REPLY_TEMPLATE_ID: import.meta.env.VITE_EMAILJS_CUSTOMER_REPLY_TEMPLATE_ID,
  ADMIN_NOTIFICATION_TEMPLATE_ID: import.meta.env.VITE_EMAILJS_ADMIN_NOTIFICATION_TEMPLATE_ID,
  CONTACT_TEMPLATE_ID: import.meta.env.VITE_EMAILJS_CONTACT_TEMPLATE_ID,
  PAYMENT_TEMPLATE_ID: import.meta.env.VITE_EMAILJS_PAYMENT_TEMPLATE_ID,
  PUBLIC_KEY: import.meta.env.VITE_EMAILJS_PUBLIC_KEY
};
```

## Step 7: Test the Integration

1. Start your development server: `npm run dev`
2. Open browser console (F12)
3. Test Demo Form:
   ```javascript
   import('./utils/testEmailJS.js').then(module => module.testEmailJS())
   ```
4. Test Contact Form:
   ```javascript
   import('./utils/testEmailJS.js').then(module => module.testContactEmailJS())
   ```
5. Fill out the actual forms on your website
6. Check your email for both demo requests and contact messages

## 🚨 Troubleshooting "Failed to submit demo request"

### 1. Check Browser Console
- Open F12 → Console tab
- Look for error messages when submitting the form
- Common errors:
  - "Invalid service id" → Wrong SERVICE_ID
  - "Template not found" → Wrong TEMPLATE_ID
  - "Invalid user id" → Wrong PUBLIC_KEY

### 2. Verify EmailJS Account
- Go to [https://dashboard.emailjs.com/](https://dashboard.emailjs.com/)
- Check if your email service is connected
- Verify template is published (not in draft)

### 3. Environment Variables
Create a `.env` file in your project root:

```env
VITE_EMAILJS_SERVICE_ID=your_actual_service_id
VITE_EMAILJS_TEMPLATE_ID=your_actual_template_id
VITE_EMAILJS_PUBLIC_KEY=your_actual_public_key
```

### 4. Test with Console
Run this in browser console to test EmailJS directly:

```javascript
import('./utils/testEmailJS.js').then(module => module.testEmailJS())
```

### 5. Common Issues

**Issue: "Failed to submit demo request"**
- **Cause**: Invalid credentials or service not set up
- **Solution**: Double-check all EmailJS IDs and ensure service is connected

**Issue: "rate limit exceeded"**
- **Cause**: Too many requests (EmailJS free plan: 50/hour)
- **Solution**: Wait a few minutes and try again

**Issue: Emails not received**
- **Cause**: Email service not connected properly
- **Solution**: Reconnect email service in EmailJS dashboard

**Issue:  variables not working**
- **Cause**: Variable names don't match
- **Solution**: Ensure template uses: `{{customer_name}}`, `{{customer_email}}`, etc.

### 6. Alternative: Use Console Testing

If the form isn't working, test EmailJS directly:

```javascript
// In browser console
import emailjs from 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/emailjs.min.js'

emailjs.init('your_public_key')

const templateParams = {
  customer_name: 'Test User',
  customer_email: 'test@example.com',
  customer_phone: '123-456-7890',
  customer_profession: 'Building Developer',
  customer_message: 'Test message',
  demo_request_date: new Date().toLocaleDateString()
}

emailjs.send('your_service_id', 'your_template_id', templateParams)
  .then(result => console.log('Success:', result))
  .catch(error => console.error('Error:', error))
```
4. Test the pricing page payment flow

## Troubleshooting

### Common Issues:

1. **"Invalid service ID" error:**
   - Check your SERVICE_ID in the .env file
   - Make sure the service is connected to your email

2. **Emails not being sent:**
   - Verify your email service is properly connected
   - Check your email provider's sending limits
   - Ensure templates are published (not in draft mode)

3. **Template variables not working:**
   - Make sure variable names match exactly (case-sensitive)
   - Check that all required variables are included

### EmailJS Free Plan Limits:
- 200 emails per month
- 50KB email size limit
- Rate limit: 50 requests per hour

## Support

For EmailJS support:
- EmailJS Documentation: [https://www.emailjs.com/docs/](https://www.emailjs.com/docs/)
- EmailJS Community: [https://www.emailjs.com/forum/](https://www.emailjs.com/forum/)

For Vconstech project issues, check the console for error messages and ensure all environment variables are properly set.
