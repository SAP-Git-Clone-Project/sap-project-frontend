import { useMemo } from "react";
import { Link } from "react-router-dom";
import Animate from "@/components/animation/Animate";

/* Keyframes ONLY — nothing expressible in Tailwind */
const KEYFRAMES = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;700;800&display=swap');

  @keyframes nfpGrid{to{background-position:52px 52px}}

  @keyframes nfpDot{
    0%{transform:translateY(110vh) scaleX(1);opacity:0}
    8%{opacity:.6}
    50%{transform:translateY(50vh) scaleX(1.5);opacity:.6}
    92%{opacity:.6}
    100%{transform:translateY(-60px) translateX(32px) scaleX(1);opacity:0}
  }

  @keyframes nfpDraw{to{stroke-dashoffset:0}}
  @keyframes nfpPop{to{opacity:1;transform:scale(1)}}

  @keyframes nfpBlink{
    0%,100%{opacity:1}
    30%{opacity:1}31%{opacity:0}33%{opacity:1}
    55%{opacity:1}56%{opacity:0}57%{opacity:1}
    80%{opacity:1}81%{opacity:0}82%{opacity:1}
  }

  @keyframes nfpFlick{
    0%,100%{opacity:1;filter:none}
    10%{opacity:.08;filter:hue-rotate(90deg) saturate(5)}11%{opacity:1;filter:none}
    35%{opacity:1}36%{opacity:.05}37%{opacity:1}
    58%{opacity:1;filter:none}59%{opacity:.2;filter:hue-rotate(180deg)}60%{opacity:1;filter:none}
    85%{opacity:1}86%{opacity:.1}87%{opacity:1}
  }

  /* primary glitch — fires every 1.2s */
  @keyframes nfpG1{
    0%,64%,100%{transform:none;opacity:0}
    65%{transform:translateX(-11px) skewX(-4deg);opacity:.95}
    67%{transform:translateX(8px) scaleY(1.03);opacity:.95}
    69%{transform:translateX(-5px);opacity:.95}
    71%{transform:none;opacity:0}
    72%{transform:translateX(14px) skewX(3deg);opacity:.75}
    74%{transform:none;opacity:0}
    84%{transform:translateX(-3px);opacity:.5}
    85%{transform:none;opacity:0}
  }

  /* secondary channel */
  @keyframes nfpG2{
    0%,60%,100%{transform:none;opacity:0}
    61%{transform:translateX(12px) skewX(2deg);opacity:.9}
    63%{transform:translateX(-7px);opacity:.9}
    65%{transform:none;opacity:0}
    78%{transform:translateX(9px) scaleY(.97) skewX(-2deg);opacity:.65}
    80%{transform:none;opacity:0}
    90%{transform:translateX(-4px);opacity:.4}
    91%{transform:none;opacity:0}
  }

  /* white tear channel */
  @keyframes nfpG3{
    0%,55%,100%{transform:none;opacity:0}
    56%{transform:translateX(4px);opacity:.4;filter:brightness(10) saturate(0)}
    57%{transform:translateX(-3px);opacity:.4;filter:brightness(10) saturate(0)}
    58%{transform:none;opacity:0}
    83%{transform:translateX(-6px);opacity:.3;filter:brightness(8) saturate(0)}
    84%{transform:none;opacity:0}
  }

  /* scanline tear */
  @keyframes tear{
    0%,100%{clip-path:inset(0 0 100% 0);opacity:0}
    12%{clip-path:inset(35% 0 58% 0);opacity:1}
    13%{clip-path:inset(35% 0 58% 0);opacity:1}
    14%{clip-path:inset(0 0 100% 0);opacity:0}
    48%{clip-path:inset(0 0 100% 0);opacity:0}
    49%{clip-path:inset(60% 0 32% 0);opacity:.8}
    50%{clip-path:inset(0 0 100% 0);opacity:0}
    75%{clip-path:inset(0 0 100% 0);opacity:0}
    76%{clip-path:inset(20% 0 72% 0);opacity:.5}
    77%{clip-path:inset(0 0 100% 0);opacity:0}
  }

  @keyframes warningPulse{
    0%,100%{box-shadow:0 0 0 0 oklch(var(--er)/0)}
    50%{box-shadow:0 0 0 8px oklch(var(--er)/0.2),0 0 24px oklch(var(--er)/0.1)}
  }

  @keyframes errFlick{
    0%,100%{opacity:.7}
    20%{opacity:.7}21%{opacity:.1}22%{opacity:.7}
    50%{opacity:.7}51%{opacity:.2}52%{opacity:.7}
    80%{opacity:.7}81%{opacity:.05}82%{opacity:.7}
  }

  @keyframes graphJitter{
    0%,100%{filter:none}
    20%{filter:hue-rotate(20deg) saturate(2.5)}
    40%{filter:none}
    60%{filter:hue-rotate(-25deg) saturate(3) brightness(.85)}
    80%{filter:none}
  }

  @keyframes btnGlow{
    0%,100%{box-shadow:0 0 8px oklch(var(--er)/0.3),inset 0 0 0 oklch(var(--er)/0)}
    50%{box-shadow:0 0 20px oklch(var(--er)/0.6),inset 0 0 8px oklch(var(--er)/0.1)}
  }
