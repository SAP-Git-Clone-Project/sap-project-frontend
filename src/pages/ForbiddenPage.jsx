import { useMemo } from "react";
import { Link } from "react-router-dom";
import Animate from "@/components/animation/Animate";

/* ─────────────────────────────────────────────────────────────────────────────
   KEYFRAMES — Security / Glitch Theme
───────────────────────────────────────────────────────────────────────────── */
const KEYFRAMES = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;700;800&display=swap');

  /* ── background grid drift ── */
  @keyframes alertGrid { to { background-position: 52px 52px; } }

  /* ── moving scanline ── */
  @keyframes scanline {
    0%   { top: -120px; }
    100% { top: 110%; }
  }

  /* ── CRT flicker ── */
  @keyframes crtFlicker {
    0%,100%  { opacity: 1; }
    41%      { opacity: 1; }
    42%      { opacity: 0.6; }
    43%      { opacity: 1; }
    58%      { opacity: 1; }
    58.5%    { opacity: 0.5; }
    59%      { opacity: 1; }
    85%      { opacity: 1; }
    85.2%    { opacity: 0.7; }
    85.4%    { opacity: 1; }
  }

  /* ── 403 hero — main RGB-split glitch ── */
  @keyframes heroGlitch {
    0%,100%  { transform: none; }
    /* jerk #1 */
    8%       { transform: translateX(-6px) skewX(-3deg); }
    8.5%     { transform: translateX(5px)  skewX( 4deg); }
    9%       { transform: none; }
    /* jerk #2 */
    33%      { transform: translateX(4px); }
    33.3%    { transform: translateX(-8px) scaleX(1.02); }
    33.6%    { transform: none; }
    /* jerk #3 */
    72%      { transform: skewX(-6deg) translateX(6px); }
    72.3%    { transform: skewX(4deg)  translateX(-4px); }
    72.6%    { transform: none; }
    /* jerk #4 */
    91%      { transform: translateY(3px) scaleY(0.98); }
    91.3%    { transform: translateY(-2px); }
    91.6%    { transform: none; }
  }

  /* ── Red ghost (left offset) ── */
  @keyframes rgbRed {
    0%,100%  { clip-path: inset(0 0 100% 0); transform: translateX(0); opacity: 0; }
    8%       { clip-path: inset(20% 0 30% 0); transform: translateX(-8px); opacity: 0.7; }
    8.6%     { clip-path: inset(60% 0 5% 0);  transform: translateX(-5px); opacity: 0.5; }
    9.2%     { clip-path: inset(0 0 100% 0); opacity: 0; }
    33%      { clip-path: inset(40% 0 10% 0); transform: translateX(-10px); opacity: 0.65; }
    33.7%    { clip-path: inset(5% 0 55% 0);  transform: translateX(-6px); opacity: 0.4; }
    34.4%    { clip-path: inset(0 0 100% 0); opacity: 0; }
    72%      { clip-path: inset(10% 0 50% 0); transform: translateX(-12px); opacity: 0.8; }
    72.5%    { clip-path: inset(55% 0 15% 0); transform: translateX(-7px); opacity: 0.5; }
    73.0%    { clip-path: inset(0 0 100% 0); opacity: 0; }
  }

  /* ── Cyan ghost (right offset) ── */
  @keyframes rgbCyan {
    0%,100%  { clip-path: inset(0 0 100% 0); transform: translateX(0); opacity: 0; }
    8%       { clip-path: inset(30% 0 20% 0); transform: translateX(8px); opacity: 0.6; }
    8.6%     { clip-path: inset(5% 0 60% 0);  transform: translateX(5px); opacity: 0.4; }
    9.2%     { clip-path: inset(0 0 100% 0); opacity: 0; }
    33%      { clip-path: inset(10% 0 40% 0); transform: translateX(10px); opacity: 0.55; }
    33.7%    { clip-path: inset(50% 0 5% 0);  transform: translateX(6px);  opacity: 0.35; }
    34.4%    { clip-path: inset(0 0 100% 0); opacity: 0; }
    72%      { clip-path: inset(50% 0 10% 0); transform: translateX(12px); opacity: 0.7; }
    72.5%    { clip-path: inset(15% 0 55% 0); transform: translateX(7px);  opacity: 0.45; }
    73.0%    { clip-path: inset(0 0 100% 0); opacity: 0; }
  }

  /* ── horizontal block-corruption slices ── */
  @keyframes blockGlitch {
    0%,100%  { opacity: 0; clip-path: inset(0 0 100% 0); }
    8.1%     { opacity: 1; clip-path: inset(18% 0 72% 0); transform: translateX(14px)  scaleX(1.04); }
    8.4%     { opacity: 1; clip-path: inset(62% 0  8% 0); transform: translateX(-10px) scaleX(0.97); }
    8.7%     { opacity: 0; clip-path: inset(0 0 100% 0); }
    33.1%    { opacity: 1; clip-path: inset(45% 0 25% 0); transform: translateX(-18px) scaleX(1.06); }
    33.5%    { opacity: 1; clip-path: inset(8%  0 70% 0); transform: translateX(12px)  scaleX(0.95); }
    33.9%    { opacity: 0; clip-path: inset(0 0 100% 0); }
    72.1%    { opacity: 1; clip-path: inset(70% 0  5% 0); transform: translateX(20px)  scaleX(1.05); }
    72.4%    { opacity: 1; clip-path: inset(10% 0 55% 0); transform: translateX(-14px) scaleX(1.02); }
    72.7%    { opacity: 0; clip-path: inset(0 0 100% 0); }
  }

  /* ── text-level glitch for labels / body copy ── */
  @keyframes textGlitch {
    0%,100%  { transform: none; opacity: 1; filter: none; }
    92%      { transform: none; opacity: 1; }
    92.5%    { transform: translateX(-4px) skewX(6deg); opacity: 0.75; color: oklch(var(--wa)); filter: blur(0.5px); }
    93%      { transform: translateX(3px);  opacity: 0.85; }
    93.5%    { transform: none; opacity: 1; filter: none; }
  }

  /* ── noise overlay pseudo-random flicker ── */
  @keyframes noiseShift {
    0%   { background-position: 0    0;    }
    10%  { background-position: -5%  -10%; }
    20%  { background-position: -15% 5%;   }
    30%  { background-position: 7%   -25%; }
    40%  { background-position: 20%  10%;  }
    50%  { background-position: -20% 20%;  }
    60%  { background-position: 15%  -5%;  }
    70%  { background-position: 0    15%;  }
    80%  { background-position: -10% 0;    }
    90%  { background-position: 5%   5%;   }
    100% { background-position: 0    0;    }
  }

  /* ── badge flicker ── */
  @keyframes badgeFlicker {
    0%,100%  { opacity: 1; }
    50%      { opacity: 1; }
    50.5%    { opacity: 0.3; }
    51%      { opacity: 1; }
    75%      { opacity: 1; }
    75.3%    { opacity: 0.5; }
    75.6%    { opacity: 1; }
  }

  /* ── log line scan ── */
  @keyframes logScan {
    0%,100%  { background-position: 0 -100%; }
    50%      { background-position: 0 200%;  }
  }

  /* ── border static ── */
  @keyframes borderStatic {
    0%,100%  { border-color: oklch(var(--wa)/0.2); box-shadow: none; }
    8%       { border-color: oklch(var(--er)/0.8);  box-shadow: 0 0 12px oklch(var(--er)/0.4); }
    8.7%     { border-color: oklch(var(--wa)/0.2); }
    72%      { border-color: oklch(var(--in)/0.9);  box-shadow: 0 0 16px oklch(var(--in)/0.3); }
    72.8%    { border-color: oklch(var(--wa)/0.2); box-shadow: none; }
  }
