import { Link } from "react-router-dom";
import Animate from "@/components/animation/Animate";

/* ─────────────────────────────────────────────────────────────────────────────
   KEYFRAMES
───────────────────────────────────────────────────────────────────────────── */
const KEYFRAMES = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;700;800&display=swap');

  @keyframes errGrid  { to { background-position: 48px 48px; } }

  @keyframes errScan {
    0%   { top: -160px; }
    100% { top: 110%; }
  }

  @keyframes errFlicker {
    0%,100%  { opacity: 1; }
    17%      { opacity: 1; }
    17.3%    { opacity: 0.55; }
    17.6%    { opacity: 1; }
    44%      { opacity: 1; }
    44.2%    { opacity: 0.4; }
    44.5%    { opacity: 1; }
    79%      { opacity: 1; }
    79.2%    { opacity: 0.7; }
    79.4%    { opacity: 1; }
  }

  @keyframes heroErr {
    0%,100%  { transform: none; }
    5%       { transform: translateX(8px) skewX(-5deg); }
    5.4%     { transform: translateX(-6px) scaleX(1.03); }
    5.8%     { transform: none; }
    29%      { transform: skewX(7deg) translateX(-10px); }
    29.4%    { transform: skewX(-4deg) translateX(7px); }
    29.8%    { transform: none; }
    61%      { transform: translateX(12px) scaleX(0.97); }
    61.3%    { transform: translateX(-8px) scaleY(1.02); }
    61.6%    { transform: none; }
    88%      { transform: translateY(4px) skewX(3deg); }
    88.3%    { transform: translateY(-3px); }
    88.6%    { transform: none; }
  }

  @keyframes redLeft {
    0%,100%  { clip-path: inset(0 0 100% 0); opacity: 0; transform: translateX(0); }
    5%       { clip-path: inset(25% 0 35% 0); transform: translateX(-10px); opacity: 0.75; }
    5.5%     { clip-path: inset(65% 0  5% 0); transform: translateX(-6px);  opacity: 0.5; }
    6.1%     { clip-path: inset(0 0 100% 0); opacity: 0; }
    29%      { clip-path: inset(10% 0 55% 0); transform: translateX(-14px); opacity: 0.8; }
    29.5%    { clip-path: inset(50% 0 10% 0); transform: translateX(-8px);  opacity: 0.5; }
    30.1%    { clip-path: inset(0 0 100% 0); opacity: 0; }
    61%      { clip-path: inset(40% 0 20% 0); transform: translateX(-12px); opacity: 0.85; }
    61.5%    { clip-path: inset(5%  0 65% 0); transform: translateX(-7px);  opacity: 0.45; }
    62.1%    { clip-path: inset(0 0 100% 0); opacity: 0; }
  }

  @keyframes greenRight {
    0%,100%  { clip-path: inset(0 0 100% 0); opacity: 0; transform: translateX(0); }
    5%       { clip-path: inset(35% 0 25% 0); transform: translateX(10px); opacity: 0.6; }
    5.5%     { clip-path: inset(5%  0 65% 0); transform: translateX(6px);  opacity: 0.4; }
    6.1%     { clip-path: inset(0 0 100% 0); opacity: 0; }
    29%      { clip-path: inset(55% 0  5% 0); transform: translateX(14px); opacity: 0.65; }
    29.5%    { clip-path: inset(10% 0 50% 0); transform: translateX(8px);  opacity: 0.4; }
    30.1%    { clip-path: inset(0 0 100% 0); opacity: 0; }
    61%      { clip-path: inset(20% 0 40% 0); transform: translateX(12px); opacity: 0.7; }
    61.5%    { clip-path: inset(65% 0  5% 0); transform: translateX(7px);  opacity: 0.4; }
    62.1%    { clip-path: inset(0 0 100% 0); opacity: 0; }
  }

  @keyframes blockErr {
    0%,100%  { opacity: 0; clip-path: inset(0 0 100% 0); }
    5.1%     { opacity: 1; clip-path: inset(22% 0 68% 0); transform: translateX(16px)  scaleX(1.05); }
    5.5%     { opacity: 1; clip-path: inset(60% 0  8% 0); transform: translateX(-12px) scaleX(0.96); }
    5.9%     { opacity: 0; clip-path: inset(0 0 100% 0); }
    29.1%    { opacity: 1; clip-path: inset(48% 0 22% 0); transform: translateX(-20px) scaleX(1.07); }
    29.5%    { opacity: 1; clip-path: inset(8%  0 72% 0); transform: translateX(14px)  scaleX(0.94); }
    29.9%    { opacity: 0; clip-path: inset(0 0 100% 0); }
    61.1%    { opacity: 1; clip-path: inset(72% 0  4% 0); transform: translateX(22px)  scaleX(1.06); }
    61.5%    { opacity: 1; clip-path: inset(12% 0 58% 0); transform: translateX(-16px) scaleX(1.03); }
    61.9%    { opacity: 0; clip-path: inset(0 0 100% 0); }
  }

  @keyframes txtErr {
    0%,100%  { transform: none; opacity: 1; filter: none; }
    91%      { transform: none; }
    91.5%    { transform: translateX(-5px) skewX(7deg); opacity: 0.7; filter: blur(0.4px); }
    92%      { transform: translateX(4px);  opacity: 0.85; }
    92.5%    { transform: none; opacity: 1; filter: none; }
  }

  @keyframes bdgErr {
    0%,100%  { opacity: 1; }
    48%      { opacity: 1; }
    48.5%    { opacity: 0.25; }
    49%      { opacity: 1; }
    73%      { opacity: 1; }
    73.4%    { opacity: 0.5; }
    73.8%    { opacity: 1; }
  }

  @keyframes brdErr {
    0%,100%  { box-shadow: none; }
    5%       { box-shadow: 0 0 14px oklch(var(--wa)/0.5); }
    5.9%     { box-shadow: none; }
    61%      { box-shadow: 0 0 18px oklch(var(--su)/0.4); }
    61.9%    { box-shadow: none; }
  }

  @keyframes logErr {
    0%,100%  { background-position: 0 -100%; }
    50%      { background-position: 0 200%; }
  }

  @keyframes noiseErr {
    0%   { background-position: 0 0; }
    20%  { background-position: -8% -12%; }
    40%  { background-position: 15% 8%; }
    60%  { background-position: -12% 20%; }
    80%  { background-position: 10% -5%; }
    100% { background-position: 0 0; }
  }

  /* ── server illustration ── */
  @keyframes smokePuff {
    0%   { opacity: 0;   transform: translateY(0)    scale(0.6); }
    20%  { opacity: 0.6; transform: translateY(-8px)  scale(0.9); }
    60%  { opacity: 0.3; transform: translateY(-22px) scale(1.2); }
    100% { opacity: 0;   transform: translateY(-38px) scale(1.5); }
  }
  @keyframes ledBlink {
    0%,45%,55%,100% { opacity: 1; }
    50%             { opacity: 0.05; }
  }
  @keyframes spark {
    0%   { opacity: 1; transform: translate(0,0) scale(1); }
    100% { opacity: 0; transform: translate(var(--sx),var(--sy)) scale(0.2); }
  }
  @keyframes boltFlash {
    0%,100%  { opacity: 0; }
    5%       { opacity: 1; }
    10%      { opacity: 0; }
    47%      { opacity: 0; }
    49%      { opacity: 1; }
    52%      { opacity: 0; }
    80%      { opacity: 0.7; }
    83%      { opacity: 0; }
  }
  @keyframes crackFlicker {
    0%,100%  { opacity: 0.3; }
    50%      { opacity: 0.55; }
    51%      { opacity: 0.1; }
    52%      { opacity: 0.5; }
  }
  @keyframes serverShake {
    0%,100%  { transform: rotate(0deg) translateX(0); }
    10%      { transform: rotate(-0.8deg) translateX(-2px); }
    20%      { transform: rotate(0.6deg)  translateX(1px); }
    29.5%    { transform: rotate(1.2deg)  translateX(3px); }
    30%      { transform: rotate(0deg)    translateX(0); }
    61%      { transform: rotate(-0.6deg) translateX(-2px); }
    61.5%    { transform: rotate(0.8deg)  translateX(2px); }
    62%      { transform: rotate(0deg)    translateX(0); }
  }
