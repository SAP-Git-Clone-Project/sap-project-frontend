import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

const Navigate = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {[
        { to: "/repos", label: "Repositories", desc: "Browse all repos", color: "text-primary", bg: "bg-primary/10", border: "border-primary/20" },
        { to: "/teams", label: "Teams", desc: "Manage team members", color: "text-purple", bg: "bg-glass-purple", border: "border-purple/20" },
        { to: "/analytics", label: "Analytics", desc: "View metrics", color: "text-teal", bg: "bg-glass-teal", border: "border-teal/20" },
      ].map((n) => (
        <Link key={n.to} to={n.to} className={`card ${n.bg} border ${n.border} p-5 hover:scale-[1.02] transition-transform`}>
          <p className={`font-semibold text-sm ${n.color}`}>{n.label}</p>
          <p className="text-xs text-base-content/50 mt-1">{n.desc}</p>
          <div className={`flex items-center gap-1 text-xs mt-3 ${n.color}`}>Go <ArrowRight size={11} /></div>
        </Link>
      ))}
    </div>
  )
}

export default Navigate