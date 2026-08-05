import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import welcomeImg from '../assets/welcome.png';
/* Debug function for testing EmailJS - call this from browser console:
// window.testEmailJS()
window.testEmailJS = async () => {
  

  console.log('🧪 Testing EmailJS configuration...');
  console.log('Service ID:', EMAILJS_CONFIG.SERVICE_ID);
  console.log('Template ID:', EMAILJS_CONFIG.ADMIN_NOTIFICATION_TEMPLATE_ID);
  console.log('Public Key:', EMAILJS_CONFIG.PUBLIC_KEY);


  try {
    const testData = {
      customer_name: 'Test User',
      customer_email: 'test@example.com',
      customer_phone: '123-456-7890',
      customer_profession: 'Building Developer',
      customer_message: 'This is a test message',
      demo_request_date: new Date().toLocaleDateString()
    };

    const result = await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.ADMIN_NOTIFICATION_TEMPLATE_ID,
      testData,
      EMAILJS_CONFIG.PUBLIC_KEY
    );

    console.log('✅ EmailJS test successful:', result);
    alert('✅ EmailJS test successful! Check your email.');
  } catch (error) {
    console.error('❌ EmailJS test failed:', error);
    alert(`❌ EmailJS test failed: ${error?.text || error?.message}`);
  }
};*/

