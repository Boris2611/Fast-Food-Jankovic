import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  const role = user.role?.toLowerCase();

  if (adminOnly && role !== "admin") return <Navigate to="/home" replace />;



  return children;
};

export default ProtectedRoute;
