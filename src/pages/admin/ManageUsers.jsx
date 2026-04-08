import { useState, useEffect, useCallback, useRef } from "react";
import {
  Search, Users, ChevronLeft, ChevronRight, Calendar,
  FilterX, ShieldCheck, UserCheck, UserMinus,
  Trash2, Lock, ShieldAlert, X, AlertTriangle, Shield, UserCog
} from "lucide-react";
import Animate from "@/components/animation/Animate.jsx";
import api from "@/components/api/api";
import notify from "@/components/toaster/notify";
import Loader from "@/components/widgets/Loader.jsx";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext.jsx";

const ManageUsers = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationInfo, setPaginationInfo] = useState({ count: 0, hasNext: false, hasPrev: false });

  // Filter States
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Deletion Security State
  const [userToTerminate, setUserToTerminate] = useState(null);
  const [adminPassword, setAdminPassword] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const deleteModalRef = useRef(null);

  // Staff Toggle Security State
  const [userToToggleStaff, setUserToToggleStaff] = useState(null);
  const [staffPassword, setStaffPassword] = useState("");
  const [isTogglingStaff, setIsTogglingStaff] = useState(false);
  const staffModalRef = useRef(null);

  const pageSize = 10;
  const totalPages = Math.ceil(paginationInfo.count / pageSize) || 1;

  const canModify = (targetUser) => {
    if (!currentUser || !targetUser) return false;
    if (currentUser.id === targetUser.id) return false;
    if (currentUser.is_superuser) return !targetUser.is_superuser;
    if (currentUser.is_staff) {
      return !targetUser.is_superuser && !targetUser.is_staff;
    }
    return false;
  };

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        search: searchTerm,
      };
      if (startDate) params.start_date = startDate;
      if (endDate) params.end_date = endDate;
      if (statusFilter !== "ALL") {
        params.is_active = statusFilter === "ACTIVE" ? "true" : "false";
      }

      const res = await api.get(`/users/`, { params });
      setUsers(res.data.results || []);
      setPaginationInfo({
        count: res.data.count || 0,
        hasNext: !!res.data.next,
        hasPrev: !!res.data.previous
      });
    } catch (err) {
      notify.error("Unauthorized Access");
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, startDate, endDate, statusFilter]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchUsers();
    }, 400);
    return () => clearTimeout(delayDebounceFn);
  }, [fetchUsers]);

  const handleToggle = async (id) => {
    try {
      const res = await api.patch(`/users/${id}/toggle/`);
      setUsers(prev => prev.map(u => u.id === id ? { ...u, is_active: res.data.is_active } : u));
      notify.success(`User ${res.data.is_active ? "Activated" : "Suspended"} successfully`);
    } catch (err) {
      notify.error(err.response?.data?.detail || "Authorization denied");
    }
  };

  // Delete Modal Functions
  const openDeleteModal = (user) => {
    setUserToTerminate(user);
    setAdminPassword("");
    deleteModalRef.current?.showModal();
  };

  const closeDeleteModal = () => {
    deleteModalRef.current?.close();
    setUserToTerminate(null);
    setAdminPassword("");
  };

  const handleDelete = async () => {
    if (!adminPassword) return notify.error("Admin credentials required");

    setIsDeleting(true);
    try {
      await api.delete(`/users/${userToTerminate.id}/admin-delete/`, {
        data: { password: adminPassword },
        headers: { "Content-Type": "application/json" },
      });

      setUsers(prev => prev.filter(u => u.id !== userToTerminate.id));
      notify.success("Deletion completed successfully");
      closeDeleteModal();
    } catch (err) {
      notify.error(err.response?.data?.error || err.response?.data?.detail || "Deletion failed");
      setAdminPassword("");
    } finally {
      setIsDeleting(false);
    }
  };

  // Staff Toggle Modal Functions
  const openStaffToggleModal = (user) => {
    setUserToToggleStaff(user);
    setStaffPassword("");
    staffModalRef.current?.showModal();
  };

  const closeStaffToggleModal = () => {
    staffModalRef.current?.close();
    setUserToToggleStaff(null);
    setStaffPassword("");
  };

  const handleStaffToggle = async () => {
    if (!staffPassword) return notify.error("Superuser credentials required");

    setIsTogglingStaff(true);
    try {
      const res = await api.post(
        `/users/${userToToggleStaff.id}/toggle-admin/`,
        { password: staffPassword },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      setUsers(prev => prev.map(u => u.id === userToToggleStaff.id ? { ...u, is_staff: res.data.is_staff } : u));
      notify.success(res.data.message || `User permissions updated: ${res.data.is_staff ? "Granted Admin" : "Revoked Admin"}`);
      closeStaffToggleModal();
    } catch (err) {
      console.error("Staff toggle error:", err.response?.data, err.response?.status);

      const errorData = err.response?.data;
      let errorMsg = "Superuser authorization failed";

      if (errorData) {
        if (typeof errorData === 'string') {
          errorMsg = errorData;
        } else if (errorData.detail) {
          errorMsg = errorData.detail;
        } else if (errorData.error) {
          errorMsg = errorData.error;
        } else if (errorData.message) {
          errorMsg = errorData.message;
        } else if (errorData.non_field_errors) {
          errorMsg = Array.isArray(errorData.non_field_errors)
            ? errorData.non_field_errors[0]
            : errorData.non_field_errors;
        } else if (errorData.password) {
          errorMsg = Array.isArray(errorData.password)
            ? errorData.password[0]
            : errorData.password;
        }
      } else if (err.message) {
        errorMsg = err.message;
      }

      notify.error(errorMsg);
      setStaffPassword("");
    } finally {
      setIsTogglingStaff(false);
    }
  };

  const clearFilters = () => {
    setStatusFilter("ALL");
    setStartDate("");
    setEndDate("");
    setSearchTerm("");
    setCurrentPage(1);
  };

  if (loading && users.length === 0) {
    return <Loader message="Loading user registry..." />;
  }

  return (
    <div className="relative min-h-screen px-6 pb-12 pt-20 overflow-hidden font-sans bg-base-100">

      {/* STAFF TOGGLE SECURITY MODAL */}
      <dialog ref={staffModalRef} className="modal backdrop-blur-md">
        <div className="modal-box bg-base-100/60 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-[2.5rem] p-8 max-w-md">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3 text-warning">
              <UserCog size={24} />
              <h3 className="font-black uppercase tracking-tighter text-xl">
                {userToToggleStaff?.is_staff ? "Revoke Admin" : "Grant Admin"}
              </h3>
            </div>
            <button onClick={closeStaffToggleModal} className="btn btn-ghost btn-sm btn-circle opacity-50 hover:opacity-100"><X size={20} /></button>
          </div>

          <div className="p-4 bg-warning/10 border border-warning/20 rounded-2xl mb-6">
            <p className="text-xs font-bold text-warning/80 leading-relaxed uppercase tracking-wide">
              Security Action: You are about to {userToToggleStaff?.is_staff ? "revoke admin privileges from" : "grant admin privileges to"} <span className="text-warning font-black normal-case underline">{userToToggleStaff?.username}</span>. This will modify their system access level.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-2">Authorize with Superuser Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" />
                <input
                  type="password"
                  placeholder="Enter superuser password"
                  className="input w-full pl-12 bg-base-200/50 border-base-300/30 focus:border-warning rounded-2xl font-bold transition-all placeholder:text-gray-700"
                  value={staffPassword}
                  onChange={(e) => setStaffPassword(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && staffPassword && !isTogglingStaff) handleStaffToggle();
                  }}
                  autoFocus
                />
              </div>
            </div>

            <button
              onClick={handleStaffToggle}
              disabled={!staffPassword || isTogglingStaff}
              className="btn btn-warning w-full rounded-2xl font-black uppercase tracking-widest disabled:opacity-30 transition-all active:scale-95 text-white"
            >
              {isTogglingStaff ? <span className="loading loading-spinner"></span> : userToToggleStaff?.is_staff ? "Confirm Revoke" : "Confirm Grant"}
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={closeStaffToggleModal}>close</button>
        </form>
      </dialog>

      {/* TERMINATION SECURITY MODAL */}
      <dialog ref={deleteModalRef} className="modal backdrop-blur-md">
        <div className="modal-box bg-base-100/60 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-[2.5rem] p-8 max-w-md">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3 text-error">
              <ShieldAlert size={24} />
              <h3 className="font-black uppercase tracking-tighter text-xl">Identity Purge</h3>
            </div>
            <button onClick={closeDeleteModal} className="btn btn-ghost btn-sm btn-circle opacity-50 hover:opacity-100"><X size={20} /></button>
          </div>

          <div className="p-4 bg-error/10 border border-error/20 rounded-2xl mb-6">
            <p className="text-xs font-bold text-error/80 leading-relaxed uppercase tracking-wide">
              Critical Action: You are about to permanently delete <span className="text-error font-black underline normal-case">{userToTerminate?.username}</span>. This protocol is irreversible.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-2">Authorize with Admin Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" />
                <input
                  type="password"
                  placeholder="Enter password to confirm"
                  className="input w-full pl-12 bg-base-200/50 border-base-300/30 focus:border-error rounded-2xl font-bold transition-all placeholder:text-gray-700"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && adminPassword && !isDeleting) handleDelete();
                  }}
                  autoFocus
                />
              </div>
            </div>

            <button
              onClick={handleDelete}
              disabled={!adminPassword || isDeleting}
              className="btn btn-error w-full rounded-2xl font-black uppercase tracking-widest disabled:opacity-30 transition-all active:scale-95 text-white"
            >
              {isDeleting ? <span className="loading loading-spinner"></span> : "Confirm Termination"}
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={closeDeleteModal}>close</button>
        </form>
      </dialog>

      <Animate variant="fade-down">
        <div className="max-w-7xl mx-auto mb-12">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-primary mb-2">
                <Users size={18} />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Operational Oversight</span>
              </div>
              <h1 className="text-5xl font-black tracking-tighter text-base-content">
                User <span className="text-primary">Registry</span>
              </h1>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative w-full sm:w-80">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40" />
                <input
                  type="text"
                  placeholder="Identify users..."
                  className="input w-full pl-12 bg-base-200/50 border-base-300/30 focus:border-primary rounded-2xl font-bold placeholder:text-gray-700"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
              <button onClick={clearFilters} className="btn btn-ghost border border-base-300/30 rounded-2xl gap-2 text-[10px] font-black uppercase hover:bg-rose-500/10 hover:text-rose-500 transition-all">
                <FilterX size={16} /> Reset
              </button>
            </div>
          </div>

          {/* Filter Panel */}
          <div className="bg-base-200/40 border border-base-300/30 rounded-[2.5rem] p-6 lg:p-10 backdrop-blur-xl shadow-2xl flex flex-col gap-10">
            {/* Status Filters */}
            <div className="space-y-4">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 flex items-center gap-2">
                <ShieldCheck size={14} className="text-primary" /> Access State
              </span>
              <div className="flex flex-wrap gap-3">
                {[
                  { id: "ALL", label: "All Users", color: "bg-slate-500" },
                  { id: "ACTIVE", label: "Active Users", color: "bg-success" },
                  { id: "INACTIVE", label: "Suspended Users", color: "bg-error" },
                ].map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => { setStatusFilter(opt.id); setCurrentPage(1); }}
                    className={`btn btn-md rounded-2xl font-black uppercase text-[11px] transition-all px-6 border-0 ${statusFilter === opt.id
                      ? `${opt.color} text-white shadow-xl scale-105`
                      : 'bg-base-100 text-base-content/50 hover:bg-base-300 shadow-sm'
                      }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-px bg-base-content/5 w-full"></div>

            {/* Date Filtering */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="space-y-4">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 flex items-center gap-2 text-success">
                  <Calendar size={14} /> Registry Entry
                </span>
                <div className="join w-full shadow-lg border border-base-300/30 rounded-[1.2rem] overflow-hidden">
                  <div className="join-item bg-base-100 flex items-center px-4 border-r border-base-300/30">
                    <Calendar size={16} className="opacity-30" />
                  </div>
                  <input
                    type="date"
                    className="join-item input bg-base-100 w-full focus:outline-none font-black text-xs p-0 px-4"
                    value={startDate}
                    onChange={(e) => { setStartDate(e.target.value); setCurrentPage(1); }}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 flex items-center gap-2 text-error">
                  <Calendar size={14} /> Registry Exit
                </span>
                <div className="join w-full shadow-lg border border-base-300/30 rounded-[1.2rem] overflow-hidden">
                  <div className="join-item bg-base-100 flex items-center px-4 border-r border-base-300/30">
                    <Calendar size={16} className="opacity-30" />
                  </div>
                  <input
                    type="date"
                    className="join-item input bg-base-100 w-full focus:outline-none font-black text-xs p-0 px-4"
                    value={endDate}
                    onChange={(e) => { setEndDate(e.target.value); setCurrentPage(1); }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Animate>

      {/* Main Table */}
      <Animate>
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="relative rounded-[2rem] border border-base-300/30 bg-base-200/20 backdrop-blur-2xl shadow-2xl overflow-hidden">
            <div className="overflow-x-auto max-h-[70vh] scrollbar-custom">
              <table className="table w-full border-separate border-spacing-0">
                <thead className="sticky top-0 z-20">
                  <tr className="bg-base-300/95 backdrop-blur-md text-secondary uppercase text-[11px] font-black">
                    <th className="py-6 px-10 text-center">User Identity</th>
                    <th className="text-center">Permissions</th>
                    <th className="text-center">Actions</th>
                    <th className="text-right px-10">Created At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-base-300/5">
                  {users.map((user) => {
                    const isManageable = canModify(user);

                    return (
                      <tr key={user.id} className="hover:bg-primary/5 transition-colors group">
                        <td className="py-6 px-10">
                          <div className="flex flex-col gap-3 min-w-0">
                            <Link to={`/profile/${user.id}`}>
                              <div className="flex items-center gap-3 justify-center">
                                <div className="avatar">
                                  <div className="w-10 h-10 rounded-full ring-2 ring-primary/10 group-hover:ring-primary/40 group-hover:scale-110 transition-all duration-300 overflow-hidden bg-base-300">
                                    <img src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=random`} alt="avatar" />
                                  </div>
                                </div>
                                <span className="font-bold text-sm tracking-tight text-base-content">
                                  {user.username} {currentUser?.id === user.id && "(YOU)"}
                                </span>
                              </div>
                            </Link>

                            <div className="flex flex-col gap-1.5 w-full">
                              <div className="flex items-center w-full border border-blue-500/20 bg-blue-500/5 rounded-[0.6rem] p-1 py-1.5 shadow-sm">
                                <div className="bg-blue-500 w-12 flex justify-center py-0.5 rounded-[0.5rem] ml-1 shrink-0"><span className="text-[9px] font-black uppercase tracking-tight text-white">E-mail</span></div>
                                <span className="px-3 text-[10px] font-mono font-medium text-blue-600 truncate">{user.email}</span>
                              </div>
                              <div className="flex items-center w-full border border-slate-500/20 bg-slate-500/5 rounded-[0.6rem] p-1 py-1.5 shadow-sm">
                                <div className="bg-slate-500 w-12 flex justify-center py-0.5 rounded-[0.5rem] ml-1 shrink-0"><span className="text-[9px] font-black uppercase tracking-tight text-white">ID</span></div>
                                <span className="px-3 text-[10px] font-mono font-medium text-slate-600 truncate">{user.id}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-6">
                          <div className="flex flex-col gap-2 items-center">
                            <div className="flex items-center gap-2">
                              {user.is_superuser && <span className="badge badge-error font-black py-3 px-3 uppercase text-[9px] text-white border-none shadow-sm">SUPERUSER</span>}
                              {user.is_staff && <span className="badge badge-warning font-black py-3 px-3 uppercase text-[9px] text-white border-none shadow-sm">ADMIN STAFF</span>}
                              {!user.is_staff && !user.is_superuser && <span className="badge badge-primary font-black py-3 px-3 uppercase text-[9px] text-white border-none shadow-sm">STANDARD</span>}
                            </div>
                            <div className="bg-base-300/10 p-3 rounded-xl border border-base-300/20 text-[11px] font-medium opacity-80 max-w-[200px] text-center">
                              {user.is_superuser ? "Full System Access" : user.is_staff ? "Management Access" : "Standard Platform Access"}
                            </div>
                          </div>
                        </td>

                        <td className="text-center">
                          {isManageable ? (
                            <div className="flex flex-col items-center gap-2">
                              {/* Staff Toggle Button - only for Superuser */}
                              {currentUser?.is_superuser && (
                                <button
                                  onClick={() => openStaffToggleModal(user)}
                                  className={`btn btn-xs h-9 rounded-xl border-none font-black uppercase text-[9px] gap-2 px-4 shadow-md w-32 transition-all active:scale-95 ${user.is_staff
                                    ? 'bg-warning text-white hover:bg-warning/80'
                                    : 'bg-primary text-white hover:bg-primary/80'
                                    }`}
                                >
                                  <UserCog size={14} />
                                  {user.is_staff ? 'Revoke Staff' : 'Make Staff'}
                                </button>
                              )}

                              {/* Active/Suspend Toggle */}
                              <button
                                onClick={() => handleToggle(user.id)}
                                className={`btn btn-xs h-9 rounded-xl border-none font-black uppercase text-[9px] gap-2 px-4 shadow-md w-32 transition-all active:scale-95 ${user.is_active ? 'bg-success text-white hover:bg-success/80' : 'bg-warning text-white hover:bg-warning/80'
                                  }`}
                              >
                                {user.is_active ? <UserCheck size={14} /> : <UserMinus size={14} />}
                                {user.is_active ? 'Active' : 'Suspended'}
                              </button>

                              {/* Terminate Button */}
                              <button
                                onClick={() => openDeleteModal(user)}
                                className="btn btn-xs h-9 rounded-xl bg-error/10 text-error border border-error/20 hover:bg-error hover:text-white font-black uppercase text-[9px] gap-2 px-4 w-32 transition-all active:scale-95"
                              >
                                <Trash2 size={14} /> TERMINATE
                              </button>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-1 opacity-20 group-hover:opacity-40 transition-opacity">
                              <Lock size={18} />
                              <span className="text-[8px] font-black uppercase tracking-[0.2em]">Protected</span>
                            </div>
                          )}
                        </td>

                        <td className="text-[11px] opacity-60 px-10 font-mono text-center">
                          <div className="flex flex-col items-end">
                            <span className="font-black text-base-content tracking-tighter">
                              {user.created_at
                                ? new Date(user.created_at).toLocaleDateString(undefined, {
                                  year: 'numeric',
                                  month: '2-digit',
                                  day: '2-digit'
                                })
                                : "DATE_MISSING"}
                            </span>
                            <span className="text-[9px] font-bold opacity-30 uppercase tracking-widest">
                              {user.created_at
                                ? new Date(user.created_at).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                  hour12: true
                                })
                                : "TIME_MISSING"}
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination Controls */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-10">
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
                <span className="opacity-40 font-bold">{totalPages}</span>
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
        </div>
      </Animate>
    </div>
  );
}

export default ManageUsers;