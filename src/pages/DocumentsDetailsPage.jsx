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
      <section className="px-4 py-8 md:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="card border border-base-300 bg-base-200 shadow-sm">
            <div className="card-body items-center text-center">
              <h1 className="text-2xl font-bold">Document not found</h1>
              <p className="text-base-content/70">
                The requested document does not exist in the current mock data.
              </p>
              <Link to="/documents" className="btn btn-primary mt-2">
                Back to Documents
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 py-8 md:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex items-center justify-between gap-3">
          <Link to="/documents" className="btn btn-ghost btn-sm gap-2">
            <ArrowLeft size={16} />
            Back to Documents
          </Link>

          <Link
            to={`/documents/${id}/create-version`}
            className="btn btn-primary gap-2"
          >
            <GitBranchPlus size={18} />
            Create Version
          </Link>
        </div>

        <div className="hero rounded-3xl border border-base-300 bg-base-200">
          <div className="hero-content w-full flex-col items-start justify-between gap-6 py-8 lg:flex-row lg:items-center">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-base-content/70">
                <History size={16} />
                <span>Document Details</span>
              </div>

              <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                {document.title}
              </h1>

              <p className="max-w-3xl text-base-content/70">
                {document.description}
              </p>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span
                  className={`badge gap-1 ${getStatusClasses(document.status)}`}
                >
                  {getStatusIcon(document.status)}
                  {document.status}
                </span>

                <span className="badge badge-outline gap-1">
                  <FileText size={14} />
                  Active {document.activeVersion}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="card border border-base-300 bg-base-200 shadow-sm">
            <div className="card-body">
              <div className="flex items-center gap-2 text-sm text-base-content/70">
                <User size={16} />
                <span>Author</span>
              </div>
              <h2 className="text-xl font-semibold">{document.author}</h2>
            </div>
          </div>

          <div className="card border border-base-300 bg-base-200 shadow-sm">
            <div className="card-body">
              <div className="flex items-center gap-2 text-sm text-base-content/70">
                <CheckCircle2 size={16} />
                <span>Current Status</span>
              </div>
              <h2 className="text-xl font-semibold">{document.status}</h2>
            </div>
          </div>

          <div className="card border border-base-300 bg-base-200 shadow-sm">
            <div className="card-body">
              <div className="flex items-center gap-2 text-sm text-base-content/70">
                <FileText size={16} />
                <span>Active Version</span>
              </div>
              <h2 className="text-xl font-semibold">
                {document.activeVersion}
              </h2>
            </div>
          </div>

          <div className="card border border-base-300 bg-base-200 shadow-sm">
            <div className="card-body">
              <div className="flex items-center gap-2 text-sm text-base-content/70">
                <CalendarDays size={16} />
                <span>Last Updated</span>
              </div>
              <h2 className="text-xl font-semibold">{document.updatedAt}</h2>
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          <div className="card border border-base-300 bg-base-200 shadow-sm xl:col-span-1">
            <div className="card-body">
              <h2 className="card-title text-xl">Document Information</h2>

              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-base-content/60">Document ID</p>
                  <p className="font-medium">{document.id}</p>
                </div>

                <div>
                  <p className="text-base-content/60">Title</p>
                  <p className="font-medium">{document.title}</p>
                </div>

                <div>
                  <p className="text-base-content/60">Description</p>
                  <p className="leading-6 text-base-content/80">
                    {document.description}
                  </p>
                </div>

                <div>
                  <p className="text-base-content/60">Created By</p>
                  <p className="font-medium">{document.author}</p>
                </div>

                <div>
                  <p className="text-base-content/60">Created At</p>
                  <p className="font-medium">{document.createdAt}</p>
                </div>

                <div>
                  <p className="text-base-content/60">Updated At</p>
                  <p className="font-medium">{document.updatedAt}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card border border-base-300 bg-base-200 shadow-sm xl:col-span-2">
            <div className="card-body gap-4">
              <div>
                <h2 className="card-title text-xl">Version History</h2>
                <p className="text-sm text-base-content/70">
                  Review the full version timeline, current status, and active
                  release of this document.
                </p>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-base-300">
                <table className="table">
                  <thead className="bg-base-300/40">
                    <tr>
                      <th>Version</th>
                      <th>Status</th>
                      <th>Author</th>
                      <th>Created At</th>
                      <th>Summary</th>
                      <th className="text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {versions.map((version) => (
                      <tr key={version.id} className="hover">
                        <td>
                          <div className="flex flex-col gap-1">
                            <span className="font-semibold">
                              {version.versionNumber}
                            </span>
                            {version.isActive && (
                              <span className="badge badge-outline badge-sm w-fit">
                                Active
                              </span>
                            )}
                          </div>
                        </td>

                        <td>
                          <span
                            className={`badge gap-1 ${getStatusClasses(
                              version.status
                            )}`}
                          >
                            {getStatusIcon(version.status)}
                            {version.status}
                          </span>
                        </td>

                        <td>{version.author}</td>
                        <td>{version.createdAt}</td>
                        <td className="max-w-xs">
                          <span className="line-clamp-2 text-sm text-base-content/75">
                            {version.summary}
                          </span>
                        </td>

                        <td>
                          <div className="flex justify-end">
                            <button className="btn btn-sm btn-outline min-w-[90px] gap-2">
                              <Eye size={14} className="shrink-0" />
                              <span className="whitespace-nowrap">View</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="alert border border-base-300 bg-base-100">
                <span className="text-sm text-base-content/70">
                  Only approved versions should become active. Rejected versions
                  remain visible in history.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}