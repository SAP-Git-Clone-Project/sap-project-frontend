import { useEffect, useRef, useMemo } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ── Global performance tuning ──
gsap.ticker.lagSmoothing(0);
gsap.defaults({ force3D: true, overwrite: "auto" });

// ── Reduced-motion check (computed once) ──
const REDUCED_MOTION =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ═══════════════════════════════════════════
// ScrollReveal — Cinematic slide/fade/scale
// Richer: Adds subtle scale and rotation for depth
// ═══════════════════════════════════════════
export function ScrollReveal({
  children,
  className,
  style,
  as: Tag = "div",
  y = 50,
  x = 0,
  scale = 0.95, // Slight zoom-in effect
  opacity = 0,
  rotateX = 5,  // Subtle 3D tilt
  duration = 0.9, // Slower, cinematic speed
  delay = 0,
  start = "top 90%",
  ease = "power3.out", // Smoother deceleration
}) {
  const ref = useRef(null);
  const ctxRef = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || REDUCED_MOTION) return;

    const from = {};
    const to = {};
    if (y) { from.y = y; to.y = 0; }
    if (x) { from.x = x; to.x = 0; }
    if (scale != null) { from.scale = scale; to.scale = 1; }
    if (opacity) { from.opacity = opacity; to.opacity = 1; }
    if (rotateX) { from.rotateX = rotateX; to.rotateX = 0; }

    if (!Object.keys(from).length) return;

    ctxRef.current = gsap.context(() => {
      gsap.set(el, { ...from, force3D: true, transformPerspective: 1000 });
      gsap.to(el, {
        ...to,
        duration,
        delay,
        ease,
        force3D: true,
        scrollTrigger: {
          trigger: el,
          start,
          // Play on scroll down, Reverse on scroll up, allowing repeat
          toggleActions: "play reverse play reverse", 
          invalidateOnRefresh: true,
        },
      });
    }, el);

    return () => ctxRef.current?.revert();
  }, []);

  return (
    <Tag ref={ref} className={className} style={style}>
      {children}
    </Tag>
  );
}

// ═══════════════════════════════════════════
// MagReveal — Magnet / Parallax Reveal
// Richer: Enhanced elastic entry + stronger 3D perspective
// ═══════════════════════════════════════════
export function MagReveal({
  children,
  className,
  style,
  as: Tag = "div",
  y = 60,
  strength = 40,
  duration = 0.8,
  start = "top 85%",
}) {
  const ref = useRef(null);
  const ctxRef = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || REDUCED_MOTION) return;

    ctxRef.current = gsap.context(() => {
      // Initial state: deeper and more blurred
      gsap.set(el, { 
        y, 
        opacity: 0, 
        scale: 0.9, 
        rotateX: 20,
        filter: "blur(4px)",
        transformPerspective: 1000,
        transformStyle: "preserve-3d"
      });

      // Scroll Animation
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start,
          toggleActions: "play reverse play reverse",
        },
      });

      tl.to(el, {
        y: 0,
        opacity: 1,
        scale: 1,
        rotateX: 0,
        filter: "blur(0px)",
        duration,
        ease: "expo.out", // Very smooth, premium ease
      });

      // Parallax/Mouse effect (only on desktop)
      const onMouseMove = (e) => {
        if (window.innerWidth < 1024) return; // Tablet/Desktop only
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const mouseX = e.clientX - centerX;
        const mouseY = e.clientY - centerY;

        // Calculate rotation based on mouse position
        const rotateY = (mouseX / window.innerWidth) * strength;
        const rotateX = -(mouseY / window.innerHeight) * strength;

        gsap.to(el, {
          rotateY,
          rotateX,
          duration: 1, // Slower, smoother follow
          ease: "power2.out",
        });
      };

      const onMouseLeave = () => {
        gsap.to(el, { rotateY: 0, rotateX: 0, duration: 0.8, ease: "elastic.out(1, 0.5)" });
      };

      window.addEventListener("mousemove", onMouseMove);
      el.addEventListener("mouseleave", onMouseLeave);

      return () => {
        window.removeEventListener("mousemove", onMouseMove);
        el.removeEventListener("mouseleave", onMouseLeave);
      };
    }, el);

    return () => ctxRef.current?.revert();
  }, []);

  return (
    <Tag ref={ref} className={className} style={{ transformStyle: "preserve-3d", ...style }}>
      {children}
    </Tag>
  );
}

