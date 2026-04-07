import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Bell, Check, ArrowRight, CheckCircle2, MailOpen,
  Search, AlertCircle, ShieldAlert, Trash2,
  ChevronLeft, ChevronRight
} from "lucide-react";

import Animate from "@/components/animation/Animate.jsx";
import api from "@/components/api/api.js";
import Loader from "@/components/widgets/Loader.jsx";
import { useAuth } from "@/context/AuthContext";
import notify from "@/components/toaster/notify";

const FILTERS = ["all", "unread", "read"];

const NOTIFICATION_TYPES = {
  access: { icon: ShieldAlert, color: "secondary", label: "Permission" },
  approval: { icon: CheckCircle2, color: "success", label: "Registry" },
  default: { icon: Bell, color: "primary", label: "System" }
};

const getNotifyConfig = (verb) => {
  const v = verb?.toLowerCase() || "";
  if (v.includes("access")) return NOTIFICATION_TYPES.access;
  if (v.includes("approv") || v.includes("grant")) return NOTIFICATION_TYPES.approval;
  return NOTIFICATION_TYPES.default;
};

const ViewAllNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  
  const [searchInput, setSearchInput] = useState(""); 
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [paginationInfo, setPaginationInfo] = useState({
    count: 0,
    totalPages: 1,
    hasNext: false,
    hasPrev: false
  });

  // Handle Search Debouncing
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setCurrentPage(1); 
    }, 300);
    return () => clearTimeout(handler);
  }, [searchInput]);

  // Fetch Logic (Memoized to prevent unnecessary re-renders)
  const fetchNotifications = useCallback(async (isSilent = false) => {
    // isSilent=true means don't show the big loading spinner (used for live updates)
    if (!isSilent) setLoading(true);
    
    try {
      const res = await api.get("/notifications/", {
        params: {
          page: currentPage,
          status: filter,
          q: debouncedSearch,
          page_size: 50
        }
      });

      setNotifications(res.data?.notifications || []);
      setUnreadCount(res.data?.unread_count || 0);
      setPaginationInfo(res.data?.pagination || { count: 0, totalPages: 1 });
    } catch (err) {
      console.error("Fetch failed", err);
      // We don't notify.error here to avoid spamming the user during live background refreshes
    } finally {
      if (!isSilent) setLoading(false);
    }
  }, [currentPage, filter, debouncedSearch]);

  // Initial Load & Live Update Interval
  useEffect(() => {
    fetchNotifications();

    // Set up polling (Live Update every 5 seconds)
    const interval = setInterval(() => {
      fetchNotifications(true); 
    }, 5000);

    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const markAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read/`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
      notify.success("Record marked as read");
    } catch (err) {
      notify.error("Update failed");
    }
  };

  const deleteNotification = async (id) => {
    try {
      await api.delete(`/notifications/${id}/delete/`);
      setNotifications(prev => prev.filter(n => n.id !== id));
      // Refresh count/list after deletion to ensure pagination matches
      fetchNotifications(true);
      notify.success("Entry purged");
    } catch (err) {
      notify.error("Deletion failed");
    }
  };

  const markAllRead = async () => {
    if (unreadCount === 0) return;
    try {
      await api.post("/notifications/mark-all-read/");
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
      notify.success("All archives cleared");
    } catch (err) {
      notify.error("Action failed");
    }
  };

  if (loading && notifications.length === 0) return <Loader message="Accessing Registry..." />;

  return (
    <div className="min-h-screen bg-base-100 px-6 pb-20 pt-20 overflow-hidden">
      {/* Header */}
      <Animate variant="fade-down">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-1">
            <div className="flex items-center gap-3 text-primary mb-3">
              <Bell size={18} className={unreadCount > 0 ? "animate-pulse" : ""} />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">Notification Registry</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-base-content leading-[0.9]">
              Hello, <span className="text-primary">{user?.first_name || "Agent"}</span>
            </h1>
          </div>
          <button
            onClick={markAllRead}
            disabled={unreadCount === 0}
            className={`btn rounded-2xl border-none px-8 transition-all shadow-lg ${unreadCount === 0 ? 'btn-disabled opacity-30' : 'btn-primary hover:scale-105 shadow-primary/20'}`}
          >
            <MailOpen size={20} /> Mark All Read ({unreadCount})
          </button>
        </div>
      </Animate>

      {/* Toolbar */}
      <Animate variant="fade-up">
        <div className="max-w-7xl mx-auto mb-8 rounded-2xl border border-base-300/30 bg-base-200/40 backdrop-blur-md p-2 lg:p-3">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-3">
            <div className="grid grid-cols-3 lg:flex gap-1 w-full lg:w-auto">
              {FILTERS.map((f) => (
                <button 
                  key={f} 
                  onClick={() => { setFilter(f); setCurrentPage(1); }} 
                  className={`btn btn-xs sm:btn-sm rounded-xl px-5 border-none uppercase text-[9px] lg:text-[10px] font-black tracking-widest ${filter === f ? "btn-primary shadow-lg shadow-primary/20" : "btn-ghost text-secondary hover:bg-base-300"}`}
                >
                  {f}
                </button>
              ))}
            </div>
            <div className="relative w-full lg:max-w-[280px]">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-20" />
              <input 
                type="text" 
                placeholder="Search logs..." 
                value={searchInput} 
                onChange={(e) => setSearchInput(e.target.value)} 
                className="input w-full pl-12 bg-base-100/50 border-base-300/30 focus:border-primary rounded-2xl" 
              />
            </div>
          </div>
        </div>
      </Animate>

      {/* Table Content */}
      <Animate variant="fade-up">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="relative rounded-[1rem] border border-base-300/30 bg-base-200/20 backdrop-blur-2xl shadow-2xl overflow-hidden">
            <div className="overflow-x-auto overflow-y-auto max-h-[75vh]">
              <table className="table w-full border-separate border-spacing-0">
                <thead className="sticky top-0 z-20">
                  <tr className="bg-base-300/90 backdrop-blur-md text-secondary uppercase text-[11px] font-black">
                    <th className="py-6 px-10">User Identity</th>
                    <th>Action Details</th>
                    <th className="text-center">Category</th>
                    <th className="text-center">Control</th>
                    <th className="text-right px-10">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-base-300/5">
                  {notifications.map((n) => {
                    const config = getNotifyConfig(n.verb);
                    const rowClass = n.is_read
                      ? "bg-success/[0.03] opacity-70 italic"
                      : "bg-base-100 border-l-4 border-l-primary";

                    return (
                      <tr key={n.id} className={`hover:bg-primary/5 transition-all duration-300 group ${rowClass}`}>
                        <td className="py-6 px-10">
                          <div className="flex items-center gap-3">
                            <div className="avatar">
                              <div className={`w-10 h-10 rounded-full ring-2 ring-primary/10 overflow-hidden bg-base-300 transition-all ${n.is_read ? 'grayscale opacity-50' : 'group-hover:scale-110'}`}>
                                <img src={n.user_avatar} alt="" className="w-full h-full object-cover" />
                              </div>
                            </div>
                            <span className={`font-bold text-sm ${n.is_read ? 'text-base-content/50' : 'text-primary'}`}>
                              {n.user_username}
                            </span>
                          </div>
                        </td>
                        <td className="py-6">
                          <div className="flex flex-col gap-1">
                            <div className={`text-sm ${n.is_read ? 'font-normal text-base-content/60' : 'font-bold text-base-content'}`}>
                              {n.verb} <span className="italic underline decoration-primary/30">"{n.target_document_title}"</span>
                            </div>
                            {n.target_document_id && (
                              <Link to={`/documents/${n.target_document_id}`} className="text-[10px] text-primary font-black uppercase flex items-center gap-1 hover:gap-2 transition-all">
                                View Record <ArrowRight size={10} />
                              </Link>
                            )}
                          </div>
                        </td>
                        <td className="text-center">
                          <span className={`badge badge-sm font-black py-3 px-3 uppercase text-[9px] border-none ${n.is_read ? 'bg-base-300 text-base-content/40' : `bg-${config.color}/10 text-${config.color}`}`}>
                            {config.label}
                          </span>
                        </td>
                        <td className="text-center">
                          <div className="flex items-center justify-center gap-2">
                            {!n.is_read ? (
                              <button onClick={() => markAsRead(n.id)} className="btn btn-xs btn-primary rounded-lg uppercase text-[9px] font-black">
                                <Check size={12} /> Resolve
                              </button>
                            ) : (
                              <div className="flex items-center gap-1 text-success font-black uppercase text-[9px] bg-success/10 px-2 py-1 rounded-md">
                                <CheckCircle2 size={10} /> Archived
                              </div>
                            )}
                            <button onClick={() => deleteNotification(n.id)} className="btn btn-xs btn-ghost text-error/30 hover:text-error hover:bg-error/10 rounded-lg p-1 transition-colors">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                        <td className={`text-right px-10 text-[11px] font-mono ${n.is_read ? 'opacity-30' : 'opacity-60'}`}>
                          {new Date(n.created_at).toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {notifications.length === 0 && !loading && (
                <div className="flex flex-col items-center justify-center py-40 opacity-20 gap-4">
                  <AlertCircle size={80} strokeWidth={1} />
                  <p className="text-xl font-black uppercase tracking-[0.3em]">No Records Found</p>
                </div>
              )}
            </div>
          </div>

          {/* Pagination Controls */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-10">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">
              Matches Found: {paginationInfo.count}
            </div>

            <div className="join border border-base-300/30 bg-base-200/50 rounded-2xl p-1">
              <button
                className="join-item btn btn-sm btn-ghost hover:bg-primary hover:text-primary-content transition-colors"
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                disabled={!paginationInfo.hasPrev || loading}
              >
                <ChevronLeft size={16} />
              </button>

              <button className="join-item px-6 no-animation cursor-default flex items-center justify-center gap-2 rounded-lg">
                <span className="opacity-40 uppercase text-[10px] font-black">Page</span>
                <span className="text-primary font-black text-sm">{currentPage}</span>
                <span className="opacity-20 text-xs">of</span>
                <span className="opacity-40 font-bold text-sm">{paginationInfo.totalPages}</span>
              </button>

              <button
                className="join-item btn btn-sm btn-ghost hover:bg-primary hover:text-primary-content transition-colors"
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
};

export default ViewAllNotifications;