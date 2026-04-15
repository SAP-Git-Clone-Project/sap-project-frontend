import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

import {
  FileText, ShieldCheck, Users, Zap,
  CheckCircle, Lock, Eye, EyeOff,
  RefreshCw, Search, Code, Braces, Database,
  ArrowRight, Star,
  Upload, UserPlus, UserCheck,
  GitCommit, Trash2, History,
  MessageSquare, FileCode, FileType, Clock,
  Quote, Sparkles, XCircle,
  Bell, BellRing, ClipboardList,
  Activity, AlertCircle, ShieldAlert, Crown
} from "lucide-react";

import {
  ScrollReveal,
  MagReveal,
  BlurReveal,
  StaggerReveal,
  CharReveal,
  WordReveal,
  LineReveal,
  KineticText,
  useGsapRefresh,
} from "@/components/gsap/index.jsx";

import GlassCard from "@/components/widgets/GlassCard.jsx";
import BackgroundEffects from "@/components/background/BackgroundEffects.jsx";

// Components
import FAQSection from "./components/FAQSection";
import Testimonials from "./components/Testimonials";

import "@/index.css";

const PartialIcon = () => (
  <span className="inline-flex items-center justify-center w-[15px] h-[15px] rounded-full border-2 border-warning/50 bg-warning/10 relative mx-auto">
    <span className="block w-[6px] h-[0.5px] bg-warning/70 absolute rotate-45" />
  </span>
);

