import React from 'react';
import { XCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const MissingArtifact = ({
  title = "Object Not Found",
  message = "The digital artifact you're looking for has drifted out of reach.",
  linkText = "Return to Safety",
  linkTo = "/documents",
  className = ""
}) => {
  return (
    // RESTORED 1: Outer div forces full screen, centered content, and dark base color
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden bg-slate-950 px-6">
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/30 rounded-full blur-[80px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/20 rounded-full blur-[100px]" />
      <div className={`relative z-10 p-12 rounded-[1.5rem] bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] text-center max-w-2xl w-full ${className}`}>
        <div className="relative inline-block mb-6">
          <XCircle size={64} className="text-error/80 relative z-10" />
          <div className="absolute inset-0 bg-error/20 blur-2xl rounded-full" />
        </div>

        {/* Text Content */}
        <h2 className="text-3xl font-black uppercase tracking-tight text-white mb-2">
          {title}
        </h2>

        <p className="text-slate-300 text-sm mb-8 font-medium">
          {message}
        </p>

        {/* Action Button */}
        <Link
          to={linkTo}
          className="group btn btn-primary px-10 rounded-2xl border-none 
             hover:scale-105 active:scale-95 transition-all duration-300 
             flex items-center justify-center gap-3 shadow-lg shadow-primary/20 max-w-md mx-auto"
        >
          {/* The Arrow: Always visible, slides left on hover */}
          <ArrowLeft
            size={20}
            className="transition-transform duration-300 group-hover:-translate-x-2"
          />

          <span className="font-black uppercase tracking-widest text-[11px] transition-transform duration-300 group-hover:translate-x-1">
            {linkText}
          </span>
        </Link>
      </div>
    </div>
  );
};

export default MissingArtifact;