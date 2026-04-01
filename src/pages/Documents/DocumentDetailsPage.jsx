import React, { useState, useEffect, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft, Clock3, FileText, CheckCircle2, XCircle,
  PencilLine, GitBranchPlus, User, CalendarDays,
  History, Eye, ShieldCheck, Info
} from "lucide-react";

import Animate from "@/components/animation/Animate.jsx";
import FileStatus from "../homepage/components/FileStatus.jsx";
import GlassCard from "../homepage/components/GlassCard.jsx";
import api from "@/components/api/api.js";
import { useAuth } from "@/context/AuthContext.jsx";

const STATUS_CONFIG = {
  approved: { icon: CheckCircle2, color: "text-success", bg: "bg-success/10", border: "border-success/20", label: "Approved" },
  pending_approval: { icon: Clock3, color: "text-warning", bg: "bg-warning/10", border: "border-warning/20", label: "Pending" },
  pending: { icon: Clock3, color: "text-warning", bg: "bg-warning/10", border: "border-warning/20", label: "Pending" },
  draft: { icon: PencilLine, color: "text-info", bg: "bg-info/10", border: "border-info/20", label: "Draft" },
  rejected: { icon: XCircle, color: "text-error", bg: "bg-error/10", border: "border-error/20", label: "Rejected" },
  default: { icon: FileText, color: "text-secondary", bg: "bg-base-300/10", border: "border-base-300/20", label: "Unknown" }
};

const getStatusDetails = (status) => STATUS_CONFIG[status?.toLowerCase()] || STATUS_CONFIG.default;

export default function DocumentDetailsPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const res = await api.get(`/documents/${id}/`);
        setDocument(res.data);
      } catch (err) {
        setError("Database Linkage Failure.");
      } finally {
        setLoading(false);
      }
    };
    fetchDocument();
  }, [id]);

  const versions = useMemo(() => document?.versions || [], [document]);
  const activeVersion = useMemo(() =>
    document?.active_version || (versions.length ? versions[0] : null),
    [document, versions]);

  const statusInfo = getStatusDetails(activeVersion?.status);
  const isOwner = document?.created_by_username === user?.username || user?.is_superuser;

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-100">
      <span className="loading loading-spinner loading-lg text-primary"></span>
    </div>
  );

  if (error || !document) return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6">
      <div className="p-10 rounded-[2rem] bg-base-200 border border-base-300 text-center shadow-xl">
        <XCircle size={32} className="text-error mx-auto mb-4" />
        <h2 className="font-black uppercase tracking-tighter">Object Not Found</h2>
        <Link to="/documents" className="btn btn-primary btn-sm mt-6 rounded-xl">Return</Link>
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
              className="btn btn-ghost btn-sm gap-2 rounded-xl border border-white/10 hover:bg-white/10 transition-all"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-[10px] uppercase tracking-[0.2em]">Back to Documents</span>
            </Link>

            {isOwner && (
              <Link
                to={`/documents/${id}/create-version`}
                className="btn btn-primary btn-sm rounded-xl border-none shadow-lg shadow-primary/20 hover:scale-105 transition-all h-10 px-6"
              >
                <GitBranchPlus size={16} />
                <span className="font-bold text-[10px] uppercase tracking-widest">New Version</span>
              </Link>
            )}
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

            <div className="p-10 rounded-[3rem] bg-base-200/20 border border-base-300/40 backdrop-blur-md relative group">
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
            <GlassCard className="p-8 space-y-8 border-primary/5 shadow-2xl sticky top-24">
              <div className="space-y-6">
                <div>
                  <span className="text-[9px] font-black uppercase opacity-30 tracking-[0.2em] block mb-3">Global Status</span>
                  <div className={`w-fit px-4 py-2 rounded-xl border ${statusInfo.border} ${statusInfo.bg} ${statusInfo.color} text-[10px] font-black uppercase flex items-center gap-2`}>
                    <statusInfo.icon size={12} /> {statusInfo.label}
                  </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-4 border-y border-base-300/10 py-8">

                  {/* Originator Section */}
                  <div className="flex items-center gap-4 flex-1">
                    <div className="h-11 w-11 rounded-2xl bg-base-300/20 flex items-center justify-center text-primary shadow-inner shrink-0">
                      <User size={18} />
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

                <div className="p-6 rounded-[2rem] bg-primary/10 border border-primary/20 flex items-center justify-between">
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

        {/* Table Section */}
        {isOwner && (
          <Animate delay={0.2} className="pt-12 space-y-8">
            <div className="flex items-center gap-4 px-2">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-base-300/50 to-transparent"></div>
              <div className="flex items-center gap-3 mb-5">
                <History className="text-primary" size={20} />
                <h2 className="text-xl font-black tracking-widest uppercase ">Audit History</h2>
              </div>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-base-300/50 to-transparent"></div>
            </div>

            <div className="rounded-[2.5rem] border border-base-300/20 bg-base-200/10 backdrop-blur-3xl overflow-hidden shadow-inner">
              <div className="overflow-x-auto">
                <table className="table w-full border-separate border-spacing-0">
                  <thead className="bg-base-300/30">
                    <tr className="text-secondary uppercase text-[9px] tracking-[0.2em] font-black">
                      <th className="py-6 px-10">Hash</th>
                      <th className="text-center">Status</th>
                      <th>Lead</th>
                      <th>Remarks</th>
                      <th className="text-right px-10">Command</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-base-300/5">
                    {versions.map((v) => (
                      <tr key={v.id} className="group hover:bg-base-200/50 transition-all">
                        <td className="py-6 px-10">
                          <div className="flex items-center gap-3">
                            <span className="font-mono font-black text-lg text-primary">v{v.version_number}</span>
                            {v.is_active && (
                              <span className="bg-primary text-white text-[7px] px-2 py-0.5 rounded-md font-black uppercase tracking-tighter">Live</span>
                            )}
                          </div>
                        </td>
                        <td className="text-center">
                          <div className="flex justify-center scale-75 opacity-80 group-hover:opacity-100 transition-opacity">
                            <FileStatus status={v.status.toLowerCase()} />
                          </div>
                        </td>
                        <td className="text-[11px] font-bold opacity-60 italic">{v.created_by_username || v.author}</td>
                        <td className="max-w-xs">
                          <p className="text-[10px] font-medium opacity-40 line-clamp-1 italic">
                            {v.summary || "No manual log entry."}
                          </p>
                        </td>
                        <td className="text-right px-10">
                          <button className="btn btn-ghost btn-xs rounded-lg hover:bg-primary hover:text-white transition-all font-black text-[9px] tracking-widest px-4">
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Animate>
        )}
      </div>
    </section>
  );
}