import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import blogHeroVideo from '../assets/bloghero.mp4';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const Blog = () => {
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
  const blogPosts = [
    {
      id: 1,
      title: "The Future of Construction Management: How ERP Systems Are Transforming the Industry",
      excerpt: "Discover how modern ERP solutions are revolutionizing construction project management, improving efficiency, and reducing costs across the industry.",
      image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=400&fit=crop",
      author: "Sarah Johnson",
      date: "December 8, 2025",
      readTime: "5 min read",
      category: "Industry Trends"
    },
    {
      id: 2,
      title: "Top 10 Challenges Faced by Construction Companies in 2025",
      excerpt: "Explore the most pressing challenges construction companies face today and learn how Vconstech's ERP solutions address these critical issues.",
      image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=400&fit=crop",
      author: "Michael Chen",
      date: "December 5, 2025",
      readTime: "7 min read",
      category: "Challenges & Solutions"
    },
    {
      id: 3,
      title: "How to Choose the Right ERP System for Your Construction Business",
      excerpt: "A comprehensive guide to selecting the perfect ERP solution that matches your construction company's unique needs and growth objectives.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
      author: "Emily Rodriguez",
      date: "November 28, 2025",
      readTime: "6 min read",
      category: "Implementation Guide"
    },
    {
      id: 4,
      title: "Case Study: How ABC Construction Reduced Project Costs by 35%",
      excerpt: "Real-world success story of how ABC Construction transformed their operations using Vconstech ERP, resulting in significant cost savings and improved profitability.",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=400&fit=crop",
      author: "David Thompson",
      date: "November 20, 2025",
      readTime: "8 min read",
      category: "Case Studies"
    },
    {
      id: 5,
      title: "The Role of AI and Machine Learning in Modern Construction ERP",
      excerpt: "Explore how artificial intelligence and machine learning are being integrated into construction ERP systems to provide predictive analytics and automated decision-making.",
      image: "https://plus.unsplash.com/premium_photo-1683121710572-7723bd2e235d?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      author: "Sarah Johnson",
      date: "November 15, 2025",
      readTime: "6 min read",
      category: "Technology"
    },
    {
      id: 6,
      title: "Compliance and Safety Management in Construction Projects",
      excerpt: "Learn how modern ERP systems help construction companies maintain compliance with safety regulations and manage risk effectively.",
      image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&h=400&fit=crop",
      author: "Michael Chen",
      date: "November 10, 2025",
      readTime: "5 min read",
      category: "Safety & Compliance"
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
          <source src={blogHeroVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Black Overlay */}
        <div className="absolute inset-0 bg-black/60 z-10"></div>
        {/* You can adjust opacity: bg-black/30, bg-black/40, bg-black/70 */}

        {/* Content */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center hero-content">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Vconstech <span className="text-[#ffbe01]">Blog</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              Insights, trends, and expert advice on construction management, ERP solutions, and industry best practices.
            </p>
          </div>
        </div>
      </section>

      {/* Blog Content */}
      <section className="py-20 bg-white animate-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Featured Post */}
          <div className="mb-16">
            <div className="bg-gray-50 rounded-lg overflow-hidden shadow-lg">
              <div className="md:flex">
                <div className="md:w-1/2">
                  <img
                    src={blogPosts[0].image}
                    alt={blogPosts[0].title}
                    className="w-full h-64 md:h-full object-cover"
                  />
                </div>
                <div className="md:w-1/2 p-8">
                  <div className="flex items-center mb-4">
                    <span className="bg-[#ffbe01] text-black px-3 py-1 rounded-full text-sm font-medium">
                      {blogPosts[0].category}
                    </span>
                    <span className="ml-4 text-gray-500 text-sm">
                      {blogPosts[0].readTime}
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-black mb-4">
                    {blogPosts[0].title}
                  </h2>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {blogPosts[0].excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-[#ffbe01] rounded-full flex items-center justify-center text-black font-bold">
                        {blogPosts[0].author.charAt(0)}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-black">
                          {blogPosts[0].author}
                        </p>
                        <p className="text-sm text-gray-500">
                          {blogPosts[0].date}
                        </p>
                      </div>
                    </div>
                    <Link
                      to="#"
                      className="text-[#ffbe01] hover:text-black font-medium transition-colors duration-200"
                    >
                      Read More →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Blog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.slice(1).map((post) => (
              <article key={post.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-medium">
                      {post.category}
                    </span>
                    <span className="text-gray-500 text-xs">
                      {post.readTime}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-black mb-3 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-[#ffbe01] rounded-full flex items-center justify-center text-black font-bold text-sm">
                        {post.author.charAt(0)}
                      </div>
                      <div className="ml-2">
                        <p className="text-xs font-medium text-black">
                          {post.author}
                        </p>
                        <p className="text-xs text-gray-500">
                          {post.date}
                        </p>
                      </div>
                    </div>
                    <Link
                      to="#"
                      className="text-[#ffbe01] hover:text-black text-sm font-medium transition-colors duration-200"
                    >
                      Read More
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Newsletter Signup */}
          <div className="mt-16 bg-gray-50 rounded-lg p-8 text-center">
            <h3 className="text-2xl font-bold text-black mb-4">
              Stay Updated with Industry Insights
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Subscribe to our newsletter and get the latest updates on construction technology,
              industry trends, and ERP best practices delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-md focus:ring-[#ffbe01] focus:border-[#ffbe01] transition-colors duration-200"
              />
              <button className="bg-[#ffbe01] text-black px-6 py-3 rounded-md font-medium hover:bg-yellow-400 transition-colors duration-200">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-black text-white animate-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Construction Business?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join hundreds of construction professionals who trust Vconstech to manage their projects efficiently.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/#contact"
              className="bg-[#ffbe01] text-black px-8 py-3 rounded-md font-semibold text-lg hover:bg-yellow-400 transition-colors duration-200"
            >
              Get Started Today
            </a>
            <Link
              to="/pricing"
              className="border-2 border-[#ffbe01] text-[#ffbe01] px-8 py-3 rounded-md font-semibold text-lg hover:bg-[#ffbe01] hover:text-black transition-colors duration-200"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;
