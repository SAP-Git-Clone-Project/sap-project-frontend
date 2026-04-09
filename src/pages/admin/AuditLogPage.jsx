import { useState, useEffect, useCallback, useMemo } from "react";
import { Search, Activity, FileText, ChevronLeft, ChevronRight, Calendar, FilterX, TextSearch, UserPlus, LogIn, Trash2, Edit3, Tags } from "lucide-react";
import Animate from "@/components/animation/Animate.jsx";
import api from "@/components/api/api";
import notify from "@/components/toaster/notify";
import Loader from "@/components/widgets/Loader.jsx";
import { Link } from "react-router-dom";

const GLOBAL_GROUPS = [
  { id: "CREATE", label: "Creation", icon: <UserPlus size={14} />, values: ["create document", "create user", "create version"], color: "bg-success" },
  { id: "UPDATE", label: "Updates", icon: <Edit3 size={14} />, values: ["update document", "update user", "update permission", "update metadata"], color: "bg-warning" },
  { id: "DELETE", label: "Deletions", icon: <Trash2 size={14} />, values: ["delete document", "delete user", "delete version"], color: "bg-error" },
  { id: "AUTH", label: "Access", icon: <LogIn size={14} />, values: ["login", "logout"], color: "bg-info" },
  { id: "REVIEW", label: "Reviews", icon: <TextSearch size={14} />, values: ["approve version", "reject version"], color: "bg-accent" },
];

const AuditLogPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(50);
  const [paginationInfo, setPaginationInfo] = useState({ count: 0, hasNext: false, hasPrev: false });

  // Filter States
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedGroups, setSelectedGroups] = useState([]);

  const totalPages = Math.ceil(paginationInfo.count / pageSize) || 1;

  const backendActions = useMemo(() => {
    return selectedGroups.flatMap(gid => GLOBAL_GROUPS.find(g => g.id === gid)?.values || []);
  }, [selectedGroups]);

  const toggleGroup = (groupId) => {
    setSelectedGroups(prev => prev.includes(groupId) ? prev.filter(g => g !== groupId) : [...prev, groupId]);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSelectedGroups([]);
    setStartDate("");
    setEndDate("");
    setSearchTerm("");
    setCurrentPage(1);
  };

  // const fetchLogs = useCallback(async () => {
  //   setLoading(true);
  //   try {
  //     const params = { page: currentPage, search: searchTerm };
  //     if (startDate) params.start_date = startDate;
  //     if (endDate) params.end_date = endDate;
  //     if (backendActions.length > 0) params.action = backendActions;

  //     const res = await api.get(`/audit-log/logs/`, {
  //       params,
  //       paramsSerializer: { indexes: null }
  //     });

  //     const rawArray = res.data.results || [];
  //     setLogs(rawArray.map(item => ({
  //       id: item.id,
  //       user: item.username || "Unknown User",
  //       user_id: item.user || "unknown",
  //       action: item.action_type || "Unknown",
  //       description: item.description || "No technical details provided.",
  //       target: item.document_title || "Root System",
  //       ip: item.ip_address || "0.0.0.0",
  //       created_by_avatar_url: item.created_by_avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.username || "Unknown")}`,
  //       time: item.timestamp
  //     })));

  //     setPaginationInfo({
  //       count: res.data.count || 0,
  //       hasNext: !!res.data.next,
  //       hasPrev: !!res.data.previous
  //     });
  //   } catch (err) {
  //     notify.error("Failed to fetch logs");
  //   } finally {
  //     setLoading(false);
  //   }
  // }, [currentPage, searchTerm, backendActions, startDate, endDate]);

  // useEffect(() => {
  //   const delayDebounceFn = setTimeout(() => fetchLogs(), 300);
  //   return () => clearTimeout(delayDebounceFn);
  // }, [fetchLogs]);

  const fetchLogs = useCallback(async (signal) => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        search: searchTerm.trim()
      };

      if (startDate) params.start_date = startDate;
      if (endDate) params.end_date = endDate;

      // Convert array to string or handle as multi-param based on API needs
      if (backendActions.length > 0) params.action = backendActions;

      const res = await api.get(`/audit-log/logs/`, {
        params,
        paramsSerializer: { indexes: null },
        signal,
      });

      const { results, count, next, previous } = res.data;

      // Map and set in one go
      setLogs((results || []).map(item => ({
        id: item.id,
        user: item.username || "Unknown User",
        user_id: item.user || "unknown",
        action: item.action_type || "Unknown",
        description: item.description || "No technical details provided.",
        target: item.document_title || "Root System",
        ip: item.ip_address || "0.0.0.0",
        created_by_avatar_url: item.created_by_avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.username || "Unknown")}`,
        time: item.timestamp
      })));

      setPaginationInfo({
        count: count || 0,
        hasNext: !!next,
        hasPrev: !!previous
      });
    } catch (err) {
      // Don't show error if request was simply canceled
      if (err.name !== 'CanceledError') {
        notify.error("Failed to fetch logs");
      }
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, backendActions, startDate, endDate]);

  useEffect(() => {
    const controller = new AbortController();

    // Increased slightly to 400ms for better server mercy
    const delayDebounceFn = setTimeout(() => {
      fetchLogs(controller.signal);
    }, 400);

    return () => {
      controller.abort();
      // Cancel pervious request if still pending
      clearTimeout(delayDebounceFn);
    };
  }, [fetchLogs]);

  const getActionColor = (action) => {
    const a = action?.toLowerCase() || "";
    if (a.includes('delete') || a.includes('fail')) return 'badge-error';
    if (a.includes('create') || a.includes('add')) return 'badge-success';
    if (a.includes('update') || a.includes('edit') || a.includes('metadata')) return 'badge-warning';
    if (a.includes('login') || a.includes('logout')) return 'badge-info';
    if (a.includes('approve') || a.includes('reject')) return 'badge-accent';
    return 'badge-primary';
  };

  if (loading && logs.length === 0) return <Loader message="Loading audit logs..." />;

  return (
    <div className="relative min-h-screen px-6 pb-12 pt-20 overflow-hidden font-sans bg-base-100">
      <Animate variant="fade-down">
        <div className="max-w-7xl mx-auto mb-12">
          {/* Header Row */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-primary mb-2">
                <Activity size={18} />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">System Vitality</span>
              </div>
              <h1 className="text-5xl font-black tracking-tighter text-base-content">
                System <span className="text-primary">Audit</span>
              </h1>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative w-full sm:w-80">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40" />
                <input
                  type="text"
                  placeholder="Search by multiple criteria..."
                  className="input w-full pl-12 bg-base-200/50 border-base-300/30 focus:border-primary rounded-2xl font-bold placeholder-gray-700"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button onClick={clearFilters} className="btn btn-ghost border border-base-300/30 rounded-2xl gap-2 text-[10px] font-black uppercase hover:bg-rose-500/10 hover:text-rose-500 transition-all">
                <FilterX size={16} /> Reset
              </button>
            </div>
          </div>

          {/* Filter Panel */}
          <div className="bg-base-200/40 border border-base-300/30 rounded-[2.5rem] p-6 lg:p-10 backdrop-blur-xl shadow-2xl flex flex-col gap-10">

            {/* Filter by Type - Border 0 when selected */}
            <div className="space-y-4">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 flex items-center gap-2">
                <Tags size={14} className="text-primary" /> Action Types
              </span>
              <div className="flex flex-wrap gap-3 flex-col md:flex-row">
                {GLOBAL_GROUPS.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => toggleGroup(opt.id)}
                    className={`btn btn-md rounded-2xl font-black uppercase text-[11px] transition-all px-6 group border-0 ${selectedGroups.includes(opt.id)
                      ? `${opt.color} text-white shadow-xl scale-105`
                      : 'bg-base-100 text-base-content/50 hover:bg-base-300 shadow-sm'
                      }`}
                  >
                    <span className="opacity-70 group-hover:scale-110 transition-transform">{opt.icon}</span>
                    <span className="ml-2">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="h-px bg-base-content/5 w-full"></div>

            {/* Improved Date Visualization (No Time) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="space-y-4">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 flex items-center gap-2 text-success">
                  <Calendar size={14} /> Entry Point
                </span>
                <div className="join w-full shadow-lg border border-base-300/30 rounded-[1.2rem] overflow-hidden">
                  <div className="join-item bg-base-100 flex items-center px-4 border-r border-base-300/30">
                    <Calendar size={16} className="opacity-30" />
                  </div>
                  <input
                    type="date"
                    className="join-item input bg-base-100 w-full focus:outline-none font-black text-xs p-0 px-4"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 flex items-center gap-2 text-error">
                  <Calendar size={14} /> Exit Point
                </span>
                <div className="join w-full shadow-lg border border-base-300/30 rounded-[1.2rem] overflow-hidden">
                  <div className="join-item bg-base-100 flex items-center px-4 border-r border-base-300/30">
                    <Calendar size={16} className="opacity-30" />
                  </div>
                  <input
                    type="date"
                    className="join-item input bg-base-100 w-full focus:outline-none font-black text-xs p-0 px-4"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Animate>

      {/* REVERTED TABLE DESIGN */}
      <Animate>
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="relative rounded-[2rem] border border-base-300/30 bg-base-200/20 backdrop-blur-2xl shadow-2xl overflow-hidden">
            <div className="overflow-x-auto overflow-y-auto max-h-[70vh] scrollbar-custom">
              <table className="table w-full border-separate border-spacing-0">
                <thead className="sticky top-0 z-20">
                  <tr className="bg-base-300/95 backdrop-blur-md text-secondary uppercase text-[11px] font-black">
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
                        <div className="flex flex-col gap-3 min-w-0">
                          <Link to={`/profile/${log.user_id}`}>
                            <div className="flex items-center justify-center gap-3">
                              <div className="avatar">
                                <div className="w-10 h-10 rounded-full ring-2 ring-primary/10 group-hover:ring-primary/40 group-hover:scale-110 transition-all duration-300 overflow-hidden bg-base-300">
                                  <img src={log.created_by_avatar_url} alt="avatar" className="w-full h-full object-cover" />
                                </div>
                              </div>
                              <span className="font-bold text-sm tracking-tight">{log.user}</span>
                            </div>
                          </Link>
                          <div className="flex flex-col gap-1.5 w-full">
                            <div className="flex items-center w-full overflow-hidden border border-blue-500/20 bg-blue-500/5 rounded-[0.6rem] p-1 py-1.5 shadow-sm">
                              <div className="bg-blue-500 w-12 flex justify-center py-0.5 rounded-[0.5rem] ml-1 shrink-0"><span className="text-[9px] font-black uppercase tracking-tight text-white">User</span></div>
                              <span className="px-3 text-[10px] font-mono font-medium text-blue-600 dark:text-blue-400 truncate">{log.user_id}</span>
                            </div>
                            <div className="flex items-center w-full overflow-hidden border border-slate-500/20 bg-slate-500/5 rounded-[0.6rem] p-1 py-1.5 shadow-sm">
                              <div className="bg-slate-500 w-12 flex justify-center py-0.5 rounded-[0.5rem] ml-1 shrink-0"><span className="text-[9px] font-black uppercase tracking-tight text-white">Log</span></div>
                              <span className="px-3 text-[10px] font-mono font-medium text-slate-600 dark:text-slate-400 truncate">{log.id}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-6">
                        <div className="flex flex-col gap-2 max-w-md">
                          <div className="flex items-center gap-2">
                            <span className={`badge badge-sm font-black py-3 px-3 uppercase text-[9px] ${getActionColor(log.action)} text-white border-none shadow-sm`}>
                              {log.action}
                            </span>
                            <span className="text-[10px] opacity-40 font-bold uppercase flex flex-row items-center"><FileText size={10} className="inline mr-1" /> {log.target}</span>
                          </div>
                          <div className="bg-base-300/10 p-3 rounded-xl border border-base-300/20 text-[11px] font-medium opacity-80">{log.description}</div>
                        </div>
                      </td>
                      <td className="text-center">
                        <div className="relative flex justify-center items-center">
                          <div className="tooltip tooltip-primary font-mono text-[10px] before:z-[100] after:z-[100]" data-tip={log.ip}>
                            <div className="badge badge-outline h-8 opacity-30 group-hover:opacity-100 transition-opacity cursor-help border-base-content/20 px-3 font-mono">***.***.***</div>
                          </div>
                        </div>
                      </td>
                      <td className="text-[11px] opacity-60 px-10 font-mono text-center">
                        <div className="flex flex-col items-end">
                          <span className="font-black text-base-content tracking-tighter">{
                            new Date(log.time).toLocaleTimeString(undefined, {
                              hour: '2-digit',
                              minute: '2-digit',
                              second: '2-digit',
                              hour12: true
                            })}
                          </span>
                          <span className="text-[9px] font-bold opacity-30 uppercase tracking-widest">{
                            new Date(log.time).toLocaleDateString("en-GB", {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-10">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Matches Found: {paginationInfo.count}</div>
            <div className="join border border-base-300/30 bg-base-200/50 rounded-2xl p-1 shadow-lg">
              <button className="join-item btn btn-sm btn-ghost hover:bg-base-300/70" onClick={() => { setCurrentPage(p => Math.max(p - 1, 1)); window.scrollTo(0, 0); }} disabled={!paginationInfo.hasPrev || loading}><ChevronLeft size={16} /></button>
              <button className="join-item px-4 no-animation cursor-default">
                <span className="opacity-40 mr-2 uppercase text-[10px] font-black">Page</span>
                <span className="text-primary font-black">{currentPage}</span>
                <span className="mx-2 opacity-20">/</span>
                <span className="opacity-40 font-bold">{totalPages}</span>
              </button>
              <button className="join-item btn btn-sm btn-ghost hover:bg-base-300/70" onClick={() => { setCurrentPage(p => p + 1); window.scrollTo(0, 0); }} disabled={!paginationInfo.hasNext || loading}><ChevronRight size={16} /></button>
            </div>
          </div>
        </div>
      </Animate>
    </div>
  );
}

export default AuditLogPage;