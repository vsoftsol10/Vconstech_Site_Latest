import { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Clock, Play, Youtube } from 'lucide-react';
import contactHero from '../assets/contact-hero.mp4';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const WEBSITE_API_BASE_URL = (import.meta.env.VITE_WEBSITE_API_BASE_URL || '/api').replace(/\/$/, '');

const Contact = () => {
  gsap.registerPlugin(ScrollTrigger);
  const erpDemoUrl = 'https://youtu.be/-qwOg0fT3wU';
  const erpDemoThumbnail = 'https://img.youtube.com/vi/-qwOg0fT3wU/hqdefault.jpg';
  const erpHighlights = [
    'Project Management',
    'Material Management',
    'Labour Management',
    'Financial Management'
  ];

  useEffect(() => {
    // Hero animation
    gsap.fromTo('.hero-content', 
      { opacity: 0, y: -50 }, 
      { opacity: 1, y: 0, duration: 1 }
    );

    // Section animations on scroll
    gsap.utils.toArray('.animate-section').forEach((section) => {
      gsap.fromTo(section, 
        { opacity: 0, y: 50 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 1,
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });
  }, []);
  const [errors, setErrors] = useState({});
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [submitErrorMessage, setSubmitErrorMessage] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    company: '',
    phone: '',
    email: '',
    location: '',
    address: '',
    requirements: ''
  });

  useEffect(() => {
    if (!showSuccessMessage) return;

    const timer = setTimeout(() => {
      setShowSuccessMessage(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, [showSuccessMessage]);


 const handleChange = (e) => {
  const { name, value } = e.target;

  // Phone number: allow only digits & max 10
  if (name === "phone") {
    if (!/^\d*$/.test(value)) return; // block alphabets
    if (value.length > 10) return; // block > 10 digits
  }

  setFormData({
    ...formData,
    [name]: value
  });
};
const validateForm = () => {
  let newErrors = {};

  // Email validation
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    newErrors.email = "Please enter a valid email address with @ and '.com'";
  }

  // Phone validation
  if (!formData.phone || formData.phone.length !== 10) {
    newErrors.phone = "Phone number must be exactly 10 digits";
  }

  if (!formData.fullName) newErrors.fullName = "Name is required";
  if (!formData.company) newErrors.company = "Company name is required";

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setShowSuccessMessage(false);
    setSubmitErrorMessage('');

    console.log('Starting contact form submission...');
    console.log('Form data:', formData);

    try {
      const response = await fetch(`${WEBSITE_API_BASE_URL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (result?.errors) {
          setErrors(result.errors);
        }

        throw new Error(result?.message || 'Failed to send message. Please try again.');
      }

      setShowSuccessMessage(true);

      // Reset form
      setFormData({
        fullName: '',
        company: '',
        phone: '',
        email: '',
        location: '',
        address: '',
        requirements: ''
      });

    } catch (error) {
      console.error('Error sending contact form:', error);

      let errorMessage = 'Failed to send message. Please try again.';

      if (!navigator.onLine) {
        errorMessage = 'No internet connection. Please check your connection.';
      } else if (error?.message) {
        errorMessage = error.message;
      }

      setSubmitErrorMessage(errorMessage);
    }
  };

  const contactInfo = [
    {
      icon: (
        <svg className="w-6 h-6 text-[#ffbe01]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      title: "Phone",
      details: ["+91 90954 22237"],
      description: "Available 24/7"
    },
    {
      icon: (
        <svg className="w-6 h-6 text-[#ffbe01]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: "Email",
      details: ["vconstecherp@gmail.com"],
      description: "We respond within 24 hours"
    },
    {
      icon: (
        <svg className="w-6 h-6 text-[#ffbe01]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: "Office",
      details: ["Vannarapettai, Tirunelveli.", "Tamilnadu - 627002, India."],
      description: "Visit us for a demo"
    }
  ];

  return (
    <div className="min-h-screen">
      <style>
        {`
          @keyframes contactSuccessFadeIn {
            from {
              opacity: 0;
              transform: translateY(6px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
      {/* Hero Section */}
      <section className="relative text-white py-20 overflow-hidden">
         <video
    className="absolute inset-0 w-full h-full object-cover z-0"
    autoPlay
    muted
    loop
    playsInline
  >
    <source src={contactHero} type="video/mp4" />
  </video>

  {/* Black Overlay */}
  <div className="absolute inset-0 bg-black/60 z-10"></div>
  {/* You can adjust opacity: bg-black/30, bg-black/40, bg-black/70 */}

  {/* Content */}
  <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center hero-content">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Contact <span className="text-[#ffbe01]">Us</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              Ready to transform your construction business? Let's talk about how Vconstech can help.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20 bg-white animate-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold text-black mb-6">Get Demo</h2>
              <p className="text-gray-600 mb-8">
                Fill out the form below and we'll get back to you within 24 hours.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      // required
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-[#ffbe01] focus:border-[#ffbe01] transition-colors duration-200"
                      placeholder="John Doe"
                    />  {errors.fullName && ( <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>)}

                  </div>
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-[#ffbe01] focus:border-[#ffbe01] transition-colors duration-200"
                      placeholder="ABC Construction"
                    />
                    {errors.company && ( <p className="text-red-500 text-sm mt-1">{errors.company}</p>)}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                  <input
  type="tel"
  id="phone"
  name="phone"
  value={formData.phone}
  onChange={handleChange}
  maxLength={10}
  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-[#ffbe01] focus:border-[#ffbe01]"
  placeholder="10 digit mobile number"
/>

{errors.phone && (
  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
)}

                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      // required
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-[#ffbe01] focus:border-[#ffbe01] transition-colors duration-200"
                      placeholder="john@gmail.com"
                    />
                    {errors.email && ( <p className="text-red-500 text-sm mt-1">{errors.email}</p>)}

                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-[#ffbe01] focus:border-[#ffbe01] transition-colors duration-200"
                      placeholder="Tirunelveli"
                    />
                  </div>
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-[#ffbe01] focus:border-[#ffbe01] transition-colors duration-200"
                      placeholder="Site or office address"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-2">
                    Requirements
                  </label>
                  <textarea
                    id="requirements"
                    name="requirements"
                    value={formData.requirements}
                    onChange={handleChange}
                    // required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-[#ffbe01] focus:border-[#ffbe01] transition-colors duration-200 resize-none"
                    placeholder="Tell us about your construction project requirements..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#ffbe01] text-black py-3 px-6 rounded-md font-semibold text-lg hover:bg-yellow-400 transition-colors duration-200"
                >
                  Book Live Demo
                </button>
                {showSuccessMessage ? (
                  <div className="animate-[contactSuccessFadeIn_0.25s_ease-out] rounded-lg border border-green-200 bg-green-50 px-4 py-4 text-center text-green-800">
                    <CheckCircle className="mx-auto mb-2 h-6 w-6 text-green-600" />
                    <p className="font-semibold">Demo request submitted successfully!</p>
                    <p className="mt-1 text-sm text-green-700">
                      Our team will contact you within 24 hours to schedule your live ERP demo.
                    </p>
                  </div>
                ) : submitErrorMessage ? (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-4 text-center text-red-800">
                    <AlertCircle className="mx-auto mb-2 h-6 w-6 text-red-600" />
                    <p className="text-sm font-medium">{submitErrorMessage}</p>
                  </div>
                ) : (
                  <p className="text-center text-sm text-gray-400">
                    Our team will contact you shortly after your demo request.
                  </p>
                )}
              </form>
            </div>

            {/* Contact Information - Right side: ERP demo showcase only */}
            <div>
              <div className="sticky top-8">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-5 md:p-6">
                  <div className="text-center mb-4">
                    <h2 className="text-2xl md:text-3xl font-bold text-black mb-3">
                      Watch Vconstech ERP in Action
                    </h2>
                    <p className="text-gray-600 leading-relaxed">
                      See how Vconstech ERP simplifies Construction Project Management with powerful features for Project Management, Material Management, Labour Management, Financial Management, Contract Management and more.
                    </p>
                  </div>

                  <a
                    href={erpDemoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Watch Vconstech ERP demo on YouTube"
                    className="group relative block overflow-hidden rounded-2xl shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                  >
                    <img
                      src={erpDemoThumbnail}
                      alt="Vconstech ERP demo video thumbnail"
                      className="h-40 w-full object-cover transition-transform duration-500 group-hover:scale-105 sm:h-44 md:h-48"
                    />
                    <div className="absolute inset-0 bg-black/10 transition-colors duration-300 group-hover:bg-black/20"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-red-600 text-white shadow-xl transition-transform duration-300 group-hover:scale-110 md:h-16 md:w-16">
                        <Play className="ml-1 h-7 w-7 fill-current md:h-8 md:w-8" />
                      </span>
                    </div>
                  </a>

                  <div className="mt-4 text-center">
                    <a
                      href={erpDemoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 text-base font-semibold text-black transition-colors duration-200 hover:text-[#ffbe01]"
                    >
                      <Youtube className="h-5 w-5 text-red-600" />
                      Watch Full ERP Demo
                    </a>
                  </div>

                  <div className="mt-3 flex justify-center">
                    <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700">
                      <Clock className="h-4 w-4 text-[#ffbe01]" />
                      Duration: 2 Minutes
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {erpHighlights.map((highlight) => (
                      <div key={highlight} className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 text-sm font-medium text-gray-800">
                        <CheckCircle className="h-4 w-4 flex-shrink-0 text-[#ffbe01]" />
                        <span>{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>   
            </div>
          </div>

          {/* 4-Column Contact Info Bar */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-8 border-t border-gray-200 pt-12">
            
            {/* Col 1: Heading */}
            <div className="flex flex-col justify-center">
              <h2 className="text-2xl font-bold text-black leading-tight">
                Contact <span className="text-[#ffbe01]">Information</span>
              </h2>
              <p className="text-gray-500 text-sm mt-3">
                Prefer to reach out directly? Here are our details.
              </p>
            </div>

            {/* Col 2: Phone */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-[#ffbe01]/10 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-[#ffbe01]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">Phone</h3>
                <p className="text-gray-800 font-semibold">+91 90954 22237</p>
                <p className="text-gray-500 text-sm mt-1">Available 24/7</p>
              </div>
            </div>

            {/* Col 3: Email */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-[#ffbe01]/10 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-[#ffbe01]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">Email</h3>
                <p className="text-gray-800 font-semibold break-all">vconstecherp@gmail.com</p>
                <p className="text-gray-500 text-sm mt-1">Reply within 24 hours</p>
              </div>
            </div>

            {/* Col 4: Address */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-[#ffbe01]/10 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-[#ffbe01]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">Office</h3>
                <p className="text-gray-800 font-semibold">Vannarapettai, Tirunelveli.</p>
                <p className="text-gray-800 font-semibold">Tamilnadu - 627002, India.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Contact;
