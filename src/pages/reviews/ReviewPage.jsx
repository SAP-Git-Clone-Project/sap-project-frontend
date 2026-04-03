import { FileText, Clock, XCircle, Search } from "lucide-react";
import Animate from "@/components/animation/Animate.jsx";
import { Link } from "react-router-dom";
import FileStatus from "@/components/widgets/FileStatus.jsx";
import GlassCard from "@/components/widgets/GlassCard.jsx";
import { useState, useEffect } from "react";
import api from "@/components/api/api";

const FILTERS = ["all", "pending", "approved", "rejected"];

const ReviewPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  // Fetch reviews from backend
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const res = await api.get("/reviews/inbox/?all=true");
        setReviews(res.data);
      } catch (err) {
        console.error("Failed to fetch reviews:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const filteredReviews = reviews.filter((r) => {
    const matchesFilter = filter === "all" || r.review_status === filter;
    const matchesSearch =
      (r.version?.document?.title || "").toLowerCase().includes(search.toLowerCase()) ||
      (r.version?.created_by?.username || "").toLowerCase().includes(search.toLowerCase()) ||
      (r.comments || "").toLowerCase().includes(search.toLowerCase());

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
      <Animate>
        <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 gap-5">
          <Animate variant="fade-right">
            <GlassCard bg="bg-warning/10" border="border-warning/20">
              <div className="card bg-base-200/70 border border-base-300/40 backdrop-blur p-4 text-center">
                <Clock size={18} className="mx-auto mb-1 text-warning" />
                <p className="text-xl font-bold">
                  {reviews.filter((r) => r.review_status === "pending").length}
                </p>
                <p className="text-xs text-base-content/60">Pending</p>
              </div>
            </GlassCard>
          </Animate>

          <GlassCard bg="bg-success/10" border="border-success/20">
            <div className="card bg-base-200/70 border border-base-300/40 backdrop-blur p-4 text-center">
              <FileText size={18} className="mx-auto mb-1 text-success" />
              <p className="text-xl font-bold">
                {reviews.filter((r) => r.review_status === "approved").length}
              </p>
              <p className="text-xs text-base-content/60">Approved</p>
            </div>
          </GlassCard>

          <Animate variant="fade-left">
            <GlassCard bg="bg-error/10" border="border-error/20">
              <div className="card bg-base-200/70 border border-base-300/40 backdrop-blur p-4 text-center">
                <XCircle size={18} className="mx-auto mb-1 text-error" />
                <p className="text-xl font-bold">
                  {reviews.filter((r) => r.review_status === "rejected").length}
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
          <div className="flex gap-2 flex-wrap">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`btn btn-sm ${filter === f ? "btn-primary" : "btn-ghost border border-base-300"
                  }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

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
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-4">
                    Loading...
                  </td>
                </tr>
              ) : filteredReviews.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-4">
                    No reviews found.
                  </td>
                </tr>
              ) : (
                filteredReviews.map((review) => (
                  <tr
                    key={review.id}
                    className="hover:bg-base-300/30 transition h-[76px]"
                  >
                    <td className="font-semibold text-base">
                      {review.new_version?.document_title || "N/A"}
                    </td>
                    <td className="text-center">
                      <div className="flex justify-center">
                        <FileStatus status={review.review_status.toLowerCase()} />
                      </div>
                    </td>
                    <td className="max-w-xs">
                      <span className="line-clamp-2 text-sm text-base-content/60">
                        {review.new_version?.content || "-"}
                      </span>
                    </td>
                    <td className="text-base-content/90">
                      {review.new_version?.creator_name || "N/A"}
                    </td>
                    <td className="text-base-content/70 whitespace-nowrap">
                      {review.reviewed_at
                        ? new Date(review.reviewed_at).toLocaleString()
                        : review.new_version?.created_at
                          ? new Date(review.new_version.created_at).toLocaleString()
                          : "N/A"}
                    </td>
                    <td className="text-right">
                      <Link
                        to={`/version-review/${review.id}`}
                        className="btn btn-sm btn-primary gap-2 min-w-[90px] shadow-md shadow-primary/30"
                      >
                        Open Review →
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Animate>
    </div>
  );
};

export default ReviewPage;