import { useState, useEffect } from "react";
import { Search, Globe, Activity, FileText, AlertCircle, Info, ChevronLeft, ChevronRight } from "lucide-react";
import Animate from "@/components/animation/Animate.jsx";
import api from "@/components/api/api";
import notify from "@/components/toaster/notify";
import Loader from "@/components/widgets/Loader.jsx"

export default function AuditLogPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(50);
  const [paginationInfo, setPaginationInfo] = useState({ count: 0, hasNext: false, hasPrev: false });

  const totalPages = Math.ceil(paginationInfo.count / pageSize) || 1;

  // Reset to page 1 whenever the search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/audit-log/logs/`, {
          params: {
            page: currentPage,
            search: searchTerm, // DRF SearchFilter looks for the 'search' key
          }
        });

        // Map results
        const rawArray = res.data.results || [];
        setLogs(rawArray.map(item => ({
          id: item.id,
          user: item.username || "Unknown User",
          action: item.action_type || "Unknown",
          description: item.description || "No technical details provided.",
          target: item.document_title || "Root System",
          ip: item.ip_address || "0.0.0.0",
          created_by_avatar_url: item.created_by_avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.username || "Unknown")}`,
          time: item.timestamp
        })));

        setPaginationInfo({
          count: res.data.count || 0,
          hasNext: !!res.data.next,
          hasPrev: !!res.data.previous
        });
      } catch (err) {
        notify.error("Vault Connection Failed.");
      } finally {
        setLoading(false);
      }
    };

    // Debounce logic: Wait 300ms after typing stops before calling API
    const delayDebounceFn = setTimeout(() => {
      fetchLogs();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [currentPage, searchTerm]);

  const getActionColor = (action) => {
    const a = action?.toLowerCase() || "";
    if (a.includes('delete') || a.includes('fail')) return 'badge-error';
    if (a.includes('create') || a.includes('add')) return 'badge-success';
    if (a.includes('update') || a.includes('edit')) return 'badge-warning';
    return 'badge-primary';
  };

  if (loading && logs.length === 0) return <Loader message="Accessing secure logs..." />;

  return (
    <div className="min-h-screen bg-base-100 px-6 pb-12 pt-20 overflow-hidden font-sans">
      <Animate variant="fade-down">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-primary mb-2">
              <Activity size={18} />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">System Vitality</span>
            </div>
            <h1 className="text-5xl font-black tracking-tighter text-base-content">
              System <span className="text-primary">Audit</span>
            </h1>
          </div>

          <div className="relative w-full md:w-80">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40" />
            <input
              type="text"
              placeholder="Search protocol..."
              className="input w-full pl-12 bg-base-100/50 border-base-300/30 focus:border-primary rounded-2xl"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </Animate>

      <Animate>
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="relative rounded-[1rem] border border-base-300/30 bg-base-200/20 backdrop-blur-2xl shadow-2xl overflow-hidden">
            <div className="overflow-x-auto overflow-y-auto max-h-[75vh] scrollbar-custom">
              <table className="table w-full border-separate border-spacing-0">
                <thead className="sticky top-0 z-20">
                  <tr className="bg-base-300/90 backdrop-blur-md text-secondary uppercase text-[11px] font-black">
                    <th className="py-6 px-10">User Identity</th>
                    <th>Action Details</th>
                    <th className="text-center">IP</th>
                    <th className="text-right px-10">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-base-300/5">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-primary/5 transition-colors group">
                      <td className="py-6 px-10">
                        <div className="flex items-center gap-4">
                          {/* flex-shrink-0 prevents the circle from turning into an oval if text is long */}
                          <div className="flex-shrink-0">
                            <img
                              src={log.created_by_avatar_url}
                              alt="avatar"
                              className="w-10 h-10 rounded-full object-cover ring-2 ring-base-content/5 bg-base-300"
                            />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="font-bold text-sm uppercase tracking-tight truncate">
                              {log.user}
                            </span>
                            <span className="text-[10px] opacity-30 font-mono truncate">
                              {log.id}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-6">
                        <div className="flex flex-col gap-2 max-w-md">
                          <div className="flex items-center gap-2">
                            <span className={`badge badge-sm font-black py-3 px-3 uppercase text-[9px] ${getActionColor(log.action)} text-white border-none`}>
                              {log.action}
                            </span>
                            <span className="text-[10px] opacity-40 font-bold uppercase"><FileText size={10} className="inline mr-1" /> {log.target}</span>
                          </div>
                          <div className="bg-base-300/10 p-3 rounded-xl border border-base-300/20 text-[11px] font-medium opacity-80">
                            {log.description}
                          </div>
                        </div>
                      </td>
                      <td className="text-center">
                        {/* Added relative and z-index to the cell to ensure it can stack above the header */}
                        <div className="relative flex justify-center items-center">
                          <div
                            className="tooltip tooltip-primary font-mono text-[10px] before:z-[100] after:z-[100]"
                            data-tip={log.ip}
                          >
                            <div className="badge badge-outline h-8 opacity-30 group-hover:opacity-100 transition-opacity cursor-help border-base-content/20 px-3">
                              ***.***.***
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="text-[11px] opacity-60 text-right px-10 font-mono">
                        {new Date(log.time).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* DaisyUI Pagination Group */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-10">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">
              Matches Found: {paginationInfo.count}
            </div>

            <div className="join border border-base-300/30 bg-base-200/50 rounded-2xl p-1">
              <button
                className="join-item btn btn-sm btn-ghost hover:bg-base-300/70"
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                disabled={!paginationInfo.hasPrev || loading}
              >
                <ChevronLeft size={16} />
              </button>

              <button className="join-item px-2 no-animation cursor-default">
                <span className="opacity-40 mr-2 uppercase text-[10px] font-black">Page</span>
                <span className="text-primary font-black">{currentPage}</span>
                <span className="mx-2 opacity-20">/</span>
                <span className="opacity-40 font-bold">{totalPages}</span>
              </button>

              <button
                className="join-item btn btn-sm btn-ghost hover:bg-base-300/70"
                onClick={() => setCurrentPage(p => p + 1)}
                disabled={!paginationInfo.hasNext || loading}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </Animate>
    </div>
  );
}