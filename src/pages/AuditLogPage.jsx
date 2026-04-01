import { useState, useEffect, useMemo } from "react";
// Swapped ShieldCheck for Activity (Health line)
import { Search, Globe, Fingerprint, Activity, FileText, AlertCircle } from "lucide-react";

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
      agent: item.username || "System",
      action: item.action_type || "Unknown",
      target: item.document_title || "Root System",
      ip: item.ip_address || "0.0.0.0",
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
      (log.agent || "").toLowerCase().includes(q) ||
      (log.action || "").toLowerCase().includes(q) ||
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
              {/* Changed to Activity (Health line) */}
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
              style={{
                transform: "translateY(-50%) translateZ(0)",
                willChange: "transform"
              }}
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
                    <th className="py-6 px-10">Agent</th>
                    <th>Action</th>
                    <th className="text-center">IP Address</th>
                    <th>Time</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-primary/5 transition-colors group">
                      <td className="py-6 px-10">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-base-300/30 rounded-xl group-hover:text-primary transition-colors">
                            <Fingerprint size={20} />
                          </div>
                          <div>
                            <div className="font-bold">{log.agent}</div>
                            {/* Full User ID displayed here */}
                            <div className="text-[10px] opacity-40 font-mono">
                              {log.id}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td>
                        <div className="flex flex-col gap-1">
                          {/* Fixed Badge Layout for small screens: Added 'whitespace-nowrap' and 'w-fit' */}
                          <span className={`badge badge-sm border-none font-bold py-3 px-3 w-fit whitespace-nowrap ${getActionColor(log.action)} text-white`}>
                            {log.action}
                          </span>
                          <span className="text-[10px] opacity-40 flex items-center gap-1">
                            <FileText size={10} /> {log.target}
                          </span>
                        </div>
                      </td>

                      <td className="text-center">
                        {/* IP address format: Masked by default, Tooltip reveals full IP */}
                        <div className="tooltip tooltip-primary font-mono text-[11px]" data-tip={`Source: ${log.ip}`}>
                          <button className="btn btn-ghost btn-xs opacity-60 hover:opacity-100 font-mono tracking-widest p-2 h-14">
                            <Globe size={12} className="inline mr-1" />
                            ***.***.***
                          </button>
                        </div>
                      </td>

                      <td className="text-[11px] opacity-60">
                        <div className="flex flex-col">
                          <span className="font-bold">{new Date(log.time).toLocaleDateString()}</span>
                          <span className="text-[9px] opacity-50 font-mono">
                            {new Date(log.time).toLocaleTimeString()}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Empty States remain unchanged */}
            {logs.length === 0 && (
              <div className="flex flex-col items-center justify-center py-32 opacity-20 gap-4">
                <AlertCircle size={70} />
                <p className="uppercase tracking-[0.3em] font-black text-sm">No Audit Data</p>
              </div>
            )}
          </div>
        </div>
      </Animate>

      
    </div>
  );
}