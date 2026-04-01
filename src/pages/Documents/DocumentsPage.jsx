import React, { useMemo, useState, useEffect } from "react";
import {
  FileText, Plus, Search, Eye, Clock3, CheckCircle2,
  PencilLine, FileBadge, FileLock2, AlertCircle, ShieldCheck
} from "lucide-react";
import { Link } from "react-router-dom";

// Internal Components/Hooks
import Animate from "@/components/animation/Animate.jsx";
import GlassCard from "../homepage/components/GlassCard.jsx";
import FileStatus from "../homepage/components/FileStatus.jsx";
import { useAuth } from "@/context/AuthContext";
import api from "@/components/api/api";
import notify from "@/components/toaster/notify";

// --- Configuration & Mappers ---
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

  // Fetch documents
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const res = await api.get("/documents/");
        setDocuments(res.data);
      } catch (err) {
        notify.error("Failed to load documents");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDocuments();
  }, []);

  // Filtered documents logic
  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      const status = doc.active_version?.status;
      const matchesFilter = filter === "all" || status === filter;
      const matchesSearch = doc.title.toLowerCase().includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [documents, filter, search]);

  // Stats Logic - Utilizing semantic colors and glassy overlays
  const statsData = useMemo(() => [
    { label: "Total Assets", val: documents.length, icon: FileText, color: "primary", glass: "bg-primary/10" },
    { label: "Approved", val: documents.filter(d => d.active_version?.status === "approved").length, icon: CheckCircle2, color: "success", glass: "bg-success/10" },
    { label: "Pending", val: documents.filter(d => d.active_version?.status === "pending_approval").length, icon: Clock3, color: "warning", glass: "bg-warning/10" },
    { label: "In Review", val: documents.filter(d => d.active_version?.status === "draft").length, icon: PencilLine, color: "purple", glass: "bg-purple/10" },
  ], [documents]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <span className="loading loading-ring loading-lg text-primary"></span>
        <p className="text-xs font-bold tracking-[0.2em] uppercase animate-pulse text-secondary">Decrypting Vault...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[130vh] bg-base-100 px-6 pb-12 pt-20">

      {/* Header Section */}
      <Animate variant="fade-down" className="overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-primary mb-2">
              <ShieldCheck size={18} />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Governance Portal</span>
            </div>
            <h1 className="text-5xl font-black tracking-tighter text-base-content">
              Hello, <span className="text-primary">{user?.first_name || "User"}</span>
            </h1>
            <p className="text-secondary font-medium max-w-md">
              Securely manage policies, versioned documentation, and organizational protocols.
            </p>
          </div>

          <Link
            to="/documents/create"
            className="btn btn-primary rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 transition-all border-none px-8"
          >
            <Plus size={20} /> Create New Document
          </Link>
        </div>
      </Animate>

      {/* Stats Grid - Glassmorphism using your custom glassy logic */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {statsData.map((stat) => (
          <Animate key={stat.label} className="overflow-hidden">
            <GlassCard
              bg={stat.glass}
              border={`border-${stat.color}/20`}
              className="hover:translate-y-[-4px] transition-all duration-300"
            >
              <div className="p-8 flex flex-col items-center text-center">
                <div className={`p-4 rounded-[1.5rem] bg-base-200 text-${stat.color} mb-4 shadow-inner`}>
                  <stat.icon size={28} />
                </div>
                <span className="text-4xl font-black tracking-tighter text-base-content">{stat.val}</span>
                <span className="text-[10px] font-bold uppercase opacity-40 tracking-widest mt-1">
                  {stat.label}
                </span>
              </div>
            </GlassCard>
          </Animate>
        ))}
      </div>

      {/* Toolbar - Glassy effect using base-200/40 */}
      <Animate className="overflow-hidden">
        <div className="max-w-7xl mx-auto mb-8 flex flex-col lg:flex-row gap-4 items-center justify-between p-3 rounded-[2rem] bg-base-200/40 border border-base-300/30 backdrop-blur-md">
          <div className="flex gap-1 overflow-x-auto p-1 w-full lg:w-auto no-scrollbar">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`btn btn-sm rounded-xl px-6 border-none transition-all ${filter === f
                    ? "btn-primary shadow-lg shadow-primary/30"
                    : "btn-ghost text-secondary hover:bg-base-300"
                  }`}
              >
                {f.replace("_", " ").toUpperCase()}
              </button>
            ))}
          </div>

          <div className="relative w-full lg:w-80 px-2 lg:px-0">
            <Search size={18} className="absolute left-6 lg:left-4 top-1/2 -translate-y-1/2 opacity-20" />
            <input
              type="text"
              placeholder="Search assets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input w-full pl-12 bg-base-100/50 border-base-300/30 focus:border-primary backdrop-blur-sm rounded-2xl transition-all"
            />
          </div>
        </div>
      </Animate>

      {/* Main Table Container - overflow-hidden on Animate prevents scrollbars during entry */}
      <Animate className="overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative rounded-[2.5rem] border border-base-300/30 bg-base-200/20 backdrop-blur-2xl shadow-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="table w-full border-separate border-spacing-0">
                <thead>
                  <tr className="bg-base-300/40 text-secondary uppercase text-[11px] tracking-widest font-black">
                    <th className="py-6 px-10">Document Details</th>
                    <th>Ownership</th>
                    <th className="text-center">Status</th>
                    <th className="text-center">Revision</th>
                    <th>Last Modified</th>
                    <th className="text-right px-10">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-base-300/10">
                  {filteredDocuments.map((doc) => (
                    <tr key={doc.id} className="group hover:bg-primary/5 transition-all duration-300">
                      <td className="py-6 px-10">
                        <div className="flex items-center gap-5">
                          <div className="h-14 w-14 flex items-center justify-center rounded-[1.25rem] bg-base-100 text-primary border border-base-300 shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-transform">
                            {getDocumentIcon(doc.type)}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-lg leading-tight text-base-content group-hover:text-primary transition-colors">
                              {doc.title}
                            </span>
                            <span className="text-[11px] font-medium opacity-40 truncate max-w-[200px]">
                              {doc.active_version?.content || "System Managed Resource"}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td>
                        <div className="flex items-center gap-2">
                          <div className="avatar placeholder">
                            <div className="bg-neutral text-neutral-content rounded-xl w-8">
                              <span className="text-xs font-bold">
                                {(doc.active_version?.creator_name || doc.created_by_username || "?").charAt(0).toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <span className="text-xs font-bold text-secondary">
                            {doc.active_version?.creator_name || doc.created_by_username}
                          </span>
                        </div>
                      </td>

                      <td className="text-center">
                        <div className="flex justify-center scale-90">
                          <FileStatus status={doc.active_version?.status || "no_active"} />
                        </div>
                      </td>

                      <td className="text-center">
                        <span className="badge badge-ghost bg-base-300/20 border-none font-mono text-[10px] font-bold px-3 py-3 text-secondary">
                          v{doc.active_version?.version_number || "1.0"}
                        </span>
                      </td>

                      <td className="text-[11px] font-bold text-secondary opacity-60">
                        {new Date(doc.updated_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric"
                        })}
                      </td>

                      <td className="text-right px-10">
                        <Link
                          to={`/documents/${doc.id}`}
                          className="btn btn-ghost btn-sm rounded-xl hover:bg-primary hover:text-primary-content transition-all group-hover:shadow-lg"
                        >
                          <Eye size={18} />
                          <span className="hidden lg:inline ml-2 font-black uppercase text-[10px] tracking-widest">Inspect</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredDocuments.length === 0 && (
              <div className="flex flex-col items-center justify-center py-32 opacity-20 gap-4">
                <AlertCircle size={80} strokeWidth={1} />
                <p className="text-xl font-black uppercase tracking-[0.3em] italic">No Records Found</p>
              </div>
            )}
          </div>
        </div>
      </Animate>
    </div>
  );
}