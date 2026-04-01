import { useState, useEffect, useMemo } from "react";
import { Search, Globe, Fingerprint, Activity, FileText, AlertCircle, Info } from "lucide-react";

import Animate from "@/components/animation/Animate.jsx";
import api from "@/components/api/api";
import notify from "@/components/toaster/notify";

export default function AuditLogPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const mapAuditData = (data) => {
    const rawArray = Array.isArray(data) ? data : (data.results || []);
    return rawArray.map(item => ({
      id: item.id,
      user: item.username || "Unknown User",
      action: item.action_type || "Unknown",
      // Added Description mapping (assuming your backend sends 'description' or 'details')
      description: item.description || "No technical details provided for this protocol.",
      target: item.document_title || "Root System",
      ip: item.ip_address || "0.0.0.0",
      created_by_avatar_url: item.created_by_avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.username || "Unknown")}&background=random&color=fff&size=128`,
      time: item.timestamp
    }));
  };

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await api.get("/audit-log/logs/");
        setLogs(mapAuditData(res.data));
      } catch (err) {
        notify.error("Vault Connection Failed.");
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const filteredLogs = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return logs;
    return logs.filter(log =>
      (log.user || "").toLowerCase().includes(q) ||
      (log.action || "").toLowerCase().includes(q) ||
      (log.description || "").toLowerCase().includes(q) ||
      (log.target || "").toLowerCase().includes(q)
    );
  }, [logs, searchTerm]);

  const getActionColor = (action) => {
    const a = action.toLowerCase();
    if (a.includes('delete') || a.includes('fail')) return 'badge-error';
    if (a.includes('create') || a.includes('add')) return 'badge-success';
    if (a.includes('update') || a.includes('edit')) return 'badge-warning';
    return 'badge-primary';
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-base-100 space-y-4">
        <span className="loading loading-ring loading-lg text-primary"></span>
        <p className="text-[10px] font-black tracking-[0.4em] uppercase text-secondary">
          Decrypting Trace...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 px-6 pb-12 pt-20 overflow-hidden">

      {/* Header Section */}
      <Animate variant="fade-down" className="overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-primary mb-2">
              <Activity size={18} />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">System Vitality</span>
            </div>
            <h1 className="text-5xl font-black tracking-tighter text-base-content ">
              System <span className="text-primary">Audit</span>
            </h1>
            <p className="text-secondary font-medium max-w-md opacity-60">
              Immutable interface for tracking high-integrity asset movements and protocol execution.
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40"
            />
            <input
              type="text"
              placeholder="Search protocol..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input w-full pl-12 bg-base-100/50 border-base-300/30 focus:border-primary rounded-2xl"
            />
          </div>
        </div>
      </Animate>

      <Animate>
        <div className="max-w-7xl mx-auto">
          <div className="relative rounded-[1rem] border border-base-300/30 bg-base-200/20 backdrop-blur-2xl shadow-2xl overflow-hidden">

            <div className="overflow-x-auto overflow-y-auto max-h-[65vh] scrollbar-custom">
              <table className="table w-full border-separate border-spacing-0">
                <thead className="sticky top-0 z-20">
                  <tr className="bg-base-300/90 backdrop-blur-md text-secondary uppercase text-[11px] font-black">
                    <th className="py-6 px-10">User Identity</th>
                    <th>Action & Protocol Details</th>
                    <th className="text-center">IP Address</th>
                    <th className="text-right px-10">Timestamp</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-base-300/5">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-primary/5 transition-colors group">

                      {/* USER COLUMN */}
                      <td className="py-6 px-10">
                        <div className="flex items-center gap-4">
                          <div className="avatar">
                            <div className="w-10 h-10 rounded-full bg-base-300 overflow-hidden transition-all">
                              <img
                                src={log.created_by_avatar_url}
                                alt={log.user}
                                className="object-cover"
                              />
                            </div>
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-sm text-base-content uppercase tracking-tight">
                              {log.user}
                            </span>
                            <span className="text-[10px] opacity-30 font-mono">
                              {log.id}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* ACTION & DESCRIPTION COLUMN */}
                      <td className="py-6">
                        <div className="flex flex-col gap-2 max-w-md">
                          <div className="flex items-center gap-2">
                            <span className={`badge badge-sm border-none font-black py-3 px-3 w-fit whitespace-nowrap uppercase text-[9px] tracking-widest ${getActionColor(log.action)} text-white`}>
                              {log.action}
                            </span>
                            <span className="text-[10px] opacity-40 flex items-center gap-1 font-bold uppercase tracking-tighter">
                              <FileText size={10} /> {log.target}
                            </span>
                          </div>
                          {/* DESCRIPTION FIELD */}
                          <div className="flex items-start gap-3 bg-base-300/10 p-3 rounded-xl border border-base-300/20 group-hover:bg-base-300/30 transition-all duration-300">
                            <div className="flex-shrink-0 mt-0.5">
                              <Info size={14} className="text-primary opacity-70" />
                            </div>

                            <p className="text-[11px] leading-relaxed text-base-content/80 font-medium break-words">
                              {log.description || "No additional protocol data available."}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* IP COLUMN */}
                      <td className="text-center">
                        {/* Added relative z-30 to lift this specific cell above the sticky header */}
                        <div className="flex justify-center items-center relative z-30">
                          <div
                            className="tooltip tooltip-primary font-mono text-[10px] before:z-[100] after:z-[100]"
                            data-tip={`VERIFIED SOURCE: ${log.ip}`}
                          >
                            <button className="
        btn btn-ghost btn-xs 
        h-10 px-4 
        bg-base-300/10 hover:bg-primary/10 
        border border-base-300/30 hover:border-primary/30 
        rounded-xl transition-all duration-300
        group/ip
      ">
                              <div className="flex items-center gap-2">
                                <Globe
                                  size={12}
                                  className="text-primary opacity-40 group-hover/ip:opacity-100 group-hover/ip:rotate-12 transition-all"
                                />
                                <span className="opacity-40 group-hover/ip:opacity-100 tracking-[0.2em]">
                                  ***.***.***
                                </span>
                              </div>
                            </button>
                          </div>
                        </div>
                      </td>

                      {/* TIMESTAMP COLUMN */}
                      <td className="text-[11px] opacity-60 text-right px-10">
                        <div className="flex flex-col">
                          <span className="font-bold text-base-content/80">
                            {new Date(log.time).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                          <span className="text-[9px] opacity-40 font-mono uppercase">
                            {new Date(log.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredLogs.length === 0 && (
              <div className="flex flex-col items-center justify-center py-32 opacity-20 gap-4">
                <AlertCircle size={70} />
                <p className="uppercase tracking-[0.3em] font-black text-sm">No Audit Data Found</p>
              </div>
            )}
          </div>
        </div>
      </Animate>
    </div>
  );
}