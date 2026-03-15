import React from 'react'
import { Zap, Star, Shield, GitMerge } from "lucide-react";

const GlassCard = () => {
  return (
    <>
      <h2 className="text-xs font-semibold tracking-widest uppercase text-base-content/50 mb-4">Glass Cards</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Primary Glass", bg: "bg-primary/10", border: "border-primary/20", icon: Zap, color: "text-primary" },
          { label: "Accent Glass", bg: "bg-accent/10", border: "border-accent/20", icon: Star, color: "text-accent" },
          { label: "Purple Glass", bg: "bg-glass-purple", border: "border-purple/20", icon: Shield, color: "text-purple" },
          { label: "Teal Glass", bg: "bg-glass-teal", border: "border-teal/20", icon: GitMerge, color: "text-teal" },
        ].map(({ label, bg, border, icon: Icon, color }) => (
          <div key={label} className={`card ${bg} border ${border} p-5`}>
            <Icon size={20} className={`${color} mb-3`} />
            <p className={`font-semibold text-sm ${color}`}>{label}</p>
            <p className="text-xs text-base-content/50 mt-1">Transparent surface</p>
          </div>
        ))}
      </div>
    </>
  )
}

export default GlassCard