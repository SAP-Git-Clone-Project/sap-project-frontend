import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Clock3,
  FileText,
  CheckCircle2,
  XCircle,
  PencilLine,
  GitBranchPlus,
  User,
  CalendarDays,
  History,
  Eye,
} from "lucide-react";

import Animate from "@/components/animation/Animate.jsx";
import FileStatus from "../homepage/components/FileStatus.jsx";
import GlassCard from "../homepage/components/GlassCard.jsx";
import api from "@/components/api/api.js";

function getStatusIcon(status) {
  switch (status?.toLowerCase()) {
    case "approved":
      return <CheckCircle2 size={14} />;
    case "pending_approval":
    case "pending":
      return <Clock3 size={14} />;
    case "draft":
      return <PencilLine size={14} />;
    case "rejected":
      return <XCircle size={14} />;
    default:
      return <FileText size={14} />;
  }
}

export default function DocumentDetailsPage() {
  const { id } = useParams();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const res = await api.get(`/documents/${id}/`);
        setDocument(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load document");
      } finally {
        setLoading(false);
      }
    };
    fetchDocument();
  }, [id]);

  if (loading) return <p className="text-center mt-12">Loading...</p>;
  if (error || !document)
    return (
      <section className="px-6 py-12 overflow-x-hidden">
        <div className="mx-auto max-w-5xl">
          <div className="card border border-base-300 bg-base-200/70 backdrop-blur shadow-sm">
            <div className="card-body items-center text-center">
              <h1 className="text-2xl font-bold">Document not found</h1>
              <p className="text-base-content/60 mt-1">{error || "Document not found"}</p>
              <Link
                to="/documents"
                className="btn btn-primary mt-4 shadow-md shadow-primary/30"
              >
                Back to Documents
              </Link>
            </div>
          </div>
        </div>
      </section>
    );

  const versions = document.versions || [];
  const activeVersion = document.active_version || (versions.length ? versions[0] : null);

  const { user } = useAuth();
  const isOwner = document.created_by_username === user?.username;

  return (
    <section className="px-6 py-12 overflow-x-hidden space-y-12">
      {/* Header Links */}
      <Animate variant="fade-down">
        <div className="flex items-center justify-between gap-3 max-w-7xl mx-auto">
          <Animate>
            <Link
              to="/documents"
              className="btn btn-sm btn-ghost border border-base-300 hover:white hover:text-white transition w-fit"
            >
              <ArrowLeft size={16} />
              Back to Documents
            </Link>
          </Animate>

          {isOwner && (<Link
            to={`/documents/${id}/create-version`}
            className="btn btn-primary gap-2 shadow-md shadow-primary/30"
          >
            <GitBranchPlus size={18} />
            Create Version
          </Link>
          )}
        </div>
      </Animate>

      {/* Document Hero */}
      <Animate>
        <div className="hero rounded-3xl border border-base-300 bg-base-200/70 backdrop-blur shadow-sm max-w-7xl mx-auto">
          <div className="hero-content w-full flex-col items-start gap-6 py-8 lg:flex-row lg:items-start">
            <div className="space-y-4 flex-1">
              <div className="flex items-center gap-2 text-sm text-base-content/60">
                <History size={16} />
                <span>Document Details</span>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                {document.title}
              </h1>

              <p className="max-w-3xl text-base-content/70 leading-relaxed">
                {document.description}
              </p>

              {/* Status & Active Version */}
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm shadow-md ${
                    activeVersion?.status?.toLowerCase() === "approved"
                      ? "bg-success text-white shadow-success/30"
                      : activeVersion?.status?.toLowerCase() === "pending_approval"
                      ? "bg-warning text-white shadow-warning/30"
                      : activeVersion?.status?.toLowerCase() === "draft"
                      ? "bg-info text-white shadow-info/30"
                      : activeVersion?.status?.toLowerCase() === "rejected"
                      ? "bg-error text-white shadow-error/30"
                      : "bg-base-300 text-base-content shadow-sm"
                  }`}
                >
                  {getStatusIcon(activeVersion?.status)}
                  {activeVersion?.status || "N/A"}
                </span>

                {activeVersion && (
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm text-white bg-primary shadow-md shadow-primary/30 border border-primary">
                    <FileText size={14} />
                    Active {activeVersion.version_number || "N/A"}
                  </span>
                )}
              </div>

              {/* Author & Last Updated */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <div className="inline-flex items-center gap-2 text-sm text-base-content/60">
                  <User size={16} />
                  <span>Author:</span>
                  <span className="font-medium text-base text-base-content">
                    {document.created_by_username}
                  </span>
                </div>

                <div className="inline-flex items-center gap-2 text-sm text-base-content/60">
                  <CalendarDays size={16} />
                  <span>Last Updated:</span>
                  <span className="font-medium text-base text-base-content">
                    {new Date(document.updated_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Animate>

      {/* Version History: only if user is creator */}
      {isOwner /*&& versions.length > 1*/ && (
        <Animate>
          <div className="max-w-7xl mx-auto">
            <div className="card border border-base-300 bg-base-200/70 backdrop-blur shadow-sm">
              <div className="card-body gap-4">
                <h2 className="card-title text-xl">Version History</h2>
                <p className="text-sm text-base-content/70">
                  Full version timeline, current status, and active release.
                </p>

                <div className="overflow-x-auto rounded-2xl border border-base-300 shadow-sm">
                  <table className="table text-base">
                    <thead className="bg-base-300/40 text-base-content/80">
                      <tr className="h-12">
                        <th>Version</th>
                        <th>Status</th>
                        <th>Author</th>
                        <th>Created At</th>
                        <th>Summary</th>
                        <th className="text-right"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {versions.map((version) => (
                        <tr
                          key={version.id}
                          className="hover:bg-base-300/30 transition h-[76px]"
                        >
                          <td>
                            <div className="flex flex-col gap-1">
                              <span className="font-semibold text-base">
                                {version.version_number}
                              </span>
                              {version.is_active && (
                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary text-white text-sm font-semibold shadow-md shadow-primary/30">
                                  Active
                                </span>
                              )}
                            </div>
                          </td>

                          <td className="text-center">
                            <div className="flex justify-center">
                              <FileStatus status={version.status.toLowerCase()} />
                            </div>
                          </td>

                          <td className="text-base-content/90">{version.created_by_username || version.author}</td>

                          <td className="text-base-content/70 whitespace-nowrap">
                            {new Date(version.created_at).toLocaleDateString()}
                          </td>

                          <td className="max-w-xs">
                            <span className="line-clamp-2 text-sm text-base-content/60">
                              {version.summary || "-"}
                            </span>
                          </td>

                          <td className="text-right">
                            <button className="btn btn-sm btn-primary gap-2 min-w-[90px]">
                              <Eye size={16} />
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="alert border border-base-300 bg-base-100 shadow-sm">
                  <span className="text-sm text-base-content/70">
                    Only approved versions should become active. Rejected versions
                    remain visible in history.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Animate>
      )}
    </section>
  );
}