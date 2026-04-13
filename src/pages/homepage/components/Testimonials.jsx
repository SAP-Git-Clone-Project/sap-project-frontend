import React, { useState, useEffect } from "react";
import { Quote, ChevronRight, ChevronLeft } from "lucide-react";

import {
  StaggerReveal,
} from "@/components/gsap/index.jsx";
import GlassCard from "@/components/widgets/GlassCard.jsx";

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const testimonials = [
    { quote: "We used to have 47 versions of the same spec floating around in Slack. Now there's one document and everyone knows which version is approved.", name: "Sarah Mitchell", role: "Project Lead", company: "Stackline", highlight: "47 versions → 1 history", rating: 4.8 },
    { quote: "The audit log is incredible. When someone asks 'who changed what and when', I just pull it up. No more guessing, no more digging through email threads.", name: "James Carter", role: "Quality Manager", company: "DataForge", highlight: "Instant audit trails", rating: 4.6 },
    { quote: "Finally a tool that handles .java and .py files the same way it handles PDFs. The viewer role is exactly what we needed for our stakeholders.", name: "Emily Thornton", role: "Engineering Manager", company: "Nextera Systems", highlight: "Code + docs unified", rating: 4.9 },
    { quote: "I deleted a version by accident at 2 AM and panicked. Then I remembered I'm the owner — it was right there in the timeline. Saved my life honestly.", name: "Michael Chen", role: "Senior Developer", company: "Codecraft Labs", highlight: "Deleted ≠ gone", rating: 4.7 },
    { quote: "We onboard new contractors every month. Assigning them as viewers takes 5 seconds and they instantly see only what they need.", name: "Rachel Adams", role: "Operations Director", company: "Meridian Group", highlight: "5-sec onboarding", rating: 4.5 },
    { quote: "The notifications alone are worth it. Our reviewer gets pinged the second a new version lands, and the writer knows right away if it's approved or needs changes.", name: "David Brooks", role: "Team Lead", company: "Velocity Tech", highlight: "Zero lag in reviews", rating: 4.8 },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [activeIndex]);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const current = testimonials[activeIndex];

  // ⭐ Convert rating to nearest 0.5 (for half stars)
  const normalizedRating = Math.round(current.rating * 2) / 2;

  return (
    <StaggerReveal stagger={0.1} y={30} duration={0.6} className="w-full max-w-6xl mx-auto">

      <GlassCard
        bg="bg-base-200/30"
        border="border-white/10"
        className="overflow-hidden p-0 relative h-[30vh]"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 h-full">

          {/* LEFT SIDE (unchanged) */}
          <div className="lg:col-span-4 order-1 border-b lg:border-b-0 lg:border-r border-white/5 p-2 flex flex-col relative z-10">

            <h3 className="text-xs font-black uppercase tracking-widest text-base-content/40 mb-6 pl-1">
              Client Stories
            </h3>

            <div className={`grid gap-2 flex-1 overflow-y-auto p-1 custom-scrollbar
              ${window.innerWidth < 1024 ? "grid-cols-2" : "flex flex-col"}
            `}>
              {testimonials.map((t, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`
                    group flex items-center gap-3 p-3 rounded-xl transition-all duration-300 text-left border
                    ${activeIndex === i
                      ? "bg-primary text-primary-content border-primary transform scale-[1.02]"
                      : "bg-transparent border-transparent hover:bg-base-100/30 hover:border-white/5"
                    }
                  `}
                >
                  <div className="relative shrink-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-base-200 border-2 overflow-hidden">
                      <img
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(t.name)}&background=random`}
                        alt={t.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  <div className="min-w-0 flex flex-col justify-center">
                    <div className={`text-[10px] sm:text-xs font-bold truncate leading-tight ${activeIndex === i ? "text-primary-content" : "text-base-content"}`}>
                      {t.name}
                    </div>
                    <div className={`text-[8px] sm:text-[10px] truncate ${activeIndex === i ? "text-primary-content/70" : "text-base-content/40"}`}>
                      {t.company}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex gap-2 mt-4 pt-4 border-t border-white/5">
              <button onClick={handlePrev} className="flex-1 btn btn-sm btn-ghost rounded-lg border border-white/10">
                <ChevronLeft size={14} />
              </button>
              <button onClick={handleNext} className="flex-1 btn btn-sm bg-primary/40 hover:bg-primary rounded-lg">
                <ChevronRight size={14} />
              </button>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="lg:col-span-8 order-2 p-6 sm:p-8 lg:p-12 flex flex-col justify-center relative">

            <div className="relative z-10 flex flex-col h-full">

              {/* Header with REAL rating */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-primary/80 bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-full">
                  {current.highlight}
                </span>

                <div className="flex items-center gap-2">
                  {/* DaisyUI Rating */}
                  <div className="rating rating-sm rating-half">
                    {[1,2,3,4,5].map((star) => (
                      <React.Fragment key={star}>
                        <input type="radio" className="mask mask-star-2 mask-half-1 bg-warning" checked={normalizedRating === star - 0.5} readOnly />
                        <input type="radio" className="mask mask-star-2 mask-half-2 bg-warning" checked={normalizedRating === star} readOnly />
                      </React.Fragment>
                    ))}
                  </div>

                  {/* Numeric */}
                  <span className="text-xs font-semibold text-base-content/70">
                    {current.rating.toFixed(1)}
                  </span>
                </div>
              </div>

              {/* Quote */}
              <div className="relative flex-1 flex items-center">
                <Quote size={32} className="text-primary/10 absolute -top-2 -left-2 rotate-180" />
                <p className="text-sm sm:text-base lg:text-xl xl:text-2xl text-base-content leading-relaxed font-bold pl-6 sm:pl-8">
                  {current.quote}
                </p>
              </div>

              {/* Footer */}
              <div className="mt-6 sm:mt-8 pt-6 border-t border-white/10 flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-base-200 border-2 overflow-hidden">
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(current.name)}&background=random`}
                    alt={current.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="font-bold text-base-content text-sm sm:text-base">{current.name}</div>
                  <div className="text-[10px] sm:text-xs font-bold text-base-content/40 uppercase tracking-wide">
                    {current.role}
                  </div>
                </div>
              </div>

            </div>

            <div className="absolute bottom-0 left-0 h-1 w-full bg-base-content/5 rounded-md">
              <div key={activeIndex} className="h-full bg-gradient-to-r from-primary to-secondary animate-progress-bar" />
            </div>
          </div>

        </div>
      </GlassCard>

      <style jsx>{`
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        .animate-progress-bar {
          animation: progress 5s linear infinite;
        }
      `}</style>
    </StaggerReveal>
  );
};

export default Testimonials;