// ═══════════════════════════════════════════
// BlurReveal — Soft Lens Blur effect
// Richer: Higher blur start + Scale
// ═══════════════════════════════════════════
export function BlurReveal({
  children,
  className,
  style,
  as: Tag = "div",
  y = 30,
  scale = 0.98, // Subtle shrink to grow
  blur = 15,
  duration = 1.0, // Slow transition
  start = "top 85%",
}) {
  const ref = useRef(null);
  const ctxRef = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || REDUCED_MOTION) return;

    ctxRef.current = gsap.context(() => {
      gsap.set(el, { 
        y, 
        opacity: 0, 
        scale, 
        filter: `blur(${blur}px)` 
      });
      gsap.to(el, {
        y: 0,
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        duration,
        ease: "power3.inOut", // Smooth ease in and out
        scrollTrigger: {
          trigger: el,
          start,
          toggleActions: "play reverse play reverse",
        },
      });
    }, el);

    return () => ctxRef.current?.revert();
  }, []);

  return (
    <Tag ref={ref} className={className} style={style}>
      {children}
    </Tag>
  );
}

// ═══════════════════════════════════════════
// StaggerReveal — Enhanced Stagger
// Richer: Scale from 0.8 to 1 for a "pop" feel
// ═══════════════════════════════════════════
export function StaggerReveal({
  children,
  className,
  style,
  as: Tag = "div",
  y = 40,
  scale = 0.9, // Start smaller
  opacity = 0,
  duration = 0.6,
  stagger = 0.1, // Wider gap for luxury feel
  start = "top 85%",
  ease = "back.out(1.4)", // Bouncier for fun interaction
}) {
  const ref = useRef(null);
  const ctxRef = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || REDUCED_MOTION) return;

    const kids = Array.from(el.children);
    if (!kids.length) return;

    const from = { y, opacity, scale };
    const to = { y: 0, opacity: 1, scale: 1 };

    ctxRef.current = gsap.context(() => {
      gsap.set(kids, { ...from, force3D: true });
      gsap.to(kids, {
        ...to,
        duration,
        stagger,
        ease,
        force3D: true,
        scrollTrigger: {
          trigger: el,
          start,
          toggleActions: "play reverse play reverse",
          invalidateOnRefresh: true,
        },
      });
    }, el);

    return () => ctxRef.current?.revert();
  }, []);

  return (
    <Tag ref={ref} className={className} style={style}>
      {children}
    </Tag>
  );
}

// ═══════════════════════════════════════════
// CharReveal — 3D Rotation per character
// Richer: Added Scale and Blur for a "defrosting" text effect
// ═══════════════════════════════════════════
export function CharReveal({
  children,
  className,
  style,
  as: Tag = "h2",
  stagger = 0.03,
  y = 50,
  rotateX = -80, // Deeper rotation
  scale = 0.5, // Start small
  blur = 5,
  opacity = 0,
  duration = 0.8,
  start = "top 90%",
  ease = "power4.out", // Very smooth, long ease
  delay = 0,
}) {
  const containerRef = useRef(null);
  const ctxRef = useRef(null);

  const text = typeof children === "string" ? children : "";

  const chars = useMemo(() => {
    if (!text || REDUCED_MOTION) return null;
    const segments = text.split(/(\s+)/);
    let idx = 0;
    return segments.map((seg, si) => {
      if (/^\s+$/.test(seg)) {
        return (
          <span key={`s${si}`} className="inline-block">
            &nbsp;
          </span>
        );
      }
      return (
        <span key={`w${si}`} className="inline-block overflow-visible py-2">
          {[...seg].map((ch) => {
            const i = idx++;
            return (
              <span
                key={`c${i}`}
                data-char
                className="inline-block will-change-transform"
                style={{ display: "inline-block" }}
              >
                {ch}
              </span>
            );
          })}
        </span>
      );
    });
  }, [text]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !text || REDUCED_MOTION) return;

    ctxRef.current = gsap.context(() => {
      const spans = el.querySelectorAll("[data-char]");
      if (!spans.length) return;

      gsap.set(el, { transformPerspective: 1000, transformStyle: "preserve-3d" });

      gsap.set(spans, {
        opacity,
        y,
        scale,
        rotateX,
        filter: `blur(${blur}px)`,
        transformOrigin: "center bottom -50px", // Rotate from below
        force3D: true
      });

      gsap.to(spans, {
        opacity: 1,
        y: 0,
        scale: 1,
        rotateX: 0,
        filter: "blur(0px)",
        duration,
        stagger,
        delay,
        ease,
        scrollTrigger: {
          trigger: el,
          start,
          toggleActions: "play reverse play reverse",
        },
      });
    }, el);

    return () => ctxRef.current?.revert();
  }, [text, opacity, y, rotateX, scale, blur, duration, stagger, delay, ease, start]);

  if (!text || REDUCED_MOTION) {
    return (
      <Tag className={className} style={style}>
        {children}
      </Tag>
    );
  }

  return (
    <Tag
      ref={containerRef}
      className={className}
      style={{
        display: "block",
        perspective: "1000px",
        transformStyle: "preserve-3d",
        ...style
      }}
    >
      {chars}
    </Tag>
  );
}

// ═══════════════════════════════════════════
// WordReveal — Blur Fade per word
// Richer: Added skew for dynamic motion
// ═══════════════════════════════════════════
export function WordReveal({
  children,
  className,
  style,
  as: Tag = "p",
  stagger = 0.05,
  y = 30,
  skewX = 10, // Add skew for "speed" look
  opacity = 0,
  duration = 0.7,
  start = "top 90%",
  ease = "power2.out",
  delay = 0,
}) {
  const containerRef = useRef(null);
  const ctxRef = useRef(null);

  const text = typeof children === "string" ? children : "";

  const words = useMemo(() => {
    if (!text || REDUCED_MOTION) return null;
    return text.split(/(\s+)/).map((seg, i) => {
      if (/^\s+$/.test(seg)) {
        return <span key={`s${i}`}>&nbsp;</span>;
      }
      return (
        <span key={`w${i}`} data-word className="inline-block will-change-transform mr-[0.25em]">
          {seg}
        </span>
      );
    });
  }, [text]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !text || REDUCED_MOTION) return;

    ctxRef.current = gsap.context(() => {
      const spans = el.querySelectorAll("[data-word]");
      if (!spans.length) return;

      gsap.set(spans, { 
        opacity, 
        y, 
        skewX, 
        filter: "blur(6px)" 
      });
      gsap.to(spans, {
        opacity: 1,
        y: 0,
        skewX: 0,
        filter: "blur(0px)",
        duration,
        stagger,
        delay,
        ease,
        scrollTrigger: {
          trigger: el,
          start,
          toggleActions: "play reverse play reverse",
        },
      });
    }, el);

    return () => ctxRef.current?.revert();
  }, [text]);

  if (!text || REDUCED_MOTION) {
    return (
      <Tag className={className} style={style}>
        {children}
      </Tag>
    );
  }

  return (
    <Tag
      ref={containerRef}
      className={`${className} inline-block`}
      style={style}
    >
      {words}
    </Tag>
  );
}

// ═══════════════════════════════════════════
// CounterReveal — Number counting
// ═══════════════════════════════════════════
export function CounterReveal({
  end,
  duration = 2.5, // Slower count
  start = "top 85%",
  className,
  prefix = "",
  suffix = "",
}) {
  const ref = useRef(null);
  const ctxRef = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || REDUCED_MOTION) return;

    ctxRef.current = gsap.context(() => {
      const obj = { val: 0 };
      gsap.to(obj, {
        val: end,
        duration,
        ease: "power2.inOut", // Smooth counting
        snap: { val: 1 },
        scrollTrigger: {
          trigger: el,
          start,
          toggleActions: "play none none reverse", // Reverse on scroll up if not finished
        },
        onUpdate: () => {
          el.textContent = prefix + Math.floor(obj.val) + suffix;
        },
      });
    }, el);

    return () => ctxRef.current?.revert();
  }, [end, duration, prefix, suffix, start]);

  return <span ref={ref} className={className}>0</span>;
}

// ═══════════════════════════════════════════
// LineReveal — Width expansion + Fade
// Richer: Added opacity fade for a soft entrance
// ═══════════════════════════════════════════
export function LineReveal({
  className,
  style,
  duration = 1.2,
  start = "top 85%",
  ease = "power3.inOut",
}) {
  const ref = useRef(null);
  const ctxRef = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || REDUCED_MOTION) return;

    ctxRef.current = gsap.context(() => {
      gsap.set(el, { scaleX: 0, opacity: 0.5, transformOrigin: "left center" });
      gsap.to(el, {
        scaleX: 1,
        opacity: 1,
        duration,
        ease,
        force3D: true,
        scrollTrigger: {
          trigger: el,
          start,
          toggleActions: "play reverse play reverse",
        },
      });
    }, el);

    return () => ctxRef.current?.revert();
  }, []);

  return <div ref={ref} className={className} style={style} />;
}

// ═══════════════════════════════════════════
// useGsapRefresh
// ═══════════════════════════════════════════
export function useGsapRefresh() {
  useEffect(() => {
    let timer;
    const onResize = () => {
      clearTimeout(timer);
      timer = setTimeout(() => ScrollTrigger.refresh(), 200);
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      clearTimeout(timer);
    };
  }, []);
}

// ════════════════════════════════════════════════════
// KineticText - "Hero" text effect
// Richer: Defaults tuned for a "slow-motion" reveal
// ════════════════════════════════════════════════════
export function KineticText({
  children,
  className,
  style,
  as: Tag = "div",
  stagger = 0.05,
  y = 60,
  scale = 1.1, // Start slightly larger
  blur = 8,
  skewX = 15,
  rotateX = 30,
  opacity = 0,
  duration = 1.2, // Slower, more epic
  delay = 0.2,
  ease = "power4.inOut", // Very smooth in and out
  triggerOnScroll = false,
}) {
  const containerRef = useRef(null);
  const ctxRef = useRef(null);

  const text = typeof children === "string" ? children : "";

  const chars = useMemo(() => {
    if (!text) return null;
    const segments = text.split(/(\s+)/);
    let idx = 0;
    return segments.map((seg, si) => {
      if (/^\s+$/.test(seg)) {
        return (
          <span key={`s${si}`} className="inline-block">
            &nbsp;
          </span>
        );
      }
      return (
        <span key={`w${si}`} className="inline-block overflow-hidden">
          {[...seg].map((ch) => {
            const i = idx++;
            return (
              <span
                key={`c${i}`}
                data-char
                className="inline-block will-change-transform"
                style={{ display: "inline-block", whiteSpace: "pre" }}
              >
                {ch}
              </span>
            );
          })}
        </span>
      );
    });
  }, [text]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !text) return;

    ctxRef.current = gsap.context(() => {
      const spans = el.querySelectorAll("[data-char]");
      if (!spans.length) return;

      // Richer initial state
      gsap.set(spans, {
        opacity,
        y,
        scale,
        rotationX: rotateX,
        skewX: skewX,
        filter: `blur(${blur}px)`,
        transformOrigin: "center bottom",
        transformPerspective: 1000,
      });

      const tl = gsap.timeline({
        delay: delay,
        defaults: { ease, duration }
      });

      tl.to(spans, {
        opacity: 1,
        y: 0,
        scale: 1,
        rotationX: 0,
        skewX: 0,
        filter: "blur(0px)",
        stagger: {
          amount: stagger * spans.length,
          from: "start"
        },
        scrollTrigger: triggerOnScroll ? {
          trigger: el,
          start: "top 85%",
          toggleActions: "play reverse play reverse",
        } : null,
      });

    }, el);

    return () => ctxRef.current?.revert();
  }, [text, delay, stagger, duration, ease, y, scale, blur, skewX, rotateX, opacity, triggerOnScroll]);

  if (!text) {
    return <Tag className={className} style={style}>{children}</Tag>;
  }

  return (
    <Tag
      ref={containerRef}
      className={className}
      style={{ display: "inline-block", ...style }}
    >
      {chars}
    </Tag>
  );
}