`;

const mkParticles = () => {
  const h = (n) => ((n * 1664525 + 1013904223) >>> 0) / 2 ** 32;
  return Array.from({ length: 22 }, (_, i) => {
    const s = (i * 2654435761) >>> 0;
    return {
      left: `${(h(s) * 100).toFixed(1)}%`,
      width: `${(1 + h(s + 1) * 3.5).toFixed(1)}px`,
      height: `${(1 + h(s + 1) * 3.5).toFixed(1)}px`,
      duration: `${(5 + h(s + 2) * 9).toFixed(1)}s`,
      delay: `${(h(s + 3) * 7).toFixed(1)}s`,
      opacity: (0.35 + h(s) * 0.5).toFixed(2),
      color: i % 4 === 0 ? "oklch(var(--er))" : i % 4 === 1 ? "oklch(var(--p))" : i % 4 === 2 ? "oklch(var(--s))" : "oklch(var(--wa))",
      hue: Math.floor(h(s + 4) * 50) - 25,
    };
  });
}

const pop = (delay) => ({
  opacity: 0,
  transform: "scale(0)",
  animation: `nfpPop 0.3s cubic-bezier(.34,1.56,.64,1) ${delay}s forwards`,
});

const NotFoundPage = () => {
  const particles = useMemo(mkParticles, []);

  return (
    <>
      <style>{KEYFRAMES}</style>

      <div
        className="relative flex min-h-[105vh] flex-col items-center justify-center overflow-hidden bg-base-100"
        style={{ fontFamily: "'JetBrains Mono', monospace" }}
      >
        {/* ── dot-grid (red tint) ── */}
        <div className="absolute inset-0 pointer-events-none z-0" style={{
          backgroundImage: "linear-gradient(oklch(var(--er)/0.08) 1px,transparent 1px),linear-gradient(90deg,oklch(var(--er)/0.08) 1px,transparent 1px)",
          backgroundSize: "52px 52px",
          animation: "nfpGrid 12s linear infinite",
        }} />

        {/* ── CRT scanlines ── */}
        <div className="absolute inset-0 pointer-events-none z-[1]" style={{
          background: "repeating-linear-gradient(0deg,transparent,transparent 2px,oklch(var(--b3)/0.2) 2px,oklch(var(--b3)/0.2) 3px)",
        }} />

        {/* ── heavy red vignette ── */}
        <div className="absolute inset-0 pointer-events-none z-[2]" style={{
          background: "radial-gradient(ellipse at center,transparent 25%,oklch(var(--er)/0.15) 60%,oklch(var(--b1)/0.95) 100%)",
        }} />

        {/* ── particles ── */}
        {particles.map((p, i) => (
          <div key={i} className="absolute rounded-full pointer-events-none z-[2]" style={{
            left: p.left,
            width: p.width,
            height: p.height,
            opacity: p.opacity,
            background: p.color,
            animation: `nfpDot ${p.duration} ${p.delay} linear infinite`,
            filter: `hue-rotate(${p.hue}deg)`,
          }} />
        ))}

        {/* ── content ── */}
        <div className="relative z-10 flex flex-col items-center">

          {/* ── branch graph ── */}
          <Animate variant="fade-in" duration={700} delay={0}>
            <svg
              width="300" height="215" viewBox="0 0 300 215"
              className="overflow-visible"
              style={{ animation: "graphJitter 3s ease-in-out infinite 2.5s" }}
            >
              <defs>
                <filter id="pg">
                  <feGaussianBlur stdDeviation="2.5" result="b" />
                  <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                <filter id="eg">
                  <feGaussianBlur stdDeviation="5" result="b" />
                  <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>

              <line style={{ stroke: "oklch(var(--p))", strokeDasharray: 400, strokeDashoffset: 400, animation: "nfpDraw 1.1s ease 0.1s forwards" }} x1="90" y1="20" x2="90" y2="198" strokeWidth="2" fill="none" filter="url(#pg)" />
              <path style={{ stroke: "oklch(var(--p))", strokeDasharray: 220, strokeDashoffset: 220, animation: "nfpDraw 0.9s ease 0.55s forwards", opacity: .4 }} d="M90 84 C90 108,160 102,160 130 L160 172" strokeWidth="2" fill="none" filter="url(#pg)" />
              <line style={{ stroke: "oklch(var(--er))", strokeDasharray: 80, strokeDashoffset: 80, animation: "nfpDraw 0.6s ease 1.1s forwards" }} x1="160" y1="172" x2="160" y2="200" strokeWidth="2" fill="none" filter="url(#eg)" />

              <g style={pop(0.35)} filter="url(#pg)">
                <circle cx="90" cy="24" r="6" className="fill-primary" />
                <g style={{ animation: "nfpBlink 1.4s ease-in-out infinite 1.5s" }}>
                  <rect x="100" y="15" width="42" height="15" rx="2" className="fill-primary/10 stroke-primary" strokeWidth="0.8" />
                  <text x="121" y="26" fontSize="8" textAnchor="middle" fontWeight="700" className="fill-primary">HEAD</text>
                </g>
                <text x="148" y="28" fontSize="8" className="fill-base-content/25">a3f2c17</text>
              </g>

              <g style={pop(0.6)}>
                <circle cx="90" cy="60" r="5" className="fill-primary" />
                <text x="100" y="64" fontSize="8" className="fill-base-content/25">b7e9012</text>
              </g>

              <g style={pop(0.85)} filter="url(#pg)">
                <circle cx="90" cy="84" r="6" className="fill-primary" />
                <text x="100" y="88" fontSize="8" className="fill-base-content/25">c1d4a28</text>
              </g>

              <g style={pop(1.05)}>
                <circle cx="90" cy="140" r="5" className="fill-primary" />
                <text x="100" y="144" fontSize="8" className="fill-base-content/25">d9f3b04</text>
              </g>

              <g style={pop(1.2)}>
                <circle cx="90" cy="196" r="5" className="fill-primary" />
                <text x="100" y="200" fontSize="8" className="fill-base-content/25">e5a2f18</text>
              </g>

              <g style={pop(1.2)}>
                <circle cx="160" cy="142" r="5" className="fill-primary/45" filter="url(#pg)" />
                <rect x="148" y="106" width="88" height="14" rx="2" className="fill-primary/5 stroke-primary/25" strokeWidth="0.7" />
                <text x="192" y="116" fontSize="7.5" textAnchor="middle" className="fill-base-content/35">refs/heads/current</text>
              </g>

              {/* dead node — violent flicker + double ring */}
              <g style={pop(1.55)} filter="url(#eg)">
                <circle style={{ animation: "nfpFlick 1.2s ease-in-out infinite 1.8s" }} cx="160" cy="200" r="12" className="fill-error/15 stroke-error" strokeWidth="2" />
                <circle style={{ animation: "nfpFlick 1.2s ease-in-out infinite 2.1s", opacity: .35 }} cx="160" cy="200" r="18" className="stroke-error" strokeWidth="0.8" fill="none" />
                <line x1="155" y1="195" x2="165" y2="205" className="stroke-error" strokeWidth="2.2" strokeLinecap="round" />
                <line x1="165" y1="195" x2="155" y2="205" className="stroke-error" strokeWidth="2.2" strokeLinecap="round" />
                <text x="180" y="204" fontSize="8" fontWeight="700" className="fill-error">NULL</text>
              </g>

              <g className="opacity-20">
                <circle cx="16" cy="185" r="4" className="fill-primary" />
                <text x="24" y="189" fontSize="7.5" className="fill-base-content">main</text>
                <circle cx="16" cy="200" r="4" className="fill-error/70" />
                <text x="24" y="204" fontSize="7.5" className="fill-base-content">dangling</text>
              </g>
            </svg>
          </Animate>

          {/* ── 404 glitch hero ── */}
          <Animate variant="scale-up" duration={500} delay={250}>
            <div
              className="select-none relative"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 800,
                letterSpacing: "-4px",
                lineHeight: 1,
                fontSize: "clamp(72px,12vw,136px)",
              }}
            >
              <span style={{ color: "oklch(var(--p))", position: "relative", zIndex: 2 }}>404</span>

              {/* error channel */}
              <span aria-hidden style={{
                position: "absolute", inset: 0, left: 0, fontWeight: 800, zIndex: 3,
                color: "oklch(var(--er))",
                clipPath: "polygon(0 24%,100% 24%,100% 46%,0 46%)",
                animation: "nfpG1 1.2s steps(1) infinite 0.4s",
              }}>404</span>

              {/* secondary channel */}
              <span aria-hidden style={{
                position: "absolute", inset: 0, left: 0, fontWeight: 800, zIndex: 3,
                color: "oklch(var(--s))",
                clipPath: "polygon(0 58%,100% 58%,100% 78%,0 78%)",
                animation: "nfpG2 1.2s steps(1) infinite 0.1s",
              }}>404</span>

              {/* white tear */}
              <span aria-hidden style={{
                position: "absolute", inset: 0, left: 0, fontWeight: 800, zIndex: 4,
                color: "oklch(var(--bc))",
                animation: "nfpG3 1.8s steps(1) infinite 0.8s",
              }}>404</span>

              {/* scanline tear */}
              <span aria-hidden style={{
                position: "absolute", inset: 0, left: 0, fontWeight: 800, zIndex: 5,
                color: "oklch(var(--er)/0.7)",
                animation: "tear 2.2s steps(1) infinite 0.6s",
              }}>404</span>
            </div>
          </Animate>

          {/* ── badges ── */}
          <Animate variant="fade-up" duration={380} delay={150}>
            <div className="mt-3 flex gap-2 items-center flex-wrap justify-center">
              <div className="badge badge-error badge-sm font-bold tracking-widest uppercase">
                ref not found
              </div>
              <div className="badge badge-outline badge-error badge-sm font-bold tracking-wider opacity-60">
                exit 128
              </div>
              <div className="badge badge-outline badge-sm font-bold tracking-wider opacity-30">
                SIGKILL
              </div>
            </div>
          </Animate>

          {/* ── heading ── */}
          <Animate variant="fade-up" duration={380} delay={250}>
            <p className="mt-2 text-base font-bold text-base-content tracking-tight">
              This revision does not exist
            </p>
          </Animate>

          {/* ── description ── */}
          <Animate variant="fade-up" duration={380} delay={350}>
            <p className="mt-1.5 max-w-sm text-center text-xs leading-loose text-base-content/40">
              The ref was{" "}
              <span className="text-error font-semibold">force-deleted</span>, never
              pushed, or the object store is{" "}
              <span className="text-warning font-semibold">corrupted</span>. Check your{" "}
              <kbd className="kbd kbd-xs">reflog</kbd> before it expires.
            </p>
          </Animate>

          {/* ── terminal stderr block ── */}
          <Animate variant="fade-up" duration={380} delay={550}>
            <div
              className="mt-5 rounded border border-error/30 bg-error/5 px-4 py-3 max-w-sm w-full"
              style={{ animation: "warningPulse 2.8s ease-in-out infinite 3.5s" }}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="h-1.5 w-1.5 flex-shrink-0 animate-ping rounded-full bg-error" />
                <span className="text-[9px] tracking-widest uppercase text-error/40 font-bold">stderr</span>
                <span className="ml-auto text-[9px] tracking-widest uppercase text-base-content/20 font-bold">vcs core</span>
              </div>
              <code
                className="text-[10px] tracking-wide leading-relaxed block"
                style={{ animation: "errFlick 1.8s ease-in-out infinite 1s", color: "oklch(var(--er)/0.7)" }}
              >
                fatal: object not found — no match for id<br />
                error: refs/heads/current → [dangling]<br />
                error: ref resolution failed [exit 128]
              </code>
            </div>
          </Animate>

          {/* ── single home button ── */}
          <Animate variant="fade-up" duration={380} delay={300}>
            <div className="mt-6">
              <Link
                to="/"
                className="btn btn-error btn-sm gap-2 font-bold tracking-widest uppercase"
                style={{ animation: "btnGlow 2s ease-in-out infinite 2s" }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                return to root
              </Link>
            </div>
          </Animate>

        </div>
      </div>
    </>
  );
}

export default NotFoundPage;