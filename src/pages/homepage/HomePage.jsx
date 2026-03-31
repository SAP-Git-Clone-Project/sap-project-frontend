import { NavLink } from "react-router-dom";
import Animate from "@/components/animation/Animate.jsx";
import { 
  FileText, ShieldCheck, Users, Zap, 
  ArrowRight, CheckCircle, Lock, Cpu, Globe 
} from "lucide-react";
import GlassCard from "../homepage/components/GlassCard.jsx";
import BackgroundEffects from "@/components/background/BackgroundEffects.jsx";

const GettingStarted = () => {
  return (
    <div className="relative min-h-screen flex flex-col items-center px-6 text-center py-20 overflow-hidden bg-base-100">
      
      {/* ── BACKGROUND LAYER ── */}
      <BackgroundEffects length={18} />

      {/* Static Glows */}
      <div className="absolute w-[800px] h-[800px] bg-primary/5 blur-[140px] rounded-full top-[-300px] left-[50%] translate-x-[-50%] -z-10" />
      <div className="absolute w-[600px] h-[600px] bg-secondary/5 blur-[140px] rounded-full bottom-[10%] left-[-10%] -z-10" />

      {/* ── HERO SECTION ── */}
      <Animate variant="fade-down">
        <div className="space-y-6 max-w-2xl relative z-10 mb-20">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-primary border border-primary/30 flex items-center justify-center shadow-lg shadow-primary/20 bg-prima">
              <Zap size={22} fill="white" className="text-white" />
            </div>
            <span className="text-3xl font-extrabold tracking-tight">
              SAP <span className="text-primary">Hub</span>
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-black tracking-tight text-base-content leading-tight">
            Manage your documents
            <span className="text-primary"> smarter</span>
          </h1>

          <p className="text-base-content/60 text-lg md:text-xl leading-relaxed">
            The professional standard for document lifecycle management. 
            Track revisions, automate approvals, and maintain a single source of truth.
          </p>

          <div className="flex justify-center gap-4 mt-8">
            <NavLink
              to="/login"
              className="group btn btn-primary px-10 shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all duration-300 rounded-xl h-14"
            >
              Get Started Free
              <ArrowRight size={18} className="ml-2 transition-transform group-hover:translate-x-1" />
            </NavLink>
          </div>
        </div>
      </Animate>

      {/* ── METRICS BANNERS ── */}
      <Animate variant="fade-up" delay={0.2}>
        <div className="flex flex-wrap justify-center gap-12 md:gap-24 mb-32 py-8 border-y border-base-content/5 w-full max-w-5xl relative z-10">
          {[
            { label: "Uptime", val: "99.9%" },
            { label: "Data Encrypted", val: "256-bit" },
            { label: "Global Nodes", val: "14+" }
          ].map((m, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl font-black text-base-content">{m.val}</div>
              <div className="text-xs uppercase tracking-widest text-base-content/40 font-bold">{m.label}</div>
            </div>
          ))}
        </div>
      </Animate>

      {/* ── CORE FEATURES ── */}
      <Animate variant="fade-up">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl relative z-10">
          <GlassCard bg="bg-primary/10" border="border-primary/20">
            <FileText className="mx-auto mb-3 text-primary" size={28} />
            <h3 className="font-semibold text-lg">Version Control</h3>
            <p className="text-sm text-base-content/60">
              Track document history and manage revisions easily. Never lose a previous draft again.
            </p>
          </GlassCard>

          <GlassCard bg="bg-success/10" border="border-success/20">
            <ShieldCheck className="mx-auto mb-3 text-success" size={28} />
            <h3 className="font-semibold text-lg">Secure Access</h3>
            <p className="text-sm text-base-content/60">
              Role-based permissions ensure only authorized users can view or modify sensitive files.
            </p>
          </GlassCard>

          <GlassCard bg="bg-warning/10" border="border-warning/20">
            <Users className="mx-auto mb-3 text-warning" size={28} />
            <h3 className="font-semibold text-lg">Team Collaboration</h3>
            <p className="text-sm text-base-content/60">
              Share files and manage approval workflows. Tag teammates for instant reviews.
            </p>
          </GlassCard>
        </div>
      </Animate>

      {/* ── STEP BY STEP WORKFLOW ── */}
      <div className="mt-40 w-full max-w-5xl relative z-10">
        <Animate variant="fade-left">
          <div className="text-left mb-16">
            <h2 className="text-3xl font-bold mb-4">Streamlined Workflow</h2>
            <p className="text-base-content/50">How documents move through SAP Hub from start to finish.</p>
          </div>
        </Animate>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {[
            { icon: <Cpu />, title: "Automated Ingestion", desc: "Drag and drop any file type. Our system automatically extracts metadata and creates the first version." },
            { icon: <CheckCircle />, title: "Smart Approvals", desc: "Set up sequential or parallel approval chains. Notify stakeholders automatically when it's their turn." },
            { icon: <Lock />, title: "Immutable Storage", desc: "Once a version is finalized, it is locked. No more 'Final_Final_v2.pdf' confusion." },
            { icon: <Globe />, title: "External Sharing", desc: "Generate secure, expiring links for external auditors or clients without giving full repo access." }
          ].map((item, idx) => (
            <Animate key={idx} variant="fade-up" delay={idx * 0.1}>
              <div className="flex gap-6 text-left group">
                <div className="w-14 h-14 shrink-0 rounded-2xl bg-base-200 border border-base-content/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <div>
                  <h4 className="font-bold text-xl mb-2">{item.title}</h4>
                  <p className="text-sm text-base-content/60 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            </Animate>
          ))}
        </div>
      </div>

    </div>
  );
};

export default GettingStarted;