import React, { useEffect } from 'react';
import { useLocation, NavLink } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';
import builders from '../assets/builders-1.webp';
import designers from '../assets/interior-1.webp';
import Exteriors from '../assets/Interior&ExteriorWorks.webp';
import Architect from '../assets/Engineering&TechnicalServices.webp';
import Renovation from '../assets/Renovation&Remodeling.webp';
import Product from '../assets/Project & Support Services.webp';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const WeSupport = () => {
  const location = useLocation();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

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

    if (location.hash) {
      // Wait for DOM to be fully rendered before scrolling
      const timeoutId = setTimeout(() => {
        const element = document.getElementById(location.hash.substring(1));
        if (element) {
          // Get header height dynamically
          const header = document.querySelector('header');
          const headerHeight = header ? header.offsetHeight : 144; // fallback to max header height

          // Calculate the position to scroll to (element top - header height - some padding)
          const elementTop = element.getBoundingClientRect().top + window.pageYOffset;
          const offsetPosition = elementTop - headerHeight - 20; // 20px extra padding

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 100);

      return () => clearTimeout(timeoutId);
    } else {
      // If no hash, scroll to top
      window.scrollTo(0, 0);
    }
  }, [location]);

  const professionals = [
    {
      id: 'builders',
      title: 'Builders',
      challenges: [
        'Lack of real-time project visibility across multiple sites',
        'Cost overruns and delayed timelines',
        'Difficulty tracking materials and billing'
      ],
      solutions: [
        'Project live status dashboard for real-time visibility',
        'Integrated billing and financial management',
        'Material management with automated tracking'
      ],
      result: 'Complete project control, predictable outcomes, and on-time delivery.',
      image: builders,
      reverse: false
    },
    {
      id: 'design-planning',
      title: 'Design & Planning',
      challenges: [
        'Design files scattered across different platforms',
        'Client approvals and revisions poorly documented',
        'No clear link between design and project budget'
      ],
      solutions: [
        'Centralized file management for all design documents',
        'Project management tools for tracking approvals',
        'Financial management linked to design scope'
      ],
      result: 'Streamlined design workflow and better budget alignment.',
      image: designers,
      reverse: true
    },
    {
      id: 'interior-exterior',
      title: 'Interior & Exterior Works',
      challenges: [
        'Budget vs execution tracking is manual and error-prone',
        'Material procurement and inventory management gaps',
        'Billing and payment delays with vendors'
      ],
      solutions: [
        'Material management for procurement and stock control',
        'Financial management with automated billing',
        'Project live status for execution tracking'
      ],
      result: 'Accurate budgets, timely deliveries, and happier clients.',
      image: Exteriors,
      reverse: false
    },
    {
      id: 'engineering-technical',
      title: 'Engineering & Technical Services',
      challenges: [
        'Daily progress reporting is time-consuming',
        'Technical documents and drawings hard to access on-site',
        'Material usage and wastage not properly tracked'
      ],
      solutions: [
        'Project management with easy daily reporting',
        'File management for instant access to technical docs',
        'Material management with real-time usage tracking'
      ],
      result: 'Faster reporting, better documentation, and improved efficiency.',
      image: Architect,
      reverse: true
    },
    {
      id: 'renovation-remodeling',
      title: 'Renovation & Remodeling',
      challenges: [
        'Scope changes and variation orders create billing confusion',
        'Before/after documentation is incomplete',
        'Financial tracking becomes chaotic with changes'
      ],
      solutions: [
        'Billing management with flexible variation tracking',
        'File management for comprehensive documentation',
        'Financial management for clear cost control'
      ],
      result: 'Controlled scope changes and transparent client billing.',
      image: Renovation,
      reverse: false
    },
    {
      id: 'project-support',
      title: 'Project & Support Services',
      challenges: [
        'Manual labor and contractor payment tracking',
        'Expense reports and receipts are disorganized',
        'Poor coordination between office and site teams'
      ],
      solutions: [
        'Billing management with automated payroll and invoicing',
        'Financial management for expense tracking and reporting',
        'Project live status for team coordination'
      ],
      result: 'Efficient operations, on-time payments, and reduced administrative burden.',
      image: Product,
      reverse: true
    }
  ];

  const ProfessionalCard = ({ professional }) => {
    const { emoji, title, challenges, solutions, result, image, reverse } = professional;

    return (
      <div className={`flex flex-col ${reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-8 lg:gap-16 items-center mb-32`}>
        {/* Content Side */}
        <div className="flex-1 space-y-6">
          {/* Title */}
          <div className="flex items-center gap-3">
            {emoji && <span className="text-5xl">{emoji}</span>}
            <h3 className="text-4xl font-bold text-gray-900">{title}</h3>
          </div>

          {/* Challenges */}
          <div className="bg-gray-50 rounded-2xl p-6 border-2 border-gray-200">
            <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
              Challenges
            </h4>
            <ul className="space-y-3">
              {challenges.map((challenge, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-red-500 mt-1">✗</span>
                  <span className="text-gray-700">{challenge}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Solutions */}
          <div className="bg-yellow-50 rounded-2xl p-6 border-2 border-yellow-400">
            <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
              How We Fix It
            </h4>
            <ul className="space-y-3">
              {solutions.map((solution, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-800 font-medium">{solution}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Result */}
          <div className="bg-black text-white rounded-2xl p-6">
            <h4 className="text-sm font-semibold text-yellow-400 mb-2 uppercase tracking-wide">Result</h4>
            <p className="text-lg font-medium">{result}</p>
          </div>
        </div>

        {/* Image Side */}
        <div className="flex-1 w-full">
          <div className="relative">
            {/* Main Image */}
            <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-yellow-400">
              <img
                src={image}
                alt={title}
                className="w-full h-96 object-cover"
              />
            </div>
            {/* Decorative Element */}
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-yellow-400 rounded-full opacity-20 -z-10"></div>
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-black rounded-full opacity-10 -z-10"></div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-yellow-500 text-black py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6 hero-content">
            <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight">
              Services We Support
            </h1>
            <p className="text-2xl font-semibold max-w-4xl mx-auto">
              Comprehensive Solutions for Every Construction Need
            </p>
            <p className="text-lg max-w-3xl mx-auto text-gray-900">
              Our comprehensive ERP platform brings together project management, billing management, material management, financial tracking, file management, and live project status—all in one unified system to help construction teams deliver projects on time and within budget.
            </p>
          </div>
        </div>
      </div>

      {/* Professionals Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 animate-section">
        {professionals.map((professional) => (
          <div key={professional.id} id={professional.id} className="scroll-mt-40">
            <ProfessionalCard professional={professional} />
          </div>
        ))}
      </div>

      {/* CTA Section */}
      <div className="bg-yellow-500 text-black py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
            One Platform. Complete Service Coverage.
          </h2>
          
          <p className="text-xl max-w-2xl mx-auto">
            Whether you build, design, or manage, we provide the tools you need to deliver excellence at every stage.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <NavLink to="/contact" className="group bg-black hover:bg-gray-800 text-white px-10 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2">
              Get Started
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </NavLink>
            <button
              onClick={() => {
                // Dispatch custom event to open demo modal
                window.dispatchEvent(new CustomEvent('openDemoModal'));
              }}
              className="bg-white hover:bg-gray-100 text-black px-10 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 border-2 border-white">
              Schedule Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeSupport;