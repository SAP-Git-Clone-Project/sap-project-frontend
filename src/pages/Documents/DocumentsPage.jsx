import React, { useMemo, useState, useEffect } from "react";
import {
  FileText, Plus, Search, FileStack, Clock3, CheckCircle2,
  PencilLine, FileBadge, FileLock2, AlertCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

// Internal Components/Hooks
import Animate from "@/components/animation/Animate.jsx";
import GlassCard from "../homepage/components/GlassCard.jsx";
import FileStatus from "../homepage/components/FileStatus.jsx";
import { useAuth } from "@/context/AuthContext";
import api from "@/components/api/api";
import notify from "@/components/toaster/notify";

const FILTERS = ["all", "approved", "pending_approval", "draft", "rejected"];

const ICON_MAP = {
  policy: <FileBadge size={20} />,
  security: <FileLock2 size={20} />,
  contract: <FileText size={20} />,
  planning: <PencilLine size={20} />,
  default: <FileText size={20} />,
};

const getDocumentIcon = (type) => ICON_MAP[type] || ICON_MAP.default;

export default function DocumentsPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const res = await api.get("/documents/");
        setDocuments(res.data);
        console.log("Fetched documents:", res.data);
      } catch (err) {
        // This catches the "Network Error" you saw in console
        notify.error("Backend Server is Offline (Port 5000)");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDocuments();
  }, []);

  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      const status = doc.active_version?.status;
      const matchesFilter = filter === "all" || status === filter;
      const matchesSearch = doc.title.toLowerCase().includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [documents, filter, search]);

  const statsData = useMemo(() => [
    { label: "Total Assets", val: documents.length, icon: FileText, color: "primary", glass: "bg-primary/10" },
    { label: "Approved", val: documents.filter(d => d.active_version?.status === "approved").length, icon: CheckCircle2, color: "success", glass: "bg-success/10" },
    { label: "Pending", val: documents.filter(d => d.active_version?.status === "pending_approval").length, icon: Clock3, color: "warning", glass: "bg-warning/10" },
    { label: "Drafts", val: documents.filter(d => d.active_version?.status === "draft").length, icon: PencilLine, color: "purple", glass: "bg-purple/10" },
  ], [documents]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-base-100 space-y-4">
        <span className="loading loading-ring loading-lg text-primary"></span>
        <p className="text-[10px] font-black tracking-[0.4em] uppercase text-secondary">Loading documents...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[230vh] md:min-h-[200vh] bg-base-100 px-6 pb-12 pt-20 overflow-hidden">

      {/* Header Section */}
      <Animate variant="fade-down" className="overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-1">
            <div className="flex items-center gap-3 text-primary mb-3 group">
              <FileStack size={16} strokeWidth={2.5} />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">Central Archive</span>
            </div>
            <h1 className="text-5xl font-black tracking-tighter text-base-content">
              Hello, <span className="text-primary">{user?.first_name || "Agent"}</span>
            </h1>
            <p className="text-secondary font-medium max-w-md opacity-60">
              Interface for managing high-integrity assets and documentation.
            </p>
          </div>

          <Link
            to="/documents/create"
            className="btn btn-primary rounded-2xl shadow-xl shadow-primary/20 border-none px-8 hover:scale-105 transition-all"
          >
            <Plus size={20} /> New Document
          </Link>
        </div>
      </Animate>

      {/* Stats Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-12 items-stretch">
        {statsData.map((stat) => (
          <Animate key={stat.label} className="h-full">
            <GlassCard
              bg={stat.glass}
              border={`border-${stat.color}/20`}
              className="h-full hover:translate-y-[-6px] transition-all duration-500 group"
            >
              {/* MOBILE: py-6 (smaller) 
            DESKTOP: lg:py-12 (tall & premium) 
        */}
              <div className="py-6 lg:py-12 px-4 flex flex-col items-center justify-center text-center relative overflow-hidden h-full">

                {/* Smaller Icon for Mobile */}
                <div className={`p-3 lg:p-5 rounded-2xl lg:rounded-[2rem] bg-base-100/50 text-${stat.color} mb-3 lg:mb-6 shadow-xl border border-base-300/50 group-hover:scale-110 transition-transform duration-500`}>
                  <stat.icon size={22} className="lg:w-8 lg:h-8" strokeWidth={2} />
                </div>

                {/* Scale Text: 3xl on mobile, 5xl on desktop */}
                <span className="text-3xl lg:text-5xl font-black tracking-tighter text-base-content">
                  {stat.val}
                </span>

                {/* Subtitle: Smaller tracking on mobile to prevent overflow */}
                <span className="text-[9px] lg:text-[10px] font-black uppercase opacity-40 tracking-[0.2em] lg:tracking-[0.4em] mt-1 lg:mt-2">
                  {stat.label}
                </span>

              </div>
            </GlassCard>
          </Animate>
        ))}
      </div>

      {/* Toolbar */}
      <Animate>
        <div className="max-w-7xl mx-auto mb-8 rounded-2xl border border-base-300/30 bg-base-200/40 backdrop-blur-md overflow-hidden">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-3 p-2 lg:p-3">

            <div className="grid grid-cols-3 sm:grid-cols-5 lg:flex lg:flex-nowrap gap-1 w-full lg:w-auto">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`btn btn-xs sm:btn-sm rounded-xl px-2 lg:px-5 border-none transition-all uppercase text-[9px] lg:text-[10px] font-black tracking-tighter lg:tracking-widest ${filter === f
                    ? "btn-primary shadow-lg shadow-primary/30"
                    : "btn-ghost text-secondary hover:bg-base-300"
                    }`}
                >
                  {f.replace("_", " ")}
                </button>
              ))}
            </div>

            <div className="relative w-full lg:max-w-[280px]">
              <Search
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 opacity-20"
              />
              <input
                type="text"
                placeholder="Search by title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input w-full pl-12 bg-base-100/50 border-base-300/30 focus:border-primary rounded-2xl"
              />
            </div>

          </div>
        </div>
      </Animate>

      {/* Main Table Container */}
      <Animate className="overflow-hidden">
        <div className="max-w-7xl mx-auto min-h-[400px]">

          {/* Container */}
          <div className="relative rounded-[1rem] border border-base-300/30 bg-base-200/20 backdrop-blur-2xl shadow-2xl overflow-hidden">

            <div className="w-full overflow-x-auto">

              {/* Main Table Container - Audit Log High-Integrity Style */}
              <Animate className="overflow-hidden">
                <div className="max-w-7xl mx-auto">
                  <div className="relative rounded-[1rem] border border-base-300/30 bg-base-200/20 backdrop-blur-2xl shadow-2xl overflow-hidden">

                    {/* Scrollable Container with Custom Scrollbar */}
                    <div className="overflow-x-auto overflow-y-auto max-h-[65vh] scrollbar-custom">

                      <table className="table w-full border-separate border-spacing-0">
                        <thead className="sticky top-0 z-20">
                          <tr className="bg-base-300/90 backdrop-blur-md text-secondary uppercase text-[11px] font-black">
                            <th className="py-6 px-10">Asset Name & Description</th>
                            <th>Owner</th>
                            <th className="text-center">Status</th>
                            <th className="text-center">Ver.</th>
                            <th className="text-right px-10">Modified</th>
                          </tr>
                        </thead>

                        <tbody className="divide-y divide-base-300/5">
                          {filteredDocuments.map((doc) => (
                            <tr key={doc.id} className="hover:bg-primary/5 transition-colors group">

                              {/* Asset Column - Now the primary link */}
                              <td className="py-6 px-10">
                                <Link to={`/documents/${doc.id}`} className="flex items-center gap-4 outline-none">
                                  <div className="p-3 bg-base-300/30 rounded-xl group-hover:text-primary group-hover:bg-primary/10 group-hover:scale-110 transition-all duration-300">
                                    {getDocumentIcon(doc.type)}
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="font-bold text-base-content leading-tight group-hover:text-primary transition-colors text-base">
                                      {doc.title}
                                    </span>
                                    <span className="text-[10px] opacity-40 font-mono italic truncate max-w-[300px] group-hover:opacity-60 transition-opacity">
                                      {doc.active_version?.content || "No description provided"}
                                    </span>
                                  </div>
                                </Link>
                              </td>

                              {/* Owner Column */}
                              <td>
                                <Link to={`/profile/${doc.created_by}`} className="flex items-center gap-3 hover:text-primary transition-colors">
                                  <div className="avatar">
                                    <div className="w-7 h-7 rounded-full ring ring-primary/10 ring-offset-base-100 ring-offset-1">
                                      <img
                                        src={doc.created_by_avatar_url}
                                        alt={doc.created_by_username}
                                      />
                                    </div>
                                  </div>
                                  <span className="text-[11px] font-bold opacity-70">
                                    {doc.active_version?.creator_name || doc.created_by_username}
                                  </span>
                                </Link>
                              </td>

                              {/* Status Column */}
                              <td className="text-center">
                                <div className="flex justify-center scale-90">
                                  <FileStatus status={doc.active_version?.status || "no_active"} />
                                </div>
                              </td>

                              {/* Version Column */}
                              <td className="text-center">
                                <span className="badge badge-sm border-none bg-primary/10 text-primary font-mono font-black px-3">
                                  v{doc.active_version?.version_number || "1.0"}
                                </span>
                              </td>

                              {/* Date Column - Shifted to the right */}
                              <td className="text-right px-10 text-[11px] opacity-60">
                                <div className="flex flex-col items-end">
                                  <span className="font-bold text-base-content/80">
                                    {new Date(doc.updated_at).toLocaleDateString("en-US", {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric"
                                    })}
                                  </span>
                                  <span className="text-[9px] opacity-50 font-mono uppercase">
                                    {new Date(doc.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                </div>
                              </td>

                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Empty State UI */}
                    {filteredDocuments.length === 0 && (
                      <div className="flex flex-col items-center justify-center py-32 opacity-20 gap-4">
                        <AlertCircle size={70} strokeWidth={1} />
                        <p className="uppercase tracking-[0.3em] font-black text-sm">Accessing Empty Index</p>
                      </div>
                    )}

                  </div>
                </div>
              </Animate>
            </div>

            {/* EMPTY STATE */}
            {filteredDocuments.length === 0 && (
              <div className="flex flex-col items-center justify-center py-32 opacity-20 gap-4">
                <AlertCircle size={80} strokeWidth={1} />
                <p className="text-xl font-black text-center uppercase tracking-[0.3em]">
                  Accessing Empty Index
                </p>
              </div>
            )}

          </div>
        </div>
      </Animate>
    </div>
  );
}