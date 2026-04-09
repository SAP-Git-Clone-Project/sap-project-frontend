import { useEffect, useRef } from "react";
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
  const { ref, inView } = useInView({ 
    triggerOnce: false, 
    threshold, 
    rootMargin: '30px 0px -10px 0px' 
  });
  
  const { hidden, visible } = VARIANTS[variant] || VARIANTS["fade-up"];
  const Tag = as;

  // Create a ref for the DOM node
  const domRef = useRef(null);

  // CRITICAL FIX: Force a layout calculation (reflow) immediately on mount.
  // This forces the browser to create a GPU layer for the hidden element NOW,
  // instead of waiting until the user scrolls (which causes the stutter).
  useEffect(() => {
    const node = domRef.current;
    if (node) {
      // Reading offsetHeight forces the browser to calculate layout (Reflow).
      // We do this once at startup to prevent lag during scroll.
      void node.offsetHeight; 
    }
  }, []);

  // Merge the IntersectionObserver ref with our local DOM ref
  const setRefs = (node) => {
    domRef.current = node;
    if (typeof ref === 'function') {
      ref(node);
    } else if (ref) {
      ref.current = node;
    }
  };

  return (
    <Tag
      ref={setRefs}
      className={`transition-all will-change-transform transform-gpu backface-hidden ${
        inView ? visible : hidden
      }`}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      }}
    >
      {children}
    </Tag>
  );
};

export default Animate;