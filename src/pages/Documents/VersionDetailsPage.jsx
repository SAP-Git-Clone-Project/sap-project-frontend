import React, { useState, useEffect, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft, Clock3, FileText, CheckCircle2, XCircle,
  PencilLine, User, CalendarDays, ShieldCheck,
  Info, HardDrive, Hash, Eye,
} from "lucide-react";

import Animate from "@/components/animation/Animate.jsx";
import GlassCard from "@/components/widgets/GlassCard.jsx";
import Loader from "@/components/widgets/Loader.jsx";
import MissingArtifact from "@/components/widgets/MissingArtifact.jsx";
import api from "@/components/api/api.js";
import { useAuth } from "@/context/AuthContext.jsx";

const STATUS_CONFIG = {
  approved: { icon: CheckCircle2, color: "text-success", bg: "bg-success/10", border: "border-success/20", label: "Approved" },
  pending_approval: { icon: Clock3, color: "text-warning", bg: "bg-warning/10", border: "border-warning/20", label: "Pending Approval" },
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const versionRes = await api.get(`/versions/${id}/`);
        const versionData = versionRes.data;

        setVersion(versionData);

        // Fetch parent document
        const docRes = await api.get(`/documents/${versionData.document}/`);
        setDocument(docRes.data);

      } catch (err) {
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

    // Only fetch text-based files
    if (type === "markdown" || type === "text") {
      fetch(version.file_path)
        .then((res) => res.text())
        .then((data) => {
          setPreviewContent(data.slice(0, 2000)); // limit size
        })
        .catch(() => {
          setPreviewContent("Preview unavailable.");
        });
    }
  }, [version]);

  const statusInfo = getStatusDetails(version?.status);
  const isOwner =
    document?.created_by_username === user?.username ||
    user?.is_superuser;

  if (loading) {
    return (
      <Loader message="Loading version details..." />
    );
  }

  if (error || !version) {
    return (
      <MissingArtifact
        title="Version Not Found"
        message="The requested version for this document is missing from the system registry. It may have been redacted, purged, or moved to a restricted sector."
        linkText="Return to Documents"
        linkTo={`/documents`}
      />
    );
  }

  return (
    <section className="px-6 py-20 min-h-screen bg-base-100">
      <div className="max-w-7xl mx-auto space-y-16">

        {/* NAV */}
        <Animate variant="fade-down">
          <div className="flex justify-between border-b pb-6">
            <Link to={`/documents/${document?.id}`} className="btn btn-ghost btn-sm">
              <ArrowLeft size={14} />
              Back to Document
            </Link>
          </div>
        </Animate>

        {/* HEADER */}
        <Animate>
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-primary text-xs uppercase tracking-widest opacity-60">
              <ShieldCheck size={12} />
              Version Archive
            </div>

            <h1 className="text-5xl font-black">
              Version {version.version_number}
            </h1>

            <p className="text-base-content/60 font-medium">
              {document?.title}
            </p>
          </div>
        </Animate>

        {/* CONTENT */}
        <div className="grid lg:grid-cols-2 gap-12">

          {/* DESCRIPTION */}
          <Animate>
            <div className="p-10 rounded-3xl bg-base-200/20 border backdrop-blur-md">
              <h3 className="text-xs uppercase opacity-40 mb-4 flex gap-2">
                <Info size={14} />
                Remarks
              </h3>
              <p className="opacity-70">
                {version.content || "No summary provided."}
              </p>
            </div>
          </Animate>

          {/* SIDEBAR */}
          <Animate delay={0.1}>
            <GlassCard className="p-8 space-y-8">

              {/* STATUS */}
              <div>
                <span className="text-xs uppercase opacity-40">Status</span>
                <div className={`mt-2 px-4 py-2 rounded-xl border ${statusInfo.border} ${statusInfo.bg} ${statusInfo.color}`}>
                  <statusInfo.icon size={14} />
                  {statusInfo.label}
                </div>
              </div>

              {/* USER */}
              <div className="flex items-center gap-4">
                <User />
                <div>
                  <p className="text-xs opacity-40">Uploaded By</p>
                  <p className="font-bold">{version.creator_name}</p>
                </div>
              </div>

              {/* DATE */}
              <div className="flex items-center gap-4">
                <CalendarDays />
                <div>
                  <p className="text-xs opacity-40">Created on</p>
                  <p className="font-bold">
                    {new Date(version.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* FILE INFO */}
              <div className="p-6 rounded-2xl bg-primary/10 border flex flex-col gap-4">

                <div className="flex items-center gap-3">
                  <HardDrive size={16} />
                  <span className="text-sm font-bold">
                    {(version.file_size / 1024).toFixed(2)} KB
                  </span>
                </div>

                <div className="flex items-center gap-3 break-all">
                  <Hash size={16} />
                  <span className="text-xs opacity-60">
                    {version.checksum}
                  </span>
                </div>

              </div>

              {/* ACTIVE BADGE */}
              {version.is_active && (
                <div className="p-4 bg-success/10 border border-success/20 rounded-xl text-success font-bold text-center">
                  ACTIVE VERSION
                </div>
              )}

            </GlassCard>
          </Animate>
        </div>

        {/* ACTIONS */}
        {isOwner && (
          <Animate delay={0.2}>
            <div className="flex gap-4">
              <a
                href={version.file_path}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                View File
              </a>
            </div>
          </Animate>
        )}

        <Animate delay={0.2}>
          <div className="mt-16 space-y-6">

            <div className="flex items-center gap-3">
              <Eye className="text-primary" size={18} />
              <h2 className="text-xl font-black uppercase tracking-widest">
                File Preview
              </h2>
            </div>

            <div className="rounded-[2rem] border border-base-300/20 bg-base-200/10 backdrop-blur-xl p-6">

              {/* PDF PREVIEW */}
              {fileType === "pdf" && (
                <iframe
                  src={version.file_path}
                  title="PDF Preview"
                  className="w-full h-[600px] rounded-xl border"
                />
              )}

              {/* MARKDOWN / TEXT PREVIEW */}
              {(fileType === "markdown" || fileType === "text") && (
                <pre className="text-xs whitespace-pre-wrap font-mono opacity-70">
                  {previewContent || "Loading preview..."}
                </pre>
              )}

              {/* FALLBACK */}
              {fileType === "unknown" && (
                <p className="text-sm opacity-50 italic">
                  Preview not supported for this file type.
                </p>
              )}

            </div>
          </div>
        </Animate>

      </div>
    </section>
  );
}

export default VersionDetailsPage;