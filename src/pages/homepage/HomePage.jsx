import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  Plus,
  Search,
  Filter,
  Eye,
  Clock3,
  CheckCircle2,
  XCircle,
  PencilLine,
} from "lucide-react";

const mockDocuments = [
  {
    id: 1,
    title: "Employee Handbook",
    author: "Ivan Petrov",
    status: "APPROVED",
    activeVersion: "v3",
    updatedAt: "2026-03-15",
    description: "Internal company handbook with updated onboarding policies.",
  },
  {
    id: 2,
    title: "Security Policy",
    author: "Georgi Ivanov",
    status: "PENDING",
    activeVersion: "v1",
    updatedAt: "2026-03-14",
    description: "Pending review for revised security and access rules.",
  },
  {
    id: 3,
    title: "Quarterly Planning",
    author: "Maria Dimitrova",
    status: "DRAFT",
    activeVersion: "v2",
    updatedAt: "2026-03-12",
    description: "Planning draft for the upcoming quarter goals and delivery.",
  },
  {
    id: 4,
    title: "Vendor Agreement",
    author: "Nikolay Stoyanov",
    status: "REJECTED",
    activeVersion: "v1",
    updatedAt: "2026-03-11",
    description: "Rejected version due to missing approval notes.",
  },
];

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

export default function DocumentsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const filteredDocuments = useMemo(() => {
    return mockDocuments.filter((doc) => {
      const matchesSearch =
        doc.title.toLowerCase().includes(search.toLowerCase()) ||
        doc.author.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "ALL" ? true : doc.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  const stats = useMemo(() => {
    return {
      total: mockDocuments.length,
      approved: mockDocuments.filter((d) => d.status === "APPROVED").length,
      pending: mockDocuments.filter((d) => d.status === "PENDING").length,
      drafts: mockDocuments.filter((d) => d.status === "DRAFT").length,
    };
  }, []);

  return (
    <section className="px-4 py-8 md:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="hero rounded-3xl bg-base-200 border border-base-300">
          <div className="hero-content w-full flex-col items-start justify-between gap-6 py-8 lg:flex-row lg:items-center">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-base-content/70">
                <FileText size={16} />
                <span>Document Management</span>
              </div>

              <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                Documents
              </h1>

              <p className="max-w-2xl text-base-content/70">
                Browse documents, track their current status, and open the full
                version history for each record.
              </p>
            </div>

            <Link to="/documents/create" className="btn btn-primary gap-2">
              <Plus size={18} />
              Create Document
            </Link>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="card bg-base-200 border border-base-300 shadow-sm">
            <div className="card-body">
              <p className="text-sm text-base-content/70">Total Documents</p>
              <h2 className="text-3xl font-bold">{stats.total}</h2>
            </div>
          </div>

          <div className="card bg-base-200 border border-base-300 shadow-sm">
            <div className="card-body">
              <p className="text-sm text-base-content/70">Approved</p>
              <h2 className="text-3xl font-bold">{stats.approved}</h2>
            </div>
          </div>

          <div className="card bg-base-200 border border-base-300 shadow-sm">
            <div className="card-body">
              <p className="text-sm text-base-content/70">Pending Review</p>
              <h2 className="text-3xl font-bold">{stats.pending}</h2>
            </div>
          </div>

          <div className="card bg-base-200 border border-base-300 shadow-sm">
            <div className="card-body">
              <p className="text-sm text-base-content/70">Drafts</p>
              <h2 className="text-3xl font-bold">{stats.drafts}</h2>
            </div>
          </div>
        </div>

        <div className="card bg-base-200 border border-base-300 shadow-sm">
          <div className="card-body gap-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="card-title text-xl">Documents Overview</h2>
                <p className="text-sm text-base-content/70">
                  Search and filter documents by title, author, or status.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 lg:flex-row">
              <label className="input input-bordered flex items-center gap-2 w-full lg:max-w-md">
                <Search size={16} className="text-base-content/60" />
                <input
                  type="text"
                  className="grow"
                  placeholder="Search by title or author"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </label>

              <label className="select select-bordered flex items-center gap-2 w-full lg:max-w-xs">
                <Filter size={16} className="text-base-content/60" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-transparent outline-none w-full"
                >
                  <option value="ALL">All statuses</option>
                  <option value="APPROVED">Approved</option>
                  <option value="PENDING">Pending</option>
                  <option value="DRAFT">Draft</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </label>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-base-300">
              <table className="table">
                <thead className="bg-base-300/40">
                  <tr>
                    <th>Document</th>
                    <th>Author</th>
                    <th>Status</th>
                    <th>Active Version</th>
                    <th>Last Updated</th>
                    <th className="text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDocuments.length > 0 ? (
                    filteredDocuments.map((doc) => (
                      <tr key={doc.id} className="hover">
                        <td>
                          <div className="flex flex-col">
                            <span className="font-semibold">{doc.title}</span>
                            <span className="text-xs text-base-content/60">
                              {doc.description}
                            </span>
                          </div>
                        </td>

                        <td>{doc.author}</td>

                        <td>
                          <span
                            className={`badge gap-1 ${getStatusClasses(
                              doc.status
                            )}`}
                          >
                            {getStatusIcon(doc.status)}
                            {doc.status}
                          </span>
                        </td>

                        <td>
                          <span className="badge badge-outline">
                            {doc.activeVersion}
                          </span>
                        </td>

                        <td>{doc.updatedAt}</td>

                        <td className="text-right">
                          <Link
                            to={`/documents/${doc.id}`}
                            className="btn btn-sm btn-outline gap-2"
                          >
                            <Eye size={14} />
                            View
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6">
                        <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
                          <FileText
                            size={28}
                            className="text-base-content/40"
                          />
                          <div>
                            <p className="font-medium">No documents found</p>
                            <p className="text-sm text-base-content/60">
                              Try adjusting your search or filter.
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}