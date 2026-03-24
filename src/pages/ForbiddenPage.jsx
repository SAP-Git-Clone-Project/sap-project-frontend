import { useMemo } from "react";
import { Link } from "react-router-dom";
import Animate from "@/components/animation/Animate";

/* Keyframes - Security Alert Theme */
const KEYFRAMES = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;700;800&display=swap');

  @keyframes alertGrid{to{background-position:52px 52px}}
  @keyframes alertPop{to{opacity:1;transform:scale(1)}}
  
  @keyframes scanline {
    0% { transform: translateY(-100%); }
    100% { transform: translateY(100%); }
  }

  @keyframes securityPulse {
    0%, 100% { opacity: 0.15; }
    50% { opacity: 0.4; }
  }

  @keyframes textGlitch {
    0%, 100% { transform: none; opacity: 1; }
    92% { transform: none; opacity: 1; }
    93% { transform: translateX(-4px) skewX(5deg); opacity: 0.75; color: oklch(var(--wa)); }
    94% { transform: translateX(3px); opacity: 0.8; }
    95% { transform: none; opacity: 1; }
  }
`;

const ForbiddenPage = () => {
  return (
    <>
      <style>{KEYFRAMES}</style>

      <div
        className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-base-100"
        style={{ fontFamily: "'JetBrains Mono', monospace" }}
      >
        {/* ── security grid (amber/yellow tint) ── */}
        <div className="absolute inset-0 pointer-events-none z-0" style={{
          backgroundImage: "linear-gradient(oklch(var(--wa)/0.05) 1px,transparent 1px),linear-gradient(90deg,oklch(var(--wa)/0.05) 1px,transparent 1px)",
          backgroundSize: "52px 52px",
          animation: "alertGrid 20s linear infinite",
        }} />

        {/* ── moving scanline ── */}
        <div className="absolute inset-0 pointer-events-none z-[1]" style={{
          height: '100px',
          background: "linear-gradient(to bottom, transparent, oklch(var(--wa)/0.1), transparent)",
          animation: "scanline 4s linear infinite",
        }} />

        {/* ── heavy vignette ── */}
        <div className="absolute inset-0 pointer-events-none z-[2]" style={{
          background: "radial-gradient(ellipse at center,transparent 20%,oklch(var(--b1)/0.9) 100%)",
        }} />

        {/* ── content ── */}
        <div className="relative z-10 flex flex-col items-center">

          {/* ── shield icon / security graph ── */}
          <Animate variant="fade-in" duration={700} delay={0}>
            <div className="mb-6 flex justify-center">
              <svg width="120" height="120" viewBox="0 0 24 24" fill="none" className="stroke-warning opacity-80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="M12 8v4" />
                <path d="M12 16h.01" />
                <circle cx="12" cy="12" r="10" className="opacity-20 stroke-warning" strokeDasharray="4 4" />
              </svg>
            </div>
          </Animate>

          {/* ── 403 alert hero ── */}
          <Animate variant="scale-up" duration={500} delay={250}>
            <div
              className="select-none relative"
              style={{
                fontWeight: 800,
                letterSpacing: "-4px",
                lineHeight: 1,
                fontSize: "clamp(72px,12vw,136px)",
                animation: "textGlitch 5s infinite",
              }}
            >
              <span className="text-warning">403</span>
            </div>
          </Animate>

          {/* ── badges ── */}
          <Animate variant="fade-up" duration={380} delay={150}>
            <div className="mt-3 flex gap-2 items-center flex-wrap justify-center">
              <div className="badge badge-warning badge-sm font-bold tracking-widest uppercase">
                access denied
              </div>
              <div className="badge badge-outline badge-warning badge-sm font-bold tracking-wider opacity-60">
                insufficient privilege
              </div>
            </div>
          </Animate>

          {/* ── heading ── */}
          <Animate variant="fade-up" duration={380} delay={250}>
            <p className="mt-4 text-base font-bold text-warning tracking-tight uppercase">
              Restricted Area
            </p>
          </Animate>

          {/* ── description ── */}
          <Animate variant="fade-up" duration={380} delay={350}>
            <p className="mt-2 max-w-sm text-center text-xs leading-loose text-base-content/50">
              Your credentials are valid, but your current <span className="text-warning font-bold">Role</span> does not have
              clearance for this resource. Contact a <span className="text-primary font-bold">System Admin</span> to
              elevate your permissions.
            </p>
          </Animate>

          {/* ── navigation ── */}
          <Animate variant="fade-up" duration={380} delay={450}>
            <div className="mt-8 flex gap-4">
              <Link
                to="/"
                className="btn btn-outline btn-warning btn-sm gap-2 font-bold tracking-widest uppercase"
              >
                Go Back
              </Link>
              <Link
                to="/dashboard"
                className="btn btn-warning btn-sm gap-2 font-bold tracking-widest uppercase"
              >
                Dashboard
              </Link>
            </div>
          </Animate>

          {/* ── security log ── */}
          <Animate variant="fade-up" duration={380} delay={550}>
            <div className="mt-8 rounded border border-warning/20 bg-warning/5 px-6 py-4 max-w-md w-full backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-2 w-2 rounded-full bg-warning animate-pulse" />
                <span className="text-[10px] tracking-widest uppercase text-warning font-bold">Security Audit Log</span>
              </div>
              <code className="text-[10px] tracking-wide leading-relaxed block text-base-content/60">
                [AUTH_LOG]: User ID authenticated.<br />
                [AUTH_LOG]: Checking Role: <span className="text-warning">GUEST_OR_AUTHOR</span><br />
                [AUTH_LOG]: Target Resource: <span className="text-error">ADMIN_GATEWAY</span><br />
                [SYSTEM]: Permission Validation Failed - Code 403
              </code>
            </div>
          </Animate>

        </div>
      </div>
    </>
  );
}

export default ForbiddenPage;