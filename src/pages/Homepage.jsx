import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import heroImg from '../assets/herobck.png';
import softwareErpImg from '../assets/software-Erp.webp';
import dashboardImg from '../assets/11.webp';
import mobileImg from '../assets/9.webp';
import reportsImg from '../assets/10.webp';
import contractorImg from '../assets/contractorCard.jpg';
import interiorImg from '../assets/interiorCard.jpg';
import ownerImg from '../assets/builders-1.webp';
import Time1 from '../assets/Time1.jpg'; // adjust path as needed
import digital from "../assets/digital.jpg";
import costoverruns from "../assets/costoverruns.jpg";
import MobileGif from "../assets/mobile 1.gif";
import sketch from "../assets/pointing-sketch.jpg"
import woman from "../assets/woman-working-as-engineer.jpg"
import project from "../assets/project.webp"
import BillingManagement from "../assets/Billing Management.webp";
import ProjectPlanning from "../assets/Construction.webp";
import ResourceManagement from "../assets/project-management.jpg";
import CostEstimation from "../assets/Cost Estimation.webp";
import ReportingAnalytics from "../assets/Reporting & Analytics.webp";

const Homepage = () => {
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
      icon: (
        <svg className="w-12 h-12 text-[#000]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      title: "Project Management",
      description: "Complete project lifecycle management from planning to completion with real-time tracking and reporting."
    },
    {
      icon: (
        <svg className="w-12 h-12 text-[#000]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Cost Control",
      description: "Monitor budgets, track expenses, and manage costs effectively across all your construction projects."
    },
    {
      icon: (
        <svg className="w-12 h-12 text-[#000]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: "Team Collaboration",
      description: "Seamless communication and collaboration between all stakeholders including contractors, suppliers, and clients."
    },
    {
      icon: (
        <svg className="w-12 h-12 text-[#000]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3v18h18" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 14l3-3 4 4 5-6" />
        </svg>

      ),
      title: "Financial Management",
      description: "Comprehensive financial tracking, invoicing, payment processing, and financial reporting for construction projects."
    },
    {
      icon: (
        <svg className="w-12 h-12 text-[#000]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      title: "Labour Management",
      description: "Efficient workforce planning, time tracking, productivity monitoring, and labor cost optimization."
    },
    {
      icon: (
        <svg className="w-12 h-12 text-[#000]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      title: "Material Control",
      description: "Inventory management, material procurement, supplier coordination, and material usage tracking."
    },
  ];


  const solutions = [
    {
      id: "project-planning",
      image: ProjectPlanning,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth={1.8}>
          <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" strokeLinecap="round" />
          <rect x="9" y="3" width="6" height="4" rx="1" />
          <path d="M9 12h6M9 16h4" strokeLinecap="round" />
        </svg>
      ),
      label: "Project Planning",
      tagline: "Intelligent scheduling & milestone tracking",
      description:
        "Plan every phase of your construction project with AI-driven scheduling tools. Set milestones, assign teams, and track progress in real time - all from a single intuitive dashboard.",
      capabilities: [
        "Smart Gantt chart builder",
        "Milestone & deadline alerts",
        "Team workload balancing",
        "Critical path analysis",
        "Version-controlled project plans",
      ],
    },
    {
      id: "resource-management",
      image: ResourceManagement,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth={1.8}>
          <rect x="1" y="3" width="15" height="13" rx="2" />
          <path d="M16 8h4a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2v-3" strokeLinecap="round" />
          <circle cx="8.5" cy="9.5" r="1.5" />
        </svg>
      ),
      label: "Resource Management",
      tagline: "Optimize materials, equipment & labor",
      description:
        "Eliminate waste and maximize efficiency by managing all your construction resources in one place. Track inventory, allocate equipment, and schedule your workforce with precision.",
      capabilities: [
        "Real-time inventory tracking",
        "Equipment utilization reports",
        "Labor scheduling & shift management",
        "Supplier & vendor management",
        "Material requisition workflows",
      ],
    },
    {
      id: "cost-estimation",
      image: CostEstimation,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth={1.8}>
          <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" strokeLinecap="round" strokeLinejoin="round" />
          <polyline points="16 7 22 7 22 13" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      label: "Cost Estimation",
      tagline: "AI-powered budgeting & forecasting",
      description:
        "Generate accurate project estimates using historical data and AI forecasting. Catch budget overruns before they happen and keep your financial plan aligned with reality throughout the build.",
      capabilities: [
        "Automated quantity take-off",
        "AI-driven cost forecasting",
        "Budget vs. actual comparison",
        "Change order impact analysis",
        "Exportable cost reports",
      ],
    },
    {
      id: "billing-management",
      image: BillingManagement,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth={1.8}>
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" strokeLinecap="round" strokeLinejoin="round" />
          <polyline points="14 2 14 8 20 8" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="12" y1="18" x2="12" y2="12" strokeLinecap="round" />
          <line x1="9" y1="15" x2="15" y2="15" strokeLinecap="round" />
        </svg>
      ),
      label: "Billing Management",
      tagline: "Automated invoicing & payment tracking",
      description:
        "Streamline invoicing, payment tracking, and financial reconciliation with automated billing workflows. Reduce delays, eliminate manual errors, and keep your cash flow healthy.",
      capabilities: [
        "Automated invoice generation",
        "Payment tracking & reminders",
        "Multi-currency support",
        "Financial reconciliation dashboard",
        "Client payment portals",
      ],
    },
    {
      id: "reporting-analytics",
      image: ReportingAnalytics,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth={1.8}>
          <path d="M18 20V10M12 20V4M6 20v-6" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="18" cy="7" r="2" />
          <circle cx="12" cy="2" r="2" />
          <circle cx="6" cy="12" r="2" />
        </svg>
      ),
      label: "Reporting & Analytics",
      tagline: "Custom dashboards & predictive insights",
      description:
        "Turn raw project data into actionable intelligence. Build custom dashboards, run predictive analytics, and share executive-ready reports with stakeholders - all in real time.",
      capabilities: [
        "Drag-and-drop dashboard builder",
        "Predictive completion forecasting",
        "KPI monitoring & alerts",
        "Cross-project benchmarking",
        "Automated report scheduling",
      ],
    },
  ];
  const [activeId, setActiveId] = useState("billing-management");
  const active = solutions.find((f) => f.id === activeId);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative text-white py-20 sm:py-28 md:py-36 lg:py-44 xl:py-52 overflow-hidden flex items-center min-h-[60vh] sm:min-h-[70vh] md:min-h-[80vh]">
        {/* Desktop Background Image */}
        <img
          src={heroImg}
          alt="Background"
          className="
    absolute inset-0 w-full h-full
    object-cover
    object-[50%_20%]
    z-0
    hidden md:block
  "
        />

        {/* Mobile Background GIF */}
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-no-repeat z-0 block md:hidden bg-[position:15%_center]"
          style={{ backgroundImage: `url(${MobileGif})` }}
        ></div>
      </section>

      {/* <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-black mb-8 sm:mb-12">
            Designed for Construction Professionals
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[ownerImg, contractorImg, interiorImg, sketch, woman, project].map((img, i) => (
              <div key={i} className="relative rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden group cursor-pointer">
                <img src={img} alt="" className="w-full h-48 sm:h-56 md:h-64 object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-all duration-500 flex items-center justify-center">
                  <div className="text-center text-white transform translate-y-4 group-hover:translate-y-0 group-focus-within:translate-y-0 transition-transform duration-500 p-4 sm:p-6">
                    <div className="text-xl sm:text-2xl md:text-3xl font-bold text-[#ffbe01] mb-2 sm:mb-4">
                      {i === 0 ? "Builders" : i === 1 ? "Design & Planning" : i === 2 ? "Interio  r & Exterior Works" : i === 3 ? "Engineering & Technical Services" : i === 4 ? "Renovation & Remodeling" : "Project & Support Services"}
                    </div>
                    <div className="text-white text-xs sm:text-sm md:text-base leading-relaxed">
                      {
                        i === 0 ? "Civil Contractors, Construction Company, Real Estate Developers, Infrastructure Developers"
                          : i === 1 ? "Architectural Consultants, Structural Engineers, Planning Consultants, Urban Designer"
                            : i === 2 ? "Interior Decorators, Turnkey Interiors, Modular Kitchen Designers, False Ceiling Contractors, Exterior Designers"
                              : i === 3 ? "Electrical Contractors, Plumbing Contractors, HVAC Contractors, Mechanical & Electrical (M&E) Services, Fire & Safety System Contractors,Specialized Construction Services"
                                : i === 4 ? "Waterproofing Contractors, Flooring Contractors, Painting Contractors, Aluminium & Glass Fabricators, Steel Fabricators"
                                  : "Project Management Consultants,Quantity Surveyors,Construction Consultants,Site Supervisors,Valuation Engineers"
                      }
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Features Section */}
      {/* <section className="py-12 sm:py-16 md:py-20 bg-yellow-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-4">
            Powerful Features for Construction Professionals
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8 sm:mb-12 md:mb-16">
            Everything you need to manage your construction projects efficiently and effectively.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 sm:p-8 rounded-lg shadow-lg h-full flex flex-col">
                <div className="mb-3 sm:mb-4">{feature.icon}</div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-black mb-3 sm:mb-4 flex-grow">{feature.title}</h3>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Why Choose Vconstech Section */}
      {/* <section className="py-8 sm:py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-4">
            Why Choose <span className="text-[#ffbe01]">Vconstech</span>?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8 sm:mb-12 md:mb-16">
            Addressing the biggest challenges in construction management with proven solutions that save time, reduce costs, and boost profitability.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8"> */}
      {/* Card 1 */}
      {/* <div className="bg-yellow-200 p-4 sm:p-6 md:p-8 rounded-lg">
              <img src={Time1} alt="Project Delays" className="max-w-20 sm:max-w-24 md:max-w-32 lg:max-w-36 mx-auto transition-transform duration-300 ease-in-out transform hover:scale-105 mb-3 sm:mb-4" />
              <h3 className="text-lg sm:text-xl font-bold  mb-2">Project Delays</h3>
              <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 font-medium">Common construction challenge</p>
              <h4 className="text-base sm:text-lg font-semibold  mb-2">Vconstech Solution</h4>
              <p className="text-gray-600 text-center text-sm sm:text-base leading-relaxed">
                Real-time project tracking, automated progress updates, and intelligent scheduling prevent delays and ensure projects stay on track with 98% on-time delivery rate.
              </p>
            </div> */}

      {/* Card 2 */}
      {/* <div className="bg-yellow-200 p-4 sm:p-6 md:p-8 rounded-lg">
              <img src={costoverruns} alt="Project Delays" className="max-w-20 sm:max-w-24 md:max-w-32 lg:max-w-36 mx-auto h-fit transition-transform duration-300 ease-in-out transform hover:scale-105 mb-3 sm:mb-4" />
              <h3 className="text-lg sm:text-xl font-bold  mb-2 ">Cost Overruns</h3>
              <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 font-medium">Budget management nightmare</p>
              <h4 className="text-base sm:text-lg font-semibold  mb-2">Vconstech Solution</h4>
              <p className="text-gray-600 text-center text-sm sm:text-base leading-relaxed">
                Advanced cost tracking, budget forecasting, and material cost optimization
                help you stay within budget and maximize profitability on every project.
              </p>
            </div> */}

      {/* Card 3 */}
      {/* <div className="bg-yellow-200 p-4 sm:p-6 md:p-8 rounded-lg">
              <img src={digital} alt="Project Delays" className="max-w-20 sm:max-w-24 md:max-w-32 lg:max-w-36 mx-auto transition-transform duration-300 ease-in-out transform hover:scale-105 mb-3 sm:mb-4" />
              <h3 className="text-lg sm:text-xl font-bold  mb-2">Manual Paperwork</h3>
              <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 font-medium">Time-consuming documentation</p>
              <h4 className="text-base sm:text-lg font-semibold  mb-2">Vconstech Solution</h4>
              <p className="text-gray-600 text-center text-sm sm:text-base leading-relaxed">
                Digital documentation, automated reporting, and cloud-based file management
                eliminate paperwork hassles and ensure compliance with industry standards.
              </p>
            </div>

          </div>
        </div>
      </section> */}

      <section className="bg-white py-16 px-4 sm:px-6 lg:px-10 font-sans animate-section">
        {/* Header */}
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-3">
            Comprehensive Solutions For Modern Construction
          </h2>
          <p className="text-gray-500 text-base sm:text-lg leading-relaxed">
            Powerful tools designed to transform every aspect of your project lifecycle
          </p>
        </div>

        {/* Feature Cards Row */}
        <div className="flex flex-nowrap overflow-x-auto gap-3 sm:gap-4 pb-2 mb-8 justify-start sm:justify-center scrollbar-hide">
          {solutions.map((f) => {
            const isActive = f.id === activeId;
            return (
              <button
                key={f.id}
                onClick={() => setActiveId(f.id)}
                className={`
                flex-shrink-0 flex flex-col items-center text-center rounded-2xl px-4 py-5 w-36 sm:w-40 transition-all duration-200 border-2 cursor-pointer
                ${isActive
                    ? "border-amber-400 bg-white shadow-md"
                    : "border-transparent bg-yellow-400 hover:bg-gray-50 hover:border-gray-200"
                  }
              `}
              >
                <div
                  className={`
                  flex items-center justify-center w-14 h-14 rounded-xl mb-3 transition-colors duration-200
                  ${isActive ? "bg-yellow-400 text-black" : "bg-amber-100 text-amber-500"}
                `}
                >
                  {f.icon}
                </div>
                <span className="text-sm font-semibold text-gray-800 leading-snug">{f.label}</span>
              </button>
            );
          })}
        </div>

        {/* Detail Panel */}
        {active && (
          <div className="max-w-5xl mx-auto bg-gray-50 rounded-3xl overflow-hidden shadow-sm border border-gray-100">
            <div className="flex flex-col md:flex-row">
              {/* Left: Text */}
              <div className="flex-1 p-8 sm:p-10">
                <h3 className="text-2xl sm:text-3xl font-bold text-amber-500 mb-3">{active.label}</h3>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-6 max-w-md">
                  {active.description}
                </p>
                <p className="font-semibold text-gray-800 mb-4 text-sm sm:text-base">Key Capabilities:</p>
                <ul className="space-y-3">
                  {active.capabilities.map((cap) => (
                    <li key={cap} className="flex items-center gap-3">
                      <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-amber-400">
                        <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                          <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                      <span className="text-gray-700 text-sm sm:text-base">{cap}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Right: Visual */}
              <div className="md:w-80 lg:w-96 flex-shrink-0 rounded-b-3xl md:rounded-b-none md:rounded-r-3xl overflow-hidden min-h-56 sm:min-h-64 md:min-h-0 md:self-stretch">
                <img
                  src={active.image}
                  alt={active.label}
                  className="w-full h-full object-cover"
                  style={{ minHeight: '100%', display: 'block' }}
                />
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Who It's For Section */}
      <section className="py-8 sm:py-12 md:py-16 bg-yellow-200 animate-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-4">
              Who can use Vconstech For?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Built for construction professionals who demand excellence and efficiency in their operations.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12" >
            <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg" >
              <div className="flex items-center mb-4 sm:mb-6">
                <div className="bg-[#ffbe01] p-2 sm:p-3 rounded-full mr-3 sm:mr-4 flex-shrink-0">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-black">Building Developers</h3>
              </div>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-4">
                Large-scale developers managing multiple projects simultaneously need comprehensive
                oversight and control over their entire portfolio.
              </p>
              <ul className="text-gray-600 text-sm sm:text-base space-y-2">
                <li>• Multi-project portfolio management</li>
                <li>• Regulatory compliance tracking</li>
                <li>• Stakeholder communication</li>
                <li>• Risk management and mitigation</li>
              </ul>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg">
              <div className="flex items-center mb-4 sm:mb-6">
                <div className="bg-[#ffbe01] p-2 sm:p-3 rounded-full mr-3 sm:mr-4 flex-shrink-0">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-black">Contractors & Subcontractors</h3>
              </div>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-4">
                General contractors and subcontractors managing complex projects with multiple
                stakeholders and tight deadlines.
              </p>
              <ul className="text-gray-600 text-sm sm:text-base space-y-2">
                <li>• Project scheduling and coordination</li>
                <li>• Subcontractor management</li>
                <li>• Quality control and compliance</li>
                <li>• Resource allocation optimization</li>
              </ul>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg">
              <div className="flex items-center mb-4 sm:mb-6">
                <div className="bg-[#ffbe01] p-2 sm:p-3 rounded-full mr-3 sm:mr-4 flex-shrink-0">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-black">Interior Designers</h3>
              </div>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-4">
                Interior design firms managing client relationships, design projects,
                and material specifications with precision.
              </p>
              <ul className="text-gray-600 text-sm sm:text-base space-y-2">
                <li>• Client project management</li>
                <li>• Design specification tracking</li>
                <li>• Material and vendor coordination</li>
                <li>• Timeline and budget management</li>
              </ul>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg">
              <div className="flex items-center mb-4 sm:mb-6">
                <div className="bg-[#ffbe01] p-2 sm:p-3 rounded-full mr-3 sm:mr-4 flex-shrink-0">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
                    <polyline points="17,21 17,13 7,13 7,21" />
                    <polyline points="7,3 7,8 15,8" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-black">Construction Managers</h3>
              </div>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-4">
                Project managers and construction managers overseeing multiple sites,
                teams, and complex project requirements.
              </p>
              <ul className="text-gray-600 text-sm sm:text-base space-y-2">
                <li>• Multi-site project oversight</li>
                <li>• Team coordination and communication</li>
                <li>• Safety and compliance monitoring</li>
                <li>• Performance tracking and reporting</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Importance Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-white animate-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-4">
              The Importance of <span className="text-[#ffbe01]">Vconstech</span> for Your Construction Business
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              In today's competitive construction market, efficiency and accuracy are not just advantages-they're necessities.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-black mb-4 sm:mb-6">Transform Your Operations</h3>
              <div className="space-y-4 sm:space-y-6">

                <div className="flex items-start">
                  <div className="bg-[#ffbe01] p-2 rounded-full mr-3 sm:mr-4 flex-shrink-0">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-base sm:text-lg font-semibold text-black mb-2">Reduce Operational Costs by 30%</h4>
                    <p className="text-gray-600 text-sm sm:text-base">Eliminate manual processes, reduce errors, and optimize resource allocation across all projects.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-[#ffbe01] p-2 rounded-full mr-3 sm:mr-4 flex-shrink-0">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-base sm:text-lg font-semibold text-black mb-2">Improve Project Delivery by 40%</h4>
                    <p className="text-gray-600 text-sm sm:text-base">Streamline workflows, improve coordination, and deliver projects on time and within budget.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-[#ffbe01] p-2 rounded-full mr-3 sm:mr-4 flex-shrink-0">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-base sm:text-lg font-semibold text-black mb-2">Increase Profitability</h4>
                    <p className="text-gray-600 text-sm sm:text-base">Make data-driven decisions with comprehensive analytics and reporting tools.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-8 sm:p-12 md:p-16 lg:p-20 rounded-lg">
              <div className="text-center">
                <img
                  src={softwareErpImg}
                  alt="Vconstech ERP Software Interface"
                  className="w-full h-auto rounded-lg shadow-lg max-w-2xl mx-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Site Tracking Preview Section */}
      <section className="py-8 sm:py-10 md:py-12 bg-white animate-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-4">
              Get Real-Time Visibility of Your Entire Project
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-6 sm:mb-8">
              From materials to manpower - track everything instantly with our user-friendly dashboard that's easy to access anytime, anywhere.
            </p>
          </div>

          {/* Mobile Phone Style Previews */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 md:gap-12 max-w-7xl mx-auto">
            {/* Dashboard Preview - Mobile Style */}
            <div className="flex flex-col items-center">
              {/* Phone Frame */}
              <div className="relative">
                {/* Screen Content */}
                <div className="relative bg-white">
                  <img
                    src={dashboardImg}
                    alt="Vconstech Live Dashboard"
                    className="w-full h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] xl:h-[450px] object-cover"
                  />
                </div>
              </div>

              {/* Title */}
              <div className="text-center mt-6">
                <h3 className="text-xl font-bold text-black mb-2">Live Dashboard</h3>
                <p className="text-gray-600 text-sm max-w-xs">Real-time project monitoring and instant updates</p>
              </div>
            </div>

            {/* Reports Preview - Mobile Style */}
            <div className="flex flex-col items-center">
              {/* Phone Frame */}
              <div className="relative">
                {/* Screen Content */}
                <div className="relative bg-white">
                  <img
                    src={reportsImg}
                    alt="Vconstech Reports Dashboard"
                    className="w-full h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] xl:h-[450px] object-cover"
                  />
                </div>
              </div>
              {/* Title */}
              <div className="text-center mt-6">
                <h3 className="text-xl font-bold text-black mb-2">Flexible Pricing Plans</h3>
                <p className="text-gray-600 text-sm max-w-xs">Affordable plans tailored for every stage of your business</p>
              </div>
            </div>

            {/* Mobile Access Preview - Mobile Style */}
            <div className="flex flex-col items-center">
            {/* Phone Frame */}
            <div className="relative">
              <div className="relative bg-white">
                <img
                  src={mobileImg}
                  alt="Vconstech Mobile Interface"
                   className="w-full h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] xl:h-[450px] object-cover"
                />
              </div>
              {/* Title */}
              <div className="text-center mt-6">
                <h3 className="text-xl font-bold text-black mb-2">Mobile Access</h3>
                <p className="text-gray-600 text-sm max-w-xs">Access your projects anywhere, anytime</p>
              </div>
            </div>
          </div>
          </div>

          {/* Simple Benefits */}
          <div className="text-center mt-8 sm:mt-12 md:mt-16">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="bg-[#ffbe01] w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 shadow-lg">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-black text-xs sm:text-sm">Lightning Fast</h4>
              </div>

              <div className="text-center">
                <div className="bg-[#ffbe01] w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 shadow-lg">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-black text-xs sm:text-sm">Mobile Ready</h4>
              </div>

              <div className="text-center">
                <div className="bg-[#ffbe01] w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 shadow-lg">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-black text-xs sm:text-sm">User Friendly</h4>
              </div>

              <div className="text-center">
                <div className="bg-[#ffbe01] w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 shadow-lg">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-black text-xs sm:text-sm">Secure</h4>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-black text-white animate-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
            Ready to Transform Your Construction Business?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8">
            Join hundreds of construction professionals who trust Vconstech to manage their projects efficiently.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <button
              onClick={() => {
                // Dispatch custom event to open demo modal
                window.dispatchEvent(new CustomEvent('openDemoModal'));
              }}
              className="bg-[#ffbe01] text-black px-6 sm:px-8 py-3 rounded-md font-semibold text-base sm:text-lg hover:bg-yellow-400 transition-colors duration-200"
            >
              Schedule Demo
            </button>
            <Link
              to="/pricing"
              className="border-2 border-[#ffbe01] text-[#ffbe01] px-6 sm:px-8 py-3 rounded-md font-semibold text-base sm:text-lg hover:bg-[#ffbe01] hover:text-black transition-colors duration-200"
            >
              View Pricing
            </Link>
            <Link
              to="/contact"
              className="border-2 border-[#ffbe01] text-[#ffbe01] px-6 sm:px-8 py-3 rounded-md font-semibold text-base sm:text-lg hover:bg-[#ffbe01] hover:text-black transition-colors duration-200"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>


    </div>
  );
};

export default Homepage;
