import { useState, useEffect, useCallback, useRef } from "react";
import {
  Search, Users, ChevronLeft, ChevronRight, Calendar,
  FilterX, Funnel, UserCheck, UserMinus,
  Trash2, Lock, ShieldAlert, X, AlertTriangle, Shield, UserCog
} from "lucide-react";
import Animate from "@/components/animation/Animate.jsx";
import api from "@/components/api/api";
import notify from "@/components/toaster/notify";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext.jsx";
import LoadingTableData from "@/components/widgets/LoadingTableData"; // NEW IMPORT

const ManageUsers = () => {
  const { user: currentUser, refreshUser } = useAuth();
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
  const [availableRoles, setAvailableRoles] = useState([]);
  const [userRoleMap, setUserRoleMap] = useState({});
  const [pendingRoleByUser, setPendingRoleByUser] = useState({});

  const pageSize = 10;
  const totalPages = Math.ceil(paginationInfo.count / pageSize) || 1;

  /** Roles, staff toggle, terminate: same rules — no self, no targeting superusers (for superuser viewer: can target admins + normal users). */
  const canModify = (targetUser) => {
    if (!currentUser || !targetUser) return false;
    if (currentUser.id === targetUser.id) return false;
    if (currentUser.is_superuser) return !targetUser.is_superuser;
    if (currentUser.is_staff) {
      return !targetUser.is_superuser && !targetUser.is_staff;
    }
    return false;
  };

  /**
   * Ban / activate (toggle active): superuser can affect any non–super-user (including admins).
   * Staff (non–super-user) can only ban/activate normal users — not other admins or superusers.
   */
  const canToggleBan = (targetUser) => {
    if (!currentUser || !targetUser) return false;
    if (currentUser.id === targetUser.id) return false;
    if (targetUser.is_superuser) return false;
    if (currentUser.is_superuser) return true;
    if (currentUser.is_staff) {
      return !targetUser.is_superuser && !targetUser.is_staff;
    }
    return false;
  };

  const getDisplayRoles = (targetUser) => {
    if (targetUser.is_superuser) return ["superuser"];
    if (targetUser.is_staff) return ["staff"];
    return Array.from(new Set(userRoleMap[targetUser.id] || targetUser.global_roles || []));
  };

  const roleBadgeClass = (roleName) => {
    const role = (roleName || "").toLowerCase();
    if (role === "superuser") return "bg-purple text-white";
    if (role === "staff") return "bg-warning text-white";
    if (role === "author") return "bg-primary text-white";
    if (role === "reviewer") return "bg-success text-white";
    if (role === "writer") return "bg-[#b34b02] text-white";
    if (role === "reader") return "bg-base-300 text-base-content";
    return "bg-slate-500 text-white";
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
        if (statusFilter === "ACTIVE") {
          params.is_active = "true";
        } else if (statusFilter === "INACTIVE") {
          params.is_active = "false";
        } else if (statusFilter === "ADMINS") {
          params.is_staff = "true";
          params.is_superuser = "true";
        }
      }

      const res = await api.get(`/users/`, { params });
      setUsers(res.data.results || []);
      setPaginationInfo({
        count: res.data.count || 0,
        hasNext: !!res.data.next,
        hasPrev: !!res.data.previous
      });
    } catch {
      notify.error("Unauthorized Access");
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, startDate, endDate, statusFilter]);

  const fetchRolesData = useCallback(async () => {
    if (!currentUser?.is_staff && !currentUser?.is_superuser) return;
    try {
      const [rolesRes, userRolesRes] = await Promise.all([
        api.get("/roles/roles/"),
        api.get("/roles/user-roles/"),
      ]);
      setAvailableRoles(rolesRes.data || []);
      const map = {};
      (userRolesRes.data || []).forEach((entry) => {
        const key = entry?.user?.id || entry?.user;
        if (!key) return;
        if (!map[key]) map[key] = [];
        if (entry.role_name) map[key].push(entry.role_name);
      });
      setUserRoleMap(map);
    } catch {
      notify.error("Failed to load role mappings");
    }
  }, [currentUser]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchUsers();
    }, 400);
    return () => clearTimeout(delayDebounceFn);
  }, [fetchUsers]);

  useEffect(() => {
    fetchRolesData();
  }, [fetchRolesData]);

  const handleAssignRole = async (targetUser) => {
    const roleName = pendingRoleByUser[targetUser.id];
    if (!roleName) return notify.error("Select a role first");
    try {
      await api.post("/roles/manage/", {
        user: targetUser.id,
        role_name: roleName,
      });
      notify.success("Role added");
      await fetchRolesData();
      await fetchUsers();
    } catch (err) {
      notify.error(err.response?.data?.detail || "Failed to add role");
    }
  };

  const handleRemoveRole = async (targetUser) => {
    const roleName = pendingRoleByUser[targetUser.id];
    if (!roleName) return notify.error("Select a role first");
    try {
      await api.delete("/roles/manage/", {
        data: {
          user: targetUser.id,
          role_name: roleName,
        },
      });
      notify.success("Role removed");
      await fetchRolesData();
      await fetchUsers();
    } catch (err) {
      notify.error(err.response?.data?.detail || "Failed to remove role");
    }
  };

  const handleToggle = async (targetUser) => {
    // Safety check: ensure targetUser is an object with an ID
    if (!targetUser || !targetUser.id) return notify.error("Invalid target user");

    if (!canToggleBan(targetUser)) {
      notify.error("You cannot change this account status");
      return;
    }
    try {
      const res = await api.patch(`/users/${targetUser.id}/toggle/`);
      setUsers((prev) =>
        prev.map((u) => (u.id === targetUser.id ? { ...u, is_active: res.data.is_active } : u)),
      );
      notify.success(`User ${res.data.is_active ? "activated" : "banned"} successfully`);
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
    const toggledUserId = userToToggleStaff.id;
    try {
      const res = await api.post(
        `/users/${toggledUserId}/toggle-admin/`,
        { password: staffPassword },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      setUsers(prev => prev.map(u => u.id === toggledUserId ? { ...u, is_staff: res.data.is_staff } : u));
      notify.success(res.data.message || `User permissions updated: ${res.data.is_staff ? "Granted Admin" : "Revoked Admin"}`);
      closeStaffToggleModal();
      if (currentUser?.id === toggledUserId) await refreshUser();
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

  // REMOVED FULL PAGE LOADER TO SHOW SITE IMMEDIATELY
  // if (loading && users.length === 0) {
  //   return <Loader message="Loading user registry..." />;
  // }

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
                <Funnel size={14} className="text-primary" /> Filter Types
              </span>
              <div className="flex flex-wrap gap-3">
                {[
                  { id: "ALL", label: "All Users", color: "bg-slate-500" },
                  { id: "ADMINS", label: "Administrators", color: "bg-accent" },
                  { id: "ACTIVE", label: "Active Users", color: "bg-success" },
                  { id: "INACTIVE", label: "Banned Users", color: "bg-error" },
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
          <div className="relative rounded-[2rem] border border-base-300/30 bg-base-200/20 backdrop-blur-2xl shadow-2xl overflow-hidden min-h-[400px]">

            {/* Overlay Loader */}
            {loading && <LoadingTableData />}

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
                  {users.length > 0 ? (
                    users.map((user) => {
                      const isManageable = canModify(user);
                      const isBanned = !user.is_active;
                      const selectedRole = pendingRoleByUser[user.id] || "";
                      const assignedGeneralRoles = Array.from(
                        new Set(userRoleMap[user.id] || user.global_roles || [])
                      );
                      const selectedRoleAlreadyAssigned =
                        selectedRole && assignedGeneralRoles.includes(selectedRole);

                      return (
                        <tr
                          key={user.id}
                          className={`transition-colors group ${isBanned
                            ? "bg-error/10 hover:bg-error/15"
                            : "hover:bg-primary/5"
                            }`}
                        >
                          <td className="py-6 px-10">
                            <div className="flex flex-col gap-3 min-w-0">

                              {/* ONLY THE AVATAR AND NAME ARE LINKED */}
                              <Link to={`/profile/${user.id}`} className="group transition-all duration-300">
                                <div className="flex items-center gap-3 justify-center">
                                  <div className="avatar">
                                    <div className="w-10 h-10 rounded-full ring-2 ring-primary/10 group-hover:ring-primary/40 group-hover:scale-110 transition-all duration-300 overflow-hidden bg-base-300">
                                      <img
                                        src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=random`}
                                        alt="avatar"
                                      />
                                    </div>
                                  </div>

                                  <div className="flex flex-col justify-center items-center">
                                    <p className="font-bold text-sm tracking-tight text-base-content group-hover:text-primary transition-colors">
                                      {user.first_name + " " + user.last_name}
                                      {currentUser?.id === user.id && (
                                        <span className="badge badge-soft bg-primary/60 text-[13px] ml-1 text-white">
                                          You
                                        </span>
                                      )}
                                    </p>
                                  </div>
                                </div>
                              </Link>

                              {/* INFO BOXES (NOT LINKED) */}
                              <div className="flex flex-col gap-1.5 w-full">
                                <div className="flex items-center w-full border border-accent/20 bg-accent/5 rounded-[0.6rem] p-1 py-1.5 shadow-sm">
                                  <div className="bg-accent px-2 flex justify-center py-0.5 rounded-[0.5rem] ml-1 shrink-0">
                                    <span className="text-[9px] font-black uppercase tracking-tight text-white">
                                      Username
                                    </span>
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <span className="px-3 text-[10px] font-mono font-medium text-accent truncate block">
                                      {user.username}
                                    </span>
                                  </div>
                                </div>

                                <div className="flex items-center w-full border border-blue-500/20 bg-blue-500/5 rounded-[0.6rem] p-1 py-1.5 shadow-sm">
                                  <div className="bg-blue-500 w-12 flex justify-center py-0.5 rounded-[0.5rem] ml-1 shrink-0">
                                    <span className="text-[9px] font-black uppercase tracking-tight text-white">E-mail</span>
                                  </div>
                                  <span className="px-3 text-[10px] font-mono font-medium text-blue-600 truncate">{user.email}</span>
                                </div>

                                <div className="flex items-center w-full border border-slate-500/20 bg-slate-500/5 rounded-[0.6rem] p-1 py-1.5 shadow-sm">
                                  <div className="bg-slate-500 w-12 flex justify-center py-0.5 rounded-[0.5rem] ml-1 shrink-0">
                                    <span className="text-[9px] font-black uppercase tracking-tight text-white">ID</span>
                                  </div>
                                  <span className="px-3 text-[10px] font-mono font-medium text-slate-600 truncate">{user.id}</span>
                                </div>
                              </div>

                            </div>
                          </td>

                          <td className="py-6 px-1">
                            <div className="flex flex-col gap-2 items-center">
                              <div className="flex flex-wrap items-center justify-center gap-2 max-w-[240px]">
                                {getDisplayRoles(user).length > 0 ? (
                                  getDisplayRoles(user).map((roleName) => (
                                    <span
                                      key={`${user.id}-${roleName}`}
                                      className={`badge font-black py-3 px-3 uppercase text-[9px] border-none shadow-sm ${roleBadgeClass(roleName)}`}
                                    >
                                      {roleName === "superuser"
                                        ? "SUPER USER"
                                        : roleName === "staff"
                                          ? "ADMIN"
                                          : roleName}
                                    </span>
                                  ))
                                ) : (
                                  <span className="badge bg-base-300 text-base-content font-black py-3 px-3 uppercase text-[9px] border-none shadow-sm">
                                    NO ROLE
                                  </span>
                                )}
                              </div>
                              <div className={`p-3 rounded-xl border text-[11px] font-bold uppercase tracking-tight max-w-[240px] text-center ${!user.is_active
                                ? "bg-error/10 border-error/20 text-error"
                                : "bg-success/10 border-success/20 text-success"
                                }`}>
                                {!user.is_active ? "BANNED" : "ACTIVE"}
                              </div>
                            </div>
                          </td>

                          <td className="p-4 text-center align-middle">
                            {isManageable ? (
                              <div className="flex flex-row items-start justify-center gap-2">
                                {/* Role Control (Keep as is) */}
                                {/* Added check: !(currentUser.is_superuser && user.is_staff) */}
                                {(currentUser?.is_staff || currentUser?.is_superuser) && !(currentUser?.is_superuser && user?.is_staff) && (
                                  <div className={`glasscard w-52 p-2 rounded-xl border ${isBanned ? "opacity-70 border-error/30" : "border-base-300/30"}`}>
                                    <div className="text-[9px] font-black uppercase tracking-widest opacity-50 text-center mb-1">
                                      Role Control
                                    </div>
                                    <select
                                      className="select select-xs rounded-lg mb-1"
                                      value={selectedRole}
                                      onChange={(e) =>
                                        setPendingRoleByUser((prev) => ({
                                          ...prev,
                                          [user.id]: e.target.value,
                                        }))
                                      }
                                      disabled={isBanned}
                                    >
                                      <option value="">Select role</option>
                                      {availableRoles.map((role) => (
                                        <option key={role.id} value={role.role_name}>
                                          {role.role_name}
                                        </option>
                                      ))}
                                    </select>
                                    <div className="text-[9px] opacity-60 text-center truncate">
                                      Can add:{" "}
                                      {availableRoles
                                        .filter((role) => !getDisplayRoles(user).includes(role.role_name))
                                        .map((role) => role.role_name)
                                        .join(", ") || "none"}
                                    </div>
                                    <div className="flex gap-1 mt-1">
                                      <button
                                        onClick={() => handleAssignRole(user)}
                                        className="btn btn-xs h-7 min-h-7 rounded-lg bg-info text-white border-none flex-1"
                                        disabled={isBanned || !selectedRole || selectedRoleAlreadyAssigned}
                                      >
                                        {selectedRoleAlreadyAssigned ? "Has Role" : "Add"}
                                      </button>
                                      <button
                                        onClick={() => handleRemoveRole(user)}
                                        className={`btn btn-xs h-7 min-h-7 rounded-lg border-none flex-1 ${selectedRoleAlreadyAssigned
                                            ? "bg-warning text-white"
                                            : "bg-base-300 text-base-content"
                                          }`}
                                        disabled={isBanned || !selectedRole || !selectedRoleAlreadyAssigned}
                                      >
                                        Remove
                                      </button>
                                    </div>
                                  </div>
                                )}

                                <div className="flex flex-col items-center gap-2">
                                  {currentUser?.is_superuser && (
                                    <button
                                      onClick={() => openStaffToggleModal(user)}
                                      disabled={!user.is_active}
                                      className={`btn btn-xs h-9 rounded-xl border-none font-bold uppercase text-[10px] gap-2 px-4 shadow-sm w-36 transition-all 
                                        active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:bg-slate-500/20 disabled:text-slate-500
                                        ${user.is_staff
                                          ? 'bg-warning text-white hover:bg-warning/80'
                                          : 'bg-primary text-white hover:bg-primary/80'
                                        }`}
                                    >
                                      {!user.is_active ? <Lock size={14} /> : <UserCog size={14} />}
                                      <span className="truncate">
                                        {!user.is_active ? 'User Banned' : user.is_staff ? 'Revoke Admin' : 'Make Admin'}
                                      </span>
                                    </button>
                                  )}

                                  {/* 2. Active/Ban Toggle Button - FIXED CLICK HANDLER */}
                                  <button
                                    onClick={() => handleToggle(user)} // FIXED: Passing 'user' object instead of 'user.id'
                                    className={`btn btn-xs h-9 rounded-xl border-none font-bold uppercase text-[10px] gap-2 px-4 shadow-sm w-36 transition-all active:scale-95 
                                      ${user.is_active
                                        ? 'bg-success text-white hover:bg-success/80'
                                        : 'bg-error text-white hover:bg-error/80'
                                      }`}
                                  >
                                    {user.is_active ? <UserCheck size={14} /> : <UserMinus size={14} />}
                                    <span>{user.is_active ? 'Active' : 'Banned'}</span>
                                  </button>

                                  {/* 3. Terminate Button */}
                                  <button
                                    onClick={() => openDeleteModal(user)}
                                    className="btn btn-xs h-9 rounded-xl bg-error/10 text-error border border-error/20 hover:bg-error hover:text-white font-bold uppercase text-[10px] gap-2 px-4 w-36 transition-all active:scale-95 shadow-sm"
                                  >
                                    <Trash2 size={14} />
                                    <span>Terminate</span>
                                  </button>
                                </div>
                              </div>
                            ) : (
                              /* Protected State */
                              <div className="flex flex-col items-center justify-center py-4 opacity-30 group-hover:opacity-60 transition-opacity">
                                <Lock size={20} className="mb-1" />
                                <span className="text-[9px] font-bold uppercase tracking-widest text-base-content">
                                  System Protected
                                </span>
                              </div>
                            )}
                          </td>

                          <td className="text-[11px] opacity-60 px-10 font-mono text-center">
                            <div className="flex flex-col items-end">
                              <span className="font-black text-base-content tracking-tighter text-[13px]">
                                {user.created_at
                                  ? new Date(user.created_at).toLocaleDateString("en-GB", {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit'
                                  })
                                  : "DATE_MISSING"}
                              </span>
                              <span className="text-[9px] font-bold opacity-30 uppercase tracking-widest">
                                {user.created_at
                                  ? new Date(user.created_at).toLocaleTimeString(undefined, {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit',
                                    hour12: true
                                  })
                                  : "TIME_MISSING"}
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    !loading && (
                      <tr>
                        <td colSpan="4" className="py-20 text-center opacity-30">
                          <div className="flex flex-col items-center justify-center gap-4">
                            <Users size={60} strokeWidth={1} />
                            <p className="text-xl font-black uppercase tracking-[0.3em]">
                              No Users Found
                            </p>
                            <p className="text-[10px] font-bold uppercase tracking-widest">
                              Try adjusting your filters
                            </p>
                          </div>
                        </td>
                      </tr>
                    )
                  )}
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