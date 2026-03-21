import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import {
  GitBranch, Star, CheckCircle, XCircle, RefreshCw, AlertTriangle,
  Info, Plus, Download, Trash2, Edit, Eye, Zap, Lock, Clock,
  TrendingUp, MoreHorizontal, Shield, Upload, GitMerge, Filter,
  Check, X, Users, BarChart2, ArrowRight,
  AppleIcon,
} from "lucide-react";

import Animate from "@/components/animation/Animate.jsx";
import Hero from "./components/Hero.jsx";
import ToastDemo from "./components/ToastDemo.jsx";
import Stats from "./components/Stats.jsx";
import Alerts from "./components/Alerts.jsx";
import CommitTable from "./components/CommitTable.jsx";
import GlassCards from "./components/GlassCard.jsx";
import Badges from "./components/Badges.jsx";
import RepoCard from "./components/RepoCard.jsx";
import FormsAndProgress from "./components/FormsAndProgress.jsx";
import Tabs from "./components/Tabs.jsx";
import Accordion from "./components/Accordion.jsx";
import Team from "./components/Team.jsx";
import Rating from "./components/Rating.jsx";
import TooltipKBD from "./components/TooltipKBD.jsx";
import Modals from "./components/Modals.jsx";
import UploadFile from "./components/UploadFile.jsx";
import Chat from "./components/Chat.jsx";
import DangerZone from "./components/DangerZone.jsx";
import Navigate from "./components/Navigate.jsx";

// ─── Data ─────────────────────────────────────────────────────────────────────
const STATS = [
  { label: "Commits", value: "12,847", trend: "+8.4%", up: true, color: "text-primary", bg: "bg-primary/10" },
  { label: "Open MRs", value: "34", trend: "-3", up: false, color: "text-teal", bg: "bg-glass-teal" },
  { label: "Branches", value: "128", trend: "+12", up: true, color: "text-purple", bg: "bg-glass-purple" },
  { label: "Pass Rate", value: "97.2%", trend: "+1.1%", up: true, color: "text-success", bg: "bg-success/10" },
];

const COMMITS = [
  { hash: "a3f2c1d", msg: "feat: JWT refresh token rotation", author: "M. Petrov", av: "MP", avBg: "bg-primary", branch: "main", adds: 142, dels: 38, status: "success", time: "2h ago" },
  { hash: "b7e8f2a", msg: "fix: race condition in session handler", author: "S. Müller", av: "SM", avBg: "bg-purple", branch: "main", adds: 28, dels: 15, status: "success", time: "5h ago" },
  { hash: "c1d4e5b", msg: "feat(ui): dark mode toggle", author: "A. Khoury", av: "AK", avBg: "bg-teal", branch: "feature/dark-mode", adds: 340, dels: 12, status: "running", time: "1d ago" },
  { hash: "d9a2c7f", msg: "chore: update deps", author: "L. Chen", av: "LC", avBg: "bg-accent", branch: "main", adds: 45, dels: 89, status: "failed", time: "2d ago" },
];

const STATUS_MAP = {
  success: { cls: "text-success", bg: "bg-success/15", icon: CheckCircle },
  failed: { cls: "text-error", bg: "bg-error/15", icon: XCircle },
  running: { cls: "text-warning", bg: "bg-warning/15", icon: RefreshCw },
};

const REPOS = [
  { name: "auth-service", lang: "Java", stars: 89, forks: 7, iconBg: "bg-primary", glass: "bg-primary/10", border: "border-primary/20", desc: "JWT + SSO microservice" },
  { name: "ui-components", lang: "TypeScript", stars: 142, forks: 22, iconBg: "bg-purple", glass: "bg-glass-purple", border: "border-purple/20", desc: "Shared React component library" },
  { name: "data-pipeline", lang: "Python", stars: 34, forks: 4, iconBg: "bg-teal", glass: "bg-glass-teal", border: "border-teal/20", desc: "ETL pipeline for analytics" },
];

const TEAM = [
  { name: "Maria Petrov", role: "Lead Engineer", av: "MP", bg: "bg-primary", tag: "Admin", tagCls: "badge-primary" },
  { name: "Stefan Müller", role: "Backend Eng.", av: "SM", bg: "bg-purple", tag: "Maintainer", tagCls: "badge-ghost" },
  { name: "Amal Khoury", role: "Frontend Eng.", av: "AK", bg: "bg-teal", tag: "Developer", tagCls: "badge-ghost" },
  { name: "Li Chen", role: "DevOps Eng.", av: "LC", bg: "bg-accent", tag: "Developer", tagCls: "badge-ghost" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
const HomePage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [rating, setRating] = useState(3);
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="space-y-8  px-4 sm:px-6 py-8">

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <Animate variant="fade-down" delay={0}>
        <Hero />
      </Animate>

      {/* ── Toast Demo ─────────────────────────────────────────────────────── */}
      <Animate delay={50}>
        <ToastDemo />
      </Animate>

      {/* ── Stats ──────────────────────────────────────────────────────────── */}

      <Stats stats={STATS} />

      {/* ── Alerts ─────────────────────────────────────────────────────────── */}
      <Animate>
        <Alerts />
      </Animate>

      {/* ── Commit Table 
      ──────────────────────────────────────────────────── */}
      <Animate variant="scale-up">
        <CommitTable commits={COMMITS} statusMap={STATUS_MAP} />
      </Animate>

      {/* ── Glass Cards ────────────────────────────────────────────────────── */}
      <Animate>
        <GlassCards />
      </Animate>

      {/* ── Badges ─────────────────────────────────────────────────────────── */}
      <Animate>
        <Badges />
      </Animate>

      {/* ── Repo Cards ─────────────────────────────────────────────────────── */}
      <Animate>
        <RepoCard repos={REPOS} />
      </Animate>

      {/* ── Forms + Progress ───────────────────────────────────────────────── */}
      <FormsAndProgress />

      {/* ── Tabs + Accordion ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Animate variant="fade-right">
          <Tabs />
        </Animate>

        <Animate variant="fade-left">
          <Accordion />
        </Animate>
      </div>

      {/* ── Team + Rating + Steps ──────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Animate variant="fade-right">
          <Team members={TEAM} />
        </Animate>

        <div className="flex flex-col gap-4">
          <Animate variant="fade-left">
            <Rating />
          </Animate>

          <Animate variant="fade-left" delay={80}>
            <div className="card bg-base-200 p-6">
              <h2 className="text-xs font-semibold tracking-widest uppercase text-base-content/50 mb-4">Pipeline Steps</h2>
              <ul className="steps steps-vertical text-xs">
                <li className="step step-primary text-base-content">Push Code</li>
                <li className="step step-primary text-base-content">Run Tests</li>
                <li className="step step-primary text-base-content">SAST Scan</li>
                <li className="step text-base-content/60">Deploy Staging</li>
                <li className="step text-base-content/60">Deploy Prod</li>
              </ul>
            </div>
          </Animate>
        </div>
      </div>

      {/* ── Tooltips + KBD ─────────────────────────────────────────────────── */}
      <Animate>
        <TooltipKBD />
      </Animate>

      {/* ── Modals ─────────────────────────────────────────────────────────── */}
      <Animate>
        <Modals />
      </Animate>

      {/* ── Upload + Chat ──────────────────────────────────────────────────── */}
      <UploadFile />
      <Chat />

      {/* ── Danger Zone ────────────────────────────────────────────────────── */}
      <Animate>
        <DangerZone />
      </Animate>

      {/* ── Navigate ───────────────────────────────────────────────────────── */}
      <Animate>
        <Navigate />
      </Animate>

    </div>
  );
}

export default HomePage;