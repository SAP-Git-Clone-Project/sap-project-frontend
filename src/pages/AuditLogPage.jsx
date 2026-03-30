import { useState } from "react";
import Animate from "@/components/animation/Animate.jsx";
import { Search, Activity, ShieldAlert, Clock, FileText } from "lucide-react";

// MOCK DATA 
const MOCK_LOGS = [
  { id: 1, user_id: 101, username: "Ivan Petrov", action_type: "create document", target_id: 50, timestamp: "2026-03-30 10:15:02" },
  { id: 2, user_id: 102, username: "Maria Ivanova", action_type: "approve version", target_id: 122, timestamp: "2026-03-30 09:45:12" },
  { id: 3, user_id: 101, username: "Ivan Petrov", action_type: "export (pdf, txt. etc)", target_id: 50, timestamp: "2026-03-30 08:30:00" },
  { id: 4, user_id: 103, username: "Georgi Dimitrov", action_type: "reject version", target_id: 125, timestamp: "2026-03-29 16:20:55" },
  { id: 5, user_id: 104, username: "Anna Petrova", action_type: "login", target_id: null, timestamp: "2026-03-29 09:00:01" },
];

export default function AuditLogPage() {
  const [logs] = useState(MOCK_LOGS);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredLogs = logs.filter(log => 
    log.action_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="px-6 pt-10 pb-16 space-y-12 bg-base-100 min-h-screen">
      {/* Header */}
      <Animate variant="fade-down">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">System Audit Logs</h1>
            <p className="text-base-content/60 italic">
              Tracking ENUM: create, delete, export, login/logout, and version decisions.
            </p>
          </div>
          
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" size={18} />
            <input 
              type="text" 
              placeholder="Search by user or action type..." 
              className="input input-bordered w-full pl-10 bg-base-200/50 backdrop-blur border-base-300/40 focus:border-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </Animate>

      <Animate>
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="card bg-base-200/70 border border-base-300/40 backdrop-blur p-6 flex flex-row items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-xl text-primary"><Activity size={24} /></div>
            <div>
              <p className="text-2xl font-bold">{logs.length}</p>
              <p className="text-xs text-base-content/60 uppercase">Total Logged Actions</p>
            </div>
          </div>

          <div className="card bg-error/10 border border-error/20 backdrop-blur p-6 flex flex-row items-center gap-4">
            <div className="p-3 bg-error/10 rounded-xl text-error"><ShieldAlert size={24} /></div>
            <div>
              <p className="text-2xl font-bold">{logs.filter(l => l.action_type.includes('delete') || l.action_type.includes('reject')).length}</p>
              <p className="text-xs text-base-content/60 uppercase">Critical/Rejections</p>
            </div>
          </div>

          <div className="card bg-success/10 border border-success/20 backdrop-blur p-6 flex flex-row items-center gap-4">
            <div className="p-3 bg-success/10 rounded-xl text-success"><FileText size={24} /></div>
            <div>
              <p className="text-2xl font-bold">{logs.filter(l => l.action_type.includes('version')).length}</p>
              <p className="text-xs text-base-content/60 uppercase">Version Actions</p>
            </div>
          </div>
        </div>
      </Animate>

      <Animate>
        <div className="max-w-6xl mx-auto">
          <div className="card bg-base-200/70 border border-base-300/40 backdrop-blur p-6 shadow-xl">
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr className="text-base-content/70 border-b border-base-300/50">
                    <th>ID</th>
                    <th>User (ID)</th>
                    <th>Action Type (ENUM)</th>
                    <th>Target ID</th>
                    <th>Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map(log => (
                    <tr key={log.id} className="hover:bg-base-content/5 transition-colors">
                      <td className="font-mono text-xs opacity-50">{log.id}</td>
                      <td>
                        <div className="flex flex-col">
                          <span className="font-bold">{log.username}</span>
                          <span className="text-[10px] opacity-50 uppercase font-mono">UID: {log.user_id}</span>
                        </div>
                      </td>
                      <td>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                          log.action_type.includes('delete') || log.action_type.includes('reject') ? "bg-error/20 text-error border border-error/20" :
                          log.action_type.includes('create') || log.action_type.includes('approve') ? "bg-success/20 text-success border border-success/20" :
                          "bg-base-300 text-base-content/70"
                        }`}>
                          {log.action_type}
                        </span>
                      </td>
                      <td className="font-mono text-sm italic">
                        {log.target_id ? `#${log.target_id}` : "—"}
                      </td>
                      <td className="text-xs">
                        <div className="flex items-center gap-2 opacity-70">
                          <Clock size={12} />
                          {log.timestamp}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Animate>
    </div>
  );
}