const HomePage = () => {
  const { isAuthenticated } = useAuth();
  useGsapRefresh();

  const starIcons = Array.from({ length: 5 }).map((_, i) => (
    <Star key={i} size={13} fill="currentColor" className="text-warning" />
  ));

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      // 768px is a standard breakpoint for tablets/mobiles
      setIsMobile(window.innerWidth < 768);
    };

    // Check immediately on load
    checkScreenSize();

    // Listen for window resize
    window.addEventListener('resize', checkScreenSize);

    // Cleanup listener
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col items-center px-4 sm:px-6 text-center overflow-hidden bg-base-100">

      <BackgroundEffects length={isMobile ? 35 : 75} />

      {/* ══════════════════════════════════════ */}
      {/* ANNOUNCEMENT BADGE */}
      {/* ══════════════════════════════════════ */}
      <ScrollReveal y={-20} duration={0.4} start="top 99%" className="pt-6 pb-2 relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary backdrop-blur-sm">
          <Sparkles size={12} />
          <span>Simple version control for every document</span>
        </div>
      </ScrollReveal>

      {/* ══════════════════════════════════════ */}
      {/* HERO */}
      {/* ══════════════════════════════════════ */}
      <MagReveal>


      </MagReveal>
      <ScrollReveal y={25} duration={0.5} start="top 99%" className="space-y-7 max-w-7xl relative z-10 mb-8 pt-4">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-primary border border-primary/30 flex items-center justify-center shadow-lg shadow-primary/25">
            <Zap size={22} fill="white" className="text-white" />
          </div>
          <span className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            SAP <span className="text-primary">Hub</span>
          </span>
        </div>

        <MagReveal>
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-base-content leading-[1.05]">
            <KineticText
              className="block"
              stagger={0.02}
              y={40}
              rotateX={-70}
              duration={0.4}
              start="top 99%"
            >
              Your documents,
            </KineticText>

            {/* Applying the pure CSS class here */}
            <KineticText
              className="inline-block [transform-style:preserve-3d] [backface-visibility:hidden]"
              stagger={0.02}
              y={40}
              rotateX={-30}
              duration={0.4}
              delay={0.2}
              start="top 85%"
            >
              <div className="gradient-text-clip">
                version controlled.
              </div>
            </KineticText>
          </h1>
        </MagReveal>

        <WordReveal
          className="text-base-content/55 text-sm sm:text-base md:text-xl leading-relaxed max-w-2xl mx-auto font-light"
          stagger={0.02}
          y={20}
          duration={0.4}
          delay={0.4}
          start="top 99%"
        >
          Create a document, assign writers and reviewers, upload versions, and get every version approved. As the owner, see the full history — including deleted versions. Always.
        </WordReveal>

        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 pt-2">
          { (!isAuthenticated) && <Link
            to="/login"
            className="btn btn-primary btn-lg px-8 sm:px-10 rounded-2xl gap-2 shadow-xl shadow-primary/25 hover:shadow-primary/40 transition-all hover:scale-[1.02]"
          >
            Get Started Free
            <ArrowRight size={18} />
          </Link>}
          <a
            href="#how-it-works"
            className="btn btn-ghost btn-lg px-8 sm:px-10 rounded-2xl gap-2 border border-base-content/10 hover:border-base-content/25"
          >
            See How It Works
          </a>
        </div>

        <p className="text-[11px] sm:text-xs text-base-content/35 font-medium">
          Free to use · No credit card required · Set up in seconds
        </p>
      </ScrollReveal>

      {/* ══════════════════════════════════════ */}
      {/* SUPPORTED FILES */}
      {/* ══════════════════════════════════════ */}
      <div className="w-full max-w-7xl relative z-10 mb-8 py-6">
        <BlurReveal y={15} duration={0.4} className="mb-5">
          <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-base-content/25 font-bold">
            Supported file formats
          </p>
        </BlurReveal>

        <StaggerReveal
          stagger={0.05}
          y={20}
          duration={0.4}
          className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4"
        >
          {/* Documents */}
          <div className="bg-base-200/30 border border-base-content/5 rounded-2xl p-4 sm:p-5 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-3 pb-2.5 border-b border-base-content/5">
              <FileText size={13} className="text-primary/50" />
              <span className="text-[10px] uppercase tracking-[0.15em] font-bold text-primary/50">Documents</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {[".pdf", ".doc", ".docx", ".txt", ".md"].map((ext, i) => (
                <div key={i} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-primary/[0.04] border border-primary/10 text-[10px] font-mono font-semibold text-primary/60 hover:bg-primary/[0.08] hover:text-primary/80 transition-colors cursor-default">
                  <FileText size={13} />{ext}
                </div>
              ))}
            </div>
          </div>


          {/* Code */}
          <div className="bg-base-200/30 border border-base-content/5 rounded-2xl p-4 sm:p-5 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-3 pb-2.5 border-b border-base-content/5">
              <FileCode size={13} className="text-secondary/50" />
              <span className="text-[10px] uppercase tracking-[0.15em] font-bold text-secondary/50">Code</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { ext: ".java", icon: <FileCode size={13} /> },
                { ext: ".cpp", icon: <FileCode size={13} /> },
                { ext: ".py", icon: <FileCode size={13} /> },
                { ext: ".js", icon: <FileCode size={13} /> },
                { ext: ".ts", icon: <FileCode size={13} /> },
                { ext: ".html", icon: <FileCode size={13} /> },
                { ext: ".css", icon: <FileCode size={13} /> },
                { ext: ".sql", icon: <Database size={13} /> },
              ].map((f, i) => (
                <div key={i} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-secondary/[0.04] border border-secondary/10 text-[10px] font-mono font-semibold text-secondary/60 hover:bg-secondary/[0.08] hover:text-secondary/80 transition-colors cursor-default">
                  {f.icon}{f.ext}
                </div>
              ))}
            </div>
          </div>

          {/* Data & Config */}
          <div className="bg-base-200/30 border border-base-content/5 rounded-2xl p-4 sm:p-5 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-3 pb-2.5 border-b border-base-content/5">
              <Braces size={13} className="text-accent/50" />
              <span className="text-[10px] uppercase tracking-[0.15em] font-bold text-accent/50">Data & Config</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { ext: ".json", icon: <Braces size={13} /> },
                { ext: ".xml", icon: <Code size={13} /> },
                { ext: ".yaml", icon: <FileType size={13} /> },
                { ext: ".yml", icon: <FileType size={13} /> },
                { ext: ".toml", icon: <FileType size={13} /> },
                { ext: ".csv", icon: <FileType size={13} /> },
              ].map((f, i) => (
                <div key={i} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-accent/[0.04] border border-accent/10 text-[10px] font-mono font-semibold text-accent/60 hover:bg-accent/[0.08] hover:text-accent/80 transition-colors cursor-default">
                  {f.icon}{f.ext}
                </div>
              ))}
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-base-content/[0.03] border border-base-content/10 text-[10px] font-mono font-semibold text-base-content/30">
                + more
              </div>
            </div>
          </div>
        </StaggerReveal>
      </div>

      {/* ══════════════════════════════════════ */}
      {/* METRICS - Using MagReveal for 3D feel */}
      {/* ══════════════════════════════════════ */}
      <div className="flex flex-wrap justify-center gap-8 sm:gap-10 md:gap-20 mb-32 sm:mb-36 py-8 sm:py-10 border-y border-base-content/5 w-full max-w-6xl relative z-10">
        {[
          { label: "Version Format", val: "v1, v2, v3…", sub: "Simple & clean" },
          { label: "File Types", val: "15+", sub: "Docs & code files" },
          { label: "Role Control", val: "4 Roles", sub: "Owner · Writer · Reviewer · Viewer" },
          { label: "Deleted Versions", val: "Always Visible", sub: "Nothing is truly gone" },
        ].map((m, i) => (
          <MagReveal key={i} strength={10} duration={0.5} delay={i * 0.1} className="text-center min-w-[120px]">
            <div className="text-xl sm:text-2xl md:text-3xl font-black text-base-content">{m.val}</div>
            <div className="text-[9px] sm:text-[10px] uppercase tracking-[0.15em] text-base-content/40 font-bold mt-1">{m.label}</div>
            <div className="text-[9px] sm:text-[10px] text-base-content/25 mt-0.5 hidden sm:block">{m.sub}</div>
          </MagReveal>
        ))}
      </div>

      {/* ══════════════════════════════════════ */}
      {/* HOW IT WORKS */}
      {/* ══════════════════════════════════════ */}
      <div id="how-it-works" className="scroll-mt-24 w-full max-w-6xl relative z-10 mb-32 sm:mb-40 px-2">
        <div className="text-center mb-14 sm:mb-20 px-2">
          <BlurReveal y={15} duration={0.4} className="mb-4">
            <span className="inline-block text-[10px] uppercase tracking-[0.2em] font-bold text-primary/70 bg-primary/10 px-3 py-1 rounded-full">
              How It Works
            </span>
          </BlurReveal>
          <CharReveal
            as="h2"
            className="block text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 p-4"
            stagger={0.015}
            y={30}
            rotateX={-60}
            duration={0.4}
          >
            Four steps. That&apos;s it.
          </CharReveal>
          <ScrollReveal y={20} duration={0.4} delay={0.1}>
            <p className="text-base-content/45 max-w-xl mx-auto text-sm sm:text-base">
              No complex setup. No learning curve. Create a document and you&apos;re in control.
            </p>
          </ScrollReveal>
        </div>

        <div className="relative">

          <StaggerReveal
            stagger={0.08}
            y={30}
            duration={0.5}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 relative z-10 items-stretch auto-rows-fr"
          >
            {[
              {
                step: "01", icon: <Upload className="text-primary" size={26} />,
                title: "Create Document",
                desc: "Start a new document. Upload your first file — a PDF, Word doc, or any text-based file.",
                glassBg: "bg-primary/[0.04]", glassBorder: "border-primary/15",
                glowColor: "group-hover:shadow-primary/10", stepColor: "text-primary",
                iconBg: "bg-primary/10 border-primary/20", dotColor: "bg-primary",
              },
              {
                step: "02", icon: <UserPlus className="text-secondary" size={26} />,
                title: "Assign Roles",
                desc: "Pick who writes, reviews, or views. You're the owner — you decide who has access.",
                glassBg: "bg-secondary/[0.04]", glassBorder: "border-secondary/15",
                glowColor: "group-hover:shadow-secondary/10", stepColor: "text-secondary",
                iconBg: "bg-secondary/10 border-secondary/20", dotColor: "bg-secondary",
              },
              {
                step: "03", icon: <GitCommit className="text-accent" size={26} />,
                title: "Upload Versions",
                desc: "Writers upload new versions. Each gets the next number: v1, v2, v3 — no confusion.",
                glassBg: "bg-accent/[0.04]", glassBorder: "border-accent/15",
                glowColor: "group-hover:shadow-accent/10", stepColor: "text-accent",
                iconBg: "bg-accent/10 border-accent/20", dotColor: "bg-accent",
              },
              {
                step: "04", icon: <UserCheck className="text-success" size={26} />,
                title: "Reviewers Approve",
                desc: "Reviewers approve or reject each version. Nothing goes live without their green light.",
                glassBg: "bg-success/[0.04]", glassBorder: "border-success/15",
                glowColor: "group-hover:shadow-success/10", stepColor: "text-success",
                iconBg: "bg-success/10 border-success/20", dotColor: "bg-success",
              },
            ].map((s, i) => (
              <div key={i} className="group flex">
                <GlassCard
                  bg={s.glassBg}
                  border={s.glassBorder}
                  hover
                  className={`flex-1 transition-all duration-500 group-hover:shadow-xl ${s.glowColor} hover:-translate-y-1`}
                >
                  <div className="p-6 sm:p-7 flex flex-col h-full relative">

                    <div className={`absolute top-4 right-4 text-[10px] font-black font-mono ${s.stepColor} opacity-30`}>
                      {s.step}
                    </div>

                    <div className="relative mb-6">
                      <div className={`w-14 h-14 rounded-2xl ${s.iconBg} border flex items-center justify-center relative z-10 transition-transform duration-500 group-hover:scale-110`}>
                        {s.icon}
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full ${s.dotColor} border-[3px] border-base-100 z-20`} />
                    </div>

                    <h3 className="font-bold text-lg sm:text-xl mb-2.5 text-base-content">
                      {s.title}
                    </h3>

                    <p className="text-sm text-base-content/50 leading-relaxed flex-1">
                      {s.desc}
                    </p>

                    <div className="flex items-center gap-2 mt-5 pt-4 border-t border-base-content/5 lg:hidden">
                      <div className={`w-1.5 h-1.5 rounded-full ${s.dotColor}`} />
                      <span className={`text-[10px] font-bold uppercase tracking-[0.15em] ${s.stepColor} opacity-60`}>
                        Step {s.step}
                      </span>
                    </div>

                  </div>
                </GlassCard>
              </div>
            ))}
          </StaggerReveal>

        </div>

        <ScrollReveal y={15} duration={0.4} delay={0.2}>
          <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6">
            {[
              { icon: <Clock size={14} />, label: "Under 30 seconds" },
              { icon: <Users size={14} />, label: "Invite your team" },
              { icon: <GitCommit size={14} />, label: "Start versioning" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-base-content/35">
                {item.icon}
                <span className="font-medium">{item.label}</span>
                {i < 2 && <ArrowRight size={12} className="text-base-content/15 hidden sm:block" />}
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>

      {/* ══════════════════════════════════════ */}
      {/* FOUR ROLES - Using BlurReveal for Glassmorphism feel */}
      {/* ══════════════════════════════════════ */}
      <div className="w-full max-w-6xl relative z-10 mb-32 sm:mb-40">
        <div className="text-center mb-12 sm:mb-14 px-2">
          <BlurReveal y={15} duration={0.4} className="mb-4">
            <span className="inline-block text-[10px] uppercase tracking-[0.2em] font-bold text-secondary/70 bg-secondary/10 px-3 py-1 rounded-full">
              Role System
            </span>
          </BlurReveal>
          <CharReveal
            as="h2"
            className="block text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 p-4"
            stagger={0.015}
            y={30}
            rotateX={-60}
            duration={0.4}
          >
            Four roles. Clear permissions.
          </CharReveal>
          <ScrollReveal y={20} duration={0.4} delay={0.1}>
            <p className="text-base-content/45 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
              Every document has one owner, and you assign writers, reviewers, and viewers. No ambiguity about who can do what.
            </p>
          </ScrollReveal>
        </div>

        <StaggerReveal
          stagger={0.08}
          y={25}
          duration={0.5}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >

          {/* OWNER */}
          <GlassCard bg="bg-primary/5" border="border-primary/20" hover>
            <div className="p-5 sm:p-6 flex flex-col h-full">

              {/* ICON HEADER (CENTERED) */}
              <div className="flex flex-col items-center text-center mb-5">
                <div className="w-14 h-14 rounded-2xl bg-primary/15 flex items-center justify-center mb-3">
                  <ShieldCheck className="text-primary" size={26} />
                </div>

                <h3 className="font-bold text-lg sm:text-xl">Document Owner</h3>
                <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.1em] text-primary/60 font-bold mt-1">
                  Full document control
                </p>
              </div>

              <ul className="flex flex-col items-center space-y-2 text-xs sm:text-sm text-base-content/55 lg:items-start">
                {["Create & delete documents", "Assign roles", "View deleted versions", "Remove anyone", "Receive all notifications"].map((f, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle size={13} className="text-primary/60 shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>

            </div>
          </GlassCard>

          {/* WRITER */}
          <GlassCard bg="bg-secondary/5" border="border-secondary/20" hover>
            <div className="p-5 sm:p-6 flex flex-col h-full">

              <div className="flex flex-col items-center text-center mb-5">
                <div className="w-14 h-14 rounded-2xl bg-secondary/15 flex items-center justify-center mb-3">
                  <RefreshCw className="text-secondary" size={26} />
                </div>

                <h3 className="font-bold text-lg sm:text-xl">Writer</h3>
                <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.1em] text-secondary/60 font-bold mt-1">
                  Uploads versions
                </p>
              </div>

              <ul className="flex flex-col items-center space-y-2 text-xs sm:text-sm text-base-content/55 lg:items-start">
                {["Upload new versions", "See approved versions", "View own upload status", "Cannot delete versions", "Cannot approve or reject", "Gets upload notifications"].map((f, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle size={13} className="text-secondary/60 shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>

            </div>
          </GlassCard>

          {/* REVIEWER */}
          <GlassCard bg="bg-success/5" border="border-success/20" hover>
            <div className="p-5 sm:p-6 flex flex-col h-full">

              <div className="flex flex-col items-center text-center mb-5">
                <div className="w-14 h-14 rounded-2xl bg-success/15 flex items-center justify-center mb-3">
                  <UserCheck className="text-success" size={26} />
                </div>

                <h3 className="font-bold text-lg sm:text-xl">Reviewer</h3>
                <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.1em] text-success/60 font-bold mt-1">
                  Approve or reject
                </p>
              </div>

              <ul className="flex flex-col items-center space-y-2 text-xs sm:text-sm text-base-content/55 lg:items-start">
                {["Approve or reject versions", "View all uploaded versions", "Add comments", "Cannot upload files", "Cannot delete anything", "Gets review notifications"].map((f, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle size={13} className="text-success/60 shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>

            </div>
          </GlassCard>

          {/* VIEWER */}
          <GlassCard bg="bg-accent/5" border="border-accent/20" hover>
            <div className="p-5 sm:p-6 flex flex-col h-full">

              <div className="flex flex-col items-center text-center mb-5">
                <div className="w-14 h-14 rounded-2xl bg-accent/15 flex items-center justify-center mb-3">
                  <Eye className="text-accent" size={26} />
                </div>

                <h3 className="font-bold text-lg sm:text-xl">Viewer</h3>
                <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.1em] text-accent/60 font-bold mt-1">
                  Read-only access
                </p>
              </div>

              <ul className="flex flex-col items-center space-y-2 text-xs sm:text-sm text-base-content/55 lg:items-start">
                {["View approved versions only", "Download approved files", "See document info", "Cannot upload anything", "Cannot approve or reject", "Gets update notifications"].map((f, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle size={13} className="text-accent/60 shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>

            </div>
          </GlassCard>

        </StaggerReveal>
      </div>

      {/* ══════════════════════════════════════ */}
      {/* VERSION TIMELINE */}
      {/* ══════════════════════════════════════ */}
      <div className="max-w-7xl w-full relative z-10 mb-32 sm:mb-40">
        <div className="text-center mb-12 sm:mb-14 px-2">
          <BlurReveal y={15} duration={0.4} className="mb-4">
            <span className="inline-block text-[10px] uppercase tracking-[0.2em] font-bold text-primary/70 bg-primary/10 px-3 py-1 rounded-full">
              Live Preview
            </span>
          </BlurReveal>
          <CharReveal
            as="h2"
            className="block text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 p-4"
            stagger={0.015}
            y={30}
            rotateX={-60}
            duration={0.4}
          >
            Every version. Always visible.
          </CharReveal>
          <ScrollReveal y={20} duration={0.4} delay={0.1}>
            <p className="text-base-content/45 text-sm sm:text-lg max-w-xl mx-auto">
              Even deleted versions are never hidden from the owner. Full transparency, full history.
            </p>
          </ScrollReveal>
        </div>

        <BlurReveal y={30} duration={0.6} delay={0.1}>
          <div className="bg-base-200/40 rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 border border-base-content/5 backdrop-blur-xl text-left relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-5 sm:mb-6 pb-5 sm:pb-6 border-b border-base-content/5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-primary/15 flex items-center justify-center">
                  <FileCode size={18} className="text-primary" />
                </div>
                <div>
                  <span className="font-bold text-base-content block text-sm sm:text-base">api-handler.py</span>
                  <span className="text-[10px] sm:text-[11px] text-base-content/35 font-mono">.py file · You are the Owner</span>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-[11px]">
                <span className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 rounded-lg bg-secondary/15 text-secondary font-semibold">
                  <RefreshCw size={11} /> 2 Writers
                </span>
                <span className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 rounded-lg bg-success/15 text-success font-semibold">
                  <UserCheck size={11} /> 1 Reviewer
                </span>
                <span className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 rounded-lg bg-accent/15 text-accent font-semibold">
                  <Eye size={11} /> 3 Viewers
                </span>
              </div>
            </div>

            <div className="space-y-0 relative">
              <div className="absolute left-[19px] sm:left-[23px] top-4 bottom-4 w-0.5 bg-base-content/10" />
              {[
                { version: "v1", user: "You (Owner)", action: "Uploaded initial file", time: "Jan 6 · 10:00 AM", status: "approved", statusLabel: "Approved", icon: <Upload size={15} />, file: "api-handler.py — 4.2 KB" },
                { version: "v2", user: "Jude (Writer)", action: "Uploaded new version", time: "Jan 6 · 2:30 PM", status: "approved", statusLabel: "Approved", icon: <RefreshCw size={15} />, file: "api-handler.py — 5.1 KB", comment: "\"Added error handling for timeout cases\"" },
                { version: "v3", user: "Jude (Writer)", action: "Uploaded new version", time: "Jan 7 · 9:15 AM", status: "rejected", statusLabel: "Rejected", icon: <RefreshCw size={15} />, file: "api-handler.py — 5.8 KB", comment: "\"Missing import statements, please fix\"" },
                { version: "v4", user: "Lena (Writer)", action: "Uploaded new version", time: "Jan 7 · 11:45 AM", status: "approved", statusLabel: "Approved", icon: <RefreshCw size={15} />, file: "api-handler.py — 5.3 KB" },
                { version: "v5", user: "Lena (Writer)", action: "Uploaded new version", time: "Jan 8 · 3:00 PM", status: "pending", statusLabel: "Pending Review", icon: <Clock size={15} />, file: "api-handler.py — 6.0 KB" },
                { version: "v6", user: "You (Owner)", action: "Deleted this version", time: "Jan 8 · 3:05 PM", status: "deleted", statusLabel: "Deleted", icon: <Trash2 size={15} />, file: "api-handler.py — 6.0 KB", deleted: true },
              ].map((step, i) => (
                <div key={i} className={`flex items-start gap-3 sm:gap-4 relative group py-3 sm:py-3.5 ${step.deleted ? "opacity-60" : ""}`}>
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border-4 border-base-200 shadow-sm z-10 transition-all duration-300 shrink-0 ${step.status === "approved" ? "bg-success/15 text-success" : step.status === "rejected" ? "bg-error/15 text-error" : step.status === "pending" ? "bg-warning/15 text-warning" : "bg-base-300 text-base-content/30"}`}>
                    {step.icon}
                  </div>
                  <div className="flex-1 pt-0.5 sm:pt-1 min-w-0">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-1 sm:gap-1.5 mb-0.5 sm:mb-1">
                      <span className={`font-bold text-xs sm:text-sm ${step.deleted ? "text-base-content/40 line-through" : "text-base-content"}`}>
                        {step.action}
                      </span>
                      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                        <span className={`text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full ${step.status === "approved" ? "bg-success/15 text-success" : step.status === "rejected" ? "bg-error/15 text-error" : step.status === "pending" ? "bg-warning/15 text-warning" : "bg-base-content/10 text-base-content/30"}`}>
                          {step.statusLabel}
                        </span>
                        <span className="text-[10px] sm:text-[11px] font-mono bg-base-300/50 px-1.5 sm:px-2 py-0.5 rounded-lg text-base-content/40 border border-base-content/5">{step.version}</span>
                      </div>
                    </div>
                    <p className="text-[10px] sm:text-xs text-base-content/40 mb-0.5">
                      <span className="font-semibold text-base-content/55">{step.user}</span>
                      <span className="mx-1 sm:mx-1.5 text-base-content/15">·</span>
                      <span>{step.time}</span>
                    </p>
                    <p className="text-[10px] sm:text-[11px] text-base-content/30 font-mono">{step.file}</p>
                    {step.comment && (
                      <div className="mt-1.5 sm:mt-2 flex items-start gap-2 text-[10px] sm:text-xs text-base-content/45 bg-base-300/30 rounded-lg px-2.5 sm:px-3 py-1.5 sm:py-2 border border-base-content/5">
                        <MessageSquare size={11} className="shrink-0 mt-0.5 text-base-content/25" />
                        <span>{step.comment}</span>
                      </div>
                    )}
                    {step.deleted && (
                      <div className="mt-1.5 sm:mt-2 flex items-center gap-2 text-[10px] sm:text-xs text-base-content/30">
                        <EyeOff size={11} />
                        <span>Visible only to you (Owner) — file preserved for reference</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 sm:mt-6 pt-5 sm:pt-6 border-t border-base-content/5 flex flex-wrap gap-3 sm:gap-5">
              {[
                { color: "bg-success", label: "Approved" },
                { color: "bg-error", label: "Rejected" },
                { color: "bg-warning", label: "Pending" },
                { color: "bg-base-content/20", label: "Deleted (owner-only)" },
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] text-base-content/40">
                  <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${s.color}`} />
                  {s.label}
                </div>
              ))}
            </div>
          </div>
        </BlurReveal>
      </div>

      {/* ══════════════════════════════════════ */}
      {/* NOTIFICATIONS PREVIEW */}
      {/* ══════════════════════════════════════ */}
      <div className="max-w-7xl w-full relative z-10 mb-32 sm:mb-40">
        <div className="text-center mb-12 sm:mb-14 px-2">
          <BlurReveal y={15} duration={0.4} className="mb-4">
            <span className="inline-block text-[10px] uppercase tracking-[0.2em] font-bold text-warning/70 bg-warning/10 px-3 py-1 rounded-full">
              Notifications
            </span>
          </BlurReveal>
          <CharReveal
            as="h2"
            className="block text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 p-4"
            stagger={0.015}
            y={30}
            rotateX={-60}
            duration={0.4}
          >
            Never miss a thing.
          </CharReveal>
          <ScrollReveal y={20} duration={0.4} delay={0.1}>
            <p className="text-base-content/45 text-sm sm:text-base max-w-xl mx-auto">
              Everyone gets notified about what matters to them. Writers know when their version is reviewed, reviewers know when a new version lands, owners see everything.
            </p>
          </ScrollReveal>
        </div>

        <BlurReveal y={30} duration={0.6} delay={0.1}>
          <div className="bg-base-200/40 rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 border border-base-content/5 backdrop-blur-xl text-left relative overflow-hidden">
            <div className="flex items-center gap-3 mb-6 pb-5 border-b border-base-content/5">
              <div className="w-10 h-10 rounded-xl bg-warning/15 flex items-center justify-center">
                <BellRing size={20} className="text-warning" />
              </div>
              <div>
                <span className="font-bold text-base-content block text-sm sm:text-base">Your Notifications</span>
                <span className="text-[10px] sm:text-[11px] text-base-content/35">3 unread · Showing latest</span>
              </div>
              <div className="ml-auto">
                <span className="w-5 h-5 rounded-full bg-warning text-[10px] font-bold text-warning-content flex items-center justify-center">3</span>
              </div>
            </div>

            <div className="space-y-2">
              {[
                { icon: <UserCheck size={16} className="text-success" />, title: "Lena approved v4", desc: "api-handler.py — Version v4 has been approved and is now the current version.", time: "2 min ago", unread: true, dot: "bg-success" },
                { icon: <RefreshCw size={16} className="text-secondary" />, title: "Jude uploaded v5", desc: "api-handler.py — A new version is ready for your review.", time: "15 min ago", unread: true, dot: "bg-secondary" },
                { icon: <AlertCircle size={16} className="text-error" />, title: "Nick rejected v3", desc: "api-handler.py — \"Missing import statements, please fix.\"", time: "1 hour ago", unread: true, dot: "bg-error" },
                { icon: <UserPlus size={16} className="text-primary" />, title: "You assigned Priya as Viewer", desc: "api-handler.py — Priya now has read-only access to approved versions.", time: "3 hours ago", unread: false, dot: "bg-primary" },
                { icon: <Trash2 size={16} className="text-base-content/30" />, title: "You deleted v6", desc: "api-handler.py — The version has been removed from public view but preserved in your timeline.", time: "5 hours ago", unread: false, dot: "bg-base-content/20" },
                { icon: <MessageSquare size={16} className="text-accent" />, title: "Nick commented on v2", desc: "api-handler.py — \"Good error handling, but consider adding a retry mechanism.\"", time: "Yesterday", unread: false, dot: "bg-accent" },
              ].map((n, i) => (
                <div key={i} className={`flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl transition-colors ${n.unread ? "bg-base-300/30 border border-base-content/5" : "hover:bg-base-content/[0.02]"}`}>
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-base-200 flex items-center justify-center shrink-0 relative">
                    {n.icon}
                    {n.unread && <div className={`absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ${n.dot} border-2 border-base-200`} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={`text-xs sm:text-sm font-bold ${n.unread ? "text-base-content" : "text-base-content/70"}`}>{n.title}</span>
                    </div>
                    <p className="text-[10px] sm:text-xs text-base-content/40 leading-relaxed">{n.desc}</p>
                  </div>
                  <span className="text-[9px] sm:text-[10px] text-base-content/25 shrink-0 mt-0.5">{n.time}</span>
                </div>
              ))}
            </div>

            <div className="mt-5 pt-5 border-t border-base-content/5 flex flex-wrap gap-4 sm:gap-6">
              {[
                { label: "Writers get", val: "Upload confirmed, Review result" },
                { label: "Reviewers get", val: "New version to review" },
                { label: "Viewers get", val: "New approved version" },
                { label: "Document Owners get", val: "Everything" },
              ].map((n, i) => (
                <div key={i} className="text-[10px] sm:text-[11px]">
                  <span className="text-base-content/25">{n.label}:</span>
                  <span className="ml-1 font-semibold text-base-content/50">{n.val}</span>
                </div>
              ))}
            </div>
          </div>
        </BlurReveal>
      </div>

      {/* ══════════════════════════════════════ */}
      {/* AUDIT LOG PREVIEW */}
      {/* ══════════════════════════════════════ */}
      <div className="max-w-7xl w-full relative z-10 mb-32 sm:mb-40">
        <div className="text-center mb-12 sm:mb-14 px-2">
          <BlurReveal y={15} duration={0.4} className="mb-4">
            <span className="inline-block text-[10px] uppercase tracking-[0.2em] font-bold text-error/70 bg-error/10 px-3 py-1 rounded-full">
              Audit Log
            </span>
          </BlurReveal>
          <CharReveal
            as="h2"
            className="block text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 p-4"
            stagger={0.015}
            y={30}
            rotateX={-60}
            duration={0.4}
          >
            See everything that happened.
          </CharReveal>
          <ScrollReveal y={20} duration={0.4} delay={0.1}>
            <p className="text-base-content/45 text-sm sm:text-base max-w-xl mx-auto">
              As the owner, you have access to a complete audit log. Every action on every version, by every user, with exact timestamps. No gaps, no guesswork.
            </p>
          </ScrollReveal>
        </div>

        <BlurReveal y={30} duration={0.6} delay={0.1}>
          <div className="bg-base-200/40 rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 border border-base-content/5 backdrop-blur-xl text-left relative overflow-hidden">
            <div className="flex items-center gap-3 mb-6 pb-5 border-b border-base-content/5">
              <div className="w-10 h-10 rounded-xl bg-error/15 flex items-center justify-center">
                <ClipboardList size={20} className="text-error" />
              </div>
              <div>
                <span className="font-bold text-base-content block text-sm sm:text-base">Audit Log — api-handler.py</span>
                <span className="text-[10px] sm:text-[11px] text-base-content/35">Owner access only · 12 events recorded</span>
              </div>
            </div>

            <div className="overflow-x-auto -mx-5 sm:-mx-8 md:-mx-10 px-5 sm:px-8 md:px-10 transform-gpu">
              <table className="w-full text-[10px] sm:text-xs min-w-[500px]">
                <thead>
                  <tr className="border-b border-base-content/5">
                    <th className="py-2.5 pr-3 text-base-content/30 font-semibold uppercase tracking-wider text-[9px] sm:text-[10px] text-center">Timestamp</th>
                    <th className="py-2.5 pr-3 text-base-content/30 font-semibold uppercase tracking-wider text-[9px] sm:text-[10px] text-center">User</th>
                    <th className="py-2.5 pr-3 text-base-content/30 font-semibold uppercase tracking-wider text-[9px] sm:text-[10px] text-center">Action</th>
                    <th className="py-2.5 pr-3 text-base-content/30 font-semibold uppercase tracking-wider text-[9px] sm:text-[10px] text-center">Version</th>
                    <th className="py-2.5 text-base-content/30 font-semibold uppercase tracking-wider text-[9px] sm:text-[10px] text-center">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { time: "Jan 8 · 3:05 PM", user: "You", action: "DELETE", version: "v6", detail: "Deleted version — file preserved", color: "text-error" },
                    { time: "Jan 8 · 3:00 PM", user: "Lena", action: "UPLOAD", version: "v5", detail: "api-handler.py — 6.0 KB", color: "text-secondary" },
                    { time: "Jan 7 · 11:45 AM", user: "Lena", action: "UPLOAD", version: "v4", detail: "api-handler.py — 5.3 KB", color: "text-secondary" },
                    { time: "Jan 7 · 10:30 AM", user: "Nick", action: "APPROVE", version: "v4", detail: "Approved with no comments", color: "text-success" },
                    { time: "Jan 7 · 9:15 AM", user: "Jude", action: "UPLOAD", version: "v3", detail: "api-handler.py — 5.8 KB", color: "text-secondary" },
                    { time: "Jan 7 · 9:45 AM", user: "Nick", action: "REJECT", version: "v3", detail: "\"Missing import statements\"", color: "text-error" },
                    { time: "Jan 6 · 2:30 PM", user: "Jude", action: "UPLOAD", version: "v2", detail: "api-handler.py — 5.1 KB", color: "text-secondary" },
                    { time: "Jan 6 · 3:15 PM", user: "Nick", action: "APPROVE", version: "v2", detail: "Approved", color: "text-success" },
                    { time: "Jan 6 · 10:00 AM", user: "You", action: "UPLOAD", version: "v1", detail: "api-handler.py — 4.2 KB", color: "text-secondary" },
                    { time: "Jan 6 · 10:05 AM", user: "You", action: "ROLE_ASSIGN", version: "—", detail: "Jude → Writer", color: "text-primary" },
                    { time: "Jan 6 · 10:06 AM", user: "You", action: "ROLE_ASSIGN", version: "—", detail: "Lena → Writer, Nick → Reviewer", color: "text-primary" },
                    { time: "Jan 6 · 10:00 AM", user: "You", action: "CREATE", version: "—", detail: "Document created", color: "text-primary" },
                  ].map((log, i) => (
                    <tr key={i} className="border-b border-base-content/[0.03] hover:bg-base-content/[0.02] transition-colors">
                      <td className="py-2.5 pr-3 text-base-content/35 font-mono whitespace-nowrap text-center">{log.time}</td>
                      <td className="py-2.5 pr-3 font-semibold text-base-content/60 whitespace-nowrap text-center">{log.user}</td>
                      <td className="py-2.5 pr-3  text-center">
                        <span className={`font-bold ${log.color}`}>{log.action}</span>
                      </td>
                      <td className="py-2.5 pr-3 font-mono text-base-content/40 whitespace-nowrap text-center">{log.version}</td>
                      <td className="py-2.5 text-base-content/40 text-center">{log.detail}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-5 pt-5 border-t border-base-content/5 flex flex-wrap gap-4 sm:gap-6">
              {[
                { icon: <Lock size={12} />, label: "Owner-only access" },
                { icon: <Clock size={12} />, label: "Exact timestamps" },
                { icon: <Activity size={12} />, label: "All actions tracked" },
                { icon: <Eye size={12} />, label: "Immutable — cannot be edited" },
              ].map((l, i) => (
                <div key={i} className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-base-content/35">
                  {l.icon}
                  {l.label}
                </div>
              ))}
            </div>
          </div>
        </BlurReveal>
      </div>

      {/* ══════════════════════════════════════ */}
      {/* FEATURES GRID */}
      {/* ══════════════════════════════════════ */}
      <div className="w-full max-w-6xl relative z-10 mb-32 sm:mb-40">
        <div className="text-center mb-12 sm:mb-14 px-2">
          <BlurReveal y={15} duration={0.4} className="mb-4">
            <span className="inline-block text-[10px] uppercase tracking-[0.2em] font-bold text-accent/70 bg-accent/10 px-3 py-1 rounded-full">
              Features
            </span>
          </BlurReveal>
          <CharReveal
            as="h2"
            className="block text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 p-4"
            stagger={0.01}
            y={30}
            rotateX={-60}
            duration={0.4}
          >
            Built around how you actually work.
          </CharReveal>
          <ScrollReveal y={20} duration={0.4} delay={0.1}>
            <p className="text-base-content/45 max-w-2xl mx-auto text-sm sm:text-base">No bloat. No unnecessary complexity. Every feature exists because real teams need it.</p>
          </ScrollReveal>
        </div>

        <StaggerReveal stagger={0.03} y={20} duration={0.4} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[
            { icon: <GitCommit size={24} />, title: "Simple Versioning", desc: "v1, v2, v3 — that's it. No confusing sub-versions, no branches, no tags. Just a clean, linear history." },
            { icon: <UserPlus size={24} />, title: "You Pick the Team", desc: "As the owner, assign writers, reviewers, and viewers. Add or remove people anytime." },
            { icon: <UserCheck size={24} />, title: "Approval Gates", desc: "No version is final until a reviewer approves it. Reviewers approve or reject with comments." },
            { icon: <EyeOff size={24} />, title: "Deleted Versions Stay Visible", desc: "Deleted a version by mistake? As the owner, you can still see it. Clearly marked, always preserved." },
            { icon: <Eye size={24} />, title: "Viewer Role", desc: "Need someone to just see the latest approved version? Give them viewer access — no edit permissions." },
            { icon: <History size={24} />, title: "Full Activity Timeline", desc: "Every upload, approval, rejection, and deletion is logged with a timestamp and user name." },
            { icon: <FileCode size={24} />, title: "Code Files Welcome", desc: "Upload .java, .cpp, .py, .js, .ts, .html, .css, .sql, .json, .yaml, and any other text-based file." },
            { icon: <Search size={24} />, title: "Search & Filter", desc: "Find any document or version instantly. Filter by status, role, date, or file type." },
            { icon: <Lock size={24} />, title: "Role-Based Access", desc: "Writers can't approve. Reviewers can't upload. Viewers can only see. Owners see everything." },
            { icon: <MessageSquare size={24} />, title: "Comments on Versions", desc: "Reviewers leave comments when approving or rejecting. Writers know exactly what to fix." },
            { icon: <Bell size={24} />, title: "Smart Notifications", desc: "Everyone gets notified about what matters to them. Writers, reviewers, viewers, and owners — each gets relevant alerts." },
            { icon: <ClipboardList size={24} />, title: "Owner Audit Log", desc: "As the owner, access a complete, immutable audit log of every action ever taken on your document." },
          ].map((item, idx) => (
            <div key={idx} className="group p-5 sm:p-6 border border-base-content/5 rounded-2xl hover:border-primary/60 hover:bg-primary/10 transition-all duration-300 h-full">
              <div className="flex flex-col items-center justify-center text-center">
                <div className="text-primary mb-3 sm:mb-4">
                  {item.icon}
                </div>
                <h4 className="font-bold text-base sm:text-lg mb-1.5 sm:mb-2">
                  {item.title}
                </h4>
              </div>
              <p className="text-xs sm:text-sm text-base-content/50 leading-relaxed text-center">
                {item.desc}
              </p>
            </div>
          ))}
        </StaggerReveal>
      </div>

      {/* ══════════════════════════════════════ */}
      {/* PROBLEM / SOLUTION */}
      {/* ══════════════════════════════════════ */}
      <div className="w-full max-w-5xl relative z-10 mb-32 sm:mb-40">
        <div className="text-center mb-12 sm:mb-14 px-2">
          <BlurReveal y={15} duration={0.4} className="mb-4">
            <span className="inline-block text-[10px] uppercase tracking-[0.2em] font-bold text-error/70 bg-error/10 px-3 py-1 rounded-full mb-4">
              The Problem
            </span>
          </BlurReveal>
          <CharReveal
            as="h2"
            className="block text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 p-4"
            stagger={0.015}
            y={30}
            rotateX={-60}
            duration={0.4}
          >
            Email is not version control.
          </CharReveal>
          <ScrollReveal y={20} duration={0.4} delay={0.1}>
            <p className="text-base-content/45 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
              If you've ever searched your inbox for "final version please use this one", you already know why you need this.
            </p>
          </ScrollReveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {/* Card 1: Without SAP Hub */}
          <BlurReveal x={-30} duration={0.5}>
            <div className="bg-error/5 border border-error/15 rounded-2xl p-5 sm:p-7 text-center h-full hover:bg-error/15 transition-all duration-300 ease-in-out">
              <h4 className="font-bold text-base sm:text-lg text-error/80 mb-4 sm:mb-5 flex items-center justify-center gap-2">
                <XCircle size={18} /> Without SAP Hub
              </h4>
              <ul className="space-y-3 sm:space-y-3.5 text-xs sm:text-sm text-base-content/50">
                {[
                  "\"Which version is the right one?\"",
                  "\"Did Nick approve this or the old one?\"",
                  "\"Someone deleted the file from the drive\"",
                  "\"Who even has access to this folder?\"",
                  "\"Can you resend the latest .py file?\"",
                  "\"I don't remember what changed between v2 and v4\"",
                  "\"No idea who viewed or downloaded what\"",
                ].map((item, i) => (
                  <li key={i} className="flex items-center justify-center gap-2">
                    {/* Keeping the dot, but centered with the text line */}
                    <div className="w-1.5 h-1.5 rounded-full bg-error/30 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </BlurReveal>

          {/* Card 2: With SAP Hub */}
          <BlurReveal x={30} duration={0.5}>
            <div className="bg-success/5 border border-success/15 rounded-2xl p-5 sm:p-7 text-center h-full hover:bg-success/15 transition-all duration-300 ease-in-out">
              <h4 className="font-bold text-base sm:text-lg text-success/80 mb-4 sm:mb-5 flex items-center justify-center gap-2">
                <CheckCircle size={18} /> With SAP Hub
              </h4>
              <ul className="space-y-3 sm:space-y-3.5 text-xs sm:text-sm text-base-content/50">
                {[
                  "Latest approved version is always front and center",
                  "Every approval recorded with name and timestamp",
                  "Deleted versions preserved and visible to owner",
                  "Roles are clear: Owner, Writer, Reviewer, Viewer",
                  "All files in one place with version history built in",
                  "Full audit log shows exactly who did what and when",
                  "Notifications keep everyone in the loop automatically",
                ].map((item, i) => (
                  <li key={i} className="flex items-center justify-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-success/40 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </BlurReveal>
        </div>
      </div>

      {/* ══════════════════════════════════════ */}
      {/* ROLE COMPARISON TABLE */}
      {/* ══════════════════════════════════════ */}
      <div className="w-full max-w-5xl relative z-10 mb-32 sm:mb-40">
        <div className="text-center mb-12 sm:mb-14 px-2">
          <BlurReveal y={15} duration={0.4} className="mb-4">
            <span className="inline-block text-[10px] uppercase tracking-[0.2em] font-bold text-primary/70 bg-primary/10 px-3 py-1 rounded-full">
              Permission Matrix
            </span>
          </BlurReveal>
          <CharReveal
            as="h2"
            className="block text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 p-4"
            stagger={0.015}
            y={30}
            rotateX={-60}
            duration={0.4}
          >
            Who can do what.
          </CharReveal>
          <ScrollReveal y={20} duration={0.4} delay={0.1}>
            <p className="text-base-content/45 max-w-xl mx-auto text-sm sm:text-base">
              Six roles. Zero ambiguity. Every action mapped.
            </p>
          </ScrollReveal>
        </div>

        <ScrollReveal y={30} duration={0.5} delay={0.1}>
          <div className="bg-base-200/30 border border-base-content/5 rounded-2xl overflow-hidden transform-gpu">
            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm min-w-[700px]">
                <thead>
                  <tr className="border-b border-base-content/5">
                    <th className="text-left p-3.5 sm:p-4 text-base-content/35 font-semibold text-[10px] sm:text-xs uppercase tracking-wider sticky left-0 bg-base-200/80 backdrop-blur-sm z-10 min-w-[160px]">Action</th>
                    <th className="p-3.5 sm:p-4 text-center font-bold text-error text-[10px] sm:text-xs uppercase tracking-wider bg-error/5 min-w-[80px]">
                      <div className="flex flex-col items-center gap-0.5">
                        <ShieldAlert size={14} className="opacity-60" />
                        Super User
                      </div>
                    </th>
                    <th className="p-3.5 sm:p-4 text-center font-bold text-primary text-[10px] sm:text-xs uppercase tracking-wider bg-primary/5 min-w-[80px]">
                      <div className="flex flex-col items-center gap-0.5">
                        <ShieldCheck size={14} className="opacity-60" />
                        Admin
                      </div>
                    </th>
                    <th className="p-3.5 sm:p-4 text-center font-bold text-warning text-[10px] sm:text-xs uppercase tracking-wider bg-warning/5 min-w-[80px]">
                      <div className="flex flex-col items-center gap-0.5">
                        <Crown size={14} className="opacity-60" />
                        Doc Owner
                      </div>
                    </th>
                    <th className="p-3.5 sm:p-4 text-center font-bold text-secondary text-[10px] sm:text-xs uppercase tracking-wider min-w-[80px]">
                      <div className="flex flex-col items-center gap-0.5">
                        <RefreshCw size={14} className="opacity-60" />
                        Writer
                      </div>
                    </th>
                    <th className="p-3.5 sm:p-4 text-center font-bold text-success text-[10px] sm:text-xs uppercase tracking-wider min-w-[80px]">
                      <div className="flex flex-col items-center gap-0.5">
                        <UserCheck size={14} className="opacity-60" />
                        Reviewer
                      </div>
                    </th>
                    <th className="p-3.5 sm:p-4 text-center font-bold text-accent text-[10px] sm:text-xs uppercase tracking-wider min-w-[80px]">
                      <div className="flex flex-col items-center gap-0.5">
                        <Eye size={14} className="opacity-60" />
                        Viewer
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* Platform Access */}
                  <tr className="border-b border-base-content/5 bg-base-content/[0.015]">
                    <td colSpan={7} className="p-2.5 sm:p-3">
                      <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.15em] font-bold text-base-content/25 flex items-center gap-1.5">
                        <Lock size={10} /> Platform Access
                      </span>
                    </td>
                  </tr>
                  {[
                    { action: "Access audit log", su: true, admin: true, owner: false, writer: false, reviewer: false, viewer: false },
                    { action: "Manage users & roles", su: true, admin: true, owner: false, writer: false, reviewer: false, viewer: false },
                    { action: "Delete users", su: true, admin: true, owner: false, writer: false, reviewer: false, viewer: false },
                  ].map((row, i) => (
                    <tr key={`plat-${i}`} className="border-b border-base-content/[0.03] hover:bg-base-content/[0.02] transition-colors">
                      <td className="text-left p-3 sm:p-3.5 text-base-content/60 font-medium text-xs">{row.action}</td>
                      <td className="p-3 sm:p-3.5 text-center bg-error/[0.015]">
                        {row.su === true ? <CheckCircle size={15} className="text-error mx-auto" /> : row.su === "partial" ? <PartialIcon /> : <span className="text-base-content/10">—</span>}
                      </td>
                      <td className="p-3 sm:p-3.5 text-center bg-primary/[0.015]">
                        {row.admin === true ? <CheckCircle size={15} className="text-primary mx-auto" /> : row.admin === "partial" ? <PartialIcon /> : <span className="text-base-content/10">—</span>}
                      </td>
                      <td className="p-3 sm:p-3.5 text-center bg-warning/[0.015]">
                        {row.owner === true ? <CheckCircle size={15} className="text-warning mx-auto" /> : row.owner === "partial" ? <PartialIcon /> : <span className="text-base-content/10">—</span>}
                      </td>
                      <td className="p-3 sm:p-3.5 text-center">
                        {row.writer === true ? <CheckCircle size={15} className="text-secondary mx-auto" /> : row.writer === "partial" ? <PartialIcon /> : <span className="text-base-content/10">—</span>}
                      </td>
                      <td className="p-3 sm:p-3.5 text-center">
                        {row.reviewer === true ? <CheckCircle size={15} className="text-success mx-auto" /> : row.reviewer === "partial" ? <PartialIcon /> : <span className="text-base-content/10">—</span>}
                      </td>
                      <td className="p-3 sm:p-3.5 text-center">
                        {row.viewer === true ? <CheckCircle size={15} className="text-accent mx-auto" /> : row.viewer === "partial" ? <PartialIcon /> : <span className="text-base-content/10">—</span>}
                      </td>
                    </tr>
                  ))}

                  {/* Document Access */}
                  <tr className="border-b border-base-content/5 bg-base-content/[0.015]">
                    <td colSpan={7} className="p-2.5 sm:p-3">
                      <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.15em] font-bold text-base-content/25 flex items-center gap-1.5">
                        <FileText size={10} /> Document Access
                      </span>
                    </td>
                  </tr>
                  {[
                    { action: "Upload versions", su: true, admin: true, owner: true, writer: true, reviewer: false, viewer: false },
                    { action: "Approve / reject", su: true, admin: true, owner: true, writer: false, reviewer: true, viewer: false },
                    { action: "View approved versions", su: true, admin: true, owner: true, writer: true, reviewer: true, viewer: true },
                    { action: "View all uploaded versions", su: true, admin: true, owner: true, writer: false, reviewer: true, viewer: false },
                    { action: "See deleted versions", su: true, admin: true, owner: true, writer: false, reviewer: false, viewer: false },
                    { action: "Add comments", su: true, admin: true, owner: true, writer: false, reviewer: true, viewer: false },
                    { action: "Assign doc roles", su: true, admin: true, owner: true, writer: false, reviewer: false, viewer: false },
                    { action: "Delete document", su: true, admin: true, owner: true, writer: false, reviewer: false, viewer: false },
                    { action: "Download files", su: true, admin: true, owner: true, writer: true, reviewer: true, viewer: true },
                    { action: "Receive notifications", su: true, admin: true, owner: true, writer: true, reviewer: true, viewer: true },
                  ].map((row, i) => (
                    <tr key={`doc-${i}`} className="border-b border-base-content/[0.03] hover:bg-base-content/[0.02] transition-colors">
                      <td className="text-left p-3 sm:p-3.5 text-base-content/60 font-medium text-xs">{row.action}</td>
                      <td className="p-3 sm:p-3.5 text-center bg-error/[0.015]">
                        {row.su === true ? <CheckCircle size={15} className="text-error mx-auto" /> : <span className="text-base-content/10">—</span>}
                      </td>
                      <td className="p-3 sm:p-3.5 text-center bg-primary/[0.015]">
                        {row.admin === true ? <CheckCircle size={15} className="text-primary mx-auto" /> : <span className="text-base-content/10">—</span>}
                      </td>
                      <td className="p-3 sm:p-3.5 text-center bg-warning/[0.015]">
                        {row.owner === true ? <CheckCircle size={15} className="text-warning mx-auto" /> : <span className="text-base-content/10">—</span>}
                      </td>
                      <td className="p-3 sm:p-3.5 text-center">
                        {row.writer === true ? <CheckCircle size={15} className="text-secondary mx-auto" /> : <span className="text-base-content/10">—</span>}
                      </td>
                      <td className="p-3 sm:p-3.5 text-center">
                        {row.reviewer === true ? <CheckCircle size={15} className="text-success mx-auto" /> : <span className="text-base-content/10">—</span>}
                      </td>
                      <td className="p-3 sm:p-3.5 text-center">
                        {row.viewer === true ? <CheckCircle size={15} className="text-accent mx-auto" /> : <span className="text-base-content/10">—</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-4 sm:px-5 py-4 border-t border-base-content/5 flex flex-wrap gap-x-5 gap-y-2">
              <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-base-content/35">
                <CheckCircle size={13} className="text-base-content/40" />
                Full access
              </div>
              <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-base-content/35">
                <PartialIcon />
                Partial — cannot delete Super Users or Admins
              </div>
              <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-base-content/35">
                <span className="text-base-content/15 text-sm">—</span>
                No access
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
            <div className="flex items-start gap-3 bg-error/[0.04] border border-error/10 rounded-xl p-3.5">
              <ShieldAlert size={16} className="text-error/50 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-error/70 mb-0.5">Super User</p>
                <p className="text-[11px] text-base-content/40 leading-relaxed">Unrestricted access to everything. The only role that can delete other Admins.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-primary/[0.04] border border-primary/10 rounded-xl p-3.5">
              <ShieldCheck size={16} className="text-primary/50 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-primary/70 mb-0.5">Admin</p>
                <p className="text-[11px] text-base-content/40 leading-relaxed">Full platform access but cannot delete Super Users or other Admins. Can manage all other users.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-warning/[0.04] border border-warning/10 rounded-xl p-3.5 sm:col-span-1">
              <Crown size={16} className="text-warning/50 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-warning/70 mb-0.5">Owner + Writer + Reviewer + Viewer</p>
                <p className="text-[11px] text-base-content/40 leading-relaxed">Full control over their own documents, but no platform-level access.</p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>

      {/* ══════════════════════════════════════ */}
      {/* TESTIMONIALS */}
      {/* ══════════════════════════════════════ */}
      <div className="w-full max-w-6xl relative z-10 mb-32 sm:mb-40">
        <div className="text-center mb-12 sm:mb-16">
          <BlurReveal y={15} duration={0.4} className="mb-4">
            <span className="inline-block text-[10px] uppercase tracking-[0.2em] font-bold text-warning/70 bg-warning/10 px-3 py-1 rounded-full">
              What People Say
            </span>
          </BlurReveal>
          <CharReveal
            as="h2"
            className="block text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 p-4"
            stagger={0.015}
            y={30}
            rotateX={-60}
            duration={0.4}
          >
            Trusted by teams who ship.
          </CharReveal>
          <ScrollReveal y={20} duration={0.4} delay={0.1}>
            <p className="text-base-content/40 max-w-md mx-auto text-sm sm:text-base">
              Real feedback from real teams using SAP Hub every day.
            </p>
          </ScrollReveal>
        </div>

        <Testimonials />

        <ScrollReveal y={20} duration={0.4} delay={0.2}>
          <div className="mt-10 sm:mt-14 grid grid-cols-3 gap-4 sm:gap-6 max-w-2xl mx-auto">
            {[
              { val: "4.9", label: "Average rating" },
              { val: "500+", label: "Teams onboarded" },
              { val: "< 30s", label: "Avg. setup time" },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-xl sm:text-2xl font-black text-base-content">{s.val}</div>
                <div className="text-[9px] sm:text-[10px] uppercase tracking-[0.15em] text-base-content/30 font-bold mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>

      {/* ══════════════════════════════════════ */}
      {/* FAQ */}
      {/* ══════════════════════════════════════ */}
      <div className="w-full max-w-3xl relative z-10 mb-32 sm:mb-40">
        <div className="text-center mb-12 sm:mb-14">
          <ScrollReveal y={15} duration={0.4} className="mb-4">
            <span className="inline-block text-[10px] uppercase tracking-[0.2em] font-bold text-base-content/30 bg-base-content/5 px-3 py-1 rounded-full">
              FAQ
            </span>
          </ScrollReveal>
          <CharReveal
            as="h2"
            className="block text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 p-4"
            stagger={0.02}
            y={30}
            rotateX={-60}
            duration={0.4}
          >
            Questions & answers.
          </CharReveal>
        </div>
        <MagReveal>
          <FAQSection />
        </MagReveal>
      </div>

      {/* ══════════════════════════════════════ */}
      {/* CTA */}
      {/* ══════════════════════════════════════ */}
      <div className="mt-8 sm:mt-12 mb-16 sm:mb-24 w-full max-w-5xl relative z-10">
        <ScrollReveal scale={0.95} duration={0.5} start="top 90%">
          <div className="bg-gradient-to-br from-primary/20 via-primary/10 to-transparent p-8 sm:p-12 md:p-16 rounded-2xl sm:rounded-[2rem] border border-primary/20 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 sm:p-8 opacity-[0.07] text-primary">
              <Zap size={100} fill="currentColor" />
            </div>
            <div className="absolute bottom-0 left-0 p-6 sm:p-8 opacity-[0.05] text-primary rotate-180">
              <Zap size={80} fill="currentColor" />
            </div>

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-success/15 border border-success/20 text-[10px] sm:text-xs font-semibold text-success mb-5 sm:mb-6">
                <CheckCircle size={11} />
                Free to use · No credit card
              </div>

              <CharReveal
                as="h2"
                className="block text-3xl sm:text-4xl md:text-6xl font-black mb-5 sm:mb-6"
                stagger={0.015}
                y={30}
                rotateX={-60}
                duration={0.4}
                start="top 95%"
              >
                Stop losing track of your documents.
              </CharReveal>

              <WordReveal
                className="text-sm sm:text-lg text-base-content/50 max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed"
                stagger={0.02}
                y={15}
                duration={0.4}
                delay={0.2}
                start="top 95%"
              >
                Create your first document in seconds. Assign your team, upload versions, and let reviewers do their job. It really is that simple.
              </WordReveal>
              <MagReveal>
                <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mb-7 sm:mb-8">
                  <Link
                    to="/login"
                    className="btn btn-primary btn-lg px-8 sm:px-12 rounded-2xl gap-2 transition-all hover:scale-[1.02]"
                  >
                    Create Your Document
                    <ArrowRight size={18} />
                  </Link>
                </div>
              </MagReveal>

              <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-[10px] sm:text-xs text-base-content/30">
                {["Free forever", "No credit card", "v1, v2, v3 simplicity", "PDFs & code files", "4 roles", "Audit log"].map((t, i) => (
                  <span key={i} className="flex items-center gap-1 sm:gap-1.5">
                    <CheckCircle size={11} className="text-success/50" />
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>

    </div>
  );
};

export default HomePage;