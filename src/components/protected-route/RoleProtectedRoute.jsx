import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const RoleProtectedRoute = ({ children, roleRequired }) => {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" />;

  // Django staff/superuser — we store is_staff / is_superuser, not user.role
  const isAdmin =
    Boolean(user?.is_superuser || user?.is_staff || user?.role === "admin");
  if (roleRequired === "admin" && !isAdmin) {
    return <Navigate to="/forbidden" />;
  }
  return children;
};

export default RoleProtectedRoute;