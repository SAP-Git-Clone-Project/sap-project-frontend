import { FileText, Clock, XCircle } from "lucide-react";
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

  const [filter, setFilter] = useState("all");

  const filteredReviews =
    filter === "all"
      ? REVIEWS
      : REVIEWS.filter((r) => r.status === filter);


  return (
    <div className="space-y-12 px-6 pb-12 pt-16">


      {/* Header */}
      <Animate variant="fade-down">
        <div className="max-w-6xl mx-auto space-y-2">

          <h1 className="text-4xl font-bold tracking-tight">
            Reviews
          </h1>

          <p className="text-base-content/60">
            Manage versions awaiting approval or already reviewed.
          </p>

        </div>
      </Animate>


      {/* Stats row */}
      <Animate>
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">

 <Animate variant="fade-right">
          <GlassCard bg="bg-warning/10" border="border-warning/20">
            <div className="card bg-base-200/70 border border-base-300/40 backdrop-blur p-6 text-center">

              <Clock className="mx-auto mb-2 text-warning" />

              <p className="text-2xl font-bold">
                {REVIEWS.filter(r => r.status === "pending").length}
              </p>

              <p className="text-xs text-base-content/60">
                Pending
              </p>

            </div>
          </GlassCard>
</Animate>

          <GlassCard bg="bg-success/10" border="border-success/20">
            <div className="card bg-base-200/70 border border-base-300/40 backdrop-blur p-6 text-center">

              <FileText className="mx-auto mb-2 text-success" />

              <p className="text-2xl font-bold">
                {REVIEWS.filter(r => r.status === "approved").length}
              </p>

              <p className="text-xs text-base-content/60">
                Approved
              </p>

            </div>
          </GlassCard>

<Animate variant="fade-left">
          <GlassCard bg="bg-error/10" border="border-error/20">
            <div className="card bg-base-200/70 border border-base-300/40 backdrop-blur p-6 text-center">

              <XCircle className="mx-auto mb-2 text-error" />

              <p className="text-2xl font-bold">
                {REVIEWS.filter(r => r.status === "rejected").length}
              </p>

              <p className="text-xs text-base-content/60">
                Rejected
              </p>

            </div>
          </GlassCard>
</Animate>

        </div>
      </Animate>



      {/* Filters */}
      <Animate>
        <div className="max-w-6xl mx-auto flex gap-2">

          {FILTERS.map(f => (

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
      </Animate>



      {/* Review list */}
      <Animate>
        <div className="max-w-6xl mx-auto space-y-4">

          {filteredReviews.map(review => (

            <div
              key={review.id}
              className="card bg-base-200/70 border border-base-300/40 backdrop-blur p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:scale-[1.01] transition"
            >

              <div className="space-y-1">

                <div className="flex items-center gap-3">

                  <span className="font-semibold text-lg">
                    {review.title}
                  </span>

                  <FileStatus status={review.status} />

                </div>


                <p className="text-sm text-base-content/60">
                  {review.summary}
                </p>


                <p className="text-xs text-base-content/40">
                  Author: {review.author} · {review.date}
                </p>

              </div>


              <Link
                to={`/version-review/${review.id}`}
                className="btn btn-sm btn-primary shadow-md shadow-primary/30"
              >
                Open Review →
              </Link>

            </div>

          ))}

        </div>
      </Animate>


    </div>
  );
}