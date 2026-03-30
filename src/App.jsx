import { BrowserRouter, Routes, Route } from "react-router-dom";

// Components like Navbar, Footer, Scroll
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollUp from "@/components/layout/ScrollUp";

// Login and Register
import Login from "@/pages/Login";
import Register from "@/pages/Register";

// Pages
import HomePage from "@/pages/homepage/HomePage";
import ReposPage from "@/pages/ReposPage";
import TeamsPage from "@/pages/TeamsPage";
import AnalyticsPage from "@/pages/AnalyticsPage";
import ProfilePage from "@/pages/ProfilePage";
import NotFoundPage from "@/pages/NotFoundPage";
import GettingStarted from "@/pages/GettingStarted";
import Demo from "@/pages/homepage/Demo.jsx";

import DocumentsPage from "@/pages/documents/DocumentsPage";
import DocumentDetailsPage from "@/pages/documents/DocumentDetailsPage";
import CreateDocumentPage from "@/pages/documents/CreateDocumentPage";
import CreateVersionPage from "@/pages/documents/CreateVersionPage";

import VersionReviewPage from "@/pages/VersionReviewPage.jsx";
import ReviewPage from "@/pages/ReviewPage.jsx";
import ForbiddenPage from "@/pages/ForbiddenPage";
import ServerErrorPage from "@/pages/ServerErrorPage";
import ProtectedRoute from "@/components/protected-route/ProtectedRoute";
import AdminPage from "@/pages/AdminPage.jsx";

import useTheme from "@/hooks/useTheme";

export default function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <BrowserRouter>
      <div
        data-theme={theme}
        className="min-h-[100vh] bg-base-100 overflow-x-hidden"
      >
        <Navbar theme={theme} toggleTheme={toggleTheme} />

        <main className="min-h-[100vh] overflow-x-hidden">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/repos" element={<ReposPage />} />
            <Route path="/teams" element={<TeamsPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/documents" element={<DocumentsPage />} />
            <Route path="/documents/create" element={<CreateDocumentPage />} />
            <Route
              path="/documents/:id/create-version"
              element={<CreateVersionPage />}
            />
            <Route path="/documents/:id" element={<DocumentDetailsPage />} />

            <Route path="/getting-started" element={<GettingStarted />} />
            <Route path="/demo" element={<Demo />} />
            <Route path="/version-review/:id" element={<VersionReviewPage />} />
            <Route path="/reviews" element={<ReviewPage />} />
            <Route path="/forbidden" element={<ForbiddenPage />} />
            <Route path="/server-error" element={<ServerErrorPage />} />
            <Route path="/admin" element={<AdminPage />} />

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>

        <ScrollUp />
        <Footer />
      </div>
    </BrowserRouter>
  );
}