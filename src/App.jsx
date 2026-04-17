import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

// Layout & Widgets
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollUp from "@/components/widgets/ScrollUp";

// Auth & Guards
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import ProtectedRoute from "@/components/protected-route/ProtectedRoute";
import RoleProtectedRoute from "@/components/protected-route/RoleProtectedRoute";
import ReviewsProtectedRoute from "@/components/protected-route/ReviewsProtectedRoute";
import NotStaffRoute from "@/components/protected-route/NotStaffRoute";

// Hooks
import useTheme from "@/hooks/useTheme";

// Pages: General
import HomePage from "@/pages/homepage/HomePage";
import ProfilePage from "@/pages/profile/ProfilePage";

// Pages: Documents
import DocumentsPage from "@/pages/documents/DocumentsPage";
import DocumentDetailsPage from "@/pages/documents/DocumentDetailsPage";
import CreateDocumentPage from "@/pages/documents/CreateDocumentPage";
import CreateVersionPage from "@/pages/documents/CreateVersionPage";
import VersionDetailsPage from "@/pages/documents/VersionDetailsPage";

// Pages: Reviews
import VersionReviewPage from "@/pages/reviews/VersionReviewPage";
import ReviewPage from "@/pages/reviews/ReviewPage";

// Pages: Admin
import ManageUsers from "@/pages/admin/ManageUsers";
import AuditLogPage from "@/pages/admin/AuditLogPage";

// Pages: Error Handling
import NotFoundPage from "@/pages/error-pages/NotFoundPage";
import ServerErrorPage from "@/pages/error-pages/ServerErrorPage";
import ForbiddenPage from "@/pages/error-pages/ForbiddenPage";

// Notifications
import ViewAllNotifications from "@/pages/notifications/ViewAllNotifications";

/**
 * 1. Detailed Page Title Logic
 */
const PageTitleUpdater = () => {
  const location = useLocation();

  useEffect(() => {
    const pathSegments = location.pathname.split("/").filter(Boolean);
    let title = "SAP Hub";

    if (pathSegments.length === 0) {
      title = "Dashboard";
    } else {
      // Handle logic for complex paths
      const first = pathSegments[0];
      const last = pathSegments[pathSegments.length - 1];

      switch (first) {
        case "documents":
          if (pathSegments.includes("create")) title = "New Document";
          else if (pathSegments.includes("create-version")) title = "Add Version";
          else if (pathSegments.length > 1) title = `View Document`;
          else title = "All Documents";
          break;
        case "versions":
          title = "Version Details";
          break;
        case "version-review":
          title = "Version Review";
          break;
        case "profile":
          title = "User Profile";
          break;
        case "manage-users":
          title = "Admin: User Management";
          break;
        case "audit-log":
          title = "Admin: System Logs";
          break;
        case "notifications":
          title = "My Notifications";
          break;
        case "reviews":
          title = "Reviews Page";
          break;
        case "login":
          title = "Sign In";
          break;
        case "register":
          title = "Create Account";
          break;
        default:
          // Capitalize first letter of path if not in switch
          title = first.charAt(0).toUpperCase() + first.slice(1);
      }
    }

    document.title = `${title} | SAP Hub`;
  }, [location]);

  return null;
}

export default function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <BrowserRouter>
      <PageTitleUpdater />
      <div data-theme={theme} className="min-h-[100vh] bg-base-100">
        <Navbar theme={theme} toggleTheme={toggleTheme} />

        <main className="min-h-[100vh] overflow-x-hidden">
          <Routes>
            {/* --- PUBLIC --- */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* --- GENERAL AUTH PROTECTED --- */}
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/profile/:id" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute><ViewAllNotifications /></ProtectedRoute>} />
            <Route path="/documents" element={<ProtectedRoute><DocumentsPage /></ProtectedRoute>} />
            <Route path="/documents/:id" element={<ProtectedRoute><DocumentDetailsPage /></ProtectedRoute>} />
            <Route path="/versions/:id" element={<ProtectedRoute><VersionDetailsPage /></ProtectedRoute>} />

            {/* --- CREATION (Auth + Not Staff) --- */}
            <Route path="/documents/create" element={
              <ProtectedRoute>
                <NotStaffRoute><CreateDocumentPage /></NotStaffRoute>
              </ProtectedRoute>
            } />
            <Route path="/documents/:id/create-version" element={
              <ProtectedRoute>
                <NotStaffRoute><CreateVersionPage /></NotStaffRoute>
              </ProtectedRoute>
            } />

            {/* --- REVIEWS: not reader-only (staff / elevated global roles / superuser) --- */}
            <Route path="/reviews" element={
              <ProtectedRoute>
                <ReviewsProtectedRoute><ReviewPage /></ReviewsProtectedRoute>
              </ProtectedRoute>
            } />
            <Route path="/version-review/:id" element={
              <ProtectedRoute>
                <ReviewsProtectedRoute><VersionReviewPage /></ReviewsProtectedRoute>
              </ProtectedRoute>
            } />

            {/* --- ADMIN ONLY (is_staff & is_superuser) --- */}
            <Route path="/manage-users" element={
              <RoleProtectedRoute roleRequired="admin">
                <ManageUsers />
              </RoleProtectedRoute>
            } />
            <Route path="/audit-log" element={
              <RoleProtectedRoute roleRequired="admin">
                <AuditLogPage />
              </RoleProtectedRoute>
            } />

            {/* --- ERRORS --- */}
            <Route path="/forbidden" element={<ForbiddenPage />} />
            <Route path="/server-error" element={<ServerErrorPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>

        <ScrollUp />
        <Footer />
      </div>
    </BrowserRouter>
  );
}