import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import HomePage from "@/pages/homepage/HomePage";
import ReposPage from "@/pages/ReposPage";
import TeamsPage from "@/pages/TeamsPage";
import AnalyticsPage from "@/pages/AnalyticsPage";
import NotFoundPage from "@/pages/NotFoundPage";
import Login from "@/pages/Login";
import Register from "@/pages/Register";

import useTheme from "@/hooks/useTheme";

export default function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <BrowserRouter>
      <div data-theme={theme} className="min-h-[100vh] bg-base-100 overflow-x-hidden">
        <Navbar theme={theme} toggleTheme={toggleTheme} />

        <main className="min-h-[100vh]">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/repos" element={<ReposPage />} />
            <Route path="/teams" element={<TeamsPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}