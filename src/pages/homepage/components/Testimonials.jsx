import React, { useState, useEffect } from "react";
import { Quote, ChevronRight, ChevronLeft } from "lucide-react";

import {
  StaggerReveal, CharReveal,
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
  const normalizedRating = Math.round(current.rating * 2) / 2;

  return (
    <StaggerReveal stagger={0.1} y={30} duration={0.6} className="w-full max-w-6xl mx-auto">

      <GlassCard
        bg="bg-base-200/30"
        border="border-white/10"
        className="overflow-hidden p-0 relative h-[420px] "
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 h-full">

          {/* LEFT SIDE: Fixed Scrollable List */}
          <div className="lg:col-span-4 order-1 border-b lg:border-b-0 lg:border-r border-white/5 p-4 flex flex-col h-full bg-base-300/10 rounded-[0.75rem]">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-base-content/40 mb-4 pl-1">
              Client Stories
            </h3>

            {/* Changed to a grid that is 2 columns on small screens (grid-cols-2)
                and switches to a single column list on large screens (lg:flex lg:flex-col)
            */}
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar grid grid-cols-2 lg:flex lg:flex-col gap-2">
              {testimonials.map((t, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`
                      group flex items-center gap-3 p-3 rounded-xl transition-all duration-300 text-left border
                      ${activeIndex === i
                        ? "bg-primary text-primary-content border-primary shadow-lg shadow-primary/20"
                        : "bg-transparent border-transparent hover:bg-base-100/30 hover:border-white/5"
                      }
                  `}
                >
                  <div className="relative shrink-0">
                    <div className="w-8 h-8 rounded-full bg-base-200 border border-white/10 overflow-hidden">
                      <img
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(t.name)}&background=random`}
                        alt={t.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  <div className="min-w-0 flex flex-col justify-center">
                    <div className={`text-xs font-bold truncate leading-tight ${activeIndex === i ? "text-primary-content" : "text-base-content"}`}>
                      {t.name}
                    </div>
                    <div className={`text-[10px] truncate ${activeIndex === i ? "text-primary-content/70" : "text-base-content/40"}`}>
                      {t.company}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex gap-2 mt-4 pt-4 border-t border-white/5">
              <button onClick={handlePrev} className="flex-1 btn btn-xs btn-ghost rounded-lg border border-white/10">
                <ChevronLeft size={14} />
              </button>
              <button onClick={handleNext} className="flex-1 btn btn-xs bg-primary/40 hover:bg-primary rounded-lg text-white">
                <ChevronRight size={14} />
              </button>
            </div>
          </div>

          {/* RIGHT SIDE: Content Area */}
          <div className="lg:col-span-8 order-2 p-8 lg:p-10 flex flex-col justify-center relative bg-gradient-to-br from-transparent to-base-300/5 rounded-t-[0.75rem]">
            <div key={activeIndex} className="relative z-10 flex flex-col h-full">
              <StaggerReveal y={20} duration={0.6} className="flex flex-col h-full">

                {/* Header: Stacks on mobile, Rows on sm+ */}
                <div className="flex flex-col sm:flex-row justify-between items-center sm:items-center gap-4 mb-6">

                  {/* Highlight Badge - mx-auto sm:mx-0 ensures it stays centered when stacked */}
                  <span className="mx-auto sm:mx-0 text-[10px] font-bold uppercase tracking-widest text-primary/80 bg-primary/10 border border-primary/20 px-3 py-1 rounded-full">
                    {current.highlight}
                  </span>

                  {/* Rating Group - justify-center on mobile */}
                  <div className="flex items-center justify-center sm:justify-end gap-2 w-full sm:w-auto">
                    <div className="rating rating-xs sm:rating-sm rating-half">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <React.Fragment key={star}>
                          <input
                            type="radio"
                            className="mask mask-star-2 mask-half-1 bg-warning"
                            checked={normalizedRating === star - 0.5}
                            readOnly
                          />
                          <input
                            type="radio"
                            className="mask mask-star-2 mask-half-2 bg-warning"
                            checked={normalizedRating === star}
                            readOnly
                          />
                        </React.Fragment>
                      ))}
                    </div>
                    <span className="text-xs font-semibold text-base-content/70">
                      {current.rating.toFixed(1)}
                    </span>
                  </div>
                </div>

                {/* Quote Section */}
                <div className="relative flex-1 flex items-center py-4">
                  <Quote size={32} className="text-primary/10 absolute -top-2 -left-2 rotate-180" />

                  <div className="pt-2 text-sm sm:text-base lg:text-lg xl:text-xl text-base-content leading-relaxed font-bold pl-8">
                    <CharReveal>
                      <i className="italic">"{current.quote}"</i>
                    </CharReveal>
                  </div>
                </div>

                {/* Footer Info */}
                <div className="mt-auto pt-6 border-t border-white/10 flex items-center justify-center lg:justify-normal gap-4">
                  <div className="w-10 h-10 rounded-full border-2 border-primary/20 overflow-hidden">
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(current.name)}&background=random`}
                      alt={current.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-base-content text-sm">{current.name}</div>
                    <div className="text-[10px] font-bold text-base-content/40 uppercase tracking-wide">
                      {current.role} • {current.company}
                    </div>
                  </div>
                </div>

              </StaggerReveal>
            </div>

            {/* Progress Bar */}
            <div className="absolute bottom-0 left-1 h-1 w-full bg-base-content/5 rounded-lg">
              <div key={activeIndex} className="h-full bg-primary animate-progress-bar rounded-lg" />
            </div>
          </div>

        </div>
      </GlassCard>

      <style jsx>{`
        @keyframes progress {
          0% { 
            width: 0%; 
            background-color: oklch(var(--p)); /* Primary start color */
          }
          100% { 
            width: 100%; 
            background-color: oklch(var(--su) / 20); /* Success end color */
          }
        }

        .animate-progress-bar {
          background: linear-gradient(45deg, oklch(var(--p)), oklch(var(--su) / 20));
          animation: progress 5s linear infinite;
        }
      `}</style>
    </StaggerReveal>
  );
};

export default Testimonials;