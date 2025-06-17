import React, { useState } from 'react';
import { FaGithub, FaLinkedin, FaTwitter, FaInstagram, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { MdEmail, MdPhone, MdLocationOn } from 'react-icons/md';
import { HiArrowUp } from 'react-icons/hi';
import { FiEye, FiShield, FiZap, FiUsers } from 'react-icons/fi';
import { motion } from 'framer-motion';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const StayUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch('http://localhost:3000/subscribe-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        let data = await response.json();
        setMessage(data.message);
        setEmail("");
      } else {
        setError("Failed to subscribe. Please try again.");
      }
    } catch (err) {
      setError("Something went wrong. Please check your connection.");
    }
    setLoading(false);
  };

  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: FaGithub, href: "https://github.com/asharful70786", label: "GitHub" },
    { icon: FaLinkedin, href: "https://www.linkedin.com/in/ashraful-momin/", label: "LinkedIn" },
    { icon: FaTwitter, href: "https://x.com/SingerBitto", label: "Twitter" },
    { icon: FaInstagram, href: "https://www.instagram.com/codercamp2024?igsh=M2RocGY1bnQydjd5&utm_source=qr", label: "Instagram" },
  ];

  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Contact", href: "/contact" }
  ];

  const features = [
    { icon: FiShield, text: "Enterprise Security" },
    { icon: FiZap, text: "Real-time Processing" },
    { icon: FiUsers, text: "99.9% Accuracy" }
  ];

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #3b82f6 0%, transparent 50%), 
                           radial-gradient(circle at 75% 75%, #8b5cf6 0%, transparent 50%)`
        }}></div>
      </div>

      <div className="relative">
        {/* Main Footer Content */}
        <div className="container mx-auto px-6 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Brand Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              transition={{ duration: 0.6 }}
              className="lg:col-span-1"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <FiEye className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                    Face Laxious
                  </h3>
                  <p className="text-sm text-gray-400 font-medium">Enterprise AI Platform</p>
                </div>
              </div>
              
              <p className="text-gray-300 leading-relaxed mb-6 max-w-md">
                Advanced facial recognition technology that delivers enterprise-grade security and accuracy for modern businesses.
              </p>

              {/* Feature Badges */}
              <div className="space-y-3 mb-8">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
                      <feature.icon className="w-4 h-4 text-blue-400" />
                    </div>
                    <span className="text-gray-300 text-sm">{feature.text}</span>
                  </div>
                ))}
              </div>

              {/* Social Links */}
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <motion.a 
                    key={index} 
                    href={social.href} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-800/50 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 border border-gray-700 hover:border-blue-500"
                    whileHover={{ y: -2 }} 
                    aria-label={social.label}
                  >
                    <social.icon className="w-4 h-4" />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-1"
            >
              <h4 className="text-lg font-semibold text-white mb-6">Quick Links</h4>
              <ul className="space-y-4">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <a 
                      href={link.href} 
                      className="text-gray-300 hover:text-blue-400 transition-colors duration-300 hover:translate-x-1 inline-block"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>

              {/* Contact Info */}
              <div className="mt-8 space-y-4">
                <h4 className="text-lg font-semibold text-white mb-4">Contact</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-gray-300">
                    <MdLocationOn className="w-5 h-5 text-blue-400" />
                    <span className="text-sm">Kolkata, India</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-300">
                    <MdPhone className="w-5 h-5 text-blue-400" />
                    <a href="tel:+917076091389" className="text-sm hover:text-blue-400 transition-colors">
                      +91 7076091389
                    </a>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-300">
                    <MdEmail className="w-5 h-5 text-blue-400" />
                    <a href="mailto:ashrafulmomin530@gmail.com" className="text-sm hover:text-blue-400 transition-colors">
                      ashrafulmomin530@gmail.com
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Newsletter */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-1"
            >
              <h4 className="text-lg font-semibold text-white mb-6">Stay Updated</h4>
              <p className="text-gray-300 text-sm mb-6 leading-relaxed">
                Get the latest updates on AI technology and platform improvements delivered to your inbox.
              </p>
              
              <form className="space-y-4" onSubmit={StayUpdate}>
                <div className="relative">
                  <input 
                    type="email" 
                    placeholder="Enter your email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-300"
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    "Subscribe"
                  )}
                </button>
                
                {message && (
                  <div className="flex items-center space-x-2 text-green-400 text-sm">
                    <FaCheckCircle className="w-4 h-4" />
                    <span>{message}</span>
                  </div>
                )}
                {error && (
                  <div className="flex items-center space-x-2 text-red-400 text-sm">
                    <FaExclamationCircle className="w-4 h-4" />
                    <span>{error}</span>
                  </div>
                )}
              </form>
            </motion.div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800">
          <div className="container mx-auto px-6 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-gray-400 text-sm text-center md:text-left">
                © {currentYear}  Face Laxious Enterprise. All rights reserved.
              </div>
              
              <div className="flex items-center space-x-6">
                <div className="hidden md:flex items-center space-x-4 text-xs text-gray-500">
                  <span>Privacy Policy</span>
                  <span>•</span>
                  <span>Terms of Service</span>
                  <span>•</span>
                  <span>Security</span>
                </div>
                
                <motion.button 
                  onClick={scrollToTop}
                  className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 border border-gray-700 hover:border-blue-500"
                  whileHover={{ y: -2 }} 
                  whileTap={{ scale: 0.95 }}
                  aria-label="Scroll to top"
                >
                  <HiArrowUp className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
