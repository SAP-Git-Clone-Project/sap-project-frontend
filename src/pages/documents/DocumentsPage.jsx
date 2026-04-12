import React, { useMemo, useState, useEffect, useCallback } from "react";
import {
  FileText, Plus, Search, FileStack, Clock3, CheckCircle2,
  PencilLine, FileBadge, FileLock2, AlertCircle, ChevronLeft, ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";

// Internal Components/Hooks
import Animate from "@/components/animation/Animate.jsx";
import GlassCard from "@/components/widgets/GlassCard.jsx";
import FileStatus from "@/components/widgets/FileStatus.jsx";
import notify from "@/components/toaster/notify";
import Loader from "@/components/widgets/Loader.jsx"
import GetGreeting from "@/components/greetings/GetGreeting";

import api from "@/components/api/api";
import { useAuth } from "@/context/AuthContext";

const FILTERS = ["all", "approved", "pending", "draft", "rejected"];

const ICON_MAP = {
  policy: <FileBadge size={20} />,
  security: <FileLock2 size={20} />,
  contract: <FileText size={20} />,
  planning: <PencilLine size={20} />,
  default: <FileText size={20} />,
};

const getDocumentIcon = (type) => ICON_MAP[type] || ICON_MAP.default;

const DocumentsPage = () => {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationInfo, setPaginationInfo] = useState({ count: 0, hasNext: false, hasPrev: false });
  const PAGE_SIZE = 20;

  useEffect(() => {
    const controller = new AbortController();

    const fetchDocuments = async () => {
      setLoading(true);
      try {
        const res = await api.get("/documents/", {
          params: { page: currentPage },
          signal: controller.signal,
        });
        console.log("res.data:", res.data);
        const { results, count, next, previous } = res.data;
        setDocuments(results || []);
        setPaginationInfo({ count: count || 0, hasNext: !!next, hasPrev: !!previous });
      } catch (err) {
        if (err.name !== "CanceledError")
          notify.error("Backend Server is Offline (Port 5000)");
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
    return () => controller.abort();
  }, [currentPage]);

  const handleFilterChange = (f) => {
    setFilter(f);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

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
      <Loader message="Loading documents..." />
    );
  }

  let notStaff = !user?.is_staff;

  return (
    <div className="min-h-[230vh] md:min-h-[200vh] bg-base-100 px-6 pb-12 pt-20 overflow-hidden">

      {/* Header Section */}
      <Animate variant="fade-down" className="overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-1">
            <div className="flex items-center gap-3 text-primary mb-3 group">
              <FileStack size={18} />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">Documents</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-base-content leading-[0.9]">
              <GetGreeting /> <span className="text-primary">{user?.first_name || "Agent"}</span> <span className="text-primary">{user?.last_name || "Agent"}</span>
            </h1>
            <p className="text-secondary font-medium max-w-md opacity-60">
              Interface for managing high-integrity assets and documentation.
            </p>
          </div>

          {notStaff && (
            <Link
              to="/documents/create"
              className="btn btn-primary rounded-2xl border-none px-8 hover:scale-105 transition-all"
            >
              <Plus size={20} /> New Document
            </Link>
          )}
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
                  onClick={() => handleFilterChange(f)}
                  className={`btn btn-xs sm:btn-sm rounded-xl px-2 lg:px-5 border-none transition-all uppercase text-[9px] lg:text-[10px] font-black tracking-tighter lg:tracking-widest ${filter === f
                    ? "btn-primary"
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
                onChange={handleSearchChange}
                className="input w-full pl-12 bg-base-100/50 border-base-300/30 focus:border-primary rounded-2xl"
              />
            </div>

          </div>
        </div>
      </Animate>

      <Animate className="overflow-hidden" variant="fade-up">
        {/* Legend Header */}
        <div className="max-w-7xl mx-auto px-6 py-4 rounded-t-[1.25rem] border border-white/5 border-b-0 bg-base-200/20 backdrop-blur-3xl shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-y-6">
            <div className="flex items-center gap-3">
              <div className="h-4 w-[2px] bg-primary/40 rounded-full" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-base-content/30">
                Index Metadata
              </span>
            </div>

            <div className="grid grid-cols-2 xs:grid-cols-3 md:flex items-center gap-x-8 gap-y-4 md:gap-x-12">
              {[
                { label: "Approved", status: "approved", desc: "Verified" },
                { label: "Pending", status: "pending", desc: "Awaiting" },
                { label: "Rejected", status: "rejected", desc: "Declined" },
                { label: "Draft", status: "draft", desc: "Draft" },
                { label: "Default", status: "default", desc: "No Status" }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 transition-opacity hover:opacity-80">
                  <FileStatus status={item.status} />
                  <div className="flex flex-col leading-none">
                    <span className="text-[11px] font-black text-base-content/80 tracking-tight">{item.label}</span>
                    <span className="text-[7px] font-bold text-base-content/20 uppercase tracking-widest mt-1">{item.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Table Container */}
        <div className="max-w-7xl mx-auto">
          <div className="relative rounded-b-[1rem] border border-base-300/30 bg-base-200/20 backdrop-blur-2xl shadow-2xl overflow-hidden">
            <div className="w-full overflow-x-auto overflow-y-auto max-h-[75vh] scrollbar-custom">

              {/* Only show table if documents exist */}
              {filteredDocuments.length > 0 ? (
                <table className="table w-full border-separate border-spacing-0">
                  <thead className="sticky top-0 z-20">
                    <tr className="bg-base-300/90 backdrop-blur-md text-secondary uppercase text-[11px] font-black">
                      <th className="py-6 px-10">Asset Name & Description</th>
                      <th>Owner</th>
                      <th className="text-center">Status</th>
                      <th className="text-center">Version</th>
                      <th className="text-right px-10">Modified</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-base-300/5">
                    {filteredDocuments.map((doc) => (
                      <tr
                        key={doc.id}
                        className={`transition-colors group ${doc.is_deleted ? "bg-error/15 hover:bg-error/25" : "hover:bg-primary/5"}`}
                      >
                        <td className="py-6 px-10">
                          <Link to={`/documents/${doc.id}`} className="flex items-center gap-4 outline-none">
                            <div className="p-3 bg-base-300/30 rounded-xl group-hover:text-primary group-hover:bg-primary/10 group-hover:scale-110 transition-all duration-300">
                              {getDocumentIcon(doc.type)}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-bold text-base-content leading-tight group-hover:text-primary transition-colors text-base">{doc.title}</span>
                              <span className="text-[10px] opacity-40 font-mono italic truncate max-w-[300px]">{doc.active_version?.content || "No description provided"}</span>
                            </div>
                          </Link>
                        </td>
                        <td>
                          <Link to={`/profile/${doc.created_by}`} className="flex items-center gap-3 hover:text-primary transition-colors">
                            <div className="avatar group">
                              <div className="w-7 h-7 rounded-full ring ring-primary/10 ring-offset-base-100 ring-offset-1 group-hover:ring-primary/40 group-hover:scale-110 transition-all duration-300 overflow-hidden bg-base-300">
                                <img
                                  src={doc.created_by_avatar_url}
                                  alt={doc.created_by_username}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </div>
                            <span className="text-[11px] font-bold opacity-70">{doc.active_version?.creator_name || doc.created_by_username}</span>
                          </Link>
                        </td>
                        <td className="text-center">
                          <div className="flex justify-center scale-90">
                            <FileStatus status={doc.active_version?.status || "no_active"} />
                          </div>
                        </td>
                        <td className="text-center">
                          <span className="badge badge-sm border-none bg-primary/10 text-primary font-mono font-black px-3">v{doc.active_version?.version_number || "1"}</span>
                        </td>
                        <td className="text-right px-10 text-[11px] opacity-60">
                          <div className="flex flex-col items-end">
                            <span className="font-bold text-base-content/80">{
                              new Date(doc.updated_at).toLocaleDateString('en-GB', {
                                day: 'numeric',
                                month: 'short'
                              }) + ', ' + new Date(doc.updated_at).getFullYear()
                            }</span>
                            <span className="text-[9px] opacity-50 font-mono uppercase">{
                              new Date(doc.updated_at).toLocaleTimeString(undefined, {
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                                hour12: true
                              })}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                /* SINGLE EMPTY STATE UI - Only shows when filtered list is 0 */
                <div className="flex flex-col items-center justify-center py-40 opacity-20 gap-4">
                  <AlertCircle size={80} strokeWidth={1} />
                  <div className="text-center">
                    <p className="text-xl font-black uppercase tracking-[0.3em]">Accessing Empty Index</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest mt-2">No documents match the current criteria</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Pagination */}
        <div className="max-w-7xl mx-auto mt-6 flex flex-col md:flex-row items-center justify-between gap-6 pb-10">
          <div className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">
            Matches Found: {paginationInfo.count}
          </div>
          <div className="join border border-base-300/30 bg-base-200/50 rounded-2xl p-1 shadow-lg">
            <button
              className="join-item btn btn-sm btn-ghost hover:bg-base-300/70"
              onClick={() => { setCurrentPage(p => Math.max(p - 1, 1)); window.scrollTo(0, 0); }}
              disabled={!paginationInfo.hasPrev || loading}
            >
              <ChevronLeft size={16} />
            </button>
            <button className="join-item px-4 no-animation cursor-default">
              <span className="opacity-40 mr-2 uppercase text-[10px] font-black">Page</span>
              <span className="text-primary font-black">{currentPage}</span>
              <span className="mx-2 opacity-20">/</span>
              <span className="opacity-40 font-bold">{Math.ceil(paginationInfo.count / PAGE_SIZE) || 1}</span>
            </button>
            <button
              className="join-item btn btn-sm btn-ghost hover:bg-base-300/70"
              onClick={() => { setCurrentPage(p => p + 1); window.scrollTo(0, 0); }}
              disabled={!paginationInfo.hasNext || loading}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

      </Animate>
    </div>
  );
}

export default DocumentsPage;