import { useInView } from "react-intersection-observer";

const VARIANTS = {
  "fade-up": {
    hidden: "opacity-0 translate-y-16",
    visible: "opacity-100 translate-y-0"
  },
  "fade-down": {
    hidden: "opacity-0 -translate-y-16",
    visible: "opacity-100 translate-y-0"
  },
  "fade-left": {
    hidden: "opacity-0 translate-x-16",
    visible: "opacity-100 translate-x-0"

  },
  "fade-right": {
    hidden: "opacity-0 -translate-x-16",
    visible: "opacity-100 translate-x-0"

  },
  "fade-in": {
    hidden: "opacity-0",
    visible: "opacity-100"
  },
  "scale-up": {
    hidden: "opacity-0 scale-90",
    visible: "opacity-100 scale-100"
  },
  "slide-up": {
    hidden: "opacity-0 translate-y-24",
    visible: "opacity-100 translate-y-0"
  },
};

const Animate = ({
  children,
  delay = 100,
  duration = 400,
  variant = "fade-up",
  threshold = 0.15,
  as = "div",
}) => {

  const { ref, inView } = useInView({ triggerOnce: false, threshold });
  const { hidden, visible } = VARIANTS[variant] || VARIANTS["fade-up"];
  const Tag = as;

  return (
    <Tag
      ref={ref}
      className={`transition-all ease-out will-change-transform ${inView ? visible : hidden
        }`}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </Tag>
  );
};

export default Animate;

/* ------------ Threshold Value Recommendation ----------------
0.00 → element just enters viewport, may be too early for noticeable effect
0.08 → fires at the very edge, user barely sees it start
0.15 → fires when element is just peeking in — user sees the full motion  ✓
0.25 → good for small cards, risky for tall sections on mobile
0.5+ → too late, user has to scroll deep before it triggers

*/