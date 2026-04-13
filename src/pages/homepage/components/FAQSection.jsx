import { useState } from 'react';

import {
  Check,
  MessageSquare
} from "lucide-react";

import {
  StaggerReveal,
} from "@/components/gsap/index.jsx";
import GlassCard from "@/components/widgets/GlassCard.jsx";

const FAQSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const faqs = [
    { q: "What does the version numbering look like?", a: "Dead simple: v1, v2, v3, v4, and so on. Every time a writer uploads a new file, it gets the next number. No sub-versions, no v1.0.1 or v2.3-rc nonsense. Just clean, sequential numbers." },
    { q: "Can I see deleted versions?", a: "Yes — but only if you're the owner. Deleted versions are preserved in the timeline and clearly marked. Writers, reviewers, and viewers cannot see them." },
    { q: "What file types can I upload?", a: "Documents like .pdf, .doc, .docx, .txt, .md — and all text-based code files like .java, .cpp, .py, .js, .ts, .html, .css, .sql, .json, .xml, .yaml, and more." },
    { q: "What can a Viewer do?", a: "Viewers can only see and download approved versions. They cannot upload, approve, reject, comment, or see the audit log. They get notified when a new version is approved." },
    { q: "Can a reviewer also be a writer?", a: "No. Each person has exactly one role per document: Owner, Writer, Reviewer, or Viewer. This keeps permissions clear with no overlap." },
    { q: "What happens when a reviewer rejects a version?", a: "The version stays in the history marked as 'Rejected' with the reviewer's comment. The writer gets a notification with the feedback and can upload a new version (next number). The rejected version stays visible." },
    { q: "Who can see the audit log?", a: "Only the owner. The audit log is a complete, immutable record of every action — uploads, approvals, rejections, deletions, role assignments — with exact timestamps and user names." },
    { q: "How do notifications work?", a: "Writers get notified when their version is reviewed. Reviewers get notified when a new version needs review. Viewers get notified when a new version is approved. Owners get notified about everything." },
    { q: "Can I remove someone from my document?", a: "Yes. As the owner, remove writers, reviewers, or viewers at any time. They immediately lose access. Their past activity remains in the audit log and timeline." },
    { q: "Is there a limit on versions?", a: "No. Have as many versions as you need. The timeline and audit log handle it, and you can search and filter to find any version quickly." },
  ];

  return (
    // ONE UNIFIED GLASS CARD CONTAINER
    <div className="w-full max-w-4xl mx-auto bg-base-200/30 backdrop-blur-2xl border border-white/10 rounded-[1.5rem] shadow-2xl overflow-hidden flex flex-col relative">

      {/* --- BACKGROUND DECORATION --- */}
      <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-[-50px] left-[-50px] w-64 h-64 bg-secondary/10 rounded-full blur-[80px] pointer-events-none" />

      <div className="relative z-10 flex flex-col h-full">

        {/* --- TOP: NAVIGATION GRID (Embedded in Card) --- */}
        <div className="p-6 pb-2 border-b border-white/5 bg-base-100/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-base-content/40">
              Quick Select
            </h3>
            <div className="text-[10px] font-bold text-primary uppercase tracking-wider bg-primary/10 px-2 py-1 rounded-md">
              {activeIndex + 1} / {faqs.length}
            </div>
          </div>

          {/* Grid: 5 cols on mobile, 10 on desktop */}
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
            {faqs.map((faq, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`
                  group aspect-square flex items-center justify-center rounded-xl transition-all duration-300 border text-sm font-bold relative overflow-hidden
                  ${activeIndex === i
                    ? "bg-primary text-primary-content border-primary shadow-lg shadow-primary/30 scale-105 z-10"
                    : "bg-base-100/40 border-white/5 hover:bg-base-100/60 hover:border-white/20 text-base-content/40 hover:text-base-content"
                  }
                `}
              >
                {/* Active Checkmark Background Blur */}
                {activeIndex === i && (
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                )}

                <span className="relative z-10">
                  {activeIndex === i ? <Check size={16} strokeWidth={3} /> : String(i + 1)}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* --- BOTTOM: CONTENT VISUALIZATION (Embedded in Card) --- */}
        <div className="p-6 sm:p-10 lg:p-12 flex-grow flex flex-col justify-center">

          <StaggerReveal
            key={activeIndex}
            y={20}
            opacity={0}
            duration={0.5}
            className="w-full h-full flex flex-col"
          >
            <div className="mb-6 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <MessageSquare size={20} />
              </div>
              <div className="h-px flex-grow bg-gradient-to-r from-primary/50 to-transparent" />
            </div>

            {/* Question: Scaled Down Text */}
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-base-content tracking-tight leading-[1.1] mb-8">
              {faqs[activeIndex].q}
            </h2>

            {/* Answer: Scaled Down Text, Readable Font Size */}
            <div className="p-6 sm:p-8 rounded-3xl bg-base-100/40 border border-white/5 backdrop-blur-sm">
              <p className="text-base sm:text-lg text-base-content/80 leading-relaxed font-medium">
                {faqs[activeIndex].a}
              </p>
            </div>
          </StaggerReveal>

        </div>

        {/* --- PROGRESS BAR FOOTER (Inside Card) --- */}
        <div className="h-1.5 w-full bg-base-content/5 mt-auto">
          <div
            className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500 ease-out shadow-[0_0_10px_rgba(var(--p),0.5)]"
            style={{ width: `${((activeIndex + 1) / faqs.length) * 100}%` }}
          />
        </div>

      </div>
    </div>
  );
};

export default FAQSection