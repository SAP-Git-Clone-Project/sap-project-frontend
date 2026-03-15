import React from 'react'
import { CheckCircle, XCircle, AlertTriangle, RefreshCw } from "lucide-react"

const Badges = () => {
  return (
    <div className="card bg-base-200 p-6">
      <h2 className="text-xs font-semibold tracking-widest uppercase text-base-content/50 mb-4">Badges</h2>
      <div className="flex flex-wrap gap-2 mb-3">
        <span className="badge badge-primary">Primary</span>
        <span className="badge badge-secondary">Secondary</span>
        <span className="badge badge-accent">Accent</span>
        <span className="badge badge-ghost">Ghost</span>
        <span className="badge badge-outline">Outline</span>
      </div>
      <div className="flex flex-wrap gap-2 mb-3">
        <span className="badge badge-success gap-1"><CheckCircle size={10} />Passing</span>
        <span className="badge badge-error gap-1"><XCircle size={10} />Failed</span>
        <span className="badge badge-warning gap-1"><AlertTriangle size={10} />Review</span>
        <span className="badge badge-info gap-1"><RefreshCw size={10} />Running</span>
      </div>
      <div className="flex flex-wrap gap-2">
        <span className="badge bg-purple/20 text-purple border-purple/20 font-medium">feat</span>
        <span className="badge bg-teal/20 text-teal border-teal/20 font-medium">fix</span>
        <span className="badge bg-accent/15 text-accent border-accent/20 font-medium">chore</span>
        <span className="badge bg-primary/15 text-primary border-primary/20 font-medium">docs</span>
        <span className="badge bg-error/15 text-error border-error/20 font-medium">breaking</span>
      </div>
    </div>
  )
}

export default Badges