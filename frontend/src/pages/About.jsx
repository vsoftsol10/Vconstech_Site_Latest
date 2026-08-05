import heroVideo from '../assets/abouthero.mp4';

import timeImage from "../assets/3.png";
import Service24 from "../assets/Service24.jpg"
import ideas from "../assets/ideas.png";
import SaveMoney from "../assets/weight_7448974.png";
import hours24 from "../assets/24-hours_6021109.png";
import timeManagement from "../assets/time-management_8251971.png";
import cyber from "../assets/cyber-security_10429893.png";
import engineer from "../assets/engineer_11773950.png";
import { NavLink } from "react-router-dom";
import StoryGif from '../assets/mobile 2.gif';
import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const About = () => {
  gsap.registerPlugin(ScrollTrigger);

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

 const features = [
    {
      icon: "🏗️",
      title: "Project Management",
      description: "Comprehensive project lifecycle management from planning to completion with real-time tracking."
    },
    {
      icon: "💰",
      title: "Financial Control",
      description: "Advanced cost tracking, budgeting, invoicing, and financial reporting for complete visibility."
    },
    {
      icon: "👥",
      title: "Team Collaboration",
      description: "Seamless communication and coordination between contractors, suppliers, and stakeholders."
    },
    {
      icon: "📊",
      title: "Analytics & Reporting",
      description: "Powerful dashboards and reports to track performance, profitability, and project metrics."
    },
    {
      icon: "📱",
      title: "Mobile Access",
      description: "Full platform access on mobile devices for on-site management and real-time updates."
    },
    {
      icon: "🔒",
      title: "Security & Compliance",
      description: "Bank-level security with compliance features for construction industry standards."
    }
  ];

  const commitments = [
    {
      icon: (
        <svg className="w-8 h-8 text-[#ffbe01]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Quality Assurance",
      description: "Rigorous testing and quality control to ensure reliable, error-free software performance."
    },
    {
      icon: (
        <svg className="w-8 h-8 text-[#ffbe01]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "24/7 Priority Support",
      description: "Dedicated round-the-clock technical support with construction industry specialists. Get instant help whenever you need it, ensuring your projects never stop."
    },
    {
      icon: (
        <svg className="w-8 h-8 text-[#ffbe01]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 7V3a2 2 0 012-2z" />
        </svg>
      ),
      title: "Continuous Innovation",
      description: "Regular updates and new features based on industry feedback and technological advancements."
    }
  ];

  return (


    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative text-white py-20 overflow-hidden">
        {/* Background Video */}
        <video
          className="absolute inset-0 w-full h-full object-cover z-0"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src={heroVideo} type="video/mp4" />
        </video>

        {/* Black Overlay */}
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        {/* You can adjust opacity: bg-black/30, bg-black/40, bg-black/70 */}

        {/* Content */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center hero-content">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About <span className="text-[#ffbe01]">Vconstech</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-4xl mx-auto">
              To empower construction businesses with smart technology that saves time, reduces errors, and improves decision-making.
            </p>
          </div>
        </div>
      </section>

      {/* Who We Are Section */}
      <section className="py-20 bg-white animate-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-black mb-6">
                Who We Are
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Vconstech is a leading provider of construction ERP software, dedicated to transforming how construction businesses operate.
                Founded in 2018, we've grown from a small startup to a trusted partner for construction professionals across the industry.
              </p>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Our team combines deep construction industry expertise with cutting-edge technology to deliver solutions that
                truly understand and serve the unique needs of building developers, contractors, and interior designers.
              </p>
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="flex flex-col md:flex-row items-center gap-6">
  
              {/* Image */}
              <div className="h-40 w-40 flex justify-center md:items-start">
               <img
               src={Service24}
               alt="24/7 service"
               className="h-full w-full object-contain"
                />
             </div>

                 {/* Text */}
                 <div className="text-center md:text-left py-6">
                  <div className="text-3xl font-bold text-[#ffbe01] mb-2">24/7</div>
                   <div className="text-lg font-semibold text-gray-800 mb-2">
                      Support Commitment
                    </div>
                 <p className="text-gray-600 text-sm">
                     Round-the-clock expert assistance whenever you need it
                     </p>
                </div>

                </div>

              </div>
            </div>
            <div className="relative rounded-lg overflow-hidden shadow-lg">
              <img
                src={StoryGif}
                alt="Our Story"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="py-20 bg-yellow-100 animate-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
              What We Do
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive construction ERP solutions designed to streamline every aspect of your business operations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="text-5xl mb-6 text-center">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-black mb-4 text-center">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-center">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20 bg-white animate-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-gradient-to-br from-[#ffbe01] to-yellow-400 p-8 rounded-lg text-black">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Our Vision
              </h2>
              <p className="text-lg mb-6 leading-relaxed">
                To become the most trusted and comprehensive construction technology platform globally,
                revolutionizing how construction businesses operate and succeed.
              </p>
              <p className="text-lg leading-relaxed">
                We envision a construction industry where technology eliminates inefficiencies,
                enhances collaboration, and enables every stakeholder to make data-driven decisions
                that lead to better outcomes and greater profitability.
              </p>
            </div>

            <div className="bg-gray-900 text-white p-8 rounded-lg">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Our Mission
              </h2>
              <p className="text-lg mb-6 leading-relaxed">
                To empower construction businesses with smart technology that saves time, reduces errors,
                and improves decision-making.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-[#ffbe01] text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-1">✓</div>
                  <p>Streamline complex workflows and eliminate manual processes</p>
                </div>
                <div className="flex items-start">
                  <div className="bg-[#ffbe01] text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-1">✓</div>
                  <p>Provide real-time visibility into project performance and finances</p>
                </div>
                <div className="flex items-start">
                  <div className="bg-[#ffbe01] text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-1">✓</div>
                  <p>Enable data-driven decision making for better business outcomes</p>
                </div>
                <div className="flex items-start">
                  <div className="bg-[#ffbe01] text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-1">✓</div>
                  <p>Support sustainable growth and scalability for construction businesses</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Vconstech Section */}
      <section className="py-20 bg-yellow-100 animate-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
              Why Choose Vconstech?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              What sets us apart in the construction technology landscape.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-start">
                  <img src={engineer} className=" text-black rounded-full w-10 h-10 flex items-center justify-center font-bold mr-4"/>
                  <div>
                    <h3 className="text-lg font-semibold text-black mb-2">Industry-Specific Expertise</h3>
                    <p className="text-gray-600">Built exclusively for construction, Vconstech understands industry workflows and challenges better than generic software.</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-start">
                  <img src={timeManagement} className=" text-black rounded-full w-10 h-10 flex items-center justify-center font-bold mr-4"/>
                  <div>
                    <h3 className="text-lg font-semibold text-black mb-2">Rapid Implementation</h3>
                    <p className="text-gray-600">Get up and running quickly with our streamlined onboarding process and comprehensive training programs.</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-start">
                  <img src={SaveMoney} className=" text-black rounded-full w-10 h-10 flex items-center justify-center font-bold mr-4"/>
                  <div>
                    <h3 className="text-lg font-semibold text-black mb-2">Proven ROI</h3>
                    <p className="text-gray-600">Measurable returns on investment with cost savings, efficiency gains, and improved project profitability.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-start">
                  <img src={cyber} className=" text-black rounded-full w-10 h-10 flex items-center justify-center font-bold mr-4"/>
                  <div>
                    <h3 className="text-lg font-semibold text-black mb-2">Enterprise Security</h3>
                    <p className="text-gray-600">Bank-level security with encryption, compliance certifications, and robust data protection measures.</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md ">
                <div className="flex items-start">
                  <img src={hours24} className=" text-black rounded-full w-10 h-10 flex items-center jus6ify-center font-bold mr-4"/>
                  <div>
                    <h3 className="text-lg font-semibold text-black mb-2">24/7 Priority Support</h3>
                    <p className="text-gray-600">24/7 expert support from construction specialists ensures you never face technical challenges alone.</p>
                  </div>
                </div>      
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-start">
                  <img src={ideas} className="   w-12 h-12 flex items-center justify-center font-bold mr-4"/>
                  <div>
                    <h3 className="text-lg font-semibold text-black mb-2">Continuous Innovation</h3>
                    <p className="text-gray-600">Regular updates with new features based on user feedback and industry advancements.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Commitment Section */}
      <section className="py-20 bg-white animate-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
              Our Commitment
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're committed to your success with unwavering dedication to quality, innovation, and customer satisfaction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 ">
            {commitments.map((commitment, index) => (
              <div key={index} className="bg-gray-50 p-8 rounded-lg shadow-lg text-center transform hover:scale-105 transition-transform duration-300">
                <div className="flex justify-center mb-6">
                  {commitment.icon}
                </div>
                <h3 className="text-xl font-semibold text-black mb-4">
                  {commitment.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {commitment.description}
                </p>
              </div>
            ))}
          </div>
            {/* join our community */}
           
           <div className="flex flex-col md:flex-row gap-8 mt-20">

             <div className="flex gap-4 w-full lg:w-1/2">
             <img src={timeImage} alt="24/7 Expert Support" className='object-cover w-full h-76 rounded-2xl'></img>
             </div>
          <div className="text-center ">
            <div className="bg-gradient-to-r from-gray-100 to-gray-200 p-8 rounded-2xl max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold text-black mb-4">Join Our Growing Community</h3>
              <p className="text-gray-700 mb-6">
                Over 50 construction companies trust Vconstech to power their business operations.
                Join them today and experience the difference that industry-leading ERP software can make.
              </p>
              <div className="text-center">
                <div className="inline-flex items-center justify-center bg-[#ffbe01] text-black px-8 py-4 rounded-full">
                  <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <span className="text-xl font-bold">24/7 Expert Support</span>
                </div>
                <p className="text-gray-700 mt-4 max-w-md mx-auto">
                  Our dedicated support team is available around the clock to help you succeed with Vconstech.
                </p>
              </div>
            </div>
          </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-black text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Construction Business?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join the growing community of construction professionals who trust Vconstech to power their success.
            Experience the difference that smart technology makes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="bg-[#ffbe01] text-black px-8 py-3 rounded-md font-semibold text-lg hover:bg-yellow-400 transition-colors duration-200 inline-block"
            >
              Start Your Journey
            </a>
            <a
              href="/pricing"
              className="border-2 border-[#ffbe01] text-[#ffbe01] px-8 py-3 rounded-md font-semibold text-lg hover:bg-[#ffbe01] hover:text-black transition-colors duration-200 inline-block"
            >
              View Pricing
            </a>
          </div>
        </div>
      </section>
    </div>
  );  
};

export default About;