`;

const NOISE_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`;

/* ─────────────────────────────────────────────────────────────────────────────
   BrokenServer — ALL colors via style props so DaisyUI CSS vars are resolved
───────────────────────────────────────────────────────────────────────────── */
const BrokenServer = () => {
  return (
    <svg
      width="200" height="180" viewBox="0 0 200 180"
      xmlns="http://www.w3.org/2000/svg"
      style={{ animation: "serverShake 5s infinite", overflow: "visible" }}
    >
      {/* chassis body */}
      <rect x="30" y="30" width="140" height="120" rx="6"
        style={{ fill: "oklch(var(--b2))", stroke: "oklch(var(--er)/0.5)", strokeWidth: 1.5 }} />

      {/* screw holes */}
      {[40, 160].map(cx =>
        [48, 90, 130].map(cy => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="3"
            style={{ fill: "oklch(var(--b3))", stroke: "oklch(var(--er)/0.3)", strokeWidth: 0.5 }} />
        ))
      )}

      {/* ── slot 1 — blown ── */}
      <rect x="48" y="42" width="104" height="26" rx="3"
        style={{ fill: "oklch(var(--b3))", stroke: "oklch(var(--er)/0.4)", strokeWidth: 1 }} />
      {/* error LEDs */}
      <circle cx="58" cy="55" r="3"
        className="fill-error"
        style={{ animation: "ledBlink 1.1s infinite" }} />
      <circle cx="68" cy="55" r="3"
        style={{ fill: "oklch(var(--er)/0.3)", animation: "ledBlink 1.1s infinite", animationDelay: "0.55s" }} />
      {/* corrupted label bars */}
      {[80, 92, 104, 116, 128, 140].map((x, i) => (
        <rect key={x} x={x} y="50" width={i % 3 === 1 ? 6 : 8} height="4" rx="1"
          style={{ fill: `oklch(var(--er)/${i % 2 === 0 ? "0.6" : "0.25"})` }} />
      ))}
      {/* lightning bolt */}
      <path d="M97 47 L92 57 L96 57 L91 67 L101 54 L97 54 Z"
        className="fill-warning"
        style={{ animation: "boltFlash 3.8s infinite" }} />

      {/* ── slot 2 — ejected ── */}
      <rect x="48" y="76" width="104" height="26" rx="3"
        style={{ fill: "oklch(var(--b3))", stroke: "oklch(var(--er)/0.4)", strokeWidth: 1 }} />
      {/* ejected handle */}
      <rect x="144" y="78" width="16" height="22" rx="2"
        style={{ fill: "oklch(var(--b2))", stroke: "oklch(var(--er)/0.6)", strokeWidth: 1 }} />
      {[83, 89, 95].map(y => (
        <rect key={y} x="146" y={y} width="12" height="3" rx="1"
          style={{ fill: "oklch(var(--er)/0.4)" }} />
      ))}
      <circle cx="58" cy="89" r="3"
        className="fill-error"
        style={{ animation: "ledBlink 0.7s infinite", animationDelay: "0.2s" }} />

      {/* ── slot 3 — stable ── */}
      <rect x="48" y="110" width="104" height="26" rx="3"
        style={{ fill: "oklch(var(--b3))", stroke: "oklch(var(--bc)/0.1)", strokeWidth: 1 }} />
      <circle cx="58" cy="123" r="3"
        style={{ fill: "oklch(var(--su)/0.6)", animation: "ledBlink 2.4s infinite", animationDelay: "0.9s" }} />
      {[72, 84, 96, 108, 120, 132].map(x => (
        <rect key={x} x={x} y="119" width="8" height="4" rx="1"
          style={{ fill: "oklch(var(--bc)/0.12)" }} />
      ))}

      {/* warning stripe */}
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map(i => (
        <rect key={i} x={30 + i * 10} y={148} width={5} height={6}
          style={{ fill: `oklch(var(--er)/${i % 2 === 0 ? "0.5" : "0.15"})` }} />
      ))}

      {/* smoke puffs */}
      {[
        { cx: 72, delay: "0s", dur: "2.2s" },
        { cx: 100, delay: "0.7s", dur: "2.8s" },
        { cx: 128, delay: "1.4s", dur: "2.4s" },
        { cx: 90, delay: "0.35s", dur: "3.1s" },
      ].map(({ cx, delay, dur }, i) => (
        <ellipse key={i} cx={cx} cy={28} rx="7" ry="5"
          style={{ fill: "oklch(var(--bc)/0.25)", animation: `smokePuff ${dur} ${delay} infinite ease-out` }} />
      ))}

      {/* sparks */}
      {[
        { sx: "-18px", sy: "-22px", delay: "0.0s", dur: "1.1s", warm: true },
        { sx: "16px", sy: "-28px", delay: "0.4s", dur: "0.9s", warm: false },
        { sx: "-12px", sy: "-34px", delay: "0.8s", dur: "1.3s", warm: true },
        { sx: "22px", sy: "-18px", delay: "1.2s", dur: "1.0s", warm: false },
        { sx: "-8px", sy: "-40px", delay: "1.6s", dur: "1.2s", warm: true },
        { sx: "28px", sy: "-24px", delay: "2.0s", dur: "0.8s", warm: false },
      ].map(({ sx, sy, delay, dur, warm }, i) => (
        <circle key={i} cx={100} cy={55} r="2.5"
          style={{
            fill: warm ? "oklch(var(--wa))" : "oklch(var(--er))",
            "--sx": sx, "--sy": sy,
            animation: `spark ${dur} ${delay} infinite`,
          }} />
      ))}

      {/* crack lines */}
      <path d="M72 42 L88 60 L80 68 M88 60 L96 52 L110 72 M96 52 L104 44"
        style={{
          stroke: "oklch(var(--er)/0.65)",
          strokeWidth: 1.5, fill: "none", strokeLinecap: "round",
          animation: "crackFlicker 2.3s infinite",
        }} />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   ServerErrorPage
