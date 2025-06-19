import React, { useState } from 'react';

function PrivacyPage() {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { id: 'overview', title: 'Overview', icon: '📋' },
    { id: 'collection', title: 'Data Collection', icon: '📊' },
    { id: 'usage', title: 'Data Usage', icon: '🔧' },
    { id: 'sharing', title: 'Data Sharing', icon: '🤝' },
    { id: 'security', title: 'Security', icon: '🔒' },
    { id: 'rights', title: 'Your Rights', icon: '⚖️' },
    { id: 'cookies', title: 'Cookies', icon: '🍪' },
    { id: 'contact', title: 'Contact', icon: '📞' }
  ];

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
     <div 
  className="absolute inset-0 pointer-events-none bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] bg-[length:60px_60px] opacity-40 -z-10"
></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="pt-8 pb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">FaceFriendiya</h1>
                <p className="text-indigo-200">Privacy Policy</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-1">
              <span className="text-sm text-gray-400">Last updated:</span>
              <span className="text-sm text-white">{new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex flex-col lg:flex-row gap-8 pb-16">
          {/* Sidebar Navigation */}
          <aside className="lg:w-64 flex-shrink-0">
            <nav className="sticky top-8">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 shadow-lg">
                <h2 className="text-lg font-semibold text-white mb-4 px-2">Policy Sections</h2>
                <ul className="space-y-2">
                  {sections.map((section) => (
                    <li key={section.id}>
                      <button
                        onClick={() => scrollToSection(section.id)}
                        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${activeSection === section.id ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-400/20' : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'}`}
                      >
                        <span className="text-lg">{section.icon}</span>
                        <span className="text-sm font-medium">{section.title}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </nav>
          </aside>

          {/* Policy Content */}
          <div className="flex-1 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 shadow-lg overflow-hidden">
            {/* Overview Section */}
            <section id="overview" className="p-6 border-b border-gray-700/50">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                <span className="mr-3">📋</span> Overview
              </h2>
              <div className="prose prose-invert max-w-none text-gray-300">
                <p>
                  FaceFriendiya is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our facial recognition services.
                </p>
                <p>
                  Please read this policy carefully. By accessing or using our service, you agree to the collection and use of information in accordance with this policy.
                </p>
              </div>
            </section>

            {/* Data Collection Section */}
            <section id="collection" className="p-6 border-b border-gray-700/50">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                <span className="mr-3">📊</span> Data Collection
              </h2>
              <div className="prose prose-invert max-w-none text-gray-300">
                <p>We collect several types of information to provide and improve our services:</p>
                <ul>
                  <li><strong>Facial Data:</strong> Biometric data including facial features and descriptors</li>
                  <li><strong>Usage Data:</strong> Information about how you interact with our services</li>
                  <li><strong>Device Information:</strong> Device type, operating system, and browser information</li>
                  <li><strong>Metadata:</strong> Information about the images you upload including timestamps</li>
                </ul>
              </div>
            </section>

            {/* Data Usage Section */}
            <section id="usage" className="p-6 border-b border-gray-700/50">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                <span className="mr-3">🔧</span> Data Usage
              </h2>
              <div className="prose prose-invert max-w-none text-gray-300">
                <p>We use the collected data for various purposes:</p>
                <ul>
                  <li>To provide and maintain our facial recognition services</li>
                  <li>To improve and personalize user experience</li>
                  <li>To develop new features and functionality</li>
                  <li>To monitor service usage and detect security issues</li>
                  <li>To comply with legal obligations</li>
                </ul>
              </div>
            </section>

            {/* Data Sharing Section */}
            <section id="sharing" className="p-6 border-b border-gray-700/50">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                <span className="mr-3">🤝</span> Data Sharing
              </h2>
              <div className="prose prose-invert max-w-none text-gray-300">
                <p>We may share your information in the following situations:</p>
                <ul>
                  <li><strong>Service Providers:</strong> With third-party vendors who perform services on our behalf</li>
                  <li><strong>Legal Requirements:</strong> When required by law or to respond to legal process</li>
                  <li><strong>Business Transfers:</strong> In connection with any merger or sale of company assets</li>
                </ul>
                <p>We do not sell your facial recognition data to third parties.</p>
              </div>
            </section>

            {/* Security Section */}
            <section id="security" className="p-6 border-b border-gray-700/50">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                <span className="mr-3">🔒</span> Security
              </h2>
              <div className="prose prose-invert max-w-none text-gray-300">
                <p>We implement appropriate technical and organizational measures to protect your data:</p>
                <ul>
                  <li>Encryption of biometric data in transit and at rest</li>
                  <li>Regular security audits and vulnerability testing</li>
                  <li>Access controls and authentication mechanisms</li>
                  <li>Employee training on data protection</li>
                </ul>
                <p>While we strive to protect your data, no security system is impenetrable.</p>
              </div>
            </section>

            {/* Your Rights Section */}
            <section id="rights" className="p-6 border-b border-gray-700/50">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                <span className="mr-3">⚖️</span> Your Rights
              </h2>
              <div className="prose prose-invert max-w-none text-gray-300">
                <p>Depending on your jurisdiction, you may have the following rights:</p>
                <ul>
                  <li><strong>Access:</strong> Request copies of your personal data</li>
                  <li><strong>Rectification:</strong> Request correction of inaccurate data</li>
                  <li><strong>Erasure:</strong> Request deletion of your personal data</li>
                  <li><strong>Restriction:</strong> Request restriction of processing</li>
                  <li><strong>Objection:</strong> Object to certain processing activities</li>
                  <li><strong>Portability:</strong> Request transfer of data to another organization</li>
                </ul>
              </div>
            </section>

            {/* Cookies Section */}
            <section id="cookies" className="p-6 border-b border-gray-700/50">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                <span className="mr-3">🍪</span> Cookies
              </h2>
              <div className="prose prose-invert max-w-none text-gray-300">
                <p>We use cookies and similar tracking technologies to:</p>
                <ul>
                  <li>Maintain user sessions</li>
                  <li>Remember preferences</li>
                  <li>Analyze service usage</li>
                  <li>Improve our services</li>
                </ul>
                <p>You can control cookies through your browser settings.</p>
              </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                <span className="mr-3">📞</span> Contact Us
              </h2>
              <div className="prose prose-invert max-w-none text-gray-300">
                <p>If you have questions about this Privacy Policy, please contact us:</p>
                <ul>
                  <li><strong>Email:</strong> privacy@facefriendiya.com</li>
                  <li><strong>Address:</strong> 123 Privacy Lane, Data Protection City</li>
                  <li><strong>Phone:</strong> +1 (555) 123-4567</li>
                </ul>
                <p>We may update this policy periodically. We will notify you of significant changes.</p>
              </div>
            </section>
          </div>
        </main>

        {/* Footer */}
        <footer className="py-6 border-t border-gray-700/50">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© {new Date().getFullYear()} FaceFriendiya. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Cookie Policy</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default PrivacyPage;