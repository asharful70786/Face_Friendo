import { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // ⏳ New

  const checkAuth = async () => {
    try {
      const res = await fetch("https://backend.face.ashraful.in/auth/user-info", {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (data?.message) {
        setIsAuthenticated(true);
        setUser(data.message); // 🧠 Store user data if needed
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false); // ✅ Done fetching
    }
  };

  const logout = async () => {
    try {
      await fetch("https://backend.face.ashraful.in/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
  <AuthContext.Provider
    value={{ isAuthenticated, setIsAuthenticated, user, loading, logout, checkAuth }}
  >
    {children}
  </AuthContext.Provider>
);
};

export const useAuth = () => useContext(AuthContext);
