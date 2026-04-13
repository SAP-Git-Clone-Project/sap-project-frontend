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
    { q: "What does the version numbering look like?", a: "Dead simple: v1, v2, v3, v4, and so on. Every time a writer uploads a new file, it gets the next number. No sub-versions or complex decimals—just clean, sequential numbers." },
    { q: "Can I see deleted versions?", a: "Yes, but visibility is strictly limited. Deleted versions are preserved in the timeline for the Document Owner and the Superuser only. Writers, reviewers, and viewers cannot see them." },
    { q: "What file types can I upload?", a: "You can upload documents like .pdf, .doc, .docx, .txt, .md, and all text-based code files (e.g., .java, .py, .js, .ts). Please note that video uploads are not supported." },
    { q: "What can a Viewer do?", a: "Viewers can only see and download approved versions. They cannot upload, approve, reject, or see the system logs. They simply get notified when a new version is officially approved." },
    { q: "Can a reviewer also be a writer?", a: "No. To maintain clear boundaries, each person has exactly one role per document: Document Owner, Writer, Reviewer, or Viewer." },
    { q: "What happens when a reviewer rejects a version?", a: "The version is marked 'Rejected' in the history with the reviewer's feedback. This rejected state is visible to the Document Owner and the writers so they can address the changes." },
    { q: "Who can see the audit log?", a: "Since the audit log is a comprehensive system-level record, it is only accessible by the Admin or Superuser. It tracks every login, logout, deletion, update, and document creation." },
    { q: "How do notifications work?", a: "Writers are alerted when their version is reviewed; Reviewers are pinged when a file needs checking; Viewers are notified of approvals; and Document Owners are kept in the loop on everything." },
    { q: "Can I remove someone from my document?", a: "Yes. Both the Document Owner and the Co-Author have the authority to remove writers, reviewers, or viewers at any time to manage team access effectively." },
    { q: "Is there a limit on versions?", a: "No. You can have as many versions as the project requires. The timeline and system logs are designed to handle long-term histories without slowing down." },
    { q: "Can I download older versions?", a: "Yes. Anyone with access (except Viewers) can download previous versions from the timeline. This is helpful for manual comparisons or checking work from earlier stages." },
    { q: "What happens if a writer uploads the wrong file?", a: "Uploads cannot be edited. The writer must ask the Document Owner to delete that version, or simply upload the correct file as the next sequential version." },
    { q: "Is there a file size limit?", a: "We support file sizes up to the maximum limit allowed by Cloudinary in a single API call (currently 50MB). This ensures fast processing for documents and code, but specifically excludes video files." },
    { q: "Can a document have multiple Reviewers?", a: "Yes. Multiple reviewers are allowed per document, enabling diverse feedback and more thorough quality checks before a version is officially approved." },
    { q: "Does the system support auto-save?", a: "No. This is a version control system, not a live editor. You should finalize your work locally and upload it only when it is ready to be recorded as a formal version." },
    { q: "What if the Document Owner leaves the company?", a: "Document Ownership can be transferred to any other user currently assigned to the document. This ensures the timeline and records stay intact regardless of team changes." },
    { q: "What exactly does the audit log track?", a: "It is a total system log. It records logins/logouts, file deletions, metadata updates, document creations, new version uploads, and all review actions with exact timestamps." },
    { q: "Can I search through old versions?", a: "Yes. You can filter the timeline by version number, uploader, or date, making it easy to find a specific file from months ago in seconds." },
    { q: "What happens to the timeline if a user is deleted?", a: "The history is permanent. Even if a user is removed, their name remains attached to every version they uploaded or review they performed for accountability." },
    { q: "Can Viewers see the comments on a rejected version?", a: "No. Viewers only see the final, approved versions. The back-and-forth feedback between writers and reviewers is kept hidden to maintain a clean workspace for stakeholders." }
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
            className="h-full bg-gradient-to-r from-primary to-success transition-all duration-500 ease-out "
            style={{ width: `${((activeIndex + 1) / faqs.length) * 100}%` }}
          />
        </div>

      </div>
    </div>
  );
};

export default FAQSection