`;

/* ─────────────────────────────────────────────────────────────────────────────
   Noise SVG (inline, no external asset)
───────────────────────────────────────────────────────────────────────────── */
const NOISE_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`;

/* ─────────────────────────────────────────────────────────────────────────────
   Component
───────────────────────────────────────────────────────────────────────────── */
const ForbiddenPage = () => {
  return (
    <>
      <style>{KEYFRAMES}</style>

      {/* ── root ── */}
      <div
        className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-base-100"
        style={{ fontFamily: "'JetBrains Mono', monospace", animation: "crtFlicker 8s infinite" }}
      >
        {/* ── security grid ── */}
        <div className="absolute inset-0 pointer-events-none z-0" style={{
          backgroundImage: "linear-gradient(oklch(var(--wa)/0.06) 1px,transparent 1px),linear-gradient(90deg,oklch(var(--wa)/0.06) 1px,transparent 1px)",
          backgroundSize: "52px 52px",
          animation: "alertGrid 20s linear infinite",
        }} />

        {/* ── film-grain noise overlay ── */}
        <div className="absolute inset-0 pointer-events-none z-[1]" style={{
          backgroundImage: NOISE_SVG,
          backgroundRepeat: "repeat",
          backgroundSize: "180px 180px",
          opacity: 0.04,
          animation: "noiseShift 0.3s steps(1) infinite",
          mixBlendMode: "screen",
        }} />

        {/* ── moving scanline ── */}
        <div className="absolute pointer-events-none z-[2]" style={{
          left: 0, right: 0, height: '160px',
          background: "linear-gradient(to bottom, transparent, oklch(var(--wa)/0.07) 30%, oklch(var(--wa)/0.13) 50%, oklch(var(--wa)/0.07) 70%, transparent)",
          animation: "scanline 3.5s linear infinite",
        }} />

        {/* ── second fast scanline (thin, bright) ── */}
        <div className="absolute pointer-events-none z-[2]" style={{
          left: 0, right: 0, height: '3px',
          background: "oklch(var(--wa)/0.35)",
          animation: "scanline 1.2s linear infinite",
          animationDelay: "0.6s",
        }} />

        {/* ── CRT horizontal lines ── */}
        <div className="absolute inset-0 pointer-events-none z-[3]" style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, oklch(var(--b1)/0.15) 2px, oklch(var(--b1)/0.15) 4px)",
          backgroundSize: "100% 4px",
        }} />

        {/* ── vignette ── */}
        <div className="absolute inset-0 pointer-events-none z-[4]" style={{
          background: "radial-gradient(ellipse at center, transparent 15%, oklch(var(--b1)/0.85) 100%)",
        }} />

        {/* ── content ── */}
        <div className="relative z-10 flex flex-col items-center">

          {/* ── shield icon ── */}
          <Animate variant="fade-in" duration={700} delay={0}>
            <div className="mb-6 flex justify-center" style={{ animation: "textGlitch 4s infinite" }}>
              <svg width="120" height="120" viewBox="0 0 24 24" fill="none" className="stroke-warning opacity-80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="M12 8v4" />
                <path d="M12 16h.01" />
                <circle cx="12" cy="12" r="10" className="opacity-20 stroke-warning" strokeDasharray="4 4" />
              </svg>
            </div>
          </Animate>

          {/* ── 403 hero — RGB-split glitch stack ── */}
          <Animate variant="scale-up" duration={500} delay={250}>
            <div className="select-none relative" style={{ lineHeight: 1 }}>

              {/* Red ghost — left */}
              <div
                aria-hidden="true"
                className="absolute inset-0 text-center"
                style={{
                  fontWeight: 800,
                  letterSpacing: "-4px",
                  fontSize: "clamp(72px,12vw,136px)",
                  color: "#ff2020",
                  mixBlendMode: "screen",
                  animation: "rgbRed 4.5s infinite",
                  userSelect: "none",
                  pointerEvents: "none",
                }}
              >403</div>

              {/* Cyan ghost — right */}
              <div
                aria-hidden="true"
                className="absolute inset-0 text-center"
                style={{
                  fontWeight: 800,
                  letterSpacing: "-4px",
                  fontSize: "clamp(72px,12vw,136px)",
                  color: "#00f0f0",
                  mixBlendMode: "screen",
                  animation: "rgbCyan 4.5s infinite",
                  userSelect: "none",
                  pointerEvents: "none",
                }}
              >403</div>

              {/* Block-corruption duplicate */}
              <div
                aria-hidden="true"
                className="absolute inset-0 text-center"
                style={{
                  fontWeight: 800,
                  letterSpacing: "-4px",
                  fontSize: "clamp(72px,12vw,136px)",
                  color: "oklch(var(--wa))",
                  animation: "blockGlitch 4.5s infinite",
                  userSelect: "none",
                  pointerEvents: "none",
                  filter: "brightness(1.4)",
                }}
              >403</div>

              {/* Main text */}
              <div
                style={{
                  fontWeight: 800,
                  letterSpacing: "-4px",
                  fontSize: "clamp(72px,12vw,136px)",
                  color: "oklch(var(--wa))",
                  animation: "heroGlitch 4.5s infinite",
                  position: "relative",
                }}
              >403</div>

            </div>
          </Animate>

          {/* ── badges ── */}
          <Animate variant="fade-up" duration={380} delay={150}>
            <div className="mt-3 flex gap-2 items-center flex-wrap justify-center">
              <div
                className="badge badge-warning badge-sm font-bold tracking-widest uppercase"
                style={{ animation: "badgeFlicker 6s infinite" }}
              >
                access denied
              </div>
              <div
                className="badge badge-outline badge-warning badge-sm font-bold tracking-wider opacity-60"
                style={{ animation: "badgeFlicker 6s infinite", animationDelay: "1.3s" }}
              >
                insufficient privilege
              </div>
            </div>
          </Animate>

          {/* ── heading ── */}
          <Animate variant="fade-up" duration={380} delay={250}>
            <p
              className="mt-4 text-base font-bold text-warning tracking-tight uppercase"
              style={{ animation: "textGlitch 5.5s infinite" }}
            >
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

          {/* ── security log ── */}
          <Animate variant="fade-up" duration={380} delay={550}>
            <div
              className="mt-8 rounded px-6 py-4 max-w-md w-full backdrop-blur-sm"
              style={{
                border: "1px solid oklch(var(--wa)/0.2)",
                background: "oklch(var(--wa)/0.05)",
                animation: "borderStatic 4.5s infinite",
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="h-2 w-2 rounded-full bg-warning animate-pulse" />
                <span
                  className="text-[10px] tracking-widest uppercase text-warning font-bold"
                  style={{ animation: "textGlitch 3.8s infinite", animationDelay: "0.7s" }}
                >
                  Security Audit Log
                </span>
              </div>
              <code
                className="text-[10px] tracking-wide leading-relaxed block text-base-content/60"
                style={{
                  backgroundImage: "linear-gradient(transparent 0%, oklch(var(--wa)/0.06) 50%, transparent 100%)",
                  backgroundSize: "100% 400%",
                  animation: "logScan 4s ease-in-out infinite",
                }}
              >
                [AUTH_LOG]: User ID authenticated.<br />
                [AUTH_LOG]: Checking Role: <span className="text-warning" style={{ animation: "badgeFlicker 3s infinite" }}>GUEST_OR_AUTHOR</span><br />
                [AUTH_LOG]: Target Resource: <span className="text-error" style={{ animation: "badgeFlicker 2.4s infinite", animationDelay: "0.5s" }}>ADMIN_GATEWAY</span><br />
                [SYSTEM]: Permission Validation Failed - Code 403
              </code>
            </div>
          </Animate>

          {/* ── navigation ── */}
          <Animate variant="fade-up" duration={380} delay={450}>
            <div className="mt-8 flex gap-4">
              <Link
                to="/"
                className="btn btn-outline btn-warning btn-sm gap-2 font-bold tracking-widest uppercase"
                style={{ animation: "crtFlicker 9s infinite", animationDelay: "1s" }}
              >
                Go Back
              </Link>
            </div>
          </Animate>
          
        </div>
      </div>
    </>
  );
};

export default ForbiddenPage;