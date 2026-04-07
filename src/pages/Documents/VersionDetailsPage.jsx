import React, { useState, useEffect, useMemo, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft, Clock3, FileText, CheckCircle2, XCircle,
  PencilLine, User, CalendarDays, ShieldCheck,
  Info, HardDrive, Hash, Eye, FileStack, Download,
  X, Search
} from "lucide-react";

import Animate from "@/components/animation/Animate.jsx";
import GlassCard from "@/components/widgets/GlassCard.jsx";
import Loader from "@/components/widgets/Loader.jsx";
import MissingArtifact from "@/components/widgets/MissingArtifact.jsx";
import api from "@/components/api/api.js";
import { useAuth } from "@/context/AuthContext.jsx";

const STATUS_CONFIG = {
  approved: { icon: CheckCircle2, color: "text-success", bg: "bg-success/10", border: "border-success/20", label: "Approved" },
  pending_approval: { icon: Clock3, color: "text-warning", bg: "bg-warning/10", border: "border-warning/20", label: "Pending" },
  draft: { icon: PencilLine, color: "text-info", bg: "bg-info/10", border: "border-info/20", label: "Draft" },
  rejected: { icon: XCircle, color: "text-error", bg: "bg-error/10", border: "border-error/20", label: "Rejected" },
  default: { icon: FileText, color: "text-secondary", bg: "bg-base-300/10", border: "border-base-300/20", label: "Unknown" }
};

const getStatusDetails = (status) =>
  STATUS_CONFIG[status?.toLowerCase()] || STATUS_CONFIG.default;

