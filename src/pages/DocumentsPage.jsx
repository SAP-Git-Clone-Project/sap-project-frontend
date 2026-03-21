import { useState } from "react";
import Animate from "@/components/animation/Animate.jsx";
import { FileText, Grid, List, Plus } from "lucide-react";
import UploadFile from "./homepage/components/UploadFile.jsx";
import { Sun, Moon, Bell, Search, Home, BarChart2, Users, GitBranch, Zap, User, File } from "lucide-react";
import { CheckCircle, XCircle, AlertTriangle, RefreshCw } from "lucide-react"
import FileStatus from "./FileStatus.jsx";

const DocumentsPage = () => {
 const [gridView, setGridView] = useState(() => {
  const saved = localStorage.getItem("docsView");
  return saved ? JSON.parse(saved) : true;
});

  return (
    <div className="space-y-8 pt-6 px-6">

      <Animate variant="fade-down">
        <div className="flex items-center justify-between">

          <h1 className="text-xl font-bold text-base-content">
            My Documents
          </h1>

          <div className="flex items-center gap-2">
 <div className="relative hidden sm:block">
          <Search
            size={12}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40 pointer-events-none"
          />
          <input
            className="input input-sm input-bordered bg-base-300 pl-8 w-44 text-sm text-base-content placeholder:text-base-content/40"
            placeholder="Search…"
          />
        </div>
            <button
              className={`btn btn-sm ${gridView ? "btn-primary" : "btn-ghost"}`}
              onClick={() => {
                setGridView(true);
                localStorage.setItem("docsView", true);
                }}
            >
              <Grid size={16} />
            </button>

            <button
              className={`btn btn-sm ${!gridView ? "btn-primary" : "btn-ghost"}`}
              onClick={() => {
                setGridView(false);
                localStorage.setItem("docsView", false);
                }}
            >
              <List size={16} />
            </button>

            {/* Add document */}
            <button
              className="btn btn-sm btn-primary ml-2"
              onClick={() =>
                document.getElementById("upload_modal").showModal()
              }
            >
              <Plus size={16} />
              Add
            </button>

          </div>
        </div>
      </Animate>

      {/* ── Documents ─────────────────────────── */}
      <Animate>
        <div
          className={
            gridView
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
              : "flex flex-col gap-3"
          }
        >

          {/* Example document */}
          {[1, 2, 3, 4].map((_, i) => (
            <div
              key={i}
              className="card bg-base-200 p-4 hover:scale-[1.02] transition cursor-pointer"
            >

              <div className="flex items-center gap-3">

                {/* File icon */}
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <FileText size={18} className="text-primary" />
                </div>

                {/* Info */}
                <div className="flex-1">
                  <p className="font-semibold text-sm">Document {i + 1}</p>
                  <p className="text-xs text-base-content/50 flex items-center gap-2">
                    Version 1.2 • PDF • Author: John Doe • Status: <FileStatus status="pending" />
                    </p>
                </div>

                {/* Date */}
                <span className="text-xs text-base-content/40">
                  2d ago
                </span>

              </div>

            </div>
          ))}

        </div>
      </Animate>

     <dialog id="upload_modal" className="modal">
<div className="modal-box relative">

  <div className="w-full">
    <UploadFile />
  </div>

</div>

  {/* Click outside closes */}
  <form method="dialog" className="modal-backdrop">
    <button>close</button>
  </form>
</dialog>

    </div>
  );
};

export default DocumentsPage;