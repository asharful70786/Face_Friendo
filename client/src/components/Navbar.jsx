import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const Navbar = () => {
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await fetch("http://localhost:3000/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md px-6 py-3 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold tracking-wide hover:text-yellow-300 transition-all">
       Face Laxious  
      </Link>

      <div className="space-x-4 flex items-center">
        {isAuthenticated ? (
          <>
            <Link
              to="/about-user"
              className="hover:bg-indigo-700 px-3 py-1 rounded-md transition-all"
            >
              👤 Profile
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-4 py-1 rounded-md transition-all"
            >
              🚪 Logout
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="bg-green-500 hover:bg-green-600 px-4 py-1 rounded-md transition-all"
          >
            🔐 Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
