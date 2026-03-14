import { useState } from "react";
import { Link } from "react-router-dom";
import {
  GitBranch, Star, CheckCircle, XCircle, RefreshCw, AlertTriangle,
  Info, Plus, Download, Trash2, Edit, Eye, Zap, Lock, Clock,
  TrendingUp, MoreHorizontal, Shield, Upload, GitMerge, Filter,
  Check, X, Users, BarChart2, ArrowRight,
} from "lucide-react";
import Animate from "@/components/animation/Animate.jsx";
import notify from "@/components/toaster/notify";

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
export default function HomePage() {
  const [activeTab, setActiveTab] = useState(0);
  const [rating, setRating] = useState(3);
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="space-y-8">

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <Animate variant="fade-down" delay={0}>
        <div className="rounded-2xl bg-gradient-to-r from-primary to-primary/70 p-8 overflow-hidden">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <div className="badge bg-glass-white text-white border-white/20 mb-3">v2.5.0 · Internal</div>
              <h1 className="text-white text-3xl font-bold">Auth Service</h1>
              <p className="text-white/75 text-sm mt-1">JWT · SSO · Azure AD · Spring Boot 3.3</p>
              <div className="flex gap-2 mt-4">
                <Link to="/repos" className="btn btn-sm bg-white text-primary hover:bg-white/90 gap-1 font-semibold"><GitBranch size={12} />Repos</Link>
                <Link to="/teams" className="btn btn-sm bg-glass-white border-white/20 text-white hover:bg-white/20 gap-1"><Users size={12} />Teams</Link>
                <Link to="/analytics" className="btn btn-sm bg-glass-white border-white/20 text-white hover:bg-white/20 gap-1"><BarChart2 size={12} />Analytics</Link>
              </div>
            </div>
            <div className="flex flex-col gap-2 items-end">
              <div className="stats bg-glass-white border-white/20 text-white shadow-none">
                <div className="stat py-3 px-5">
                  <div className="stat-title text-white/70 text-xs">Last Deploy</div>
                  <div className="stat-value text-white text-lg">2h ago</div>
                  <div className="stat-desc text-white/60 text-xs">Staging · Passed</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Animate>

      {/* ── Toast Demo ─────────────────────────────────────────────────────── */}
      <Animate delay={50}>
        <div className="card bg-base-200 p-5">
          <h2 className="text-xs font-semibold tracking-widest uppercase text-base-content/50 mb-3">Notifications</h2>
          <div className="flex flex-wrap gap-2">
            <button className="btn btn-success btn-sm" onClick={() => notify.success("Branch merged successfully.")}>Success</button>
            <button className="btn btn-error btn-sm" onClick={() => notify.error("Pipeline failed on SAST stage.")}>Error</button>
            <button className="btn btn-warning btn-sm" onClick={() => notify.warning("Branch is 14 commits behind.")}>Warning</button>
            <button className="btn btn-info btn-sm" onClick={() => notify.info("New design tokens available.")}>Info</button>
            <button className="btn btn-ghost btn-sm" onClick={() => notify.loading("Deploying to staging...")}>Loading</button>
          </div>
        </div>
      </Animate>

      {/* ── Stats ──────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((s, i) => (
          <Animate key={s.label} delay={i * 60}>
            <div className={`card ${s.bg} border border-base-300 p-4`}>
              <p className="text-xs text-base-content/50 mb-1">{s.label}</p>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className={`text-xs mt-1 flex items-center gap-1 ${s.up ? "text-success" : "text-error"}`}>
                <TrendingUp size={10} />{s.trend}
              </p>
            </div>
          </Animate>
        ))}
      </div>

      {/* ── Alerts ─────────────────────────────────────────────────────────── */}
      <Animate>
        <div className="flex flex-col gap-2">
          <div className="alert alert-success text-sm py-2.5"><CheckCircle size={15} /><span>Pipeline passed all 48 checks.</span></div>
          <div className="alert alert-error   text-sm py-2.5"><XCircle size={15} /><span>Merge conflict in <code className="font-mono text-xs">src/auth/token.ts</code></span></div>
          <div className="alert alert-warning text-sm py-2.5"><AlertTriangle size={15} /><span>Branch is 14 commits behind main.</span></div>
          <div className="alert alert-info    text-sm py-2.5"><Info size={15} /><span>New SAP Horizon design tokens available.</span></div>
        </div>
      </Animate>

      {/* ── Commit Table ───────────────────────────────────────────────────── */}
      <Animate variant="scale-up">
        <div className="card bg-base-200 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-base-300">
            <div>
              <p className="font-semibold text-sm text-base-content">Recent Commits</p>
              <p className="text-xs text-base-content/50">main · 1,247 total</p>
            </div>
            <div className="flex gap-2">
              <button className="btn btn-ghost btn-xs gap-1 text-base-content"><Filter size={11} />Filter</button>
              <button className="btn btn-primary btn-xs gap-1"><Download size={11} />Export</button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="table table-sm">
              <thead>
                <tr className="bg-base-300 text-xs text-base-content/60">
                  <th>Commit</th><th>Author</th>
                  <th className="hidden sm:table-cell">Branch</th>
                  <th className="hidden md:table-cell">Changes</th>
                  <th>Status</th><th>Time</th>
                </tr>
              </thead>
              <tbody>
                {COMMITS.map((c) => {
                  const s = STATUS_MAP[c.status];
                  const Icon = s.icon;
                  return (
                    <tr key={c.hash} className="hover cursor-pointer">
                      <td>
                        <p className="font-medium text-sm text-base-content">{c.msg}</p>
                        <code className="text-xs font-mono text-primary">{c.hash}</code>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className={`w-6 h-6 rounded-full ${c.avBg} flex items-center justify-center text-primary-content text-[10px] font-bold`}>{c.av}</div>
                          <span className="text-xs text-base-content/70 hidden lg:block">{c.author}</span>
                        </div>
                      </td>
                      <td className="hidden sm:table-cell">
                        <span className="badge badge-ghost badge-sm font-mono text-[10px] gap-1 text-base-content/70">
                          <GitBranch size={8} />{c.branch}
                        </span>
                      </td>
                      <td className="hidden md:table-cell">
                        <span className="text-success text-xs font-mono font-medium">+{c.adds}</span>{" "}
                        <span className="text-error text-xs font-mono font-medium">-{c.dels}</span>
                      </td>
                      <td>
                        <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${s.bg} ${s.cls}`}>
                          <Icon size={9} />{c.status}
                        </span>
                      </td>
                      <td className="text-xs text-base-content/50 whitespace-nowrap">
                        <Clock size={10} className="inline mr-1" />{c.time}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </Animate>

      {/* ── Glass Cards ────────────────────────────────────────────────────── */}
      <Animate>
        <h2 className="text-xs font-semibold tracking-widest uppercase text-base-content/50 mb-4">Glass Cards</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Primary Glass", bg: "bg-primary/10", border: "border-primary/20", icon: Zap, color: "text-primary" },
            { label: "Accent Glass", bg: "bg-accent/10", border: "border-accent/20", icon: Star, color: "text-accent" },
            { label: "Purple Glass", bg: "bg-glass-purple", border: "border-purple/20", icon: Shield, color: "text-purple" },
            { label: "Teal Glass", bg: "bg-glass-teal", border: "border-teal/20", icon: GitMerge, color: "text-teal" },
          ].map(({ label, bg, border, icon: Icon, color }) => (
            <div key={label} className={`card ${bg} border ${border} p-5`}>
              <Icon size={20} className={`${color} mb-3`} />
              <p className={`font-semibold text-sm ${color}`}>{label}</p>
              <p className="text-xs text-base-content/50 mt-1">Transparent surface</p>
            </div>
          ))}
        </div>
      </Animate>

      {/* ── Badges ─────────────────────────────────────────────────────────── */}
      <Animate>
        <div className="card bg-base-200 p-6">
          <h2 className="text-xs font-semibold tracking-widest uppercase text-base-content/50 mb-4">Badges</h2>
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="badge badge-primary">Primary</span>
            <span className="badge badge-secondary">Secondary</span>
            <span className="badge badge-accent">Accent</span>
            <span className="badge badge-ghost">Ghost</span>
            <span className="badge badge-outline">Outline</span>
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="badge badge-success gap-1"><CheckCircle size={10} />Passing</span>
            <span className="badge badge-error gap-1"><XCircle size={10} />Failed</span>
            <span className="badge badge-warning gap-1"><AlertTriangle size={10} />Review</span>
            <span className="badge badge-info gap-1"><RefreshCw size={10} />Running</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="badge bg-purple/20 text-purple border-purple/20 font-medium">feat</span>
            <span className="badge bg-teal/20 text-teal border-teal/20 font-medium">fix</span>
            <span className="badge bg-accent/15 text-accent border-accent/20 font-medium">chore</span>
            <span className="badge bg-primary/15 text-primary border-primary/20 font-medium">docs</span>
            <span className="badge bg-error/15 text-error border-error/20 font-medium">breaking</span>
          </div>
        </div>
      </Animate>

      {/* ── Repo Cards ─────────────────────────────────────────────────────── */}
      <Animate>
        <h2 className="text-xs font-semibold tracking-widest uppercase text-base-content/50 mb-4">Repositories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {REPOS.map((r, i) => (
            <Animate key={r.name} delay={i * 80}>
              <div className={`card ${r.glass} border ${r.border} hover:scale-[1.02] transition-transform cursor-pointer`}>
                <div className="card-body p-4 gap-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-lg ${r.iconBg} flex items-center justify-center`}>
                      <GitBranch size={14} className="text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-base-content leading-none">{r.name}</p>
                      <p className="text-[10px] text-base-content/50 mt-0.5">{r.lang}</p>
                    </div>
                  </div>
                  <p className="text-xs text-base-content/60">{r.desc}</p>
                  <div className="flex items-center gap-4 text-xs text-base-content/50 pt-1 border-t border-base-300">
                    <span className="flex items-center gap-1"><Star size={10} />{r.stars}</span>
                    <span className="flex items-center gap-1"><GitBranch size={10} />{r.forks}</span>
                    <span className="ml-auto flex items-center gap-1 text-success font-medium"><CheckCircle size={10} />Active</span>
                  </div>
                </div>
              </div>
            </Animate>
          ))}
        </div>
      </Animate>

      {/* ── Forms + Progress ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Animate variant="fade-right">
          <div className="card bg-base-200 p-6">
            <h2 className="text-xs font-semibold tracking-widest uppercase text-base-content/50 mb-4">Form Controls</h2>
            <div className="flex flex-col gap-3">
              <div className="form-control">
                <label className="label pb-1"><span className="label-text text-xs text-base-content/70">Repository Name</span></label>
                <input className="input input-bordered input-sm text-base-content" defaultValue="auth-service" />
              </div>
              <div className="form-control">
                <label className="label pb-1"><span className="label-text text-xs text-base-content/70">Default Branch</span></label>
                <select className="select select-bordered select-sm text-base-content">
                  <option>main</option><option>develop</option><option>staging</option>
                </select>
              </div>
              <div className="form-control">
                <label className="label pb-1"><span className="label-text text-xs text-base-content/70">Description</span></label>
                <textarea className="textarea textarea-bordered text-sm resize-none text-base-content" rows={2} defaultValue="SAP authentication microservice." />
              </div>
              <div className="flex flex-wrap gap-4">
                {["Protected", "Auto-merge", "Require CI"].map((l, i) => (
                  <label key={l} className="flex items-center gap-2 cursor-pointer text-sm text-base-content">
                    <input type="checkbox" className="checkbox checkbox-primary checkbox-sm" defaultChecked={i !== 1} />{l}
                  </label>
                ))}
              </div>
              <div className="form-control">
                <label className="label pb-1">
                  <span className="label-text text-xs text-base-content/70">Coverage Threshold</span>
                  <span className="label-text-alt text-primary font-mono text-xs font-semibold">80%</span>
                </label>
                <input type="range" min={0} max={100} defaultValue={80} className="range range-primary range-sm" />
              </div>
              <div className="flex gap-4">
                {["Internal", "Private", "Public"].map((v) => (
                  <label key={v} className="flex items-center gap-2 cursor-pointer text-sm text-base-content">
                    <input type="radio" name="vis" className="radio radio-primary radio-sm" defaultChecked={v === "Internal"} />{v}
                  </label>
                ))}
              </div>
              <button
                className="btn btn-primary btn-sm self-start gap-1"
                onClick={() => notify.success("Settings saved.")}
              >
                <Check size={13} />Save
              </button>
            </div>
          </div>
        </Animate>

        <div className="flex flex-col gap-4">
          <Animate variant="fade-left">
            <div className="card bg-base-200 p-6">
              <h2 className="text-xs font-semibold tracking-widest uppercase text-base-content/50 mb-4">Progress</h2>
              <div className="flex flex-col gap-3">
                {[
                  { label: "Test Coverage", val: 82, cls: "progress-primary" },
                  { label: "Build Progress", val: 65, cls: "progress-warning" },
                  { label: "Deployment", val: 100, cls: "progress-success" },
                  { label: "Migration", val: 38, cls: "progress-error" },
                ].map(({ label, val, cls }) => (
                  <div key={label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-base-content/60">{label}</span>
                      <span className="font-mono font-semibold text-base-content">{val}%</span>
                    </div>
                    <progress className={`progress ${cls} h-2`} value={val} max={100} />
                  </div>
                ))}
              </div>
            </div>
          </Animate>

          <Animate variant="fade-left" delay={80}>
            <div className="card bg-base-200 p-6">
              <h2 className="text-xs font-semibold tracking-widest uppercase text-base-content/50 mb-4">Loading States</h2>
              <div className="flex gap-5 items-center flex-wrap">
                {[
                  { type: "loading-spinner", color: "text-primary", label: "spinner" },
                  { type: "loading-dots", color: "text-purple", label: "dots" },
                  { type: "loading-ring", color: "text-teal", label: "ring" },
                  { type: "loading-bars", color: "text-accent", label: "bars" },
                  { type: "loading-ball", color: "text-success", label: "ball" },
                ].map(({ type, color, label }) => (
                  <div key={label} className="flex flex-col items-center gap-1">
                    <span className={`loading ${type} loading-md ${color}`} />
                    <span className="text-[10px] text-base-content/50">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </Animate>
        </div>
      </div>

      {/* ── Tabs + Accordion ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Animate variant="fade-right">
          <div className="card bg-base-200 p-6">
            <h2 className="text-xs font-semibold tracking-widest uppercase text-base-content/50 mb-4">Tabs</h2>
            <div className="tabs tabs-bordered mb-4">
              {["Overview", "Pipelines", "Security", "Settings"].map((t, i) => (
                <button
                  key={t}
                  className={`tab text-sm ${activeTab === i ? "tab-active text-primary border-primary font-medium" : "text-base-content/60"}`}
                  onClick={() => setActiveTab(i)}
                >{t}</button>
              ))}
            </div>
            <p className="text-sm text-base-content/70 min-h-[48px]">
              {["1,247 commits · 5 branches · 34 open MRs · 89 stars.",
                "Build 2m 14s · Test 4m 38s · Deploy 1m 02s — all passing.",
                "SAST: 0 critical · 2 medium · 5 low. Last scanned 2h ago.",
                "Auto-merge on, protected branches enforced, CODEOWNERS active.",
              ][activeTab]}
            </p>
          </div>
        </Animate>

        <Animate variant="fade-left">
          <div className="card bg-base-200 p-6">
            <h2 className="text-xs font-semibold tracking-widest uppercase text-base-content/50 mb-4">Accordion</h2>
            <div className="flex flex-col gap-2">
              {[
                { q: "How are protected branches enforced?", a: "Require passing CI and 2+ approvals. Force-push is disabled." },
                { q: "What triggers a pipeline run?", a: "Every push to any branch, plus MR pipelines against merged result." },
                { q: "How do I configure code owners?", a: "Add a CODEOWNERS file at repo root using .gitignore-style patterns." },
              ].map((item) => (
                <div key={item.q} className="collapse collapse-arrow bg-base-300 rounded-lg">
                  <input type="checkbox" />
                  <div className="collapse-title text-sm font-medium py-3 min-h-0 text-base-content">{item.q}</div>
                  <div className="collapse-content text-xs text-base-content/60 leading-relaxed pb-3">{item.a}</div>
                </div>
              ))}
            </div>
          </div>
        </Animate>
      </div>

      {/* ── Team + Rating + Steps ──────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Animate variant="fade-right">
          <div className="card bg-base-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-semibold tracking-widest uppercase text-base-content/50">Team</h2>
              <button className="btn btn-primary btn-xs gap-1" onClick={() => notify.info("Invite sent.")}><Plus size={11} />Invite</button>
            </div>
            <div className="flex flex-col gap-3">
              {TEAM.map((m) => (
                <div key={m.name} className="flex items-center gap-3 py-2 border-b border-base-300 last:border-0">
                  <div className={`w-9 h-9 rounded-full ${m.bg} flex items-center justify-center text-white text-xs font-bold shrink-0`}>{m.av}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-base-content">{m.name}</p>
                    <p className="text-xs text-base-content/50">{m.role}</p>
                  </div>
                  <span className={`badge badge-sm ${m.tagCls}`}>{m.tag}</span>
                  <div className="dropdown dropdown-end">
                    <button tabIndex={0} className="btn btn-ghost btn-xs btn-circle text-base-content"><MoreHorizontal size={13} /></button>
                    <ul tabIndex={0} className="dropdown-content menu menu-sm bg-base-100 shadow-lg rounded-box w-36 z-10 border border-base-300 text-xs">
                      <li><a className="gap-2 text-base-content"><Edit size={11} />Edit Role</a></li>
                      <li><a className="gap-2 text-base-content"><Eye size={11} />View Profile</a></li>
                      <li><a className="gap-2 text-error" onClick={() => notify.error("Member removed.")}><Trash2 size={11} />Remove</a></li>
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Animate>

        <div className="flex flex-col gap-4">
          <Animate variant="fade-left">
            <div className="card bg-base-200 p-6">
              <h2 className="text-xs font-semibold tracking-widest uppercase text-base-content/50 mb-4">Rating</h2>
              <div className="rating rating-lg">
                {[1, 2, 3, 4, 5].map((v) => (
                  <input key={v} type="radio" name="rating" className="mask mask-star-2 bg-accent" checked={rating === v} onChange={() => setRating(v)} />
                ))}
              </div>
              <p className="text-xs text-base-content/50 mt-2">{rating}/5 — Code quality score</p>
            </div>
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
        <div className="card bg-base-200 p-6">
          <h2 className="text-xs font-semibold tracking-widest uppercase text-base-content/50 mb-4">Tooltips & Keyboard Shortcuts</h2>
          <div className="flex flex-wrap gap-3 mb-5">
            <div className="tooltip tooltip-primary" data-tip="Create repository"><button className="btn btn-primary btn-sm gap-1"><Plus size={13} />New</button></div>
            <div className="tooltip tooltip-success" data-tip="Pipeline passing"><button className="btn btn-success btn-sm gap-1"><CheckCircle size={13} />CI</button></div>
            <div className="tooltip tooltip-error" data-tip="Force-push blocked"><button className="btn btn-error btn-outline btn-sm gap-1"><Lock size={13} />Protected</button></div>
            <div className="tooltip" data-tip="Clone via SSH"><button className="btn btn-ghost btn-sm gap-1 text-base-content"><Download size={13} />Clone</button></div>
          </div>
          <div className="flex flex-wrap gap-3 items-center text-sm text-base-content/60">
            <span>Search</span><kbd className="kbd kbd-sm">⌘</kbd><kbd className="kbd kbd-sm">K</kbd>
            <span className="ml-3">Commit</span><kbd className="kbd kbd-sm">⌘</kbd><kbd className="kbd kbd-sm">Enter</kbd>
            <span className="ml-3">Branch</span><kbd className="kbd kbd-sm">⌘</kbd><kbd className="kbd kbd-sm">B</kbd>
          </div>
        </div>
      </Animate>

      {/* ── Modals ─────────────────────────────────────────────────────────── */}
      <Animate>
        <div className="card bg-base-200 p-6">
          <h2 className="text-xs font-semibold tracking-widest uppercase text-base-content/50 mb-4">Modals</h2>
          <div className="flex flex-wrap gap-3">
            <button className="btn btn-error btn-sm gap-1" onClick={() => document.getElementById("modal-delete").showModal()}><Trash2 size={13} />Delete</button>
            <button className="btn btn-outline btn-sm gap-1 text-base-content" onClick={() => document.getElementById("modal-info").showModal()}><Info size={13} />Info</button>
            <button className="btn btn-primary btn-sm gap-1" onClick={() => document.getElementById("modal-form").showModal()}><Plus size={13} />New Branch</button>
          </div>

          <dialog id="modal-delete" className="modal">
            <div className="modal-box max-w-sm bg-base-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-error/15 flex items-center justify-center shrink-0"><Trash2 size={16} className="text-error" /></div>
                <div>
                  <h3 className="font-bold text-base-content">Delete Repository</h3>
                  <p className="text-xs text-base-content/50">This cannot be undone.</p>
                </div>
              </div>
              <p className="text-sm text-base-content/70 mb-4">Permanently delete <strong className="text-base-content">auth-service</strong>?</p>
              <div className="modal-action gap-2">
                <form method="dialog"><button className="btn btn-ghost btn-sm text-base-content">Cancel</button></form>
                <form method="dialog">
                  <button className="btn btn-error btn-sm gap-1" onClick={() => notify.error("Repository deleted.")}><Trash2 size={12} />Delete</button>
                </form>
              </div>
            </div>
            <form method="dialog" className="modal-backdrop"><button>close</button></form>
          </dialog>

          <dialog id="modal-info" className="modal">
            <div className="modal-box max-w-sm bg-base-100">
              <h3 className="font-bold flex items-center gap-2 mb-4 text-base-content"><Info size={16} className="text-info" />Pipeline Details</h3>
              <div className="flex flex-col gap-2 text-sm">
                {[["Build", "Passed ✓", "text-success"], ["Tests (48)", "Passed ✓", "text-success"], ["SAST", "Passed ✓", "text-success"], ["Deploy", "Running…", "text-warning"]].map(([k, v, c]) => (
                  <div key={k} className="flex justify-between border-b border-base-300 pb-2 last:border-0">
                    <span className="text-base-content/60">{k}</span>
                    <span className={`font-semibold ${c}`}>{v}</span>
                  </div>
                ))}
              </div>
              <div className="modal-action mt-4"><form method="dialog"><button className="btn btn-primary btn-sm">Close</button></form></div>
            </div>
            <form method="dialog" className="modal-backdrop"><button>close</button></form>
          </dialog>

          <dialog id="modal-form" className="modal">
            <div className="modal-box max-w-sm bg-base-100">
              <h3 className="font-bold mb-4 flex items-center gap-2 text-base-content"><GitBranch size={16} className="text-primary" />New Branch</h3>
              <div className="flex flex-col gap-3">
                <div className="form-control">
                  <label className="label pb-1"><span className="label-text text-xs text-base-content/70">Branch Name</span></label>
                  <input className="input input-bordered input-sm text-base-content" placeholder="feature/my-feature" />
                </div>
                <div className="form-control">
                  <label className="label pb-1"><span className="label-text text-xs text-base-content/70">Source</span></label>
                  <select className="select select-bordered select-sm text-base-content"><option>main</option><option>develop</option></select>
                </div>
              </div>
              <div className="modal-action gap-2">
                <form method="dialog"><button className="btn btn-ghost btn-sm text-base-content">Cancel</button></form>
                <form method="dialog">
                  <button className="btn btn-primary btn-sm gap-1" onClick={() => notify.success("Branch created.")}><Plus size={12} />Create</button>
                </form>
              </div>
            </div>
            <form method="dialog" className="modal-backdrop"><button>close</button></form>
          </dialog>
        </div>
      </Animate>

      {/* ── Upload + Chat ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Animate variant="fade-right">
          <div className="card bg-base-200 p-6">
            <h2 className="text-xs font-semibold tracking-widest uppercase text-base-content/50 mb-4">File Upload</h2>
            <div className="border-2 border-dashed border-base-300 hover:border-primary/50 rounded-xl p-8 flex flex-col items-center gap-3 transition-colors cursor-pointer">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Upload size={20} className="text-primary" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-base-content">Drop files or <span className="text-primary underline">browse</span></p>
                <p className="text-xs text-base-content/50 mt-1">.zip · .tar.gz · .json — max 50 MB</p>
              </div>
              <button className="btn btn-primary btn-sm" onClick={() => notify.loading("Uploading...")}>Select Files</button>
            </div>
          </div>
        </Animate>

        <Animate variant="fade-left">
          <div className="card bg-base-200 p-6">
            <h2 className="text-xs font-semibold tracking-widest uppercase text-base-content/50 mb-4">Chat Bubbles</h2>
            <div className="flex flex-col gap-3">
              <div className="chat chat-start">
                <div className="chat-image avatar placeholder">
                  <div className="w-8 rounded-full bg-purple text-white"><span className="text-xs font-bold">SM</span></div>
                </div>
                <div className="chat-bubble chat-bubble-primary text-sm">Can we merge dark mode today?</div>
                <div className="chat-footer text-xs text-base-content/50 mt-0.5">Stefan · 10:42 AM</div>
              </div>
              <div className="chat chat-end">
                <div className="chat-image avatar placeholder">
                  <div className="w-8 rounded-full bg-primary text-primary-content"><span className="text-xs font-bold">MP</span></div>
                </div>
                <div className="chat-bubble chat-bubble-success text-sm">CI is passing. I'll approve now.</div>
                <div className="chat-footer text-xs text-base-content/50 mt-0.5">Maria · 10:45 AM</div>
              </div>
              <div className="chat chat-start">
                <div className="chat-image avatar placeholder">
                  <div className="w-8 rounded-full bg-teal text-white"><span className="text-xs font-bold">AK</span></div>
                </div>
                <div className="chat-bubble text-sm">One more review comment first.</div>
                <div className="chat-footer text-xs text-base-content/50 mt-0.5">Amal · 10:48 AM</div>
              </div>
            </div>
          </div>
        </Animate>
      </div>

      {/* ── Danger Zone ────────────────────────────────────────────────────── */}
      <Animate>
        <div className="card bg-base-200 p-6 border border-error/20">
          <h2 className="text-xs font-semibold tracking-widest uppercase text-error mb-4">Danger Zone</h2>
          <div className="flex flex-col gap-3">
            {[
              { label: "Archive Repository", desc: "Mark as archived. No new commits or MRs.", btn: "Archive", cls: "btn-warning btn-outline", toast: () => notify.warning("Repository archived.") },
              { label: "Transfer Ownership", desc: "Transfer this repo to another namespace.", btn: "Transfer", cls: "btn-warning btn-outline", toast: () => notify.warning("Ownership transferred.") },
              { label: "Delete Repository", desc: "Permanently delete all data.", btn: "Delete", cls: "btn-error", toast: () => notify.error("Repository deleted.") },
            ].map(({ label, desc, btn, cls, toast }) => (
              <div key={label} className="flex items-center justify-between gap-4 py-3 border-b border-base-300 last:border-0">
                <div>
                  <p className="text-sm font-medium text-base-content">{label}</p>
                  <p className="text-xs text-base-content/50">{desc}</p>
                </div>
                <button className={`btn btn-sm ${cls} shrink-0`} onClick={toast}>{btn}</button>
              </div>
            ))}
          </div>
        </div>
      </Animate>

      {/* ── Navigate ───────────────────────────────────────────────────────── */}
      <Animate>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { to: "/repos", label: "Repositories", desc: "Browse all repos", color: "text-primary", bg: "bg-primary/10", border: "border-primary/20" },
            { to: "/teams", label: "Teams", desc: "Manage team members", color: "text-purple", bg: "bg-glass-purple", border: "border-purple/20" },
            { to: "/analytics", label: "Analytics", desc: "View metrics", color: "text-teal", bg: "bg-glass-teal", border: "border-teal/20" },
          ].map((n) => (
            <Link key={n.to} to={n.to} className={`card ${n.bg} border ${n.border} p-5 hover:scale-[1.02] transition-transform`}>
              <p className={`font-semibold text-sm ${n.color}`}>{n.label}</p>
              <p className="text-xs text-base-content/50 mt-1">{n.desc}</p>
              <div className={`flex items-center gap-1 text-xs mt-3 ${n.color}`}>Go <ArrowRight size={11} /></div>
            </Link>
          ))}
        </div>
      </Animate>

    </div>
  );
}