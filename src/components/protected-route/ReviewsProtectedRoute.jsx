import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { canAccessReviews } from "@/utils/canAccessReviews";

const ReviewsProtectedRoute = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!canAccessReviews(user)) return <Navigate to="/forbidden" replace />;
  return children;
};

export default ReviewsProtectedRoute;
