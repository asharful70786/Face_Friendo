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
    <nav className="bg-indigo-600 text-white px-6 py-4 flex justify-between">
      <Link to="/" className="text-xl font-bold">
        🌐 MyApp
      </Link>

      <div className="space-x-4">
        {isAuthenticated ? (
          <>
            <Link to="/dashboard" className="hover:underline">
              Dashboard
            </Link>
            <button onClick={handleLogout} className="bg-red-500 px-4 py-1 rounded">
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="bg-green-500 px-4 py-1 rounded">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
