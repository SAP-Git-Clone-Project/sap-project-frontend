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
import FileStatus from "./homepage/components/FileStatus.jsx";
import GlassCard from "./homepage/components/GlassCard.jsx";

const mockDocuments = [
  {
    id: 1,
    title: "Employee Handbook",
    description:
      "Internal company handbook with updated onboarding policies and employee guidelines.",
    author: "Ivan Petrov",
    status: "APPROVED",
    activeVersion: "v3",
    createdAt: "2026-03-01",
    updatedAt: "2026-03-15",
  },
  {
    id: 2,
    title: "Security Policy",
    description:
      "Security rules and internal access requirements for company systems.",
    author: "Georgi Ivanov",
    status: "PENDING",
    activeVersion: "v1",
    createdAt: "2026-03-03",
    updatedAt: "2026-03-14",
  },
  {
    id: 3,
    title: "Quarterly Planning",
    description:
      "Quarterly planning draft for team goals, milestones, and priorities.",
    author: "Maria Dimitrova",
    status: "DRAFT",
    activeVersion: "v2",
    createdAt: "2026-03-05",
    updatedAt: "2026-03-12",
  },
  {
    id: 4,
    title: "Vendor Agreement",
    description:
      "Agreement document version history with approval and rejection states.",
    author: "Nikolay Stoyanov",
    status: "REJECTED",
    activeVersion: "v1",
    createdAt: "2026-03-02",
    updatedAt: "2026-03-11",
  },
];

const mockVersionsByDocument = {
  1: [
    {
      id: 101,
      versionNumber: "v3",
      status: "APPROVED",
      approvalStatus: "APPROVED",
      author: "Ivan Petrov",
      createdAt: "2026-03-15",
      isActive: true,
      summary: "Added onboarding updates and policy clarifications.",
    },
    {
      id: 102,
      versionNumber: "v2",
      status: "PENDING",
      approvalStatus: "PENDING",
      author: "Ivan Petrov",
      createdAt: "2026-03-10",
      isActive: false,
      summary: "Submitted revised handbook for review.",
    },
    {
      id: 103,
      versionNumber: "v1",
      status: "APPROVED",
      approvalStatus: "APPROVED",
      author: "Maria Dimitrova",
      createdAt: "2026-03-02",
      isActive: false,
      summary: "Initial approved version of the employee handbook.",
    },
    {
      id: 104,
      versionNumber: "v0.9",
      status: "REJECTED",
      approvalStatus: "REJECTED",
      author: "Georgi Ivanov",
      createdAt: "2026-03-01",
      isActive: false,
      summary: "Rejected due to missing mandatory compliance notes.",
    },
  ],
  2: [
    {
      id: 201,
      versionNumber: "v1",
      status: "PENDING",
      approvalStatus: "PENDING",
      author: "Georgi Ivanov",
      createdAt: "2026-03-14",
      isActive: true,
      summary: "Initial version waiting for review.",
    },
  ],
  3: [
    {
      id: 301,
      versionNumber: "v2",
      status: "DRAFT",
      approvalStatus: "PENDING",
      author: "Maria Dimitrova",
      createdAt: "2026-03-12",
      isActive: true,
      summary: "Draft update for quarterly priorities.",
    },
    {
      id: 302,
      versionNumber: "v1",
      status: "APPROVED",
      approvalStatus: "APPROVED",
      author: "Maria Dimitrova",
      createdAt: "2026-03-08",
      isActive: false,
      summary: "Initial approved planning version.",
    },
  ],
  4: [
    {
      id: 401,
      versionNumber: "v1",
      status: "REJECTED",
      approvalStatus: "REJECTED",
      author: "Nikolay Stoyanov",
      createdAt: "2026-03-11",
      isActive: true,
      summary: "Rejected because approval notes were missing.",
    },
  ],
};

function getStatusClasses(status) {
  switch (status) {
    case "APPROVED":
      return "badge-success";
    case "PENDING":
      return "badge-warning";
    case "DRAFT":
      return "badge-info";
    case "REJECTED":
      return "badge-error";
    default:
      return "badge-ghost";
  }
}

function getStatusIcon(status) {
  switch (status) {
    case "APPROVED":
      return <CheckCircle2 size={14} />;
    case "PENDING":
      return <Clock3 size={14} />;
    case "DRAFT":
      return <PencilLine size={14} />;
    case "REJECTED":
      return <XCircle size={14} />;
    default:
      return <FileText size={14} />;
  }
}

