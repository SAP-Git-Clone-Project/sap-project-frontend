import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Bell, Files, Clock, X, CheckCheck, Sparkles,
  Inbox, ArrowRight, User, Check
} from "lucide-react";
import api from "@/components/api/api";
import notify from "@/components/toaster/notify";

const Notifications = () => {
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const notifRef = useRef(null);

  const isFetchingRef = useRef(false);
  const abortControllerRef = useRef(null);

  const fetchNotifications = useCallback(async (isSilent = false) => {
    if (isFetchingRef.current) return;
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;
    isFetchingRef.current = true;

    try {
      const res = await api.get("/notifications/", {
        signal: controller.signal
      });
      const allNotifs = res.data.notifications || [];
      setNotifications(allNotifs.slice(0, 10));
      setUnreadCount(res.data.unread_count || 0);
    } catch (err) {
      if (err.name !== "CanceledError" && err.name !== "AbortError") {
        console.error("Failed to fetch notifications", err);
      }
    } finally {
      isFetchingRef.current = false;
    }
  }, []);

  useEffect(() => {
    // Initial fetch
    fetchNotifications();

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchNotifications(true);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Optimized Interval
    const interval = setInterval(() => {
      // Only fetch if the tab is active AND the dropdown isn't currently open 
      if (document.visibilityState === "visible") {
        fetchNotifications(true);
      }
    }, 40000);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      // Cancel any pending request when component unmounts
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchNotifications]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifOpen(false);
      }
    };
    if (notifOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [notifOpen]);

  const markAllAsRead = async () => {
    if (unreadCount === 0) return;
    try {
      await api.post("/notifications/mark-all-read/");
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
      notify.success("Inbox cleared");
    } catch (err) {
      notify.error("Action failed");
    }
  };

  const markAsRead = async (id) => {
    const targetNotif = notifications.find(n => n.id === id);
    if (targetNotif && !targetNotif.is_read) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
      try {
        await api.patch(`/notifications/${id}/read/`);
      } catch (err) {
        fetchNotifications(true);
      }
    }
  };

  const handleRequestAction = async (e, id, action) => {
    e.stopPropagation();

    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id
          ? {
            ...n,
            is_read: true,
            action_status: action,
            verb: `You ${action}ed the invitation from`
          }
          : n
      )
    );

    const target = notifications.find(n => n.id === id);
    if (target && !target.is_read) setUnreadCount(prev => Math.max(0, prev - 1));

    try {
      await api.post(`/notifications/${id}/handle-request/`, { action });
      notify.success(`Successfully ${action}ed`);
      fetchNotifications(true);
    } catch (err) {
      notify.error("Request failed");
      fetchNotifications(true);
    }
  };

  return (
    <div className="static sm:relative" ref={notifRef}>
      <button
        onClick={() => setNotifOpen(!notifOpen)}
        className={`relative w-11 h-11 flex items-center justify-center rounded-2xl transition-all duration-300 
          ${notifOpen
            ? "bg-primary text-primary-content shadow-lg shadow-primary/40"
            : "bg-base-300 text-base-content hover:bg-primary/20 hover:text-primary"
          }`}
      >
        <Bell size={20} className={unreadCount > 0 ? "animate-pulse" : ""} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-error text-error-content text-[10px] font-black rounded-full flex items-center justify-center ring-4 ring-base-100">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {notifOpen && (
        <>
          <div className="fixed inset-0 z-[100] sm:hidden" onClick={() => setNotifOpen(false)} />
          <div className="fixed top-24 right-4 sm:top-[calc(70px+1rem)] sm:right-4 z-[101] w-auto sm:w-[420px] max-w-[calc(100vw-2rem)] bg-base-100 border border-primary/20 shadow-[0_20px_50px_rgba(0,0,0,0.3)] rounded-[1.25rem] overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-top-4 duration-200 sm:origin-top-right">

            <div className="p-6 flex justify-between items-center border-b border-primary/10 bg-primary/5">
              <div className="flex flex-col">
                <h3 className="text-lg font-black tracking-tight flex items-center gap-2 text-base-content uppercase">
                  Activity <Sparkles size={16} className="text-primary" />
                </h3>
                <p className={`text-[10px] font-black uppercase tracking-widest ${unreadCount > 0 ? "text-primary" : "text-base-content/40"}`}>
                  {unreadCount} Unread Alerts
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={markAllAsRead}
                  disabled={unreadCount === 0}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all duration-300 font-bold text-[10px] uppercase
                    ${unreadCount > 0 ? "bg-primary text-primary-content hover:scale-105 active:scale-95" : "bg-base-300 text-base-content/30 cursor-not-allowed opacity-50"}`}
                >
                  <CheckCheck size={14} /> Mark All
                </button>
                <button onClick={() => setNotifOpen(false)} className="p-2 rounded-xl bg-error/20 hover:bg-error transition-all duration-200 hover:scale-105 active:scale-95">
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="max-h-[400px] overflow-y-auto custom-scrollbar bg-primary/5">
              {notifications.length > 0 ? (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => !n.is_read && markAsRead(n.id)}
                    className={`group relative p-5 flex gap-4 transition-all duration-300 cursor-pointer border-b border-primary/5 ${!n.is_read ? "bg-base-100 shadow-sm z-10" : "opacity-70 hover:opacity-100 hover:bg-base-200/50"}`}
                  >
                    <div className="relative shrink-0">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 overflow-hidden transition-transform group-hover:scale-110 ${!n.is_read ? "border-primary text-primary-content" : "border-base-300 bg-base-300 text-base-content/40"}`}>
                        {n.user_avatar ? <img src={n.user_avatar} alt="" className="w-full h-full object-cover" /> : <User size={24} strokeWidth={2.5} />}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <span className={`text-sm font-black tracking-tight ${!n.is_read ? "text-primary" : "text-base-content"}`}>{n.user_username || "System"}</span>
                        <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest opacity-40">
                          <Clock size={10} /> {n.created_since}
                        </div>
                      </div>

                      <p className="text-xs font-bold leading-relaxed text-base-content/80">
                        <span className="opacity-60">{n.verb}</span>

                        {/* Only render the quotes and title if the notification actually has a document */}
                        {n.target_document_title && (
                          <>
                            {" "}
                            <span className="text-base-content font-black group-hover:text-primary transition-colors">
                              "{n.target_document_title}"
                            </span>
                          </>
                        )}
                      </p>

                      {/* --- UPDATED BUTTONS --- */}
                      {(n.data?.type === "ROLE_REQUEST" || n.verb?.includes("invited")) && (
                        <div className="mt-4 flex gap-2">
                          {!n.action_status ? (
                            <>
                              <button
                                onClick={(e) => handleRequestAction(e, n.id, "accept")}
                                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-success/40 hover:bg-success text-white rounded-xl text-[10px] font-black uppercase hover:scale-[1.02] active:scale-95 transition-all"
                              >
                                <Check size={14} /> Accept
                              </button>
                              <button
                                onClick={(e) => handleRequestAction(e, n.id, "reject")}
                                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-black uppercase
                                bg-error/40 text-white hover:bg-error transition-all "
                              >
                                <X size={14} /> Reject
                              </button>
                            </>
                          ) : (
                            <div className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest border 
                              ${(n.action_status === 'accept' || n.verb?.toLowerCase().includes('accept'))
                                ? "bg-success/10 text-success border-success/20"
                                : "bg-error/10 text-error border-error/20"}`}>
                              {(n.action_status === 'accept' || n.verb?.toLowerCase().includes('accept')) ? 'Request Accepted' : 'Request Rejected'}
                            </div>
                          )}
                        </div>
                      )}

                      <div className="mt-3 flex items-center justify-between">
                        <p className="text-[9px] font-black text-base-content/30 uppercase tracking-[0.1em]">
                          {new Date(n.created_at).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                        {!n.is_read && <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[8px] font-black uppercase">New</span>}
                      </div>
                    </div>
                    {!n.is_read && <div className="absolute left-0 top-1 bottom-1 w-[0.3rem] rounded-r-full bg-primary shadow-[2px_0_10px_rgba(var(--p),0.4)]" />}
                  </div>
                ))
              ) : (
                <div className="py-32 flex flex-col items-center justify-center text-primary/20">
                  <div className="p-6 rounded-full bg-primary/5 mb-4"><Inbox size={64} strokeWidth={1} /></div>
                  <p className="text-[10px] font-black uppercase tracking-[0.5em]">Zero Notifications</p>
                </div>
              )}
            </div>

            <Link to="/notifications" onClick={() => setNotifOpen(false)} className="flex items-center justify-between px-8 py-5 bg-base-200 hover:bg-primary hover:text-primary-content transition-all duration-500 group border-t border-primary/10">
              <span className="text-xs font-black uppercase tracking-[0.2em]">Full Dashboard</span>
              <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
        </>
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(var(--p), 0.2); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: var(--p); }
      `}</style>
    </div>
  );
};

export default Notifications;