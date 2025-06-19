import React, { useState } from 'react';

function Terms() {
  const [activeSection, setActiveSection] = useState('introduction');
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const sections = [
    { id: 'introduction', title: 'Introduction', icon: '📝' },
    { id: 'acceptance', title: 'Acceptance', icon: '✅' },
    { id: 'services', title: 'Our Services', icon: '🌟' },
    { id: 'accounts', title: 'User Accounts', icon: '👤' },
    { id: 'conduct', title: 'User Conduct', icon: '⚡' },
    { id: 'content', title: 'Content Policy', icon: '📋' },
    { id: 'intellectual', title: 'Intellectual Property', icon: '©️' },
    { id: 'termination', title: 'Termination', icon: '🚫' },
    { id: 'liability', title: 'Liability', icon: '⚖️' },
    { id: 'changes', title: 'Changes', icon: '🔄' }
  ];

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
      <header className="sticky top-0 z-50 bg-white/10 backdrop-blur-xl border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Face Laxious</h1>
                <p className="text-sm text-gray-300">Terms & Conditions</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <nav className="space-y-2 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
                <span className="mr-2">🧭</span> Navigation
              </h2>
              {sections.map(section => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 flex items-center space-x-3 group ${
                    activeSection === section.id
                      ? 'bg-gradient-to-r from-blue-500/30 to-purple-500/30 text-white border border-blue-400/50 shadow-lg'
                      : 'text-gray-300 hover:text-white hover:bg-white/10 hover:border-white/20 border border-transparent'
                  }`}
                >
                  <span className="text-lg group-hover:scale-110 transition-transform">{section.icon}</span>
                  <span className="font-medium text-sm">{section.title}</span>
                </button>
              ))}
            </nav>
          </aside>

          <main className="lg:col-span-3 space-y-8">
            <section id="introduction" className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center space-x-3"><span>📝</span><span>Introduction</span></h2>
              <p>Welcome to Face Laxious! These Terms and Conditions govern your use of our platform.</p>
            </section>

            <section id="acceptance" className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center space-x-3"><span>✅</span><span>Acceptance</span></h2>
              <p>By using Face Laxious, you agree to our Terms and Privacy Policy.</p>
            </section>

            <section id="services" className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center space-x-3"><span>🌟</span><span>Our Services</span></h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Social Networking</li>
                <li>Content Sharing</li>
                <li>Messaging</li>
                <li>Notifications</li>
              </ul>
            </section>

            {/* Add additional sections below in the same format */}

          </main>
        </div>
      </div>
    </div>
  );
}

export default Terms;