───────────────────────────────────────────────────────────────────────────── */
const ServerErrorPage = () => {
  return (
    <>
      <style>{KEYFRAMES}</style>

      <div
        className="relative flex min-h-[110vh] flex-col items-center justify-center overflow-hidden bg-base-100"
        style={{ fontFamily: "'JetBrains Mono', monospace", animation: "errFlicker 7s infinite" }}
      >
        {/* grid */}
        <div className="absolute inset-0 pointer-events-none z-0" style={{
          backgroundImage: "linear-gradient(oklch(var(--er)/0.05) 1px,transparent 1px),linear-gradient(90deg,oklch(var(--er)/0.05) 1px,transparent 1px)",
          backgroundSize: "48px 48px",
          animation: "errGrid 18s linear infinite",
        }} />

        {/* grain */}
        <div className="absolute inset-0 pointer-events-none z-[1]" style={{
          backgroundImage: NOISE_SVG,
          backgroundRepeat: "repeat",
          backgroundSize: "180px 180px",
          opacity: 0.04,
          animation: "noiseErr 0.25s steps(1) infinite",
          mixBlendMode: "screen",
        }} />

        {/* wide scanline */}
        <div className="absolute pointer-events-none z-[2]" style={{
          left: 0, right: 0, height: "160px",
          background: "linear-gradient(to bottom, transparent, oklch(var(--er)/0.06) 30%, oklch(var(--er)/0.12) 50%, oklch(var(--er)/0.06) 70%, transparent)",
          animation: "errScan 4s linear infinite",
        }} />

        {/* thin scanline */}
        <div className="absolute pointer-events-none z-[2]" style={{
          left: 0, right: 0, height: "3px",
          background: "oklch(var(--er)/0.4)",
          animation: "errScan 1.4s linear infinite",
          animationDelay: "0.7s",
        }} />

        {/* CRT lines */}
        <div className="absolute inset-0 pointer-events-none z-[3]" style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, oklch(var(--b1)/0.15) 2px, oklch(var(--b1)/0.15) 4px)",
        }} />

        {/* vignette */}
        <div className="absolute inset-0 pointer-events-none z-[4]" style={{
          background: "radial-gradient(ellipse at center, transparent 15%, oklch(var(--b1)/0.88) 100%)",
        }} />

        {/* ── content ── */}
        <div className="relative z-10 flex flex-col items-center">

          {/* animated server */}
          <Animate variant="fade-in" duration={700} delay={0}>
            <div className="mb-4 flex justify-center">
              <BrokenServer />
            </div>
          </Animate>

          {/* 500 RGB-split hero */}
          <Animate variant="scale-up" duration={500} delay={200}>
            <div className="select-none relative" style={{ lineHeight: 1 }}>

              {/* red ghost */}
              <div aria-hidden="true" className="absolute inset-0 text-center" style={{
                fontWeight: 800, letterSpacing: "-4px",
                fontSize: "clamp(72px,12vw,136px)",
                color: "#ff1a1a", mixBlendMode: "screen",
                animation: "redLeft 5s infinite",
                userSelect: "none", pointerEvents: "none",
              }}>500</div>

              {/* green ghost */}
              <div aria-hidden="true" className="absolute inset-0 text-center" style={{
                fontWeight: 800, letterSpacing: "-4px",
                fontSize: "clamp(72px,12vw,136px)",
                color: "#00ff88", mixBlendMode: "screen",
                animation: "greenRight 5s infinite",
                userSelect: "none", pointerEvents: "none",
              }}>500</div>

              {/* block corruption */}
              <div aria-hidden="true" className="absolute inset-0 text-center text-error" style={{
                fontWeight: 800, letterSpacing: "-4px",
                fontSize: "clamp(72px,12vw,136px)",
                animation: "blockErr 5s infinite",
                userSelect: "none", pointerEvents: "none",
                filter: "brightness(1.5)",
              }}>500</div>

              {/* main */}
              <div className="text-error" style={{
                fontWeight: 800, letterSpacing: "-4px",
                fontSize: "clamp(72px,12vw,136px)",
                animation: "heroErr 5s infinite",
                position: "relative",
              }}>500</div>
            </div>
          </Animate>

          {/* badges */}
          <Animate variant="fade-up" duration={380} delay={150}>
            <div className="mt-3 flex gap-2 items-center flex-wrap justify-center">
              <div className="badge badge-error badge-sm font-bold tracking-widest uppercase"
                style={{ animation: "bdgErr 5s infinite" }}>
                internal server error
              </div>
              <div className="badge badge-outline badge-error badge-sm font-bold tracking-wider opacity-60"
                style={{ animation: "bdgErr 5s infinite", animationDelay: "1.1s" }}>
                process terminated
              </div>
            </div>
          </Animate>

          {/* heading */}
          <Animate variant="fade-up" duration={380} delay={250}>
            <p className="mt-4 text-base font-bold text-error tracking-tight uppercase"
              style={{ animation: "txtErr 5s infinite" }}>
              Critical System Failure
            </p>
          </Animate>

          {/* description */}
          <Animate variant="fade-up" duration={380} delay={350}>
            <p className="mt-2 max-w-sm text-center text-xs leading-loose text-base-content/50">
              Something exploded on our end. The error has been logged and our{" "}
              <span className="text-error font-bold">on-call team</span> has been woken up.
              Please try again in a moment or{" "}
              <span className="text-primary font-bold">contact support</span> if this persists.
            </p>
          </Animate>

          {/* crash log */}
          <Animate variant="fade-up" duration={380} delay={550}>
            <div className="mt-8 rounded px-6 py-4 max-w-md w-full backdrop-blur-sm border border-error/20 bg-error/5"
              style={{ animation: "brdErr 5s infinite" }}>
              <div className="flex items-center gap-2 mb-2">
                <div className="h-2 w-2 rounded-full bg-error animate-ping" />
                <span className="text-[10px] tracking-widest uppercase text-error font-bold"
                  style={{ animation: "txtErr 4s infinite", animationDelay: "0.5s" }}>
                  Crash Dump
                </span>
              </div>
              <code className="text-[10px] tracking-wide leading-relaxed block text-base-content/60"
                style={{
                  backgroundImage: "linear-gradient(transparent 0%, oklch(var(--er)/0.06) 50%, transparent 100%)",
                  backgroundSize: "100% 400%",
                  animation: "logErr 4.5s ease-in-out infinite",
                }}>
                [KERNEL]: Unhandled exception in request pipeline.<br />
                [PROC]:   Worker PID <span className="text-error" style={{ animation: "bdgErr 2.8s infinite" }}>0x3F9A</span> — SEGFAULT<br />
                [MEM]:    Heap corruption at <span className="text-warning" style={{ animation: "bdgErr 2.2s infinite", animationDelay: "0.3s" }}>0xDEADBEEF</span><br />
                [SYSTEM]: Core dump written — HTTP 500
              </code>
            </div>
          </Animate>

          {/* navigation */}
          <Animate variant="fade-up" duration={380} delay={450}>
            <div className="mt-8 flex gap-4">
              <button
                onClick={() => window.location.reload()}
                className="btn btn-outline btn-error btn-sm gap-2 font-bold tracking-widest uppercase"
                style={{ animation: "errFlicker 8s infinite", animationDelay: "0.8s" }}
              >
                Retry
              </button>
              <Link to="/"
                className="btn btn-error btn-sm gap-2 font-bold tracking-widest uppercase"
                style={{ animation: "errFlicker 6s infinite", animationDelay: "0.2s" }}>
                Home
              </Link>
            </div>
          </Animate>

        </div>
      </div>
    </>
  );
};

export default ServerErrorPage;