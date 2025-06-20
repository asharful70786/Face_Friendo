import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { useState, useEffect } from "react";
import { 
  Eye, 
  User, 
  LogOut, 
  LogIn, 
  Menu, 
  X, 
  Shield,
  Zap,
  TrendingUp,
  Settings,
  ChevronDown
} from "lucide-react";

const Navbar = () => {
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

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
    setIsProfileDropdownOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-200/50' 
          : 'bg-white/90 backdrop-blur-md'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            
            {/* Logo Section */}
            <Link 
              to="/" 
              className="flex items-center space-x-3 group transition-all duration-300 hover:scale-105"
            >
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <Eye className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-300" />
                </div>
                {/* Glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                {/* Status indicator */}
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse shadow-sm"></div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
                  Face Laxious
                </h1>
                <p className="text-xs text-gray-500 font-medium tracking-wider uppercase">AI Recognition</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              
              {/* Feature Badges */}
              <div className="flex items-center space-x-3">
                <div className="group flex items-center space-x-2 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition-all duration-200 cursor-pointer">
                  <Shield className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform duration-200" />
                  <span className="text-sm font-semibold text-emerald-700">Secure</span>
                </div>
                
                <div className="group flex items-center space-x-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-all duration-200 cursor-pointer">
                  <Zap className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform duration-200" />
                  <span className="text-sm font-semibold text-blue-700">Real-time</span>
                </div>
                
                <div className="group flex items-center space-x-2 px-3 py-2 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-all duration-200 cursor-pointer">
                  <TrendingUp className="w-4 h-4 text-purple-600 group-hover:scale-110 transition-transform duration-200" />
                  <span className="text-sm font-semibold text-purple-700">99.9%</span>
                </div>
              </div>

              {/* Auth Section */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="group flex items-center space-x-3 px-4 py-2 bg-gradient-to-r from-gray-50 to-blue-50 hover:from-blue-50 hover:to-indigo-50 rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-md"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-medium text-gray-700 group-hover:text-blue-700 transition-colors duration-300">Profile</span>
                    <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Profile Dropdown */}
                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
                      <Link
                        to="/about-user"
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors duration-200"
                      >
                        <User className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-700 font-medium">View Profile</span>
                      </Link>
                      <div className="border-t border-gray-100 my-1"></div>
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 px-4 py-3 hover:bg-red-50 transition-colors duration-200 w-full text-left"
                      >
                        <LogOut className="w-4 h-4 text-red-500" />
                        <span className="text-red-600 font-medium">Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="group flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <LogIn className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
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
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
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
              <div className="flex items-center space-x-2 px-3 py-2 bg-emerald-50 rounded-lg border border-emerald-100">
                <Shield className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-medium text-emerald-700">Secure</span>
              </div>
              <div className="flex items-center space-x-2 px-3 py-2 bg-blue-50 rounded-lg border border-blue-100">
                <Zap className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">Real-time</span>
              </div>
              <div className="flex items-center space-x-2 px-3 py-2 bg-purple-50 rounded-lg border border-purple-100">
                <TrendingUp className="w-4 h-4 text-purple-600" />
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
                      <User className="w-5 h-5 text-white" />
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
                      <LogOut className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium">Sign Out</p>
                      <p className="text-sm opacity-90">Logout securely</p>
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
                    <LogIn className="w-5 h-5" />
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
