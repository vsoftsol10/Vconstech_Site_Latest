// Test EmailJS functionality
import emailjs from '@emailjs/browser';
import { EMAILJS_CONFIG } from '../config/emailjs';

export const testEmailJS = async () => {
  try {
    console.log('🔄 Starting EmailJS test...');
    console.log('📋 Config:', EMAILJS_CONFIG);

    // Initialize EmailJS
    emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
    console.log('✅ EmailJS initialized');

    const testParams = {
      customer_name: 'Test User',
      customer_email: 'test@example.com',
      customer_phone: '123-456-7890',
      customer_profession: 'Building Developer',
      customer_message: 'This is a test message from Vconstech website.',
      demo_request_date: new Date().toLocaleDateString(),
    };

    console.log('📤 Sending test email with params:', testParams);

    const result = await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.ADMIN_NOTIFICATION_TEMPLATE_ID,
      testParams,
      EMAILJS_CONFIG.PUBLIC_KEY
    );

    console.log('✅ EmailJS test successful:', result);
    alert('✅ EmailJS test successful! Check your email for the test message.');
    return true;
  } catch (error) {
    console.error('❌ EmailJS test failed:', error);
    console.error('❌ Error details:', {
      text: error?.text,
      status: error?.status,
      message: error?.message
    });

    let errorMessage = '❌ EmailJS test failed: ';
    if (error?.text?.includes('Invalid service id')) {
      errorMessage += 'Invalid Service ID. Check your EmailJS dashboard.';
    } else if (error?.text?.includes('Template not found')) {
      errorMessage += 'Template not found. Check your template ID.';
    } else if (error?.text?.includes('Invalid user id')) {
      errorMessage += 'Invalid Public Key. Check your public key.';
    } else {
      errorMessage += error?.text || error?.message || 'Unknown error';
    }

    alert(errorMessage);
    return false;
  }
};

// Test Contact Form EmailJS
export const testContactEmailJS = async () => {
  try {
    console.log('🔄 Testing Contact Form EmailJS...');
    console.log('📋 Config:', EMAILJS_CONFIG);

    emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
    console.log('✅ EmailJS initialized');

    const contactParams = {
      customer_name: 'John Doe',
      customer_email: 'john@example.com',
      customer_company: 'ABC Construction',
      customer_phone: '(555) 123-4567',
      contact_subject: 'General Inquiry',
      customer_message: 'I am interested in learning more about your ERP solutions for construction management.',
      contact_date: new Date().toLocaleDateString(),
      contact_type: 'General Contact'
    };

    console.log('📤 Sending contact email with params:', contactParams);

    const result = await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.CONTACT_TEMPLATE_ID,
      contactParams,
      EMAILJS_CONFIG.PUBLIC_KEY
    );

    console.log('✅ Contact EmailJS test successful:', result);
    alert('✅ Contact EmailJS test successful! Check your email.');
    return true;
  } catch (error) {
    console.error('❌ Contact EmailJS test failed:', error);
    console.error('❌ Error details:', {
      text: error?.text,
      status: error?.status,
      message: error?.message
    });

    let errorMessage = '❌ Contact EmailJS test failed: ';
    if (error?.text?.includes('Invalid service id')) {
      errorMessage += 'Invalid Service ID.';
    } else if (error?.text?.includes('Template not found')) {
      errorMessage += 'Template not found.';
    } else {
      errorMessage += error?.text || error?.message || 'Unknown error';
    }

    alert(errorMessage);
    return false;
  }
};

// Call this function from browser console to test:
// import('./utils/testEmailJS.js').then(module => module.testEmailJS()); // For demo
// import('./utils/testEmailJS.js').then(module => module.testContactEmailJS()); // For contact
