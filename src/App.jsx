import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import HomePage     from "@/pages/HomePage";
import ReposPage    from "@/pages/ReposPage";
import TeamsPage    from "@/pages/TeamsPage";
import AnalyticsPage from "@/pages/AnalyticsPage";
import NotFoundPage from "@/pages/NotFoundPage";

import useTheme from "@/hooks/useTheme";

export default function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <BrowserRouter>
      <div data-theme={theme} className="min-h-screen bg-base-100 flex flex-col">
        <Navbar theme={theme} toggleTheme={toggleTheme} />

        <main className="flex-1 min-h-[100vh] px-4 sm:px-6 py-8 overflow-hidden">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/repos" element={<ReposPage />} />
            <Route path="/teams" element={<TeamsPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}