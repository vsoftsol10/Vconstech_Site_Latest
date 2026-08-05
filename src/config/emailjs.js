// EmailJS Configuration
// Replace these values with your actual EmailJS credentials

export const EMAILJS_CONFIG = {
  SERVICE_ID: import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_q599twq',
  CUSTOMER_REPLY_TEMPLATE_ID: import.meta.env.VITE_EMAILJS_CUSTOMER_REPLY_TEMPLATE_ID || 'template_3jy2zbf',
  ADMIN_NOTIFICATION_TEMPLATE_ID: import.meta.env.VITE_EMAILJS_ADMIN_NOTIFICATION_TEMPLATE_ID || 'template_lsvud2q',
  CONTACT_TEMPLATE_ID: import.meta.env.VITE_EMAILJS_CONTACT_TEMPLATE_ID || 'template_lsvud2q',
  PAYMENT_TEMPLATE_ID: import.meta.env.VITE_EMAILJS_PAYMENT_TEMPLATE_ID || 'your_payment_template_id',
  PUBLIC_KEY: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'u1VtE8xU_DvxQcjM3'
};

// EmailJS Template Variables for Demo Requests:
// customer_name: Customer's full name
// customer_email: Customer's email address
// customer_phone: Customer's phone number
// customer_profession: Customer's profession (Interior Designer, Building Developer, etc.)
// customer_message: Additional message from customer
// demo_request_date: Date when demo was requested

// EmailJS Template Variables for Payment Confirmations:
// customer_name: Customer's full name
// customer_email: Customer's email address
// customer_company: Customer's company name
// plan_name: Selected plan name
// plan_price: Plan price
// payment_id: Razorpay payment ID
// purchase_date: Date of purchase