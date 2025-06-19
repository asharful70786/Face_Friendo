import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { useState, useEffect } from "react";
import { 
  FiEye, 
  FiUser, 
  FiLogOut, 
  FiLogIn, 
  FiMenu, 
  FiX, 
  FiShield,
  FiZap,
  FiTrendingUp
} from "react-icons/fi";

const Navbar = () => {
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await fetch("https://backend.face.ashraful.in/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    setIsAuthenticated(false);
    navigate("/login");
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-200/50' 
          : 'bg-white/80 backdrop-blur-md'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo Section */}
            <Link 
              to="/" 
              className="flex items-center space-x-3 group transition-all duration-300 hover:scale-105"
            >
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <FiEye className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-300" />
                </div>
                {/* Pulse effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                {/* Status indicator */}
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
                   Face Laxious
                </h1>
                <p className="text-xs text-gray-500 font-medium tracking-wide">ENTERPRISE AI</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {/* Feature Badges */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 px-3 py-2 bg-green-50 rounded-lg border border-green-100 hover:bg-green-100 transition-colors duration-200">
                  <FiShield className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-700">Secure</span>
                </div>
                <div className="flex items-center space-x-2 px-3 py-2 bg-blue-50 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors duration-200">
                  <FiZap className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-700">Real-time</span>
                </div>
                <div className="flex items-center space-x-2 px-3 py-2 bg-purple-50 rounded-lg border border-purple-100 hover:bg-purple-100 transition-colors duration-200">
                  <FiTrendingUp className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium text-purple-700">99.9%</span>
                </div>
              </div>

              {/* Auth Section */}
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/about-user"
                    className="group flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-gray-50 to-blue-50 hover:from-blue-50 hover:to-indigo-50 rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-md"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <FiUser className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-medium text-gray-700 group-hover:text-blue-700 transition-colors duration-300">Profile</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="group flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 rounded-xl text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    <FiLogOut className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="group flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <FiLogIn className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                  <span>Sign In</span>
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
            >
              {isMobileMenuOpen ? (
                <FiX className="w-6 h-6 text-gray-700" />
              ) : (
                <FiMenu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen 
            ? 'max-h-96 opacity-100' 
            : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
          <div className="px-4 pb-6 bg-white/95 backdrop-blur-lg border-t border-gray-200/50">
            {/* Mobile Feature Badges */}
            <div className="flex flex-wrap gap-2 mb-6 pt-4">
              <div className="flex items-center space-x-2 px-3 py-2 bg-green-50 rounded-lg border border-green-100">
                <FiShield className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-700">Secure</span>
              </div>
              <div className="flex items-center space-x-2 px-3 py-2 bg-blue-50 rounded-lg border border-blue-100">
                <FiZap className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">Real-time</span>
              </div>
              <div className="flex items-center space-x-2 px-3 py-2 bg-purple-50 rounded-lg border border-purple-100">
                <FiTrendingUp className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-700">99.9% Accuracy</span>
              </div>
            </div>

            {/* Mobile Auth Section */}
            <div className="space-y-3">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/about-user"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center space-x-3 w-full px-4 py-3 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-300"
                  >
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                      <FiUser className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Profile</p>
                      <p className="text-sm text-gray-500">View your account</p>
                    </div>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 w-full px-4 py-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl text-white font-medium shadow-lg"
                  >
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      <FiLogOut className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium">Logout</p>
                      <p className="text-sm opacity-90">Sign out securely</p>
                    </div>
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center space-x-3 w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl text-white font-medium shadow-lg"
                >
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <FiLogIn className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium">Sign In</p>
                    <p className="text-sm opacity-90">Access your account</p>
                  </div>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer to prevent content from hiding behind fixed navbar */}
      <div className="h-20"></div>
    </>
  );
};

export default Navbar;
