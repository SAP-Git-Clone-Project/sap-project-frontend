import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import Animate from "@/components/animation/Animate"

const ScrollToTop = ({ threshold = 500 }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > threshold);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  const scrollToTop = () =>
    window.scrollTo({ top: 0, behavior: "smooth" });

  if (!visible) return null;

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <Animate variant="scale-up" duration={300} delay={0} threshold={0}>
        <button
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="
            group
            relative
            w-12 h-12
            rounded-full
            flex items-center justify-center
            cursor-pointer
            overflow-hidden
            transition-transform duration-200
            hover:scale-110 active:scale-95
          "
          style={{
            background: "rgba(37, 99, 235, 0.15)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            border: "1px solid rgba(37, 99, 235, 0.35)",
            boxShadow:
              "0 4px 24px rgba(37, 99, 235, 0.18), inset 0 1px 0 rgba(255,255,255,0.18)",
          }}
        >
          {/* Inner glow ring on hover */}
          <span
            className="
              absolute inset-0 rounded-full opacity-0
              group-hover:opacity-100
              transition-opacity duration-300
            "
            style={{
              background:
                "radial-gradient(circle at 50% 0%, rgba(37,99,235,0.25) 0%, transparent 70%)",
            }}
          />

          {/* Arrow icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="relative z-10 text-primary transition-transform duration-200 group-hover:-translate-y-0.5"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 19V5" />
            <path d="M5 12l7-7 7 7" />
          </svg>
        </button>
      </Animate>
    </div>
  );
};

export default ScrollToTop;