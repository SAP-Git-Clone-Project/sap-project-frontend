import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  GitBranchPlus,
  Ban,
  Upload,
  FileUp,
  Rocket,
  CheckCircle2  
} from "lucide-react";

import Animate from "@/components/animation/Animate.jsx";
import api from "@/components/api/api.js";
import Loader from "@/components/widgets/Loader.jsx";
import { useAuth } from "@/context/AuthContext.jsx";

const CreateVersionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [document, setDocument] = useState(null);
  const [versions, setVersions] = useState([]);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    content: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [docRes, versionsRes] = await Promise.all([
          api.get(`/documents/${id}/`),
          api.get(`/versions/document/${id}/`)
        ]);

        setDocument(docRes.data);
        setVersions(versionsRes.data);

      } catch (err) {
        setError("Database Linkage Failure.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const [errors, setErrors] = useState({});

  const activeVersion = useMemo(() =>
    document?.active_version || (versions.length ? versions[0] : null),
    [document, versions]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
      form: "",
    }));
  }

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0] || null;
    setFile(selected);

    setErrors((prev) => ({
      ...prev,
      file: "",
      form: "",
    }));
  }

  const validateForm = () => {
    const newErrors = {};

    return newErrors;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setErrors({ file: "File is required." });
      return;
    }

    try {
      const formDataToSend = new FormData();

      formDataToSend.append("file", file);
      formDataToSend.append("document", id);
      formDataToSend.append("content", formData.content || "");

      await api.post(
        `/versions/document/${id}/`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      navigate(`/documents/${id}`);

    } catch (err) {
      if (err.response) {
        console.log(err.response.data);
        setErrors(err.response.data);
      } else {
        setErrors({ form: "Upload failed." });
      }
    }
  }

  if (loading) {
    return (
      <Loader message="Loading document and versions..." />
    );
  }

  if (error) {
    return (
      <div className="text-center mt-10 text-error">
        {error.message || "An error occurred while loading the document."}
      </div>
    );
  }

  if (!document) {
    return (
      <section className="px-4 py-8 md:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="card border border-base-300 bg-base-200 shadow-sm">
            <div className="card-body items-center text-center">
              <h1 className="text-2xl font-bold">Document not found</h1>
              <p className="text-base-content/70">
                Cannot create a version because this document does not exist in
                the current mock data.
              </p>
              <Link to="/documents" className="btn btn-primary mt-2">
                Back to Documents
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 md:px-6 lg:px-8 min-h-screen bg-base-100 px-6 pb-12 pt-20 overflow-hidden font-sans">
      <div className="mx-auto max-w-7xl space-y-6">
        <Animate variant="fade-down">
          <div className="max-w-7xl mx-auto flex flex-col gap-4 mb-12">

            {/* NAVIGATION BUTTONS */}
            <div className="flex justify-start mb-8">
              <Link
                to={`/documents/${id}`}
                className="group btn btn-ghost btn-xs gap-2 rounded-lg border border-base-300/30 hover:bg-base-300/50 transition-all px-3"
              >
                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                <span className="text-[9px] font-black uppercase tracking-widest opacity-60">
                  Back To Document
                </span>
              </Link>
            </div>

            {/* PROTOCOL HEADER */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-primary mb-2">
                <GitBranchPlus size={18} />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                  Version Management
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-base-content leading-[0.9]">
                Create <span className="text-primary">Iteration</span>
              </h1>

              {/* VERSION STATUS LINE */}
              <div className="flex flex-col md:flex-row md:items-center gap-6 pt-6">
                {/* DOCUMENT IDENTIFIER */}
                <div className="flex items-center gap-3">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-primary/60 mb-1">
                      Target Source
                    </span>
                    <div className="bg-base-200 border border-base-300/10 px-4 py-2 rounded-lg backdrop-blur-sm group hover:border-primary/30 transition-colors">
                      <span className="text-sm font-mono font-bold tracking-tight">
                        <span className="opacity-30 mr-1.5">DIR://</span>
                        {document.title}
                        <span className="opacity-30 ml-1.5">.node</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* DIVIDER: Vertical on Desktop, Horizontal on Mobile */}
                <div className="hidden md:block h-10 w-[1px] bg-gradient-to-b from-transparent via-base-300/10 to-transparent" />
                <div className="md:hidden h-[1px] w-full bg-gradient-to-r from-base-300/10 to-transparent" />

                {/* VERSION STATUS BLOCK */}
                <div className="flex flex-col">
                  <span className="text-[9px] font-black uppercase tracking-[0.2em mb-1">
                    Protocol State
                  </span>
                  <div className="flex items-center gap-3 bg-primary/5 border border-primary/20 px-4 py-2 rounded-lg shadow-[0_0_15px_rgba(var(--primary),0.05)]">
                    <div className="relative flex h-2 w-2">
                      <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></div>
                      <div className="relative inline-flex rounded-full h-2 w-2 bg-primary"></div>
                    </div>
                    <span className="text-[11px] font-mono font-black text-primary uppercase tracking-widest">
                      Active Node: v{activeVersion?.version_number || "0.0"}
                    </span>
                  </div>
                </div>

                {/* DECORATIVE LINE FOR LAYOUT BALANCE */}
                <div className="hidden lg:block flex-1 h-[1px] bg-gradient-to-r from-base-300/5 to-transparent ml-4" />
              </div>
            </div>
          </div>
        </Animate>

        {/* NEW WORKSPACE LAYOUT (Unique 2nd Animate block) */}
        <Animate variant="fade-up">
          <form onSubmit={handleSubmit} noValidate className="mt-8">
            {/* items-stretch is the key for equal height columns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">

              {/* LEFT COLUMN: SYSTEM TERMINAL */}
              <div className="bg-base-200/50 border border-base-300/5 rounded-2xl overflow-hidden shadow-xl backdrop-blur-md flex flex-col">
                <div className="bg-base-300/5 px-6 py-3 border-b border-base-300/5 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary),0.8)]" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Terminal Input</span>
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-1 gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 shrink-0">
                    {/* Node Info Boxes */}
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest opacity-40 ml-1">Origin Node</label>
                      <div className="flex items-center gap-3 bg-base-300/20 border border-base-300/5 rounded-xl px-4 py-2.5 text-xs font-mono font-bold">
                        {activeVersion ? `VERSION v${activeVersion.version_number}` : "NULL ROOT"}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest opacity-40 ml-1">Target Pointer</label>
                      <div className="flex items-center gap-3 bg-primary/10 border border-primary/20 rounded-xl px-4 py-2.5 text-xs font-mono font-bold text-primary">
                        VERSION v{(activeVersion?.version_number || 0) + 1}
                      </div>
                    </div>
                  </div>

                  {/* This textarea now has flex-1 to fill the terminal's height */}
                  <div className="flex flex-col flex-1 min-h-0 space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest opacity-40 ml-1">System Documentation</label>
                    <textarea
                      name="content"
                      placeholder="Describe iteration deltas..."
                      className="flex-1 w-full bg-base-300/20 border border-white/10 rounded-xl px-5 py-4 text-sm font-sans focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all outline-none resize-none"
                      value={formData.content}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: UPLINK & COMMANDS */}
              {/* This wrapper is ALSO a flex column that stretches to the grid height */}
              <div className="flex flex-col gap-6 h-full">

                {/* PAYLOAD UPLINK - flex-1 here forces it to expand to match the Left column */}
                <div className="bg-base-200 border border-base-300/10 rounded-xl p-6 shadow-2xl flex flex-col flex-1 min-h-0 relative group/container">
                  {/* TOP HEADER - Minimal & Sharp */}
                  <div className="flex items-center justify-between mb-5 shrink-0">
                    <div className="flex items-center gap-2">
                      <Upload size={14} className="text-primary/70" />
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] ">Payload Uplink</span>
                    </div>
                    {file && (
                      <div className="flex items-center gap-2">
                        <div className="h-1 w-1 rounded-full bg-primary animate-pulse" />
                        <span className="text-[8px] font-mono text-primary/70 uppercase tracking-widest">Linked</span>
                      </div>
                    )}
                  </div>

                  {/* MAIN DROPZONE - Clean Industrial Style */}
                  <div className={`relative flex-1 rounded-lg border-2 border-dashed transition-all duration-300 overflow-hidden group/zone ${file
                    ? 'border-primary/40 bg-primary/[0.02]'
                    : 'border-base-300/5 bg-base-300/[0.01] hover:border-base-300/20 hover:bg-base-300/[0.03]'
                    }`}>

                    {/* HIDDEN INPUT */}
                    <input
                      type="file"
                      accept="image/jpeg,image/png,text/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      className="absolute inset-0 opacity-0 cursor-pointer z-20"
                      onChange={handleFileChange}
                    />

                    {/* VISUAL CONTENT */}
                    <div className="relative z-10 h-full flex flex-col items-center justify-center p-6">
                      {file ? (
                        /* SUCCESS STATE - "Payload Loaded" with Discard Button */
                        <div className="flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-300">
                          <div className="w-14 h-14 rounded-2xl bg-success/10 text-success flex items-center justify-center mb-4 border border-success/20">
                            <CheckCircle2 size={28} />
                          </div>

                          <div className="space-y-1">
                            <p className="text-sm font-mono font-bold truncate max-w-[200px]">
                              {file.name}
                            </p>
                            <div className="flex items-center justify-center gap-2">
                              <div className="h-1 w-1 rounded-full bg-success animate-pulse" />
                              <p className="text-[9px] uppercase font-black tracking-[0.2em] text-success/80">
                                Payload Loaded
                              </p>
                            </div>
                            <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">
                              {(file.size / 1024).toFixed(1)} KB — Verified
                            </p>
                          </div>

                          <button
                            onClick={(e) => { e.preventDefault(); handleFileChange({ target: { files: [] } }); }}
                            className="mt-6 px-4 py-1.5 rounded-lg bg-error/5 border border-error/10 text-[9px] font-black text-error/60 hover:text-error hover:bg-error/10 transition-all z-30"
                          >
                            DISCARD DATA
                          </button>
                        </div>
                      ) : (
                        /* EMPTY STATE - "Source Uplink" with Type Tags */
                        <div className="flex flex-col items-center gap-4 w-full">
                          {/* Visual Header */}
                          <div className="flex flex-col items-center gap-2 opacity-40 group-hover/zone:opacity-100 transition-opacity">
                            <div className="p-4 rounded-3xl bg-base-300/5 border border-base-300/5">
                              <FileUp size={32} strokeWidth={1.5} className="text-primary" />
                            </div>
                            <div className="text-center">
                              <p className="text-[11px] font-black uppercase tracking-[0.2em]">Source Uplink</p>
                              <p className="text-[9px] font-medium opacity-60">Drag and drop or click to initiate</p>
                            </div>
                          </div>

                          {/* Type Tags */}
                          <div className="mt-2 flex flex-wrap justify-center gap-2 max-w-[280px]">
                            {['IMG', 'PDF', 'DOC', 'TXT'].map((type) => (
                              <span key={type} className="px-2 py-1 rounded bg-base-300/[0.03] border border-base-300/5 text-[8px] font-mono opacity-30">
                                {type}
                              </span>
                            ))}
                          </div>

                          <p className="mt-2 text-[9px] font-bold text-primary/40 uppercase tracking-widest">Awaiting Payload...</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* COMMAND DECK - shrink-0 ensures it keeps its height at the bottom */}
                <div className="bg-base-300/5 border border-base-300/10 p-5 rounded-2xl flex flex-col gap-4 shrink-0">
                  {/* Commit Button */}
                  <button
                    type="submit" // Keep submit type for form handling
                    disabled={isSubmitting}
                    className="group btn btn-primary w-full h-16 rounded-2xl border-none transition-all hover:scale-[1.02] hover:bg-success/80 active:scale-[0.98] relative overflow-hidden bg-primary/80 text-white"
                  >
                    <div className="flex items-center justify-center gap-3 relative z-10">
                      {isSubmitting ? (
                        <Loader2 className="animate-spin" size={20} />
                      ) : (
                        <>
                          <Rocket
                            size={18}
                            className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform"
                          />
                          <span className="text-[11px] font-black uppercase tracking-[0.2em]">
                            Commit Version
                          </span>
                        </>
                      )}
                    </div>
                    {/* Subtle shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-base-300/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
                  </button>

                  {/* Abort Button */}
                  <Link
                    to={`/documents/${id}`}
                    className="group flex items-center justify-center w-full h-12 rounded-xl border border-base-300/40 hover:bg-error/15 hover:border-error/20 transition-all bg-base-300/20"
                  >
                    <div className="flex items-center gap-2 opacity-40 group-hover:opacity-100 group-hover:text-error transition-all">
                      <Ban size={14} />
                      <span className="text-[10px] font-black uppercase tracking-widest">
                        Abort
                      </span>
                    </div>
                  </Link>
                </div>
              </div>

            </div>
          </form>
        </Animate>
      </div>
    </section>
  );
}

export default CreateVersionPage;
