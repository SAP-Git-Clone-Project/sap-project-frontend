import React, { useState, useEffect, useMemo, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  ArrowRight,
  Loader2,
  FileIcon,
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
import DiffViewer from "@/components/diff/DiffViewer.jsx";

/* Helpers */
const formatDate = (dateStr) => {
  if (!dateStr) return "N/A";

  const d = new Date(dateStr);
  const now = new Date();

  const time = d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });

  if (d.toDateString() === now.toDateString()) {
    return `Today · ${time}`;
  }

  const datePart = d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  const yearPart = d.getFullYear();

  return `${datePart}, ${yearPart} · ${time}`;
};

const extractErrorMessage = (err) => {
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

/* Show extension */
const getExtension = (path) => {
  if (!path) return "Unknown";
  // Split by dot, take the last part, and remove any potential URL parameters
  return path.split('.').pop().split(/[?#]/)[0].toLowerCase();
};

/* Main page */
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
  if (isInitialLoading) return <Loader message="Loading version review..." />;

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
    <section className="min-h-screen w-full bg-base-100 flex flex-col items-center pt-16 lg:pt-20 pb-8 px-4 sm:px-6">
      <div
        className="w-full max-w-7xl flex flex-col gap-4"
      >

        {/* ── HEADER ── */}
        <div className="shrink-0 space-y-2.5">
          {/* top nav row */}
          <div className="flex items-center justify-between border-b border-base-300/10 pb-8">
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
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-12 border-b border-base-300/15 pb-3 pt-20">
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
                      Synthesizing Changes...
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

            {/* FIX: Fixed but check */}
            <div className="space-y-4">
              {/* Release Info Block */}
              {newVersion?.version_number && (
                <div className="p-4 rounded-[1.25rem] bg-primary/8 border border-primary/15 flex items-center justify-between shrink-0">
                  <div className="flex flex-col">
                    <span className="text-[8px] uppercase font-black text-primary tracking-[0.2em]">
                      Release Candidate
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

              {/* File Type Transition Analysis */}
              <div className={`grid ${review.old_version ? "grid-cols-2" : "grid-cols-1"} gap-4`}>
                {/* Old Version Type - Only renders if old_version exists */}
                {review.old_version && (
                  <div className="p-3 rounded-2xl bg-base-300/10 border border-base-300/10">
                    <span className="text-[7px] uppercase font-bold opacity-40 tracking-widest block mb-1">
                      Legacy Format (v{review.old_version?.version_number})
                    </span>
                    <div className="flex items-center gap-2">
                      <FileIcon size={12} className="opacity-50" />
                      <span className="text-[11px] font-mono font-black uppercase text-error/70">
                        .{getExtension(review.old_version?.file_path)}
                      </span>
                    </div>
                  </div>
                )}

                {/* New Version Type - Always renders if new_version exists */}
                {review.new_version && (
                  <div className={`p-3 rounded-2xl bg-success/5 border border-success/10 ${!review.old_version ? "flex flex-col justify-center" : ""}`}>
                    <span className="text-[7px] uppercase font-bold text-success/60 tracking-widest block mb-1">
                      {review.old_version ? `Target Format (v${review.new_version?.version_number})` : `Initial Format (v${review.new_version?.version_number})`}
                    </span>
                    <div className="flex items-center gap-2">
                      {review.old_version ? (
                        <ArrowRight size={12} className="text-success/40" />
                      ) : (
                        <FileIcon size={12} className="text-success/40" />
                      )}
                      <span className="text-[11px] font-mono font-black uppercase text-success">
                        .{getExtension(review.new_version?.file_path)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VersionReviewPage;