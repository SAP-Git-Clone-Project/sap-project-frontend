import { useState } from "react";
import {
  FileText,
  User,
  Clock,
  CheckCircle,
  XCircle,
  MessageSquare,
  ArrowLeft,
} from "lucide-react";

import { Link } from "react-router-dom";
import Animate from "@/components/animation/Animate.jsx";
import FileStatus from "./homepage/components/FileStatus.jsx";
import notify from "@/components/toaster/notify";

export default function VersionReviewPage() {
  const [comment, setComment] = useState("");

  const [status, setStatus] = useState("pending");

  const version = {
    title: "UserAuth Spec v1.2",
    author: "Ivan Petrov",
    created: "Today · 14:32",
    status: "pending",
    summary:
      "Updated login flow, added OAuth provider handling and improved validation logic.",
  };

  return (
    <div className="px-6 pt-10 pb-16">
      <div className="max-w-[1400px] mx-auto space-y-12">
        {/* Back button */}
        <Animate>
          <Link
            to="/reviews"
            className="btn btn-sm btn-ghost border border-base-300 hover:white hover:text-white transition w-fit"
          >
            <ArrowLeft size={16} />
            Back to Reviews
          </Link>
        </Animate>

        {/* Header */}
        <Animate variant="fade-down">
          <div className="space-y-3">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-4xl font-bold tracking-tight">
                {version.title}
              </h1>

              <FileStatus status={status} />
            </div>

            <div className="flex gap-6 text-sm text-base-content/60">
              <span className="flex items-center gap-1">
                <User size={14} />
                {version.author}
              </span>

              <span className="flex items-center gap-1">
                <Clock size={14} />
                {version.created}
              </span>
            </div>
          </div>
        </Animate>

        {/* Main grid */}
        <div className="grid xl:grid-cols-[2fr_1fr] gap-10 max-w-[1200px] mx-auto">
          {/* LEFT — Preview panel */}
          <Animate className="xl:col-span-2">
            <div className="card bg-base-200/70 border border-base-300/40 backdrop-blur p-8 space-y-5">
              <div className="flex items-center gap-2 font-semibold text-lg">
                <FileText size={20} />
                Version Preview
              </div>

              <div className="rounded-xl border border-base-300/40 bg-base-100/40 h-[500px] flex items-center justify-center text-base-content/40">
                Document preview / diff viewer goes here
              </div>
            </div>
          </Animate>

          {/* RIGHT — Side panel */}
          <Animate variant="fade-left">
            <div className="flex flex-col gap-8">
              {/* Summary */}
              <div className="card bg-base-200/70 border border-base-300/40 backdrop-blur p-7 space-y-3">
                <div className="font-semibold text-base">Summary</div>

                <p className="text-sm text-base-content/70 leading-relaxed">
                  {version.summary}
                </p>
              </div>

              {/* Comments */}
              <div className="card bg-base-200/70 border border-base-300/40 backdrop-blur p-7 space-y-5">
                <div className="flex items-center gap-2 font-semibold text-base">
                  <MessageSquare size={18} />
                  Comments
                </div>

                <div className="text-sm text-base-content/50">
                  No comments yet.
                </div>

                <textarea
                  className="textarea textarea-bordered w-full"
                  placeholder="Leave feedback before approving..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>

              {/* Approve / Reject */}
              <div className="card bg-base-200/70 border border-base-300/40 backdrop-blur p-7 flex flex-col gap-3">
                {status === "pending" ? (
                  <div className="flex gap-4">
                    <button
                      className="btn btn-error flex-1 shadow-md shadow-error/30"
                      onClick={() => {
                        setStatus("rejected");
                        notify.error("Version rejected");
                      }}
                    >
                      <XCircle size={18} />
                      Reject
                    </button>
                    <button
                      className="btn btn-success flex-1 shadow-md shadow-success/30"
                      onClick={() => {
                        setStatus("approved");
                        notify.success("Version approved successfully");
                      }}
                    >
                      <CheckCircle size={18} />
                      Approve
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Current status label */}
                    <div className="text-sm text-center">
                      Current status:
                      <span
                        className={`ml-2 font-semibold capitalize px-2 py-1 rounded-md ${
                          status === "approved"
                            ? "text-success bg-success/10 shadow-md shadow-success/30"
                            : "text-error bg-error/10 shadow-md shadow-error/30"
                        }`}
                      >
                        {status}
                      </span>
                    </div>

                    <button
                      className="btn btn-warning w-full shadow-md shadow-warning/30"
                      onClick={() => {
                        setStatus("pending");
                        notify.success("Decision reset — choose again");
                      }}
                    >
                      Edit Decision
                    </button>
                  </>
                )}
              </div>
            </div>
          </Animate>
        </div>
      </div>
    </div>
  );
}