export default function DocumentDetailsPage() {
  const { id } = useParams();

  const numericId = Number(id);
  const document = mockDocuments.find((doc) => doc.id === numericId);
  const versions = mockVersionsByDocument[numericId] || [];

  if (!document) {
    return (
      <section className="px-6 py-12 overflow-x-hidden">
        <div className="mx-auto max-w-5xl">
          <div className="card border border-base-300 bg-base-200/70 backdrop-blur shadow-sm">
            <div className="card-body items-center text-center">
              <h1 className="text-2xl font-bold">Document not found</h1>
              <p className="text-base-content/60 mt-1">
                The requested document does not exist in the current mock data.
              </p>
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
  }

  return (
    <section className="px-6 py-12 overflow-x-hidden space-y-12">
      {/* Header Links */}
      <Animate variant="fade-down">
        <div className="flex items-center justify-between gap-3 max-w-7xl mx-auto">
          {/* Back button */}
          <Animate>
            <Link
              to="/documents"
              className="btn btn-sm btn-ghost border border-base-300 hover:white hover:text-white transition w-fit"
            >
              <ArrowLeft size={16} />
              Back to Documents
            </Link>
          </Animate>

          <Link
            to={`/documents/${id}/create-version`}
            className="btn btn-primary gap-2 shadow-md shadow-primary/30"
          >
            <GitBranchPlus size={18} />
            Create Version
          </Link>
        </div>
      </Animate>

      {/* Document Hero with Stats */}
      <Animate>
        <div className="hero rounded-3xl border border-base-300 bg-base-200/70 backdrop-blur shadow-sm max-w-7xl mx-auto">
          <div className="hero-content w-full flex-col items-start gap-6 py-8 lg:flex-row lg:items-start">
            {/* Left-aligned content */}
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

              {/* Modern Status & Active Version Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm shadow-md ${
                    document.status === "APPROVED"
                      ? "bg-success text-white shadow-success/30"
                      : document.status === "PENDING"
                        ? "bg-warning text-white shadow-warning/30"
                        : document.status === "DRAFT"
                          ? "bg-info text-white shadow-info/30"
                          : document.status === "REJECTED"
                            ? "bg-error text-white shadow-error/30"
                            : "bg-base-300 text-base-content shadow-sm"
                  }`}
                >
                  {getStatusIcon(document.status)}
                  {document.status}
                </span>

                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm text-white bg-primary shadow-md shadow-primary/30 border border-primary">
                  <FileText size={14} />
                  Active {document.activeVersion}
                </span>
              </div>

              {/* Author & Last Updated */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <div className="inline-flex items-center gap-2 text-sm text-base-content/60">
                  <User size={16} />
                  <span>Author:</span>
                  <span className="font-medium text-base text-base-content">
                    {document.author}
                  </span>
                </div>

                <div className="inline-flex items-center gap-2 text-sm text-base-content/60">
                  <CalendarDays size={16} />
                  <span>Last Updated:</span>
                  <span className="font-medium text-base text-base-content">
                    {document.updatedAt}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Animate>

      {/* Document Information & Version History */}
      <Animate>
        <div className="max-w-7xl mx-auto grid gap-6 xl:grid-cols-3">
          {/* Document Information */}
          <div className="card border border-base-300 bg-base-200/70 backdrop-blur shadow-sm xl:col-span-1">
            <div className="card-body space-y-5">
              <h2 className="card-title text-xl">Document Information</h2>
              {[
                ["Document ID", document.id],
                ["Title", document.title],
                ["Description", document.description],
                ["Created By", document.author],
                ["Created At", document.createdAt],
                ["Updated At", document.updatedAt],
              ].map(([label, value]) => (
                <div key={label} className="space-y-1">
                  <p className="text-sm text-base-content/60">{label}</p>
                  <p className="font-medium text-base">{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Version History Table */}
          <div className="card border border-base-300 bg-base-200/70 backdrop-blur shadow-sm xl:col-span-2">
            <div className="card-body gap-4">
              <div>
                <h2 className="card-title text-xl">Version History</h2>
                <p className="text-sm text-base-content/70">
                  Review the full version timeline, current status, and active
                  release of this document.
                </p>
              </div>

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
                        {/* Version */}
                        <td>
                          <div className="flex flex-col gap-1">
                            <span className="font-semibold text-base">
                              {version.versionNumber}
                            </span>
                            {version.isActive && (
                              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary text-white text-sm font-semibold shadow-md shadow-primary/30">
                                Active
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Status */}
                        <td className="text-center">
                          <div className="flex justify-center">
                            <FileStatus status={version.status.toLowerCase()} />
                          </div>
                        </td>

                        {/* Author */}
                        <td className="text-base-content/90">
                          {version.author}
                        </td>

                        {/* Created At */}
                        <td className="text-base-content/70 whitespace-nowrap">
                          {version.createdAt}
                        </td>

                        {/* Summary */}
                        <td className="max-w-xs">
                          <span className="line-clamp-2 text-sm text-base-content/60">
                            {version.summary}
                          </span>
                        </td>

                        {/* Action */}
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
    </section>
  );
}
