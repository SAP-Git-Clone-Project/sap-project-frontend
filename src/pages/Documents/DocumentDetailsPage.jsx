import React, { useState, useEffect, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft, Clock3, FileText, CheckCircle2, XCircle,
  PencilLine, GitBranchPlus, User, CalendarDays,
  History, Eye, ShieldCheck, Info
} from "lucide-react";

import Animate from "@/components/animation/Animate.jsx";
import FileStatus from "@/components/widgets/FileStatus.jsx";
import GlassCard from "@/components/widgets/GlassCard.jsx";
import api from "@/components/api/api.js";
import { useAuth } from "@/context/AuthContext.jsx";
import Loader from "@/components/widgets/Loader.jsx";

const STATUS_CONFIG = {
  approved: { icon: CheckCircle2, color: "text-success", bg: "bg-success/10", border: "border-success/20", label: "Approved" },
  pending_approval: { icon: Clock3, color: "text-warning", bg: "bg-warning/10", border: "border-warning/20", label: "Pending" },
  pending: { icon: Clock3, color: "text-warning", bg: "bg-warning/10", border: "border-warning/20", label: "Pending" },
  draft: { icon: PencilLine, color: "text-info", bg: "bg-info/10", border: "border-info/20", label: "Draft" },
  rejected: { icon: XCircle, color: "text-error", bg: "bg-error/10", border: "border-error/20", label: "Rejected" },
  default: { icon: FileText, color: "text-secondary", bg: "bg-base-300/10", border: "border-base-300/20", label: "Unknown" }
};

const getStatusDetails = (status) => STATUS_CONFIG[status?.toLowerCase()] || STATUS_CONFIG.default;

const DocumentDetailsPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [versions, setVersions] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [permissionType, setPermissionType] = useState("READ");
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const delay = setTimeout(async () => {
      try {
        const url = search
          ? `/users/search/?search=${search}`
          : `/users/search/`;

        const res = await api.get(url);
        setUsers(res.data.results || res.data);
      } catch (err) {
        console.error(err);
      }
    }, 300);

    return () => clearTimeout(delay);
  }, [search]);

  const openModal = (type) => {
    setPermissionType(type);
    setShowModal(true);
  };

  const handleGrant = async () => {
    if (!selectedUser) return;

    try {
      await api.post("/permissions/grant/", {
        user: selectedUser.id,
        document: id,
        permission_type: permissionType,
      });

      setShowModal(false);
      setSelectedUser(null);
      setSearch("");
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [docRes, versionsRes, membersRes] = await Promise.all([
          api.get(`/documents/${id}/`),
          api.get(`/versions/document/${id}/`),
          api.get(`/permissions/${id}/members/`)
        ]);

        setDocument(docRes.data);
        setVersions(versionsRes.data);
        setMembers(membersRes.data);
      } catch (err) {
        setError("Database Linkage Failure.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const activeVersion = useMemo(() =>
    document?.active_version || (versions.length ? versions[0] : null),
    [document, versions]);

  const statusInfo = getStatusDetails(activeVersion?.status);
  const isSuperUser = user?.is_superuser;
  const isOwner = user && document?.created_by_username === user?.username;
  const isCoAuthor = useMemo(() => {
    if (!user || !members.length) return false;

    return members.some(
      (m) =>
        m.user === user.id && m.permission_type === "WRITE"
    );
  }, [members, user]);

  const isReader = useMemo(() => {
    if (!user || !members.length) return false;

    return members.some(
      (m) =>
        m.user === user.id && m.permission_type?.toUpperCase() === "READ"
    );
  }, [members, user]);

  const coAuthors = useMemo(() => {
    return members.filter(
      (m) => m.permission_type?.toUpperCase() === "WRITE"
    );
  }, [members]);

  const readers = useMemo(() => {
    return members.filter(
      (m) => m.permission_type?.toUpperCase() === "READ"
    );
  }, [members]);

  if (loading) {
    return (
      <Loader message="Loading document detail..." />
    );
  }

  if (error || !document) return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden bg-slate-950">
      {/* Decorative Background Blobs - These make the glass effect visible */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/30 rounded-full blur-[80px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/20 rounded-full blur-[100px]" />

      <div className="relative z-10 p-12 rounded-[1.5rem] 
                  bg-white/10 backdrop-blur-xl 
                  border border-white/20 
                  shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] 
                  text-center max-w-md w-full mx-6">

        {/* Icon with a glow effect */}
        <div className="relative inline-block mb-6">
          <XCircle size={64} className="text-error/80 relative z-10" />
          <div className="absolute inset-0 bg-error/20 blur-2xl rounded-full" />
        </div>

        <h2 className="text-3xl font-black uppercase tracking-tight text-white mb-2">
          Object Not Found
        </h2>

        <p className="text-slate-300 text-sm mb-8 font-medium">
          The digital artifact you're looking for has drifted out of reach.
        </p>

        <Link
          to="/documents"
          className="btn btn-primary px-8 rounded-2xl border-none hover:scale-105 transition-transform duration-200"
        >
          Return to Safety
        </Link>
      </div>
    </div>
  );

  return (
    <section className="px-6 py-20 min-h-screen bg-base-100 overflow-x-hidden">
      <div className="max-w-7xl mx-auto space-y-16">

        {/* TOP LEVEL NAVIGATION */}
        <Animate variant="fade-down">
          <div className="flex items-center justify-between w-full border-b border-base-300/10 pb-8">
            <Link
              to="/documents"
              className="btn btn-ghost btn-sm gap-2 rounded-xl border border-base-300/50 hover:bg-base-300/50 transition-all"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-[10px] uppercase tracking-[0.2em]">Back to Documents</span>
            </Link>

            <div className="flex flex-row gap-4 items-center">
              {(isOwner || isSuperUser) && (
                <div className="flex gap-2">
                  <button
                    onClick={() => openModal("WRITE")}
                    className="btn btn-secondary btn-sm rounded-xl"
                  >
                    Add Co-Author
                  </button>

                  <button
                    onClick={() => openModal("READ")}
                    className="btn btn-outline btn-sm rounded-xl btn-accent"
                  >
                    Add Reader
                  </button>
                </div>
              )}

              {(isOwner || isSuperUser || isCoAuthor) && (
                <Link
                  to={`/documents/${id}/create-version`}
                  className="btn btn-primary btn-sm rounded-xl border-none shadow-lg shadow-primary/20 hover:scale-105 transition-all h-10 px-6"
                >
                  <GitBranchPlus size={16} />
                  <span className="font-bold text-[10px] uppercase tracking-widest">New Version</span>
                </Link>
              )}
            </div>
          </div>
        </Animate>

        {/* CONTENT LEVEL */}
        <div className="grid lg:grid-cols-2 gap-12 pt-4">

          {/* Main Content */}
          <Animate className="lg:col-span-2 space-y-10 flex">
            <div className="space-y-4 mb-5">
              <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-[0.4em] opacity-60">
                <ShieldCheck size={12} /> Secure Archive
              </div>
              <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-base-content leading-[0.9]">
                {document.title}
              </h1>
            </div>

            <div className="p-10 rounded-[1.5rem] bg-base-200/20 border border-base-300/40 backdrop-blur-md relative group">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30 mb-6 flex items-center gap-2">
                <Info size={14} /> Manifest Description
              </h3>
              <p className="text-base-content/70 text-md leading-relaxed font-medium">
                {document.description || "System Remark: No description data provided for this entry."}
              </p>
            </div>
          </Animate>

          {/* Metadata Sidebar */}
          <Animate delay={0.1}>
            <GlassCard className="p-8 space-y-8 border-primary/5 shadow-2xl sticky top-24 ">
              <div className="space-y-6 rounded-[1.5rem]">
                <div>
                  <span className="text-[9px] font-black uppercase opacity-30 tracking-[0.2em] block mb-3">Global Status</span>
                  <div className={`w-fit px-4 py-2 rounded-xl border ${statusInfo.border} ${statusInfo.bg} ${statusInfo.color} text-[10px] font-black uppercase flex items-center gap-2`}>
                    <statusInfo.icon size={12} /> {statusInfo.label}
                  </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-4 border-y border-base-300/10 py-8">

                  {/* Originator Section */}
                  <div className="flex items-center gap-4 flex-1">
                    <div className="h-11 w-11 rounded-full bg-base-300/20 flex items-center justify-center text-primary shadow-inner shrink-0 overflow-hidden border border-base-300/10">
                      <img
                        src={document.created_by_avatar_url}
                        alt={document.created_by_username}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] uppercase font-black opacity-40 tracking-[0.2em] mb-0.5">Originator</span>
                      <span className="text-sm font-bold text-base-content/90 tracking-tight">
                        {document.created_by_username}
                      </span>
                    </div>
                  </div>

                  {/* Visual Divider - Hidden on Mobile, Vertical line on Desktop */}
                  <div className="hidden md:block w-px h-10 bg-gradient-to-b from-transparent via-base-300/50 to-transparent mx-4" />

                  {/* Modified Date Section */}
                  <div className="flex items-center gap-4 flex-1 md:justify-end">
                    <div className="flex flex-col md:items-end order-2 md:order-1">
                      <span className="text-[9px] uppercase font-black opacity-40 tracking-[0.2em] mb-0.5">Last Modified</span>
                      <span className="text-sm font-bold text-base-content/90 tracking-tight">
                        {new Date(document.updated_at).toLocaleDateString(undefined, {
                          month: 'short', day: 'numeric', year: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="h-11 w-11 rounded-2xl bg-base-300/20 flex items-center justify-center text-secondary shadow-inner shrink-0 order-1 md:order-2">
                      <CalendarDays size={18} />
                    </div>
                  </div>

                </div>

                <div className="p-6 rounded-[1.5rem] bg-primary/10 border border-primary/20 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[8px] uppercase font-black text-primary tracking-[0.2em]">Active Release</span>
                    <span className="text-2xl font-black">v{activeVersion?.version_number || "1.0"}</span>
                  </div>
                  <div className="h-12 w-12 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/30">
                    <ShieldCheck size={24} />
                  </div>
                </div>
              </div>
            </GlassCard>
          </Animate>
        </div>

        <Animate delay={0.15}>
          <GlassCard className="p-8 space-y-6 border-primary/5 shadow-xl">

            {/* Co-Authors */}
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-4">
                Co-Authors
              </h3>

              {coAuthors.length > 0 ? (
                <div className="space-y-3">
                  {coAuthors.map((m) => (
                    <div key={m.id} className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-base-300/20 flex items-center justify-center overflow-hidden">
                        {m.user_avatar ? (
                          <img
                            src={m.user_avatar}
                            alt={m.username}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <User size={14} />
                        )}
                      </div>
                      <span className="text-sm font-semibold">
                        {m.full_name || `User #${m.user}`}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs opacity-40 italic">No co-authors assigned</p>
              )}
            </div>

            {/* Readers */}
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-4">
                Readers
              </h3>

              {readers.length > 0 ? (
                <div className="space-y-3">
                  {readers.map((m) => (
                    <div key={m.id} className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-base-300/20 flex items-center justify-center overflow-hidden">
                        {m.user_avatar ? (
                          <img
                            src={m.user_avatar}
                            alt={m.username}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <User size={14} />
                        )}
                      </div>
                      <span className="text-sm font-semibold">
                        {m.full_name || `User #${m.user}`}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs opacity-40 italic">No readers assigned</p>
              )}
            </div>

          </GlassCard>
        </Animate>

        {/* Table Section */}
        {(isOwner || isSuperUser || isCoAuthor || isReader) && (
          <Animate delay={0.2} className="pt-12 space-y-8">
            {/* Divider Header */}
            <div className="flex items-center gap-4 px-2">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-base-300/50 to-transparent"></div>
              <div className="flex items-center gap-3 mb-5">
                <History className="text-primary" size={20} />
                <h2 className="text-xl font-black tracking-widest uppercase">Audit History</h2>
              </div>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-base-300/50 to-transparent"></div>
            </div>

            {/* Table Container */}
            <div className="rounded-[1.5rem] border border-base-300/20 bg-base-200/10 backdrop-blur-3xl overflow-hidden shadow-inner">
              <div className="overflow-x-auto">
                <table className="table w-full border-separate border-spacing-0">
                  <thead className="bg-base-300/30">
                    <tr className="text-secondary uppercase text-[10px] tracking-[0.2em] font-black">
                      <th className="py-6 px-10">Version</th>
                      <th className="text-center">Status</th>
                      <th>Created By</th>
                      <th>Remarks</th>
                      <th className="text-right px-10">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-base-300/5">
                    {versions.length > 0 ? (
                      versions.map((v) => (
                        <tr key={v.id} className="group hover:bg-base-200/50 transition-all">
                          <td className="py-6 px-10">
                            <div className="flex items-center gap-3">
                              <span className="font-mono font-black text-lg text-primary">v{v.version_number}</span>
                              {v.is_active && (
                                <span className="bg-primary text-white text-[9px] px-2 py-0.5 rounded-md font-black uppercase shadow-sm shadow-primary/20">Live</span>
                              )}
                            </div>
                          </td>
                          <td className="text-center">
                            <div className="flex justify-center scale-75 opacity-80 group-hover:opacity-100 transition-opacity">
                              <FileStatus status={v.status.toLowerCase()} />
                            </div>
                          </td>
                          <td className="text-[11px] font-bold opacity-60">
                            <div className="flex flex-col">
                              <span>{v.created_by_username || v.author}</span>
                              <span className="text-[9px] font-medium opacity-50 uppercase tracking-tighter">
                                {v.created_at || 'Pending Date'}
                              </span>
                            </div>
                          </td>
                          <td className="max-w-xs">
                            <p className="text-[10px] font-medium opacity-40 italic line-clamp-1 group-hover:opacity-100 group-hover:line-clamp-none transition-all">
                              {v.content || "Automated system log entry."}
                            </p>
                          </td>
                          <td className="text-right px-10">
                            <Link
                              to={`/versions/${v.id}`}
                              className="btn btn-ghost btn-xs rounded-lg hover:bg-primary hover:text-white transition-all font-black text-[9px] tracking-widest px-4 border border-base-content/5"
                            >
                              Audit
                            </Link>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="py-20 text-center opacity-30 italic text-sm tracking-widest uppercase">
                          No historical versions found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </Animate>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-base-100 p-6 rounded-2xl w-full max-w-md space-y-4">

            <h2 className="font-bold text-lg">
              Add {permissionType === "WRITE" ? "Co-author" : "Reader"}
            </h2>

            {/* Search Input */}
            <input
              type="text"
              placeholder="Search users..."
              className="input input-bordered w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {/* Dropdown Results */}
            <div className="max-h-40 overflow-y-auto border rounded-xl">
              {users.map((u) => (
                <div
                  key={u.id}
                  onClick={() => setSelectedUser(u)}
                  className={`p-2 cursor-pointer hover:bg-base-200 ${selectedUser?.id === u.id ? "bg-primary text-white" : ""
                    }`}
                >
                  {u.username}
                </div>
              ))}
            </div>

            {/* Selected */}
            {selectedUser && (
              <div className="text-sm">
                Selected: <b>{selectedUser.username}</b>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-2">
              <button
                className="btn btn-ghost"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>

              <button
                className="btn btn-primary"
                onClick={handleGrant}
              >
                Confirm
              </button>
            </div>

          </div>
        </div>
      )}
    </section>
  );
}

export default DocumentDetailsPage;