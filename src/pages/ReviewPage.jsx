import { FileText, Clock, XCircle, Search } from "lucide-react";
import Animate from "@/components/animation/Animate.jsx";
import { Link } from "react-router-dom";
import FileStatus from "./homepage/components/FileStatus.jsx";
import GlassCard from "./homepage/components/GlassCard.jsx";
import { useState } from "react";

const REVIEWS = [
  {
    id: 1,
    title: "UserAuth Spec v1.2",
    author: "Ivan Petrov",
    summary: "Updated login flow & OAuth handling",
    date: "2h ago",
    status: "pending",
  },
  {
    id: 2,
    title: "API Gateway Config v3.4",
    author: "Maria Ivanova",
    summary: "Added rate limiting middleware",
    date: "5h ago",
    status: "approved",
  },
  {
    id: 3,
    title: "Security Policy v2.1",
    author: "Georgi Dimitrov",
    summary: "Password rotation policy updated",
    date: "Yesterday",
    status: "rejected",
  },
];

const FILTERS = ["all", "pending", "approved", "rejected"];

export default function ReviewPage() {
  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState("all");

  const filteredReviews = REVIEWS.filter((r) => {
    const matchesFilter = filter === "all" || r.status === filter;

    const matchesSearch =
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.author.toLowerCase().includes(search.toLowerCase()) ||
      r.summary.toLowerCase().includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-12 px-6 pb-12 pt-16 overflow-x-hidden">
      {/* Header */}
      <Animate variant="fade-down">
        <div className="max-w-6xl mx-auto space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Reviews</h1>

          <p className="text-base-content/60">
            Manage versions awaiting approval or already reviewed.
          </p>
        </div>
      </Animate>

      {/* Stats row */}
      {/* Stats row */}
      <Animate>
        <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 gap-5">
          <Animate variant="fade-right">
            <GlassCard bg="bg-warning/10" border="border-warning/20">
              <div className="card bg-base-200/70 border border-base-300/40 backdrop-blur p-4 text-center">
                <Clock size={18} className="mx-auto mb-1 text-warning" />

                <p className="text-xl font-bold">
                  {REVIEWS.filter((r) => r.status === "pending").length}
                </p>

                <p className="text-xs text-base-content/60">Pending</p>
              </div>
            </GlassCard>
          </Animate>

          <GlassCard bg="bg-success/10" border="border-success/20">
            <div className="card bg-base-200/70 border border-base-300/40 backdrop-blur p-4 text-center">
              <FileText size={18} className="mx-auto mb-1 text-success" />

              <p className="text-xl font-bold">
                {REVIEWS.filter((r) => r.status === "approved").length}
              </p>

              <p className="text-xs text-base-content/60">Approved</p>
            </div>
          </GlassCard>

          <Animate variant="fade-left">
            <GlassCard bg="bg-error/10" border="border-error/20">
              <div className="card bg-base-200/70 border border-base-300/40 backdrop-blur p-4 text-center">
                <XCircle size={18} className="mx-auto mb-1 text-error" />

                <p className="text-xl font-bold">
                  {REVIEWS.filter((r) => r.status === "rejected").length}
                </p>

                <p className="text-xs text-base-content/60">Rejected</p>
              </div>
            </GlassCard>
          </Animate>
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
              placeholder="Search reviews..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="
      input input-sm
      w-full
      pl-10
      bg-base-200/70
      backdrop-blur
      border border-base-300/40
      focus:border-primary
      focus:outline-none
      transition
      relative
      z-0
    "
            />
          </div>
        </div>
      </Animate>

      {/* Review List Table */}
      <Animate>
        <div className="max-w-7xl mx-auto overflow-x-auto rounded-2xl border border-base-300 shadow-sm bg-base-200/70 backdrop-blur">
          <table className="table text-base w-full">
            <thead className="bg-base-300/40 text-base-content/80">
              <tr className="h-12">
                <th className="text-left">Title</th>
                <th className="text-center">Status</th>
                <th className="text-left">Summary</th>
                <th className="text-left">Author</th>
                <th className="text-left">Date</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredReviews.map((review) => (
                <tr
                  key={review.id}
                  className="hover:bg-base-300/30 transition h-[76px]"
                >
                  {/* Title */}
                  <td className="font-semibold text-base">{review.title}</td>

                  {/* Status */}
                  <td className="text-center">
                    <div className="flex justify-center">
                      <FileStatus status={review.status.toLowerCase()} />
                    </div>
                  </td>

                  {/* Summary */}
                  <td className="max-w-xs">
                    <span className="line-clamp-2 text-sm text-base-content/60">
                      {review.summary}
                    </span>
                  </td>

                  {/* Author */}
                  <td className="text-base-content/90">{review.author}</td>

                  {/* Date */}
                  <td className="text-base-content/70 whitespace-nowrap">
                    {review.date}
                  </td>

                  {/* Action */}
                  <td className="text-right">
                    <Link
                      to={`/version-review/${review.id}`}
                      className="btn btn-sm btn-primary gap-2 min-w-[90px] shadow-md shadow-primary/30"
                    >
                      Open Review →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Animate>
    </div>
  );
}