const VersionDetailsPage = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [version, setVersion] = useState(null);
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [previewContent, setPreviewContent] = useState(null);
  const [fileType, setFileType] = useState(null);

  const [selectedReviewers, setSelectedReviewers] = useState([]);
  const [reviewerSearch, setReviewerSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false); // New state for visibility
  const [submitting, setSubmitting] = useState(false);
  const [members, setMembers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const versionRes = await api.get(`/versions/${id}/`);
        const versionData = versionRes.data;
        setVersion(versionData);

        const docRes = await api.get(`/documents/${versionData.document}/`);
        setDocument(docRes.data);

        const membersRes = await api.get(`/permissions/${versionData.document}/members/`);
        setMembers(membersRes.data);

        const allUsersRes = await api.get("/users/search/");
        setAllUsers(allUsersRes.data);

        const reviewsRes = await api.get("/reviews/inbox/?all=true");
        const versionReviews = (reviewsRes.data || []).filter(
          (r) => String(r.version) === String(id)
        );
        setReviews(versionReviews);
      } catch (err) {
        console.error(err);
        setError("Version retrieval failure.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const getFileType = (url) => {
    if (!url) return "unknown";
    if (url.endsWith(".pdf")) return "pdf";
    if (url.endsWith(".md")) return "markdown";
    if (url.endsWith(".txt")) return "text";
    return "unknown";
  };

  useEffect(() => {
    if (!version?.file_path) return;
    const type = getFileType(version.file_path);
    setFileType(type);
    if (type === "markdown" || type === "text") {
      fetch(version.file_path)
        .then((res) => res.text())
        .then((data) => setPreviewContent(data.slice(0, 2000)))
        .catch(() => setPreviewContent("Preview unavailable."));
    }
  }, [version]);

  const documentReviewers = useMemo(() => {
    if (!members.length) return [];
    return members.filter(m => m.permission_type?.toUpperCase() === "APPROVE");
  }, [members]);

  const availableReviewers = useMemo(() => {
    return documentReviewers.filter((r) => {
      const isAlreadySelected = selectedReviewers.includes(r.user);
      const matchesSearch = r.username.toLowerCase().includes(reviewerSearch.toLowerCase());
      return !isAlreadySelected && matchesSearch;
    })
  }, [documentReviewers, selectedReviewers, reviewerSearch]);

  const handleToggleReviewer = (userId) => {
    setSelectedReviewers(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };

  const handleRequestReview = async () => {
    if (selectedReviewers.length === 0) return;
    try {
      setSubmitting(true);

      await Promise.all(selectedReviewers.map(reviewerId =>
        api.post("/reviews/create/", {
          version: version.id,
          reviewer: reviewerId,
        })
      ));

      const updated = await api.get(`/versions/${version.id}/`);
      setVersion(updated.data);

      const reviewsRes = await api.get(`/reviews/?version=${id}`);
      setReviews(reviewsRes.data);

      setSelectedReviewers([]);
      setReviewerSearch("");
    } catch (err) {
      console.error("Failed to create reviews", err);
    } finally {
      setSubmitting(false);
    }
  };

  const statusInfo = getStatusDetails(version?.status);
  const isOwner = document?.created_by_username === user?.username || user?.is_superuser;
  const isCoAuthor = useMemo(() => {
    if (!user || !members.length) return false;
    return members.some((m) => m.user === user.id && m.permission_type === "WRITE");
  }, [members, user]);

  const isDeleted = document?.is_deleted;
  const isSuperUser = user?.is_superuser;

  if (loading) return <Loader message="Loading version details..." />;
  if (error || !version) return (
    <MissingArtifact
      title="Version Not Found"
      message="The requested version for this document is missing from the system registry. It may have been redacted or purged."
      linkText="Return to Documents"
      linkTo={`/documents`}
    />
  );

  return (
    <section className="px-6 py-20 min-h-screen bg-base-100 overflow-x-hidden">
      <div className="max-w-7xl mx-auto space-y-16">

        {/* TOP LEVEL NAVIGATION */}
        <Animate variant="fade-down">
          <div className="flex flex-col sm:flex-row items-center justify-between w-full border-b border-base-300/10 pb-8 gap-4">
            <Link
              to={`/documents/${document?.id}`}
              className="group btn btn-ghost btn-sm gap-2 rounded-xl border border-base-300/50 hover:bg-base-300/50 transition-all"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-[10px] uppercase tracking-[0.2em]">Back to Document</span>
            </Link>

            {isOwner && (
              <a
                href={version.file_path}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-sm rounded-xl border-none hover:scale-105 transition-all h-10 px-6 flex items-center gap-2"
              >
                <Download size={16} />
                <span className="font-bold text-[10px] uppercase tracking-widest">Download v.{version.version_number} File</span>
              </a>
            )}
          </div>
        </Animate>

        {/* HEADER SECTION */}
        <div className="grid lg:grid-cols-2 gap-12 pt-4">
          <Animate className="lg:col-span-2 space-y-10">
            <div className="space-y-4 mb-5">
              <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-[0.4em]">
                <FileText size={18} /> Version Details
              </div>
              <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-base-content leading-[0.9]">
                Version  <span className="text-primary">№ {version.version_number}</span>
              </h1>
              <p className="text-base-content/50 font-bold uppercase tracking-widest text-xs">
                {document?.title}
              </p>
            </div>

            {isSuperUser && isDeleted && (
              <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-error/10 border border-error/20 text-error text-[10px] font-black uppercase tracking-widest">
                <XCircle size={12} />
                Redacted Artifact — Parent Document Deleted
              </div>
            )}

            <div className="p-10 rounded-[1.5rem] bg-base-200/20 border border-base-300/40 backdrop-blur-md relative group">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30 mb-6 flex items-center gap-2">
                <Info size={14} /> Version Remarks
              </h3>
              <p className="text-base-content/70 text-md leading-relaxed font-medium">
                {version.content || "System Remark: No specific version notes provided."}
              </p>
            </div>
          </Animate>

          {/* METADATA SIDEBAR */}
          <Animate>
            <GlassCard className="p-8 space-y-8 border-primary/5 shadow-2xl sticky top-24">
              <div className="space-y-6 rounded-[1.5rem]">
                <div>
                  <span className="text-[9px] font-black uppercase opacity-30 tracking-[0.2em] block mb-3">
                    Lifecycle Status
                  </span>
                  <div className={`w-fit px-4 py-2 rounded-xl border ${statusInfo.border} ${statusInfo.bg} ${statusInfo.color} text-[10px] font-black uppercase flex items-center gap-2`}>
                    <statusInfo.icon size={12} /> {statusInfo.label}
                  </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-4 border-y border-base-300/10 py-8">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="h-11 w-11 rounded-full bg-base-300/20 flex items-center justify-center text-primary shadow-inner shrink-0 overflow-hidden border border-base-300/10">
                      <img
                        src={version.avatar_url || `https://ui-avatars.com/api/?name=${version.creator_name}`}
                        alt={version.creator_name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] uppercase font-black opacity-40 tracking-[0.2em] mb-0.5">Contributor</span>
                      <span className="text-sm font-bold text-base-content/90 tracking-tight">
                        {version.creator_name}
                      </span>
                    </div>
                  </div>

                  <div className="hidden md:block w-px h-10 bg-gradient-to-b from-transparent via-base-300/50 to-transparent mx-4" />

                  <div className="flex items-center gap-4 flex-1 md:justify-end">
                    <div className="flex flex-col md:items-end order-2 md:order-1">
                      <span className="text-[9px] uppercase font-black opacity-40 tracking-[0.2em] mb-0.5">Timestamp</span>
                      <span className="text-sm font-bold text-base-content/90 tracking-tight">
                        {new Date(version.created_at).toLocaleDateString(undefined, {
                          month: 'short', day: 'numeric', year: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="h-11 w-11 rounded-2xl bg-base-300/20 flex items-center justify-center text-secondary shadow-inner shrink-0 order-1 md:order-2">
                      <CalendarDays size={18} />
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-[1.5rem] bg-primary/5 border border-primary/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <HardDrive size={14} className="opacity-40" />
                      <span className="text-[10px] font-black uppercase tracking-widest opacity-60">File Size</span>
                    </div>
                    <span className="text-xs font-mono font-bold">{(version.file_size / 1024).toFixed(2)} KB</span>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                      <Hash size={14} className="opacity-40" />
                      <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Integrity Checksum</span>
                    </div>
                    <span className="text-[10px] font-mono break-all opacity-40 bg-base-300/30 p-2 rounded-lg leading-tight">
                      {version.checksum}
                    </span>
                  </div>
                </div>

                {version.is_active && (
                  <div className="p-4 bg-success/10 border border-success/20 rounded-xl text-success font-black text-[10px] tracking-[0.3em] text-center uppercase">
                    Primary Active Version
                  </div>
                )}
              </div>
            </GlassCard>
          </Animate>
        </div>

        {/* ACTION SECTION */}
        <Animate delay={0.1}>
          <div className="w-full mt-8">
            {((isOwner || isCoAuthor) && version.status !== "pending_approval") ? (
              <GlassCard className="w-full p-10 border-primary/5 shadow-2xl overflow-visible relative">
                <div className="absolute top-0 right-0 w-96 h-96 bg-warning/5 rounded-full blur-[120px] -mr-32 -mt-32 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -ml-24 -mb-24 pointer-events-none" />

                <div className="relative z-10 flex flex-col xl:flex-row xl:items-start justify-between gap-10">
                  <div className="space-y-4 flex-1">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl bg-warning/10 flex items-center justify-center text-warning shadow-inner">
                        <ShieldCheck size={22} />
                      </div>
                      <div className="flex flex-col">
                        <h3 className="text-[12px] font-black uppercase tracking-[0.4em] text-warning">
                          Approval Protocol
                        </h3>
                        <span className="text-[9px] uppercase font-bold opacity-30 tracking-widest">Security Level: High</span>
                      </div>
                    </div>
                    <p className="text-base font-medium text-base-content/70 leading-relaxed max-w-2xl">
                      Initialize the audit sequence. Assign a qualified authority to verify the integrity and compliance of this version.
                      Submitting will lock the version for manual editing until the review is concluded.
                    </p>
                  </div>

                  {/* Right: Multi-Select Interface */}
                  <div className="flex flex-col gap-4 w-full xl:w-auto xl:min-w-[550px] relative">

                    {/* Selected Reviewers Tags */}
                    <div className="min-h-[50px] p-4 rounded-2xl border border-dashed border-base-content/20 bg-base-100/50 flex flex-wrap gap-2 content-start">
                      {selectedReviewers.length === 0 ? (
                        <span className="text-xs font-bold opacity-30 uppercase tracking-widest w-full text-center py-2">
                          No Reviewers Selected
                        </span>
                      ) : (
                        selectedReviewers.map(userId => {
                          const reviewer = documentReviewers.find(r => r.user === userId);
                          return (
                            <div key={userId} className="badge badge-primary gap-2 px-4 py-3 font-bold text-xs tracking-wider">
                              {reviewer?.username || userId}
                              <button
                                onClick={() => handleToggleReviewer(userId)}
                                className="hover:text-white/80 transition-colors"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          );
                        })
                      )}
                    </div>

                    {/* Search / Dropdown Area */}
                    <div className="relative group">
                      <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40" size={18} />
                        <input
                          type="text"
                          className="input input-bordered w-full h-14 bg-base-300/20 border-base-300/40 rounded-2xl pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-warning/20 transition-all group-hover:bg-base-300/30"
                          placeholder="Search to add reviewer..."
                          value={reviewerSearch}
                          onChange={(e) => setReviewerSearch(e.target.value)}
                          onFocus={() => setShowDropdown(true)}
                          onClick={() => setShowDropdown(true)}
                          onBlur={() => {
                            // Delay allows the click event on the dropdown buttons to fire before closing
                            setTimeout(() => setShowDropdown(false), 200);
                          }}
                        />
                      </div>

                      {/* Dropdown List - Contextual Positioning + State Controlled */}
                      {showDropdown && (
                        <div className="absolute bottom-full left-0 w-full mb-2 bg-base-100 border border-base-300/20 rounded-2xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto custom-scrollbar z-[100] animate-in fade-in slide-in-from-bottom-2 duration-200">
                          {availableReviewers.length > 0 ? (
                            availableReviewers.map(r => (
                              <button
                                key={r.user}
                                onMouseDown={(e) => {
                                    // Use onMouseDown to prevent blur from closing menu before click is registered
                                    e.preventDefault(); 
                                    handleToggleReviewer(r.user);
                                    setReviewerSearch("");
                                }}
                                className="w-full flex items-center justify-between px-4 py-3 hover:bg-primary/10 transition-colors border-b border-base-300/5 last:border-0 text-left"
                              >
                                <span className="font-bold text-sm">{r.username}</span>
                                <div className="text-[10px] font-black uppercase opacity-40 bg-base-300/30 px-2 py-1 rounded">Click to Add</div>
                              </button>
                            ))
                          ) : (
                            <div className="p-4 text-center text-xs font-bold opacity-40 uppercase tracking-widest">
                              {reviewerSearch ? "No matching reviewers" : "No available reviewers"}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <button
                      className={`btn h-14 px-8 rounded-2xl border-none transition-all duration-300 w-full font-black uppercase text-[12px] tracking-widest relative z-10
                ${selectedReviewers.length === 0 || submitting || documentReviewers.length === 0
                          ? 'bg-base-300/50 text-base-content/30 cursor-not-allowed'
                          : 'bg-warning text-warning-content hover:shadow-[0_0_40px_-10px_rgba(251,191,36,0.5)] shadow-xl shadow-warning/20 hover:scale-[1.01]'
                        }`}
                      onClick={async () => { await handleRequestReview(); window.location.reload(); }}
                      disabled={selectedReviewers.length === 0 || submitting || isDeleted}
                    >
                      {submitting ? (
                        <span className="loading loading-spinner loading-sm"></span>
                      ) : (
                        <span>Initiate Sequence</span>
                      )}
                    </button>
                  </div>
                </div>
              </GlassCard>
            ) : (
              <div className="w-full py-20 flex flex-col items-center justify-center border border-dashed border-primary/20 rounded-[2.5rem] bg-primary/5 transition-all relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent h-1/2 w-full animate-scan pointer-events-none" />
                <div className="relative mb-8">
                  <ShieldCheck size={80} className="text-primary opacity-20" />
                  <div className="absolute inset-0 animate-pulse bg-primary/20 blur-[40px] rounded-full" />
                </div>
                <div className="text-center relative z-10 space-y-3">
                  <span className="text-[14px] font-black uppercase tracking-[0.6em] text-primary opacity-60 block">
                    Protocol Active: Awaiting Verification
                  </span>
                  <p className="text-[10px] opacity-40 font-bold uppercase tracking-[0.3em]">
                    System Integrity Lock Engaged — Manual Overrides Disabled
                  </p>
                </div>
              </div>
            )}
          </div>
        </Animate>

        {/* REVIEW STATUS SECTION */}
        {reviews.length > 0 && (
          <Animate delay={0.15}>
            <div className="w-full">
              <div className="flex items-center gap-3 mb-6">
                <ShieldCheck className="text-warning" size={20} />
                <h2 className="text-xl font-black uppercase tracking-[0.2em]">
                  Review Committee Status
                </h2>
              </div>

              <GlassCard className="p-8 border-warning/5 shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="table w-full">
                    <thead>
                      <tr className="text-secondary uppercase text-[10px] tracking-[0.2em] font-black border-b border-base-300/10">
                        <th className="pb-4 pl-4">Reviewer</th>
                        <th className="pb-4 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-base-300/5">
                      {reviews.map((review) => {
                        const statusDetails = getStatusDetails(review.status);
                        const StatusIcon = statusDetails.icon;

                        return (
                          <tr key={review.id} className="hover:bg-base-200/30 transition-colors">
                            <td className="py-4 pl-4">
                              <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-base-300/20 overflow-hidden ring-1 ring-primary/20">
                                  <img
                                    src={review.reviewer_avatar || `https://ui-avatars.com/api/?name=${review.reviewer_name || review.reviewer_username}`}
                                    alt={review.reviewer_name || "Reviewer"}
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-sm font-bold text-base-content">
                                    {review.reviewer_name || review.reviewer_username || `User ID: ${review.reviewer}`}
                                  </span>
                                  {review.reviewer_comment && (
                                    <span className="text-xs text-base-content/50 italic truncate max-w-[200px]">
                                      "{review.reviewer_comment}"
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="py-4 text-center">
                              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-[10px] font-black uppercase border
                                ${statusDetails.bg} 
                                ${statusDetails.color} 
                                ${statusDetails.border}
                              `}>
                                <StatusIcon size={12} />
                                {statusDetails.label}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </GlassCard>
            </div>
          </Animate>
        )}

        {/* PREVIEW SECTION */}
        <Animate delay={0.2}>
          <div className="mt-16 space-y-8">
            <div className="flex items-center gap-3">
              <Eye className="text-primary" size={18} />
              <h2 className="text-xl font-black uppercase tracking-[0.2em]">
                Artifact Preview
              </h2>
            </div>

            <div className="rounded-[2rem] border border-base-300/20 bg-base-200/10 backdrop-blur-xl p-8 min-h-[400px]">
              {fileType === "pdf" && (
                <iframe
                  src={version.file_path}
                  title="PDF Preview"
                  className="w-full h-[700px] rounded-2xl border border-base-300/20 shadow-2xl"
                />
              )}

              {(fileType === "markdown" || fileType === "text") && (
                <div className="bg-base-300/20 p-8 rounded-2xl border border-base-300/10">
                  <pre className="text-xs whitespace-pre-wrap font-mono opacity-80 leading-relaxed">
                    {previewContent || "Loading internal data buffers..."}
                  </pre>
                </div>
              )}

              {fileType === "unknown" && (
                <div className="flex flex-col items-center justify-center py-20 opacity-30">
                  <FileText size={48} className="mb-4" />
                  <p className="text-[10px] font-black uppercase tracking-widest">
                    Visual preview unavailable for this file format.
                  </p>
                </div>
              )}
            </div>
          </div>
        </Animate>
      </div>
    </section>
  );
}

export default VersionDetailsPage;