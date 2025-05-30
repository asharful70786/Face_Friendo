// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const ProtectedRoute = ({ children, requireAdmin = false }) => {

  const { isAuthenticated, user, loading } = useAuth();

  if (loading) return <div className="text-center p-10 text-xl">Loading...</div>;

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (requireAdmin && user?.role !== "admin") {
    return <div className="text-center p-10 text-red-600 text-lg font-bold">Access Denied</div>;
  }

  return children;
};

export default ProtectedRoute;
