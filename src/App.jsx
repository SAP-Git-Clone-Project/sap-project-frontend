import { BrowserRouter, Routes, Route } from "react-router-dom";

// Layout & Widgets
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollUp from "@/components/widgets/ScrollUp";

// Auth & Guards
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import ProtectedRoute from "@/components/protected-route/ProtectedRoute";
import NotStaffRoute from "@/components/protected-route/NotStaffRoute";

// Hooks
import useTheme from "@/hooks/useTheme";

// Pages: General
import HomePage from "@/pages/homepage/HomePage";
import ProfilePage from "@/pages/profile/ProfilePage";;

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

export default function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <BrowserRouter>
      <div
        data-theme={theme}
        className="min-h-[100vh] bg-base-100"
      >
        <Navbar theme={theme} toggleTheme={toggleTheme} />

        <main className="min-h-[100vh] overflow-x-hidden">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile/:id"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/documents" element={
              <ProtectedRoute>
                <DocumentsPage />
              </ProtectedRoute>
            }
            />
            <Route path="/documents/create" element={
              <ProtectedRoute>
                <NotStaffRoute>
                <CreateDocumentPage />
                </NotStaffRoute>
              </ProtectedRoute>
            } />
            <Route path="/documents/:id/create-version" element= {
              <ProtectedRoute>
                <NotStaffRoute>
                  <CreateVersionPage />
                </NotStaffRoute>
                </ProtectedRoute>
            } />
            <Route path="/documents/:id" element={<DocumentDetailsPage />} />
            <Route path="/versions/:id" element={<VersionDetailsPage />} />
            <Route path="/version-review/:id" element={<VersionReviewPage />} />
            <Route path="/reviews" element={<ReviewPage />} />
            <Route path="/forbidden" element={<ForbiddenPage />} />
            <Route path="/server-error" element={<ServerErrorPage />} />
            <Route path="/manage-users" element={<ManageUsers />} />
            <Route path="/audit-log" element={<AuditLogPage />} />
            <Route path="/notifications" element={<ViewAllNotifications />} />

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>

        <ScrollUp />
        <Footer />
      </div>
    </BrowserRouter>
  );
}