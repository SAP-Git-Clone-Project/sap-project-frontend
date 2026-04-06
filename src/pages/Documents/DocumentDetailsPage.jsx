import React, { useState, useEffect, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft, Clock3, FileText, CheckCircle2, XCircle,
  PencilLine, GitBranchPlus, User, CalendarDays,
  History, Eye, ShieldCheck, Info, FileCog
} from "lucide-react";

import Animate from "@/components/animation/Animate.jsx";
import FileStatus from "@/components/widgets/FileStatus.jsx";
import GlassCard from "@/components/widgets/GlassCard.jsx";
import api from "@/components/api/api.js";
import { useAuth } from "@/context/AuthContext.jsx";
import Loader from "@/components/widgets/Loader.jsx";
import MissingArtifact from "@/components/widgets/MissingArtifact.jsx";

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

  console.log(users)

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
    <MissingArtifact
      title="Document Not Found"
      message="The requested document is missing from the system registry. It may have been redacted, purged, or moved to a restricted sector."
      linkText="Return to Documents"
      linkTo="/documents"
    />
  );

  console.log("Is Super User: ", isSuperUser);
  console.log("Document has been deleted: ", document?.is_deleted);

  return (
    <section className="px-6 py-20 min-h-screen bg-base-100 overflow-x-hidden">
      <div className="max-w-7xl mx-auto space-y-16">

        {/* TOP LEVEL NAVIGATION */}
        <Animate variant="fade-down">
          <div className="flex flex-col sm:flex-row items-center justify-between w-full border-b border-base-300/10 pb-8 gap-4">

            {/* LEFT: Back Button (Default size) */}
            <Link
              to="/documents"
              className="group btn btn-ghost btn-sm gap-2 rounded-xl border border-base-300/50 hover:bg-base-300/50 transition-all"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-[10px] uppercase tracking-[0.2em]">Back to Documents</span>
            </Link>

            {/* RIGHT: Actions (Default sizes, just wraps if no space) */}
            <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3">
              {(isOwner || isSuperUser) && (
                <>
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
                </>
              )}

              {(isOwner || isSuperUser) && (
                <button
                  onClick={async () => {
                    if (!window.confirm("Are you sure you want to delete this document?")) return;

                    try {
                      await api.delete(`/documents/${id}/`);
                      window.location.href = "/documents";
                    } catch (err) {
                      console.error(err);
                      alert("Failed to delete document.");
                    }
                  }}
                  className="btn btn-error btn-sm rounded-xl"
                >
                  Delete Document
                </button>
              )}

              {(isOwner || isSuperUser || isCoAuthor) && (
                <Link
                  to={`/documents/${id}/create-version`}
                  className="btn btn-primary btn-sm rounded-xl border-none hover:scale-105 transition-all h-10 px-6 flex items-center gap-2"
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
              <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-[0.4em]">
                <FileCog size={18} /> Document Details
              </div>
              <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-base-content leading-[0.9]">
                {document.title}
              </h1>
            </div>

            {isSuperUser && document?.is_deleted && (
              <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-error/10 border border-error/20 text-error text-[10px] font-black uppercase tracking-widest">
                <XCircle size={12} />
                System Notice: This document has been deleted
              </div>
            )}

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
          <Animate >
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
                  <div className="h-12 w-12 rounded-2xl bg-primary text-white flex items-center justify-center">
                    <ShieldCheck size={24} />
                  </div>
                </div>
              </div>
            </GlassCard>
          </Animate>

        </div>

        {/* --- Permission Grid Snippet --- */}
        <Animate delay={0.15}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* 1. CO-AUTHORS TABLE */}
            <div className="relative group">
              <div className="absolute inset-0 bg-primary/5 blur-2xl rounded-[2rem] opacity-0 group-hover:scale-[1.02] transition-opacity duration-500" />
              <div className="relative p-6 border border-base-content/10 backdrop-blur-2xl bg-base-100/5 shadow-2xl rounded-[1.5rem] flex flex-col h-[350px]">

                {/* Header Section */}
                <div className="flex items-center justify-between mb-4 px-2 shrink-0">
                  <div className="space-y-1">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Co-Author Registry</h3>
                  </div>
                  <div className="text-[10px] font-mono opacity-60 bg-primary/10 px-2 py-1 rounded border uppercase border-primary/20">
                    {coAuthors?.length || 0} Users
                  </div>
                </div>

                {/* TABLE WRAPPER FOR X-AXIS SCROLL */}
                <div className="flex-1 flex flex-col min-h-0 border border-base-content/5 rounded-xl bg-base-100/10 overflow-hidden">
                  <div className="overflow-x-auto custom-scrollbar">
                    {/* Set a min-width here so columns don't collapse on small screens */}
                    <div className="min-w-[500px] flex flex-col">

                      {/* Table Header Row */}
                      <div className="grid grid-cols-12 gap-2 px-4 py-2 border-b border-base-content/10 bg-base-content/5 text-[9px] font-black uppercase tracking-widest opacity-60 shrink-0">
                        <div className="col-span-8">User Details</div>
                        <div className="col-span-4 text-right">User ID</div>
                      </div>

                      {/* Scrollable Rows (Y-Axis) */}
                      <div className="max-h-[240px] overflow-y-auto custom-scrollbar">
                        {coAuthors?.length > 0 ? (
                          coAuthors.map((m) => (
                            <div key={m.id} className="grid grid-cols-12 gap-2 px-4 py-3 border-b border-base-content/5 items-center hover:bg-primary/5 transition-colors group/row">
                              <div className="col-span-7">
                                <Link to={`/profile/${m.user}`} className="flex items-center gap-3 group/link min-w-0 w-fit">
                                  <div className="h-8 w-8 rounded-full ring-1 ring-primary/30 bg-base-300/20 overflow-hidden shrink-0 group-hover/link:ring-primary/60 transition-all">
                                    <img src={m.user_avatar || `https://ui-avatars.com/api/?name=${m.username}`} className="h-full w-full object-cover" alt="" />
                                  </div>
                                  <div className="flex flex-col min-w-0 leading-tight gap-1">
                                    <span className="text-xs font-bold truncate opacity-90 group-hover/link:text-primary transition-colors">
                                      {m.full_name || (m.first_name || m.last_name ? `${m.first_name || ''} ${m.last_name || ''}`.trim() : "Unidentified Subject")}
                                    </span>
                                    <span className="text-[10px] font-mono opacity-50 tracking-tighter truncate">
                                      Username: {m.username || "No ID"}
                                    </span>
                                  </div>
                                </Link>
                              </div>
                              <div className="col-span-5 text-right">
                                <span className="text-[9px] tracking-tighter text-primary font-black px-2 py-0.5">{m.user}</span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="h-32 flex items-center justify-center opacity-20 text-[10px] font-bold uppercase tracking-widest">Registry Empty</div>
                        )}
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. READERS TABLE */}
            <div className="relative group">
              <div className="absolute inset-0 bg-secondary/5 blur-2xl rounded-[2rem] opacity-0 group-hover:scale-[1.02] transition-opacity duration-500" />
              <div className="relative p-6 border border-base-content/10 backdrop-blur-2xl bg-base-100/5 shadow-2xl rounded-[1.5rem] flex flex-col h-[350px]">

                <div className="flex items-center justify-between mb-4 px-2 shrink-0">
                  <div className="space-y-1">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary">Readers — Authorized View Only</h3>
                  </div>
                  <div className="text-[10px] font-mono opacity-60 bg-secondary/10 px-2 py-1 rounded border uppercase border-secondary/20">
                    {readers?.length || 0} Users
                  </div>
                </div>

                {/* TABLE WRAPPER FOR X-AXIS SCROLL */}
                <div className="flex-1 flex flex-col min-h-0 border border-base-content/5 rounded-xl bg-base-100/10 overflow-hidden">
                  <div className="overflow-x-auto custom-scrollbar">
                    <div className="min-w-[500px] flex flex-col">

                      <div className="grid grid-cols-12 gap-2 px-4 py-2 border-b border-base-content/10 bg-base-content/5 text-[9px] font-black uppercase tracking-widest opacity-60 shrink-0">
                        <div className="col-span-7">User Details</div>
                        <div className="col-span-5 text-right">User ID</div>
                      </div>

                      <div className="max-h-[240px] overflow-y-auto custom-scrollbar">
                        {readers?.length > 0 ? (
                          readers.map((m) => (
                            <div key={m.id} className="grid grid-cols-12 gap-2 px-4 py-2 border-b border-base-content/5 items-center hover:bg-secondary/5 transition-colors">
                              <div className="col-span-7 flex items-center gap-3 py-1">
                                <Link to={`/profile/${m.user}`} className="flex items-center gap-3 group/link">
                                  <div className="h-8 w-8 rounded-full ring-1 ring-secondary/30 bg-base-300/20 overflow-hidden shrink-0 transition-transform duration-200 group-hover/link:scale-110 group-hover/link:ring-primary/60">
                                    <img src={m.user_avatar || `https://ui-avatars.com/api/?name=${m.username}`} className="h-full w-full object-cover" alt="" />
                                  </div>
                                  <div className="flex flex-col min-w-0 gap-1">
                                    <span className="text-xs font-bold truncate transition-colors group-hover/link:text-primary">
                                      {m.full_name || (m.first_name ? `${m.first_name} ${m.last_name || ''}` : "No Name")}
                                    </span>
                                    <span className="text-[10px] font-mono opacity-50 tracking-tighter truncate">
                                      Username: {m.username || "No ID"}
                                    </span>
                                  </div>
                                </Link>
                              </div>
                              <div className="col-span-5 text-right text-[9px] tracking-tighter text-primary font-black px-2 py-0.5 ">
                                {m.user || "No ID"}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="h-32 flex items-center justify-center opacity-20 text-[10px] font-bold uppercase tracking-widest">No Logs Found</div>
                        )}
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </Animate>

        {/* Table Section */}
        {(isOwner || isSuperUser || isCoAuthor || isReader) && (
          <Animate delay={0.2} className="pt-12 space-y-8">
            {/* Divider Header */}

            <div className="flex items-center gap-4 px-2">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-base-300/50 to-transparent"></div>
              <div className="flex items-center gap-3 mb-5">
                <History className="text-primary" size={20} />
                <h2 className="text-xl font-black tracking-widest uppercase">Version History</h2>
              </div>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-base-300/50 to-transparent"></div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-4 rounded-t-[1.25rem] border border-white/5 border-b-0 bg-base-200/20 backdrop-blur-3xl shadow-xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-y-6">
                <div className="flex items-center gap-3">
                  <div className="h-4 w-[2px] bg-primary/40 rounded-full" />
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-base-content/30">
                    Index Metadata
                  </span>
                </div>

                <div className="grid grid-cols-2 xs:grid-cols-3 md:flex items-center gap-x-8 gap-y-4 md:gap-x-12">
                  {[
                    { label: "Approved", status: "approved", desc: "Verified" },
                    { label: "Pending", status: "pending", desc: "Awaiting" },
                    { label: "Rejected", status: "rejected", desc: "Declined" },
                    { label: "Default", status: "default", desc: "No Status" }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 transition-opacity hover:opacity-80">
                      <FileStatus status={item.status} />
                      <div className="flex flex-col leading-none">
                        <span className="text-[11px] font-black text-base-content/80 tracking-tight">{item.label}</span>
                        <span className="text-[7px] font-bold text-base-content/20 uppercase tracking-widest mt-1">{item.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Table Container */}
            <div className="rounded-b-[1.5rem] border border-base-300/20 bg-base-200/10 backdrop-blur-3xl overflow-hidden shadow-inner">
              <div className="overflow-x-auto">
                <table className="table w-full border-separate border-spacing-0">
                  <thead className="bg-base-300/30">
                    <tr className="text-secondary uppercase text-[10px] tracking-[0.2em] font-black">
                      <th className="py-6 px-10">Version</th>
                      <th className="text-center">Status</th>
                      <th>Created By</th>
                      <th>Created At</th>
                      <th className="text-center">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-base-300/5">
                    {versions.length > 0 ? (
                      versions.map((v) => (
                        <tr key={v.id} className="group hover:bg-base-200/50 transition-all">
                          {/* Version */}
                          <td className="py-6 px-10 relative">
                            <div
                              className="tooltip tooltip-right tooltip-primary before:z-[10000] after:z-[10000] w-fit ml-3"
                              data-tip="Click to see this version"
                            >
                              <Link
                                to={`/versions/${v.id}`}
                                className="group/version flex items-center gap-3"
                              >
                                <span className="font-mono font-black text-lg text-primary transition-transform group-hover/version:scale-110">
                                  v{v.version_number}
                                </span>
                                {v.is_active && (
                                  <span className="bg-primary text-base-300 text-[9px] px-2 py-0.5 rounded-md font-black uppercase shadow-sm shadow-primary/20">
                                    Live
                                  </span>
                                )}
                              </Link>
                            </div>
                          </td>
                          {/* Status */}
                          <td className="text-center">
                            <div className="flex justify-center scale-75 opacity-80 group-hover:opacity-100 transition-opacity">
                              <FileStatus status={v.status.toLowerCase()} />
                            </div>
                          </td>
                          {/* Created By */}
                          <td className="py-3 px-4">
                            <Link
                              to={`/profile/${v.user_id || v.user}`}
                              className="flex items-center gap-3 group/link w-fit min-w-0"
                            >
                              {/* LEFT: The Image Div */}
                              <div className="h-8 w-8 rounded-full ring-1 ring-primary/30 bg-base-300/20 overflow-hidden shrink-0 transition-transform duration-200 group-hover/link:scale-110 group-hover/link:ring-primary">
                                <img
                                  src={v.avatar_url || `https://ui-avatars.com/api/?name=${v.username}`}
                                  className="h-full w-full object-cover"
                                  alt=""
                                />
                              </div>

                              {/* RIGHT: The Text Div (Stacked) */}
                              <div className="flex flex-col min-w-0 leading-tight">
                                <span className="text-[11px] font-bold transition-colors group-hover/link:text-primary">
                                  {v.creator_name || "Unknown User"}
                                </span>
                              </div>
                            </Link>
                          </td>
                          {/* Created At */}
                          <td>
                            <div className="flex flex-col">
                              <span>{v.created_by_username || v.author}</span>
                              <span className="text-[9px] font-medium opacity-50 tracking-tighter">
                                {v.created_at ? (
                                  (() => {
                                    const d = new Date(v.created_at);
                                    const datePart = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                                    const yearPart = d.getFullYear();
                                    const timePart = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
                                    return `${datePart} ${yearPart}, ${timePart}`;
                                  })()
                                ) : 'Pending Date'}
                              </span>
                            </div>
                          </td>
                          {/* Details */}
                          <td className="max-w-xs text-center">
                            <p className="text-[10px] font-medium opacity-40 italic group-hover:opacity-100  transition-all">
                              {v.content || "Automated system log entry."}
                            </p>
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

      {/* Add this ref at the top of your component: const dialogRef = useRef(null); */}

      {showModal && (
        <dialog
          ref={(el) => {
            if (el && !el.open) el.showModal();
          }}
          className="modal backdrop-blur-lg"
          onClose={() => setShowModal(false)}
        >
          <div className="modal-box bg-base-100 p-8 rounded-[2rem] max-w-md space-y-6 shadow-2xl border border-base-300/5 relative overflow-hidden">

            {/* Header Section */}
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-1">Permission Registry</h3>
              <h2 className="font-bold text-xl">
                Add {permissionType === "WRITE" ? "Co-author" : "Reader"}
              </h2>
            </div>

            {/* Search Input */}
            <input
              autoFocus
              type="text"
              placeholder="Search users..."
              className="input input-bordered w-full bg-base-200/50 rounded-xl border-none focus:ring-1 focus:ring-primary/50 transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {/* Results List */}
            <div className="max-h-48 overflow-y-auto border border-base-content/5 rounded-2xl bg-base-200/30 custom-scrollbar">
              {users.length > 0 ? (
                users.map((u) => (
                  <div
                    key={u.id}
                    onClick={() => setSelectedUser(u)}
                    className={`flex items-center gap-3 p-3 cursor-pointer transition-all border-b border-base-content/5 last:border-0
                ${selectedUser?.id === u.id ? "bg-primary text-primary-content" : "hover:bg-primary/10"}`}
                  >
                    <div className={`h-9 w-9 rounded-full overflow-hidden shrink-0 ring-2 ${selectedUser?.id === u.id ? "ring-white/50" : "ring-primary/20"}`}>
                      <img
                        src={u.avatar || `https://ui-avatars.com/api/?name=${u.username}&background=random`}
                        className="h-full w-full object-cover"
                        alt=""
                      />
                    </div>

                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-bold truncate">{u.username}</span>
                      <span className={`text-[9px] font-mono tracking-tighter opacity-50 ${selectedUser?.id === u.id ? "text-white" : ""}`}>
                        ID: {u.id}
                      </span>
                    </div>

                    {selectedUser?.id === u.id && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    )}
                  </div>
                ))
              ) : (
                <div className="p-10 text-center opacity-20 text-[10px] font-black uppercase tracking-widest">
                  No Users Found
                </div>
              )}
            </div>

            {/* Selected Indicator */}
            <div className="h-4">
              {selectedUser && (
                <div className="text-[10px] font-bold uppercase tracking-wider text-primary flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-primary" />
                  Active Selection: <span className="opacity-60 normal-case">{selectedUser.username}</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <form method="dialog" className="flex-1">
                <button
                  className="btn btn-ghost w-full rounded-xl text-[10px] font-black uppercase tracking-widest opacity-40 hover:opacity-100"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </form>

              <button
                disabled={!selectedUser}
                className="btn btn-primary flex-[2] rounded-xl text-[10px] font-black uppercase tracking-widest disabled:opacity-30"
                onClick={async () => {
                  // 1. Run your grant logic
                  await handleGrant();

                  // 2. Close the modal state
                  setShowModal(false);

                  // 3. Force the page to reload
                  window.location.reload();
                }}
              >
                Confirm Authorization
              </button>
            </div>

          </div>
          {/* Background Close Logic */}
          <form method="dialog" className="modal-backdrop">
            <button onClick={() => setShowModal(false)}>close</button>
          </form>
        </dialog>
      )}
    </section>
  );
}

export default DocumentDetailsPage;