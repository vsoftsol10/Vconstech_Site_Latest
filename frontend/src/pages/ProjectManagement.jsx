import React from 'react';
import { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle, Package, Users, DollarSign, FolderOpen, Handshake, TrendingUp, Clock, Calculator, BarChart3, Receipt, Truck,Dock } from 'lucide-react';
// import FloatingButtons from '../components/FloatingButtons.jsx';
import FloatingButtons from "../components/FloatingButtons";
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';


const ProjectManagement = () => {
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
        }
    }, [location]);

    const ProductCard = ({ icon: IconComponent, title, description, features, image, reverse = false }) => {
        // `no-unused-vars` doesn't always recognize JSX component usage.
        void IconComponent;
        return (
            <div className={`flex flex-col ${reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-8 lg:gap-12 items-center mb-20`}>
                <div className="flex-1 space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-black rounded-lg">
                            <IconComponent className="w-6 h-6 text-yellow-300" />
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900">{title}</h3>
                    </div>
                    <p className="text-lg text-gray-600 leading-relaxed">{description}</p>
                    <div className="space-y-4">
                        {features.map((feature, index) => (
                            <div key={index} className="flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                                <p className="text-gray-700">{feature}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex-1 w-full">
                    {image}
                </div>
            </div>
        );
    };

    const products = [
        {
            id: 'material-management',
            icon: Package,
            title: "Material Management",
            description: "Track materials from procurement to usage with complete transparency. Avoid shortages, reduce wastage, and maintain accurate inventory levels across projects.",
            features: [
                "Real-time material tracking",
                "Stock usage & availability reports",
                "Reduced material loss and delays"
            ],
            image: (
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-8 shadow-lg relative overflow-hidden">
                    <h4 className="text-xl font-bold text-gray-800 mb-4">Stock Levels</h4>
                    <div className="space-y-3">
                        {['Cement', 'Steel', 'Bricks', 'Sand'].map((item, i) => (
                            <div key={i} className="bg-white rounded-lg p-3 flex justify-between items-center">
                                <span className="font-medium text-gray-700">{item}</span>
                                <span className="text-green-600 font-semibold">{85 - i * 10}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            )
        },
        {
            id: 'financial-management',
            icon: DollarSign,
            title: "Financial Management",
            description: "Monitor project expenses, budgets, and payments in one place. Ensure cost control and financial clarity throughout the project lifecycle.",
            features: [
                "Expense & budget tracking",
                "Payment monitoring",
                "Clear financial insights"
            ],
            image: (
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 shadow-lg relative overflow-hidden">
                    <h4 className="text-xl font-bold text-gray-800 mb-4">Project Budget</h4>
                    <div className="space-y-3 bg-white rounded-lg p-4">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Allocated:</span>
                            <span className="font-bold text-gray-800">₹5,00,000</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Spent:</span>
                            <span className="font-bold text-orange-600">₹3,25,000</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Remaining:</span>
                            <span className="font-bold text-green-600">₹1,75,000</span>
                        </div>
                    </div>
                    <button className="mt-4 w-full bg-green-500 text-white py-2 rounded-lg font-semibold hover:bg-green-600">
                        View Report
                    </button>
                </div>
            ),
            reverse: true
        },
        {
            id: 'labour-management',
            icon: Users,
            title: "Labour Management",
            description: "Track workforce attendance, roles, and productivity with ease. Ensure optimal manpower utilization for every project phase.",
            features: [
                "Labour allocation",
                "Salary Tracking"
            ],
            image: (
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 shadow-lg relative overflow-hidden">
                    <h4 className="text-xl font-bold text-gray-800 mb-4">Monthly Payslip</h4>
                    <div className="space-y-3 bg-white rounded-lg p-4">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Basic Salary:</span>
                            <span className="font-bold text-gray-800">₹25,000</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Overtime:</span>
                            <span className="font-bold text-blue-600">₹3,500</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t">
                            <span className="text-gray-800 font-semibold">Total:</span>
                            <span className="font-bold text-green-600">₹28,500</span>
                        </div>
                    </div>
                    <button className="mt-4 w-full bg-yellow-500 text-black py-2 rounded-lg font-semibold hover:bg-yellow-600">
                        Generate PDF
                    </button>
                </div>
            )
        },
        {
            id: 'file-management',
            icon: FolderOpen,
            title: "File Management",
            description: "Store, organize, and access all project-related documents securely. Keep contracts, drawings, invoices, and reports available anytime, anywhere.",
            features: [
                "Centralized document storage",
                "Secure access control",
                "Easy file retrieval"
            ],
            image: (
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8 shadow-lg relative overflow-hidden">
                    <h4 className="text-xl font-bold text-gray-800 mb-4">Document Vault</h4>
                    <div className="space-y-3">
                        {['Building Plans.pdf', 'NOC Certificate.pdf', 'Land Agreement.pdf'].map((doc, i) => (
                            <div key={i} className="bg-white rounded-lg p-3 flex items-center gap-3">
                                <FolderOpen className="w-5 h-5 text-purple-600" />
                                <span className="text-gray-700 text-sm">{doc}</span>
                            </div>
                        ))}
                    </div>
                </div>
            ),reverse: true
        },
        {
            id: 'contractor-management',
            icon: Handshake,
            title: "Contractor Management",
            description: "Manage contractor details, work assignments, and performance efficiently. Improve coordination and accountability across all contractors.",
            features: [
                "Contractor profiles & records",
                "Work tracking",
                "Performance monitoring"
            ],
            image: (
                <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-8 shadow-lg relative overflow-hidden">
                    <h4 className="text-xl font-bold text-gray-800 mb-4">Contractor Stats</h4>
                    <div className="grid grid-cols-3 gap-3">
                        <div className="bg-white rounded-lg p-4 text-center">
                            <div className="text-2xl font-bold text-green-600">15</div>
                            <div className="text-xs text-gray-600 mt-1">Active</div>
                        </div>
                        <div className="bg-white rounded-lg p-4 text-center">
                            <div className="text-2xl font-bold text-orange-600">3</div>
                            <div className="text-xs text-gray-600 mt-1">Pending</div>
                        </div>
                        <div className="bg-white rounded-lg p-4 text-center">
                            <div className="text-2xl font-bold text-blue-600">8</div>
                            <div className="text-xs text-gray-600 mt-1">Top Rated</div>
                        </div>
                    </div>
                </div>
            ),
          
        },
        {
    id: 'billing-management',
    icon: Dock, // or Receipt, CreditCard - choose appropriate icon
    title: "Billing Management",
    description: "Streamline invoicing, track payments, and manage billing cycles effortlessly. Keep your cash flow healthy with automated billing reminders and detailed payment records.",
    features: [
        "Payment tracking & reminders",
        "Billing history & reports"
    ],
    image: (
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 shadow-lg relative overflow-hidden">
            <h4 className="text-xl font-bold text-gray-800 mb-4">Recent Invoices</h4>
            <div className="space-y-3">
                <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-green-500">
                    <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-gray-800">INV-2024-001</span>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">Paid</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Client: ABC Corp</span>
                        <span className="font-bold text-gray-800">₹2,50,000</span>
                    </div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-orange-500">
                    <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-gray-800">INV-2024-002</span>
                        <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-medium">Pending</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Client: XYZ Ltd</span>
                        <span className="font-bold text-gray-800">₹1,75,000</span>
                    </div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-blue-500">
                    <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-gray-800">INV-2024-003</span>
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">Draft</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Client: PQR Inc</span>
                        <span className="font-bold text-gray-800">₹3,00,000</span>
                    </div>
                </div>
            </div>
            <button className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors">
                Create Invoice
            </button>
        </div>
    ),
    reverse: true 
}
        
    ];

    // (Removed unused legacy `data` constant)

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-yellow-500 text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center hero-content">
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-black">
                            Smart Project Management, Built for Complete Control
                        </h1>

                        <p className="text-xl mb-8 text-black">
                            Plan, track, and manage every aspect of your projects from materials to manpower using one powerful, centralized platform.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/contact" className="border border-black text-black px-8 py-3 rounded-lg font-semibold hover:bg-black hover:text-white transition text-center">
                                Get Started
                            </Link>

                            <Link to="/contact" className="bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-900 transition text-center">
                                Request a Demo
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Products Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 animate-section">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">Project Management Modules</h2>
                    <p className="text-xl text-gray-600">Explore our specialized management modules designed to optimize different aspects of your construction projects and business operations.</p>
                </div>

                {products.map((product) => (
                    <div key={product.id} id={product.id} className="scroll-mt-40">
                        <ProductCard {...product} />
                    </div>
                ))}
            </div>

            {/* CTA Section */}
            <div className="bg-yellow-500 text-black py-16 animate-section">
                <div className="max-w-4xl mx-auto text-center px-4">
                    <h2 className="text-4xl font-bold mb-6">Transform your project management, streamline your operations</h2>
                    <div className="flex gap-4 justify-center">
                        <Link to="/pricing" className="bg-white text-black px-8 py-3 rounded-lg font-bold hover:bg-orange-50 transition transition-all transform hover:scale-105">
                            Check Pricing
                        </Link>
                        {/* <Link to="/book-demo" className="bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-800 transition">
                            Request Demo
                        </Link> */}
                        <button
              onClick={( ) => {
                // Dispatch custom event to open demo modal
                window.dispatchEvent(new CustomEvent('openDemoModal'));
              }}
              className="bg-black text-white px-6 sm:px-8 py-3 rounded-md font-semibold text-base sm:text-lg transition-all transform hover:scale-105 "
            >
              Schedule Demo
            </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectManagement;