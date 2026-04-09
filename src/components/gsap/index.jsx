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
// ScrollReveal — Enhanced slide/fade wrapper
// Tweaked for ~300ms speed feel
// ═══════════════════════════════════════════
export function ScrollReveal({
  children,
  className,
  style,
  as: Tag = "div",
  y = 30,
  x = 0,
  scale,
  opacity = 0,
  rotateX,
  duration = 0.4, // Slightly faster default
  delay = 0,
  start = "top 90%",
  ease = "power2.out", // Snappier ease
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
      gsap.set(el, { ...from, force3D: true });
      gsap.to(el, {
        ...to,
        duration,
        delay,
        ease,
        force3D: true,
        scrollTrigger: {
          trigger: el,
          start,
          toggleActions: "play none none reverse", // Play once, reverse on scroll up
          invalidateOnRefresh: true,
        },
      });
    }, el);

    return () => ctxRef.current?.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Tag ref={ref} className={className} style={style}>
      {children}
    </Tag>
  );
}

// ═══════════════════════════════════════════
// MagReveal — Magnet / Parallax Reveal
// Unique: Moves element towards mouse during scroll entry
// ═══════════════════════════════════════════
export function MagReveal({
  children,
  className,
  style,
  as: Tag = "div",
  y = 50,
  strength = 30, // How much it follows mouse
  duration = 0.6,
  start = "top 85%",
}) {
  const ref = useRef(null);
  const ctxRef = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || REDUCED_MOTION) return;

    ctxRef.current = gsap.context(() => {
      // Initial state
      gsap.set(el, { y, opacity: 0, scale: 0.95, rotateX: 15 });

      // Scroll Animation
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start,
          toggleActions: "play none none reverse",
        },
      });

      tl.to(el, {
        y: 0,
        opacity: 1,
        scale: 1,
        rotateX: 0,
        duration,
        ease: "elastic.out(1, 0.75)", // Bouncy unique feel
      });

      // Parallax/Mouse effect (only on desktop)
      const onMouseMove = (e) => {
        if (window.innerWidth < 768) return;
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const mouseX = e.clientX - centerX;
        const mouseY = e.clientY - centerY;

        // Calculate rotation based on mouse position relative to center
        const rotateY = (mouseX / window.innerWidth) * strength; 
        const rotateX = -(mouseY / window.innerHeight) * strength;

        gsap.to(el, {
          rotateY,
          rotateX,
          duration: 0.5,
          ease: "power1.out",
        });
      };

      const onMouseLeave = () => {
        gsap.to(el, { rotateY: 0, rotateX: 0, duration: 0.5 });
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
// BlurReveal — Lens Blur effect
// Unique: Transitions from blur(10px) to clear
// ═══════════════════════════════════════════
export function BlurReveal({
  children,
  className,
  style,
  as: Tag = "div",
  y = 20,
  blur = 10,
  duration = 0.5,
  start = "top 85%",
}) {
  const ref = useRef(null);
  const ctxRef = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || REDUCED_MOTION) return;

    ctxRef.current = gsap.context(() => {
      gsap.set(el, { y, opacity: 0, filter: `blur(${blur}px)` });
      gsap.to(el, {
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        duration,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start,
          toggleActions: "play none none reverse",
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
// ═══════════════════════════════════════════
export function StaggerReveal({
  children,
  className,
  style,
  as: Tag = "div",
  y = 30,
  opacity = 0,
  duration = 0.35, // Faster stagger
  stagger = 0.05,
  start = "top 85%",
  ease = "back.out(1.2)", // Pop effect
}) {
  const ref = useRef(null);
  const ctxRef = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || REDUCED_MOTION) return;

    const kids = Array.from(el.children);
    if (!kids.length) return;

    const from = {};
    const to = {};
    if (y) { from.y = y; to.y = 0; }
    if (opacity) { from.opacity = opacity; to.opacity = 1; }

    if (!Object.keys(from).length) return;

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
          toggleActions: "play none none reverse",
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
// ═══════════════════════════════════════════
export function CharReveal({
  children,
  className,
  style,
  as: Tag = "span",
  stagger = 0.02,
  y = 40,
  rotateX = -70,
  opacity = 0,
  duration = 0.4,
  start = "top 90%",
  ease = "power3.out",
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
        <span key={`w${si}`} className="inline-block overflow-hidden">
          {[...seg].map((ch) => {
            const i = idx++;
            return (
              <span
                key={`c${i}`}
                data-char
                className="inline-block will-change-transform"
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

      gsap.set(el, { transformPerspective: 1000 });
      gsap.set(spans, { opacity, y, rotateX, transformOrigin: "center bottom" });

      gsap.to(spans, {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration,
        stagger,
        delay,
        ease,
        scrollTrigger: {
          trigger: el,
          start,
          toggleActions: "play none none reverse",
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
      className={className}
      style={{ display: "inline-block", ...style }}
    >
      {chars}
    </Tag>
  );
}

// ═══════════════════════════════════════════
// WordReveal — Blur Fade per word
// ═══════════════════════════════════════════
export function WordReveal({
  children,
  className,
  style,
  as: Tag = "p",
  stagger = 0.03,
  y = 20,
  opacity = 0,
  duration = 0.4,
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
        <span key={`w${i}`} data-word className="inline-block will-change-transform">
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

      gsap.set(spans, { opacity, y, filter: "blur(5px)" });
      gsap.to(spans, {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration,
        stagger,
        delay,
        ease,
        scrollTrigger: {
          trigger: el,
          start,
          toggleActions: "play none none reverse",
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
  duration = 1.5,
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
        ease: "power2.out",
        snap: { val: 1 },
        scrollTrigger: {
          trigger: el,
          start,
          once: true, // Only count once
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
// LineReveal — Width expansion
// ═══════════════════════════════════════════
export function LineReveal({
  className,
  style,
  duration = 0.8,
  start = "top 85%",
  ease = "power2.inOut",
}) {
  const ref = useRef(null);
  const ctxRef = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || REDUCED_MOTION) return;

    ctxRef.current = gsap.context(() => {
      gsap.set(el, { scaleX: 0, transformOrigin: "left center" });
      gsap.to(el, {
        scaleX: 1,
        duration,
        ease,
        force3D: true,
        scrollTrigger: {
          trigger: el,
          start,
          toggleActions: "play none none reverse",
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
// KineticText - special effect for the first words
// ════════════════════════════════════════════════════
export function KineticText({
  children,
  className,
  style,
  as: Tag = "div",
  stagger = 0.03,
  y = 50,
  scale = 1.2,
  blur = 10,
  skewX = 10,
  rotateX = 20,
  opacity = 0,
  duration = 5.0,
  delay = 0.5,
  ease = "power4.out",
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

      gsap.set(spans, {
        opacity,
        y,
        scale,
        rotationX: rotateX,
        skewX: skewX,
        filter: `blur(${blur}px)`,
        transformOrigin: "center bottom",
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
          toggleActions: "play none none reverse",
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