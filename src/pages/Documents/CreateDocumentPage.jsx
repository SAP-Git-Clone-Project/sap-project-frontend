import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Sparkles,
  Rocket,
  Ban,
  Loader2,
  CheckCircle2,
  FileUp,
  Fingerprint,
  FilePlus,
  X,
} from "lucide-react";

import Animate from "@/components/animation/Animate.jsx";
import api from "@/components/api/api.js";

const CreateDocumentPage = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({ title: "", content: "" });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "", form: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    const trimmedTitle = formData.title.trim();
    if (!trimmedTitle) {
      newErrors.title = "Identity required.";
    } else if (trimmedTitle.length < 3) {
      newErrors.title = "Identity too short.";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (!file) validationErrors.file = "Payload missing.";
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.post("/documents/", {
        title: formData.title.trim(),
        content: formData.content.trim() || null,
      });

      const formDataToSend = new FormData();
      formDataToSend.append("file", file);
      formDataToSend.append("document", response.data.id);
      formDataToSend.append("content", formData.content.trim() || null);

      await api.post(
        "/versions/document/" + response.data.id + "/",
        formDataToSend,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      navigate("/documents/" + response.data.id);
    } catch (err) {
      setErrors(err.response?.data || { form: "Upload failed." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-100 px-6 pb-12 pt-20 overflow-hidden font-sans">

      {/* HEADER - MATCHES AUDIT LOG SCALE */}
      <Animate variant="fade-down">
        <div className="max-w-7xl mx-auto flex flex-col gap-4 mb-12">

          {/* BUTTON MOVED TO TOP */}
          <div className="flex justify-start mb-8">
            <Link
              to="/documents"
              className="group btn btn-ghost btn-xs gap-2 rounded-lg border border-base-300/30 hover:bg-base-300/50 transition-all px-3"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-[9px] font-black uppercase tracking-widest opacity-60">Back to Documents</span>
            </Link>
          </div>

          {/* HEADER CONTENT */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-primary mb-2">
              <FilePlus size={18} />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Protocol Initiation</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-base-content leading-[0.9]">
              Create <span className="text-primary">Document</span>
            </h1>
          </div>
        </div>
      </Animate>

      <Animate variant="fade-up">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 font-sans">

          {/* LEFT COLUMN: THE WORK AREA (7/12) */}
          <div className="lg:col-span-7 flex flex-col gap-6">

            {/* 1. IDENTITY INPUT */}
            <div className="group backdrop-blur-md bg-base-300/[0.02] border border-base-300/20 p-6 rounded-2xl shadow-sm transition-all hover:bg-base-300/[0.04] hover:border-basse-300/30">
              {/* LABEL AREA */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20">
                    <Fingerprint size={14} strokeWidth={2.5} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 group-hover:opacity-100 transition-opacity">
                    Document title
                  </span>
                </div>

                {/* SUBTLE CHARACTER COUNT */}
                <span className="text-[9px] font-mono opacity-20 uppercase tracking-tighter">
                  {formData.title.length} / 64
                </span>
              </div>

              {/* INPUT FIELD */}
              <div className="relative">
                <input
                  type="text"
                  name="title"
                  autoComplete="off"
                  placeholder="Assign unique identifier..."
                  className={`w-full bg-base-300/[0.03] border rounded-xl px-4 py-3.5 text-sm font-medium transition-all focus:outline-none 
        ${errors.title
                      ? "border-error/40 bg-error/[0.02] text-error"
                      : "border-base-300/5 focus:border-primary/50 focus:bg-base-300/[0.06] hover:bg-base-300/[0.05]"
                    }`}
                  value={formData.title}
                  onChange={handleChange}
                />

                {/* THE FOCUS GLOW LINE */}
                <div className={`absolute bottom-0 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent transition-opacity duration-500 ${formData.title ? 'opacity-100' : 'opacity-0'}`} />
              </div>

              {/* ERROR FEEDBACK */}
              {errors.title && (
                <div className="flex items-center gap-1.5 mt-2.5 ml-1 animate-in fade-in slide-in-from-top-1">
                  <div className="h-1 w-1 rounded-full bg-error" />
                  <p className="text-error text-[10px] font-bold uppercase tracking-tight italic">
                    {errors.title}
                  </p>
                </div>
              )}
            </div>

            {/* 1b. REMARKS INPUT */}
            <div className="group backdrop-blur-md bg-base-300/[0.02] border border-base-300/20 p-6 rounded-2xl shadow-sm transition-all hover:bg-base-300/[0.04] hover:border-base-300/30">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20">
                    <FilePlus size={14} strokeWidth={2.5} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 group-hover:opacity-100 transition-opacity">
                    Optional Remarks
                  </span>
                </div>
                <span className="text-[9px] font-mono opacity-20 uppercase tracking-tighter">
                  {formData.content.length} / 256
                </span>
              </div>
              <textarea
                name="content"
                placeholder="Add any additional notes (optional)..."
                className={`w-full bg-base-300/[0.03] border rounded-xl px-4 py-3.5 text-sm font-medium transition-all focus:outline-none 
      border-base-300/5 focus:border-primary/50 focus:bg-base-300/[0.06] hover:bg-base-300/[0.05]`}
                value={formData.content}
                onChange={handleChange}
                rows={4}
                maxLength={256}
              />
            </div>

            {/* 2. FILE UPLINK */}
            <div className={`relative flex-1 min-h-[300px] backdrop-blur-md border border-dashed transition-all duration-300 rounded-2xl flex flex-col items-center justify-center p-6 ${file ? 'bg-success/[0.04] border-success/40 shadow-lg shadow-success/[0.02]' : 'bg-base-300/10 border-base-300/20 hover:border-primary/40 hover:bg-base-300/40'}`}>
              <input
                type="file"
                className="absolute inset-0 opacity-0 cursor-pointer z-20"
                accept="image/jpeg,image/png,text/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={(e) => setFile(e.target.files[0])}
              />

              {file ? (
                <div className="flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-300">
                  <div className="w-14 h-14 rounded-2xl bg-success/10 text-success flex items-center justify-center mb-4 border border-success/20">
                    <CheckCircle2 size={28} />
                  </div>
                  <p className="text-sm font-bold tracking-tight truncate max-w-[300px]">{file.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="h-1 w-1 rounded-full bg-success animate-pulse" />
                    <p className="text-[9px] uppercase font-black tracking-[0.2em] text-success/80">Payload Loaded</p>
                  </div>

                  <button
                    onClick={(e) => { e.preventDefault(); setFile(null); }}
                    className="mt-8 px-4 py-1.5 rounded-lg bg-error/5 border border-error/10 text-[9px] font-black text-error/60 hover:text-error hover:bg-error/10 transition-all z-30"
                  >
                    DISCARD DATA
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4 w-full">
                  {/* Visual Header */}
                  <div className="flex flex-col items-center gap-2 opacity-40 group-hover:opacity-100 transition-opacity">
                    <div className="p-4 rounded-3xl bg-base-300/5 border border-base-300/5">
                      <FileUp size={32} strokeWidth={1.5} className="text-primary" />
                    </div>
                    <div className="text-center">
                      <p className="text-[11px] font-black uppercase tracking-[0.2em]">Source Uplink</p>
                      <p className="text-[9px] font-medium opacity-60">Drag and drop or click to initiate</p>
                    </div>
                  </div>

                  {/* Type Tags - The "Cool" Additional Info */}
                  <div className="mt-4 flex flex-wrap justify-center gap-2 max-w-[280px]">
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

          {/* RIGHT COLUMN: PROTOCOL INSTRUCTIONS (5/12) */}
          <div className="lg:col-span-5 flex flex-col gap-6">

            {/* INSTRUCTION CARD */}
            <div className="flex flex-col h-full gap-6">
              {/* 1. THE PROTOCOL PANEL (INSTRUCTIONS) */}
              <div className="backdrop-blur-xl bg-primary/10 border border-base-300/10 p-8 rounded-[1rem] flex-1 shadow-2xl">
                {/* HEADER */}
                <div className="flex items-center gap-3 mb-12">
                  <div className="h-8 w-8 rounded-xl bg-primary/20 flex items-center justify-center text-primary shadow-[0_0_15px_rgba(var(--primary),0.3)]">
                    <Sparkles size={18} />
                  </div>
                  <h3 className="text-xs font-black uppercase tracking-[0.3em]">Uplink Protocol</h3>
                </div>

                <div className="space-y-0">
                  {/* STEP 01 */}
                  <div className="group flex gap-6">
                    <div className="flex flex-col items-center">
                      <div className="h-12 w-12 rounded-full bg-primary/40 border border-primary/50 flex items-center justify-center text-[11px] font-black font-mono shadow-[0_0_20px_rgba(var(--primary),0.2)] transition-all group-hover:scale-110">
                        01
                      </div>
                      <div className="w-[2px] h-12 bg-gradient-to-b from-primary/50 to-base-300/5 my-1" />
                    </div>
                    <div className="pt-2">
                      <h4 className="text-[13px] font-black uppercase tracking-tight mb-1">Identify</h4>
                      <p className="text-[11px] leading-relaxed opacity-40 group-hover:opacity-100 transition-opacity">Name your data object for the neural archives.</p>
                    </div>
                  </div>

                  {/* STEP 02 */}
                  <div className="group flex gap-6">
                    <div className="flex flex-col items-center">
                      <div className="h-12 w-12 rounded-full bg-primary/40 border border-primary/50 flex items-center justify-center text-[11px] font-black font-mono shadow-[0_0_20px_rgba(var(--primary),0.2)] transition-all group-hover:scale-110">
                        02
                      </div>
                      <div class="w-[2px] h-12 bg-gradient-to-b from-primary/50 to-base-300/5 my-1"></div>
                    </div>
                    <div className="pt-2">
                      <h4 className="text-[13px] font-black uppercase tracking-tight mb-1">Attach</h4>
                      <p className="text-[11px] leading-relaxed opacity-40 group-hover:opacity-100 transition-opacity">Feed the system PDF, DOCX, or high-res payloads.</p>
                    </div>
                  </div>

                  {/* STEP 03 */}
                  <div className="group flex gap-6">
                    <div className="flex flex-col items-center">
                      <div className="h-12 w-12 rounded-full bg-primary/40 border border-primary/50 flex items-center justify-center text-[11px] font-black font-mono shadow-[0_0_20px_rgba(var(--primary),0.2)] transition-all group-hover:scale-110">
                        03
                      </div>
                    </div>
                    <div className="pt-2">
                      <h4 className="text-[13px] font-black uppercase tracking-tight mb-1">Execute</h4>
                      <p className="text-[11px] leading-relaxed opacity-40 group-hover:opacity-100 transition-opacity">Final validation check before permanent commit.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. THE COMMAND DECK (ACTIONS) */}
              <div className="backdrop-blur-md bg-base-300/[0.01] border border-base-300/20 p-4 rounded-[1rem] space-y-3">
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="group btn btn-primary w-full h-16 rounded-2xl border-none transition-all hover:scale-[1.02] hover:bg-success/80 active:scale-[0.98] relative overflow-hidden bg-primary/80"
                >
                  <div className="flex items-center justify-center gap-3 relative z-10">
                    {isSubmitting ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <>
                        <Rocket size={18} className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                        <span className="text-[11px] font-black uppercase tracking-[0.2em]">Commit Document</span>
                      </>
                    )}
                  </div>
                  {/* Subtle shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-base-300/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
                </button>

                <Link
                  to="/documents"
                  className="group flex items-center justify-center w-full h-12 rounded-xl border border-base-300/40 hover:bg-error/15 hover:border-error/20 transition-all bg-base-300/20"
                >
                  <div className="flex items-center gap-2 opacity-30 group-hover:opacity-100 group-hover:text-error transition-all">
                    <Ban size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Abort</span>
                  </div>
                </Link>
              </div>
            </div>

            {errors.form && (
              <div className="bg-error/10 border border-error/20 p-4 rounded-2xl flex items-center gap-3 text-error text-[10px] font-bold uppercase">
                <X size={16} /> {errors.form}
              </div>
            )}
          </div>
        </div>
      </Animate>
    </div>
  );
}

export default CreateDocumentPage;