const FloatingButtons = () => {
  const navigate = useNavigate();


  const [isVisible, setIsVisible] = useState(false);

  // Legacy demo-modal state (modal no longer opens; kept only to prevent runtime errors)
  const [errors] = useState({});
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [demoForm, setDemoForm] = useState({
    name: '',
    email: '',
    phone: '',
    profession: '',
    message: ''
  });

  const handleDemoFormChange = (e) => {
    const { name, value } = e.target;
    setDemoForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleDemoSubmit = (e) => {
    e.preventDefault?.();
    setShowDemoModal(false);
    setShowSuccessModal(false);
    navigate('/contact');
  };

  // Show button when page is scrolled up to given distance
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Set the scroll event listener
  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  // Listen for demo modal open event
  useEffect(() => {
    const handleOpenDemoModal = () => {
      navigate('/contact');
    };

    window.addEventListener('openDemoModal', handleOpenDemoModal);
    return () => {
      window.removeEventListener('openDemoModal', handleOpenDemoModal);
    };
  }, [navigate]);

  // Scroll to top smoothly
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  /* Demo modal removed (demo requests go to /contact).
  const handleDemoFormChange = (e) => {
    const { name, value } = e.target;

    // Phone: allow only numbers and max 10 digits
    if (name === "phone") {
      if (!/^\d*$/.test(value)) return; // blocks alphabets
      if (value.length > 10) return;    // blocks more than 10 digits
    }

    setDemoForm({
      ...demoForm,
      [name]: value
    });
  };
  const validateDemoForm = () => {
    let newErrors = {};

    // Email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(demoForm.email)) {
      newErrors.email = "Enter a valid email address with @ and'.com' ";
    }

    // Phone validation (exactly 10 digits)
    if (demoForm.phone.length !== 10) {
      newErrors.phone = "Phone number must be exactly 10 digits";
    }


    if (demoForm.name.length == 0) { newErrors.name = "Name is required"; }
    if (!demoForm.profession) newErrors.profession = "Profession is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  // Handle demo form submission
  const handleDemoSubmit = async (e) => {
    e.preventDefault();

    if (!validateDemoForm()) return;

    console.log('Starting demo submission...');
    console.log('Form data:', demoForm);
    console.log('EmailJS Config:', EMAILJS_CONFIG);
      console.log('Using template:', EMAILJS_CONFIG.ADMIN_NOTIFICATION_TEMPLATE_ID);

    try {
      const templateParams = {
        customer_name: demoForm.name,
        customer_email: demoForm.email,
        customer_phone: demoForm.phone,
        customer_profession: demoForm.profession,
        customer_message: demoForm.message || 'No additional message',
        demo_request_date: new Date().toLocaleDateString(),
      };

      console.log('Sending admin notification email with params:', templateParams);

      // Send admin notification
      const adminResult = await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.ADMIN_NOTIFICATION_TEMPLATE_ID,
        templateParams,
        EMAILJS_CONFIG.PUBLIC_KEY
      );

      console.log('Admin demo notification sent successfully:', adminResult);

      // Send auto reply to user
      const userReplyParams = {
        to_name: demoForm.name,
        to_email: demoForm.email,
        customer_name: demoForm.name,
        customer_email: demoForm.email,
        customer_phone: demoForm.phone,
        customer_profession: demoForm.profession,
        customer_message: demoForm.message || 'No additional message',
        demo_request_date: new Date().toLocaleDateString(),
      };

      const userResult = await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.CUSTOMER_REPLY_TEMPLATE_ID,
        userReplyParams,
        EMAILJS_CONFIG.PUBLIC_KEY
      );

      console.log('User auto reply sent successfully:', userResult);

      console.log('EmailJS result:', adminResult);
      setShowDemoModal(false);
      setShowSuccessModal(true);
      setDemoForm({ name: '', email: '', phone: '', profession: '', message: '' });
    } catch (error) {
      console.error('❌ Error sending demo request:', error);
      console.log('Full error object:', error);
      console.log('Error text:', error?.text);
      console.log('Error status:', error?.status);
      console.log('Error message:', error?.message);
      console.log('Template used:', EMAILJS_CONFIG.ADMIN_NOTIFICATION_NOTIFICATION_TEMPLATE_ID);
      console.log('Service used:', EMAILJS_CONFIG.SERVICE_ID);

      // More detailed error handling
      let errorMessage = 'Failed to submit demo request. Please try again.';

      if (error?.text?.includes('Invalid service id')) {
        errorMessage = '❌ Invalid Service ID. Check your EmailJS service configuration.';
      } else if (error?.text?.includes('Template not found')) {
        errorMessage = '❌ Template not found. Check your EmailJS template ID.';
      } else if (error?.text?.includes('Invalid user id')) {
        errorMessage = '❌ Invalid Public Key. Check your EmailJS public key.';
      } else if (error?.text?.includes('rate limit')) {
        errorMessage = '⏰ Too many requests. Please try again in a few minutes.';
      } else if (!navigator.onLine) {
        errorMessage = '📡 No internet connection. Please check your connection.';
      } else if (error?.text) {
        errorMessage = `❌ EmailJS Error: ${error.text}`;
      }

      alert(errorMessage);
    }
  };*/

  return (
    <>
      {/* Scroll to Top Button */}
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-40 right-6 bg-[#ffbe01] text-black p-4 rounded-full shadow-lg hover:bg-yellow-400 transition-all duration-300 z-50 group"
          aria-label="Scroll to top"
        >
          <svg
            className="w-6 h-6 transform group-hover:-translate-y-1 transition-transform duration-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      )}

      {/* Book Demo Floating Button */}
      <button
        onClick={() => navigate('/contact')}
        className="fixed bottom-24 right-6 bg-black text-white px-6 py-3 rounded-full shadow-lg hover:bg-gray-800 transition-all duration-300 z-50 group flex items-center space-x-2"
        aria-label="Book a demo"
      >
        <svg
          className="w-5 h-5 transform group-hover:scale-110 transition-transform duration-200"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3a2 2 0 012-2h2a2 2 0 012 2v4m-6 4v10a2 2 0 002 2h8a2 2 0 002-2V11M9 11h6"
          />
        </svg>
        <span className="font-medium text-sm">Book Demo</span>
      </button>

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/+918270767468"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-28 left-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-all duration-300 z-50 group"
        aria-label="Contact us on WhatsApp"
      >
        <svg
          className="w-6 h-6 transform group-hover:scale-110 transition-transform duration-200"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
        </svg>
      </a>

      {/* Demo Request Modal */}
      {showDemoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-black">Book a Demo</h2>
              <button
                onClick={() => setShowDemoModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleDemoSubmit} className="space-y-4">
              <div>
                <label htmlFor="demo-name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="demo-name"
                  name="name"
                  value={demoForm.name}
                  onChange={handleDemoFormChange}
                  // required
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-[#ffbe01] focus:border-[#ffbe01] transition-colors duration-200"
                  placeholder="John Doe"
                />
                {/* Error BELOW input */}
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.name}
                  </p>
                )}
              </div>
              <div className="flex flex-col">
                <label
                  htmlFor="demo-email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email Address *
                </label>

                <input
                  type="email"
                  id="demo-email"
                  name="email"
                  value={demoForm.email}
                  onChange={handleDemoFormChange}
                  // required
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-[#ffbe01] focus:border-[#ffbe01] transition-colors duration-200"
                  placeholder="john@company.com"
                />

                {/* Error BELOW input */}
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email}
                  </p>
                )}
              </div>



              <div className="flex flex-col">
                <label htmlFor="demo-phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number (India) *
                </label>

                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-700 text-sm">
                    +91
                  </span>

                  <input
                    type="tel"
                    id="demo-phone"
                    name="phone"
                    value={demoForm.phone}
                    onChange={handleDemoFormChange}
                    maxLength={10}
                    // required
                    className="w-full px-4 py-3 border border-gray-300 rounded-r-md focus:ring-[#ffbe01] focus:border-[#ffbe01]"
                    placeholder="10 digit mobile number"
                  />
                </div>

                {/* ERROR BELOW PHONE INPUT */}
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
              </div>


              <div>
                <label htmlFor="demo-profession" className="block text-sm font-medium text-gray-700 mb-2">
                  Profession *
                </label>
                <select
                  id="demo-profession"
                  name="profession"
                  value={demoForm.profession}
                  onChange={handleDemoFormChange}
                  // required
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-[#ffbe01] focus:border-[#ffbe01] transition-colors duration-200"
                >
                  <option value="">Select your profession</option>
                  <option value="interior-designer">Interior Designer</option>
                  <option value="building-developer">Building Developer</option>
                  <option value="contractor">Contractor</option>
                  <option value="architect">Architect</option>
                  <option value="project-manager">Project Manager</option>
                  <option value="other">Other</option>
                </select>
                {/* ERROR BELOW PHONE INPUT */}
                {errors.profession && (
                  <p className="text-red-500 text-sm mt-1">{errors.profession}</p>
                )}
              </div>

              <div>
                <label htmlFor="demo-message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message (Optional)
                </label>
                <textarea
                  id="demo-message"
                  name="message"
                  value={demoForm.message}
                  onChange={handleDemoFormChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-[#ffbe01] focus:border-[#ffbe01] transition-colors duration-200 resize-none"
                  placeholder="Tell us about your specific requirements..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#ffbe01] text-black py-3 px-6 rounded-md font-semibold text-lg hover:bg-yellow-400 transition-colors duration-200"
              >
                Request Demo
              </button>
            </form>

            <div className="mt-4 text-center text-sm text-gray-600">
              <p>By requesting a demo, you agree to our terms of service.</p>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-md w-full text-center">
            <div className="mb-6">
              <img
                src={welcomeImg}
                alt="Welcome"
                className="w-32 h-32 mx-auto mb-4"
              />
              <h2 className="text-2xl font-bold text-black mb-4">Thank You!</h2>
              <p className="text-gray-600 leading-relaxed">
                Thanks for requesting us for a demo. We will reach out to you soon!
              </p>
            </div>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="bg-[#ffbe01] text-black px-6 py-3 rounded-md font-semibold hover:bg-yellow-400 transition-colors duration-200"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingButtons;