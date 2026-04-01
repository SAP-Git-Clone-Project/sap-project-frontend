import {
  FileText,
  Plus,
  Search,
  Eye,
  Clock3,
  CheckCircle2,
  PencilLine,
  FileBadge,
  FileLock2,
} from "lucide-react";

import Animate from "@/components/animation/Animate.jsx";
import GlassCard from "../homepage/components/GlassCard.jsx";
import FileStatus from "../homepage/components/FileStatus.jsx";

import { Link } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";
import api from "@/components/api/api";
import notify from "@/components/toaster/notify";

const FILTERS = ["all", "approved", "pending_approval", "draft", "rejected"];

function getDocumentIcon(type) {
  switch (type) {
    case "policy":
      return <FileBadge size={18} />;
    case "security":
      return <FileLock2 size={18} />;
    case "contract":
      return <FileText size={18} />;
    case "planning":
      return <PencilLine size={18} />;
    default:
      return <FileText size={18} />;
  }
}

export default function DocumentsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch documents
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const res = await api.get("/documents/");
        setDocuments(res.data);
      } catch (err) {
        notify.error("Failed to load documents");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDocuments();
  }, []);

  // Filtered documents
  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      const versionStatus = doc.active_version?.status; // undefined if no active version

      const matchesFilter =
        filter === "all" || (versionStatus && versionStatus === filter);

      const matchesSearch = doc.title.toLowerCase().includes(search.toLowerCase());

      return matchesFilter && matchesSearch;
    });
  }, [documents, filter, search]);

  // Stats
  const stats = useMemo(() => {
    const approved = documents.filter((d) => d.active_version?.status === "approved")
      .length;
    const pending = documents.filter(
      (d) => d.active_version?.status === "pending_approval"
    ).length;
    const draft = documents.filter((d) => d.active_version?.status === "draft").length;
    const total = documents.length;
    return { total, approved, pending, draft };
  }, [documents]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-lg font-semibold text-base-content/60">Loading documents...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 px-6 pb-12 pt-16 overflow-x-hidden">
      {/* Header */}
      <Animate variant="fade-down">
        <div className="max-w-6xl mx-auto space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Documents</h1>
          <p className="text-base-content/60">
            Browse documents, track status, and manage versions.
          </p>
        </div>
      </Animate>

      {/* Stats */}
      <Animate>
        <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-5">
          <GlassCard bg="bg-primary/10" border="border-primary/20">
            <div className="card bg-base-200/70 border border-base-300/40 backdrop-blur p-4 text-center">
              <FileText className="mx-auto mb-1 text-primary" size={18} />
              <p className="text-xl font-bold">{stats.total}</p>
              <p className="text-xs text-base-content/60">Total</p>
            </div>
          </GlassCard>

          <GlassCard bg="bg-success/10" border="border-success/20">
            <div className="card bg-base-200/70 border border-base-300/40 backdrop-blur p-4 text-center">
              <CheckCircle2 className="mx-auto mb-1 text-success" size={18} />
              <p className="text-xl font-bold">{stats.approved}</p>
              <p className="text-xs text-base-content/60">Approved</p>
            </div>
          </GlassCard>

          <GlassCard bg="bg-warning/10" border="border-warning/20">
            <div className="card bg-base-200/70 border border-base-300/40 backdrop-blur p-4 text-center">
              <Clock3 className="mx-auto mb-1 text-warning" size={18} />
              <p className="text-xl font-bold">{stats.pending}</p>
              <p className="text-xs text-base-content/60">Pending</p>
            </div>
          </GlassCard>

          <GlassCard bg="bg-info/10" border="border-info/20">
            <div className="card bg-base-200/70 border border-base-300/40 backdrop-blur p-4 text-center">
              <PencilLine className="mx-auto mb-1 text-info" size={18} />
              <p className="text-xl font-bold">{stats.draft}</p>
              <p className="text-xs text-base-content/60">Drafts</p>
            </div>
          </GlassCard>
        </div>
      </Animate>

      {/* Filters + Search */}
      <Animate>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Filters */}
          <div className="flex gap-2 flex-wrap">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`btn btn-sm ${
                  filter === f ? "btn-primary" : "btn-ghost border border-base-300"
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50 pointer-events-none z-10"
            />
            <input
              type="text"
              placeholder="Search documents..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input input-sm w-full pl-10 bg-base-200/70 backdrop-blur border border-base-300/40 focus:border-primary transition"
            />
          </div>

          <Link
            to="/documents/create"
            className="btn btn-sm btn-primary shadow-md shadow-primary/30"
          >
            <Plus size={16} /> Create Document
          </Link>
        </div>
      </Animate>

      {/* Document table */}
      <Animate>
        <div className="max-w-7xl mx-auto">
          <div className="card bg-base-200/70 border border-base-300/40 backdrop-blur shadow-sm overflow-x-auto">
            <table className="table text-base">
              <thead className="bg-base-300/40 text-base-content/80">
                <tr className="h-[64px]">
                  <th className="text-sm font-semibold">Document</th>
                  <th className="text-sm font-semibold">Author</th>
                  <th className="text-sm font-semibold text-center">Status</th>
                  <th className="text-sm font-semibold text-center">Version</th>
                  <th className="text-sm font-semibold">Updated</th>
                  <th className="text-sm font-semibold text-right">Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredDocuments.map((doc) => (
                  <tr
                    key={doc.id}
                    className="hover:bg-base-300/30 transition h-[76px]"
                  >
                    {/* Document */}
                    <td>
                      <div className="flex items-start gap-3">
                        <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                          {getDocumentIcon(doc.type)}
                        </div>

                        <div className="flex flex-col">
                          <span className="font-semibold text-base">{doc.title}</span>
                          <span className="text-sm text-base-content/60">
                            {doc.active_version?.content || "No active version"}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Author */}
                    <td className="text-base-content/90">
                      {doc.active_version?.creator_name || doc.created_by_username}
                    </td>

                    {/* Status */}
                    <td className="text-center">
                      <div className="flex justify-center">
                        <FileStatus status={doc.active_version?.status || "no_active"} />
                      </div>
                    </td>

                    {/* Version */}
                    <td className="text-center">
                      <span className="badge badge-outline badge-md">
                        {doc.active_version ? `v${doc.active_version.version_number}` : "N/A"}
                      </span>
                    </td>

                    {/* Updated */}
                    <td>{new Date(doc.updated_at).toLocaleDateString()}</td>

                    {/* Action */}
                    <td className="text-right">
                      <Link
                        to={`/documents/${doc.id}`}
                        className="btn btn-sm btn-primary shadow-md shadow-primary/30"
                      >
                        <Eye size={16} /> Open →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredDocuments.length === 0 && (
              <p className="p-4 text-center text-base-content/60">
                No documents match your search or filter.
              </p>
            )}
          </div>
        </div>
      </Animate>
    </div>
  );
}