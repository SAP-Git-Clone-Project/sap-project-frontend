import {
  FileText,
  Plus,
  Search,
  Eye,
  Clock3,
  CheckCircle2,
  XCircle,
  PencilLine,
  FileBadge,
  FileLock2,
} from "lucide-react";

import Animate from "@/components/animation/Animate.jsx";
import GlassCard from "../homepage/components/GlassCard.jsx";
import FileStatus from "../homepage/components/FileStatus.jsx";

import { Link } from "react-router-dom";
import { useMemo, useState } from "react";

const FILTERS = ["all", "approved", "pending", "draft", "rejected"];

const mockDocuments = [
  {
    id: 1,
    title: "Employee Handbook",
    author: "Ivan Petrov",
    status: "approved",
    activeVersion: "v3",
    updatedAt: "2026-03-15",
    description: "Internal company handbook with updated onboarding policies.",
    type: "policy",
  },
  {
    id: 2,
    title: "Security Policy",
    author: "Georgi Ivanov",
    status: "pending",
    activeVersion: "v1",
    updatedAt: "2026-03-14",
    description: "Pending review for revised security and access rules.",
    type: "security",
  },
  {
    id: 3,
    title: "Quarterly Planning",
    author: "Maria Dimitrova",
    status: "draft",
    activeVersion: "v2",
    updatedAt: "2026-03-12",
    description: "Planning draft for upcoming quarter goals.",
    type: "planning",
  },
  {
    id: 4,
    title: "Vendor Agreement",
    author: "Nikolay Stoyanov",
    status: "rejected",
    activeVersion: "v1",
    updatedAt: "2026-03-11",
    description: "Rejected version due to missing approval notes.",
    type: "contract",
  },
];

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

  const filteredDocuments = useMemo(() => {
    return mockDocuments.filter((doc) => {
      const matchesFilter = filter === "all" || doc.status === filter;

      const matchesSearch =
        doc.title.toLowerCase().includes(search.toLowerCase()) ||
        doc.author.toLowerCase().includes(search.toLowerCase());

      return matchesFilter && matchesSearch;
    });
  }, [search, filter]);

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

              <p className="text-xl font-bold">{mockDocuments.length}</p>

              <p className="text-xs text-base-content/60">Total</p>
            </div>
          </GlassCard>

          <GlassCard bg="bg-success/10" border="border-success/20">
            <div className="card bg-base-200/70 border border-base-300/40 backdrop-blur p-4 text-center">
              <CheckCircle2 className="mx-auto mb-1 text-success" size={18} />

              <p className="text-xl font-bold">
                {mockDocuments.filter((d) => d.status === "approved").length}
              </p>

              <p className="text-xs text-base-content/60">Approved</p>
            </div>
          </GlassCard>

          <GlassCard bg="bg-warning/10" border="border-warning/20">
            <div className="card bg-base-200/70 border border-base-300/40 backdrop-blur p-4 text-center">
              <Clock3 className="mx-auto mb-1 text-warning" size={18} />

              <p className="text-xl font-bold">
                {mockDocuments.filter((d) => d.status === "pending").length}
              </p>

              <p className="text-xs text-base-content/60">Pending</p>
            </div>
          </GlassCard>

          <GlassCard bg="bg-info/10" border="border-info/20">
            <div className="card bg-base-200/70 border border-base-300/40 backdrop-blur p-4 text-center">
              <PencilLine className="mx-auto mb-1 text-info" size={18} />

              <p className="text-xl font-bold">
                {mockDocuments.filter((d) => d.status === "draft").length}
              </p>

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
                  filter === f
                    ? "btn-primary"
                    : "btn-ghost border border-base-300"
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
            to="/create"
            className="btn btn-sm btn-primary shadow-md shadow-primary/30"
          >
            <Plus size={16} />
            Create Document
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
                          <span className="font-semibold text-base">
                            {doc.title}
                          </span>

                          <span className="text-sm text-base-content/60">
                            {doc.description}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Author */}

                    <td className="text-base-content/90">{doc.author}</td>

                    {/* Status */}

                    <td className="text-center">
                      <div className="flex justify-center">
                        <FileStatus status={doc.status} />
                      </div>
                    </td>

                    {/* Version */}

                    <td className="text-center">
                      <span className="badge badge-outline badge-md">
                        {doc.activeVersion}
                      </span>
                    </td>

                    {/* Updated */}

                    <td className="text-base-content/70">{doc.updatedAt}</td>

                    {/* Action */}

                    <td className="text-right">
                      <Link
                        to={`/documents/${doc.id}`}
                        className="btn btn-sm btn-primary shadow-md shadow-primary/30"
                      >
                        <Eye size={16} />
                        Open →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Animate>
    </div>
  );
}
