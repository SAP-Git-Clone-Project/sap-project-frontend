import React, { useState, useEffect, useMemo, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Loader2,
  Plus,
  Minus,
  ExternalLink,
  FileCheckCorner,
  FileCheck,
  FileX,
  ShieldCheck,
  Info,
} from "lucide-react";

import Animate from "@/components/animation/Animate.jsx";
import FileStatus from "@/components/widgets/FileStatus.jsx";
import GlassCard from "@/components/widgets/GlassCard.jsx";
import notify from "@/components/toaster/notify";
import api from "@/components/api/api";
import Loader from "@/components/widgets/Loader.jsx";
import MissingArtifact from "@/components/widgets/MissingArtifact";
import useTheme from "@/hooks/useTheme";

/* ------------------------------------------------------------------ */
/* DiffViewer — GitHub-style, notepad wrapping, Y-scroll              */
/* ------------------------------------------------------------------ */
const DiffViewer = ({ diffData, rawContent }) => {
  const { theme } = useTheme();

  const { lines, additions, deletions } = useMemo(() => {
    if (!diffData) return { lines: [], additions: 0, deletions: 0 };

    let diffLines = diffData.diff || [];
    if (
      diffData.has_parent === false &&
      diffLines.length === 0 &&
      diffData.new_content
    ) {
      diffLines = diffData.new_content
        .split("\n")
        .map((v) => ({ type: "insert", value: v }));
    }

    let oNum = 0, nNum = 0, adds = 0, dels = 0;
    const numbered = diffLines.map((entry) => {
      let o = "", n = "";
      if (entry.type === "equal") { oNum++; nNum++; o = oNum; n = nNum; }
      else if (entry.type === "delete") { oNum++; dels++; o = oNum; }
      else if (entry.type === "insert") { nNum++; adds++; n = nNum; }
      return { ...entry, o, n };
    });
    return { lines: numbered, additions: adds, deletions: dels };
  }, [diffData]);

  if (!diffData && !rawContent) return null;

  /* cannot-compare fallback */
  if (diffData?.can_compare === false) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[160px] text-base-content/30 gap-4 border-2 border-dashed border-base-content/10 rounded-2xl">
        <FileText size={36} className="opacity-40" />
        <p className="text-xs max-w-xs text-center font-semibold leading-relaxed">
          {diffData.message}
        </p>
        {diffData.file_url && (
          <a
            href={diffData.file_url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-sm bg-primary gap-2 hover:bg-primary/60 text-white rounded-xl text-[10px] uppercase tracking-widest font-black"
          >
            <ExternalLink size={12} /> View File
          </a>
        )}
      </div>
    );
  }

  /* stat header */
  const hasStats = lines.length > 0;

  /* raw-content mode (no diff data) */
  if (!diffData && rawContent) {
    const rawLines = rawContent.split("\n");
    return (
      <div className="flex flex-col h-full w-full overflow-hidden">
        <div className="overflow-y-auto overflow-x-hidden flex-1 rounded-xl border border-base-300/20 bg-base-950/40 shadow-inner custom-scrollbar">
          <div className="font-mono text-[12px] leading-6 w-full">
            {rawLines.map((line, i) => (
              <div
                key={i}
                className="flex items-start hover:bg-primary/5 transition-colors border-b border-base-300/5 last:border-0"
              >
                <span className="sticky left-0 w-12 shrink-0 text-right pr-3 py-0.5 text-base-content/25 select-none border-r border-base-300/15 bg-base-950/80 font-bold text-[11px] self-start pt-[3px]">
                  {i + 1}
                </span>
                {/* whitespace-pre-wrap so long lines wrap instead of overflow */}
                <span className="whitespace-pre-wrap break-all py-0.5 px-4 text-base-content/75 min-w-0 flex-1">
                  {line || "\u00A0"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* diff mode */
  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      {/* stat bar */}
      {hasStats && (
        <div className="flex items-center gap-5 text-[10px] font-black uppercase tracking-widest shrink-0 pb-2.5 mb-2.5 border-b border-base-300/20">
          <span className="flex items-center gap-1.5 text-success">
            <Plus size={11} />
            {additions} Addition{additions !== 1 ? "s" : ""}
          </span>
          <span className="flex items-center gap-1.5 text-error">
            <Minus size={11} />
            {deletions} Deletion{deletions !== 1 ? "s" : ""}
          </span>
          <span className="ml-auto text-base-content/20">
            {lines.length} line{lines.length !== 1 ? "s" : ""}
          </span>
        </div>
      )}

      {/* scrollable diff body — Y-only; lines wrap at container width */}
      <div className="overflow-y-auto overflow-x-hidden flex-1 rounded-xl border border-base-300/20 bg-base-950/40 shadow-inner custom-scrollbar">
        <div className="font-mono text-[12px] leading-6 w-full">
          {lines.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-base-content/20 text-[10px] font-black uppercase tracking-widest">
              No Differences Found
            </div>
          ) : (
            lines.map((entry, i) => {
              const isDel = entry.type === "delete";
              const isIns = entry.type === "insert";

              const rowBg = isDel
                ? "bg-error/15 hover:bg-error/20"
                : isIns
                  ? "bg-success/15 hover:bg-success/20"
                  : "hover:bg-base-content/5";

              const gutterBg = isDel
                ? (theme === 'light' ? "bg-error/10" : "bg-error/20")
                : isIns
                  ? "bg-success/20"
                  : "bg-base-200/60";

              const prefix = isDel ? "−" : isIns ? "+" : " ";
              const prefixClr = isDel ? "text-red-400" : isIns ? "text-success" : "text-transparent";
              const numClr = isDel
                ? (theme === 'light' ? "text-red-900" : "text-red-200")
                : isIns
                  ? "text-success/60"
                  : "text-base-content/30";

              return (
                <div
                  key={i}
                  className={`flex items-start transition-colors border-b border-base-content/5 last:border-0 ${rowBg}`}
                >
                  {/* gutter */}
                  <div className={`sticky left-0 flex shrink-0 select-none border-r border-base-content/10 z-10 ${gutterBg} ${numClr}`}>
                    <span className="w-10 text-right pr-2 py-0.5 text-[10px] font-bold self-start pt-[4px]">
                      {entry.o}
                    </span>
                    <span className="w-10 text-right pr-2 py-0.5 text-[10px] font-bold self-start pt-[4px]">
                      {entry.n}
                    </span>
                  </div>

                  {/* +/- symbol */}
                  <span className={`w-5 shrink-0 text-center py-0.5 select-none font-black self-start pt-[3px] ${prefixClr}`}>
                    {prefix}
                  </span>

                  {/* content */}
                  <span className="whitespace-pre-wrap break-all py-0.5 pl-2 pr-4 text-base-content/80 min-w-0 flex-1">
                    {entry.value || "\u00A0"}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */
function formatDate(dateStr) {
  if (!dateStr) return "N/A";
  const d = new Date(dateStr);
  const now = new Date();
  const time = d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  if (d.toDateString() === now.toDateString()) return `Today · ${time}`;
  return d.toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function extractErrorMessage(err) {
  const data = err.response?.data;
  if (!data) return "An unexpected error occurred";
  if (data.error) return data.error;
  const field = Object.keys(data)[0];
  if (field) {
    const msgs = Array.isArray(data[field]) ? data[field].join(", ") : data[field];
    return `${field}: ${msgs}`;
  }
  return "An unexpected error occurred";
}

/* ------------------------------------------------------------------ */
/* Main page                                                          */
/* ------------------------------------------------------------------ */
const VersionReviewPage = () => {
  const { id } = useParams();
  const [comment, setComment] = useState("");
  const [review, setReview] = useState(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [diffData, setDiffData] = useState(null);
  const [diffLoading, setDiffLoading] = useState(false);
  const isInitialMount = useRef(true);

  const status = review?.review_status?.toLowerCase() || "pending";
  const isFinalized = status === "approved" || status === "rejected";
  const newVersion = review?.new_version;

  /* fetch review */
  useEffect(() => {
    const controller = new AbortController();
    const fetchReview = async () => {
      try {
        setError(null);
        const res = await api.get(`/reviews/${id}/`, { signal: controller.signal });
        setReview(res.data);
        if (isInitialMount.current) {
          isInitialMount.current = false;
          setIsInitialLoading(false);
        }
      } catch (err) {
        if (err.name !== "CanceledError") {
          const msg = extractErrorMessage(err);
          setError(msg);
          notify.error(msg);
        }
      }
    };
    if (id) fetchReview();
    return () => controller.abort();
  }, [id]);

  /* fetch diff */
  useEffect(() => {
    if (!newVersion?.id) return;
    let cancelled = false;
    const fetchDiff = async () => {
      try {
        setDiffLoading(true);
        const res = await api.get(`/versions/${newVersion.id}/diff/`);
        if (!cancelled) setDiffData(res.data);
      } catch (err) {
        if (!cancelled)
          setDiffData({ can_compare: false, message: extractErrorMessage(err) });
      } finally {
        if (!cancelled) setDiffLoading(false);
      }
    };
    fetchDiff();
    return () => { cancelled = true; };
  }, [newVersion?.id]);

  const handleApprove = async () => {
    try {
      setSubmitting(true);
      const payload = { review_status: "approved" };
      if (comment.trim()) payload.comments = comment.trim();
      const res = await api.patch(`/reviews/${id}/`, payload);
      setReview(res.data);
      setComment("");
      notify.success("Version approved successfully");
    } catch (err) {
      notify.error(extractErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!comment.trim()) {
      notify.error("Please provide a reason for rejecting this version");
      return;
    }
    try {
      setSubmitting(true);
      const res = await api.patch(`/reviews/${id}/`, {
        review_status: "rejected",
        comments: comment.trim(),
      });
      setReview(res.data);
      setComment("");
      notify.error("Version rejected");
    } catch (err) {
      notify.error(extractErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const diffLabel = useMemo(() => {
    if (!diffData || diffData.can_compare === false) return null;
    if (diffData.has_parent === false) return "v1 — Initial Version";
    return `v${diffData.old_v} → v${diffData.new_v}`;
  }, [diffData]);

  /* loading / error */
  if (isInitialLoading) return <Loader message="Loading review context..." />;

  if (error) {
    return (
      <section className="px-6 py-20 h-screen bg-base-100 flex flex-col">
        <div className="w-full max-w-7xl mx-auto">
          <MissingArtifact
            title="Review Access Denied"
            message={error}
            linkTo="/reviews"
            linkText="Return to Queue"
          />
        </div>
      </section>
    );
  }

  return (
    /*
     * Outer shell: centers the inner box, pads for the navbar.
     * Does NOT set overflow-hidden so the page can scroll on small screens.
     */
    <section className="min-h-screen w-full bg-base-100 flex flex-col items-center pt-16 lg:pt-20 pb-8 px-4 sm:px-6">

      {/*
       * Inner container:
       *   - max-w-7xl keeps line width sane on ultra-wide monitors
       *   - height: 80vh is the key constraint — fills most of the viewport
       *     without the diff exploding to full page height
       *   - minHeight: 600px prevents it from collapsing on very short viewports
       */}
      <div
        className="w-full max-w-7xl flex flex-col gap-4"
      >

        {/* ── HEADER (shrinks to its natural height) ── */}
        <div className="shrink-0 space-y-2.5">
          {/* top nav row */}
          <div className="flex items-center justify-between">
            <Link
              to="/reviews"
              className="group btn btn-ghost btn-sm gap-2 border border-base-300/40 rounded-xl hover:bg-base-300/20 transition-all"
            >
              <ArrowLeft
                size={13}
                className="group-hover:-translate-x-0.5 transition-transform"
              />
              <span className="text-[10px] uppercase tracking-[0.2em] font-black">Back</span>
            </Link>

            <div className="flex items-center gap-3">
              {diffLabel && (
                <span className="text-[10px] font-mono opacity-50 bg-base-200/60 px-3 py-1 rounded-lg border border-base-300/30">
                  {diffLabel}
                </span>
              )}
              <FileStatus status={status} />
            </div>
          </div>

          {/* title row */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-base-300/15 pb-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-[0.4em]">
                <FileCheckCorner size={13} /> Version Review
              </div>
              <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-base-content leading-[0.9]">
                {newVersion?.title || newVersion?.name || `Version ${newVersion?.version_number}`}
              </h1>
            </div>

            <span className="flex items-center gap-2 text-[10px] font-bold opacity-40 w-fit shrink-0">
              <Clock size={11} /> {formatDate(newVersion?.created_at)}
            </span>
          </div>
        </div>

        {/* ── BODY: fills remaining height ── */}
        <div className="flex-1 flex flex-col-reverse lg:grid lg:grid-cols-[1fr_330px] gap-4">

          {/* ── LEFT: Diff Viewer panel ── */}
          <div className="flex flex-col h-[80vh] bg-base-200/15 border border-base-300/20 rounded-[1.5rem] p-5 overflow-hidden shadow-xl relative group">
            {/* subtle ambient glow */}
            <div className="absolute inset-0 bg-primary/4 blur-3xl rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

            <div className="relative flex flex-col h-full">
              {/* panel header */}
              <div className="flex items-center gap-2.5 text-sm font-bold text-base-content mb-3 shrink-0">
                <div className="h-7 w-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <FileText size={13} className="text-primary" />
                </div>
                Source Comparison
              </div>

              {/* diff — flex-1 fills remaining panel height */}
              <div className="flex-1 min-h-0">
                {diffLoading ? (
                  <div className="flex flex-col items-center justify-center h-full gap-3">
                    <Loader2 size={26} className="animate-spin text-primary/25" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-25">
                      Calculating Delta…
                    </span>
                  </div>
                ) : (
                  <DiffViewer diffData={diffData} rawContent={newVersion?.content} />
                )}
              </div>
            </div>
          </div>

          {/* ── RIGHT: Sidebar ── */}
          <div className="flex flex-col gap-4">

            {/* Review Protocol */}
            <GlassCard className="p-5 space-y-4 shrink-0 border-primary/10 shadow-lg rounded-[1.25rem]">
              <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-[0.3em]">
                <ShieldCheck size={13} /> Review Protocol
              </div>

              {!isFinalized ? (
                <div className="space-y-3">
                  <textarea
                    className="textarea textarea-bordered w-full min-h-[96px] bg-base-100/40 rounded-xl border-base-300/40 focus:ring-1 focus:ring-primary/40 text-sm resize-none"
                    placeholder="Optional feedback or rejection reason…"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={handleReject}
                      disabled={submitting}
                      className="btn btn-outline border-error/30 text-error hover:bg-error hover:text-white hover:border-error rounded-xl text-[9px] font-black tracking-widest uppercase gap-1.5"
                    >
                      {submitting
                        ? <Loader2 size={13} className="animate-spin" />
                        : <XCircle size={13} />}
                      Reject
                    </button>
                    <button
                      onClick={handleApprove}
                      disabled={submitting}
                      className="btn bg-success/10 text-success hover:bg-success hover:text-white border-success/20 rounded-xl text-[9px] font-black tracking-widest uppercase gap-1.5"
                    >
                      {submitting
                        ? <Loader2 size={13} className="animate-spin" />
                        : <CheckCircle2 size={13} />}
                      Approve
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-base-100/40 text-center border border-base-300/15">
                  <div
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl font-black uppercase text-xs tracking-wider ${status === "approved"
                      ? "text-success bg-success/10 border border-success/20"
                      : "text-error bg-error/10 border border-error/20"
                      }`}
                  >
                    {status === "approved" ? <FileCheck size={14} /> : <FileX size={14} />}
                    {status}
                  </div>
                  {review?.comments && (
                    <p className="mt-3 text-xs text-base-content/50 italic font-medium leading-relaxed">
                      "{review.comments}"
                    </p>
                  )}
                </div>
              )}
            </GlassCard>

            {/* Summary */}
            <div className="p-5 rounded-[1.25rem] bg-base-200/20 border border-base-300/20 backdrop-blur-xl shrink-0">
              <div className="flex items-center gap-2 text-secondary font-black text-[10px] uppercase tracking-[0.3em] mb-2.5">
                <Info size={12} /> Summary
              </div>
              <p className="text-base-content/55 text-xs leading-relaxed font-medium italic">
                {newVersion?.summary || newVersion?.description || "No summary provided."}
              </p>
            </div>

            {/* Version pill */}
            {newVersion?.version_number && (
              <div className="p-4 rounded-[1.25rem] bg-primary/8 border border-primary/15 flex items-center justify-between shrink-0">
                <div className="flex flex-col">
                  <span className="text-[8px] uppercase font-black text-primary tracking-[0.2em]">
                    Release
                  </span>
                  <span className="text-xl font-black">
                    v{newVersion.version_number}
                  </span>
                </div>
                <div className="h-9 w-9 rounded-xl bg-primary/15 border border-primary/20 text-primary flex items-center justify-center">
                  <ShieldCheck size={18} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default VersionReviewPage;