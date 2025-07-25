// components/ProtectedRoute.jsx
import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import FullScreenLoader from "../common/FullScreenLoader";

export default function ProtectedRoute({ children, roles = [] }) {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <FullScreenLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles.length > 0 && !roles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children || <Outlet />;
}
