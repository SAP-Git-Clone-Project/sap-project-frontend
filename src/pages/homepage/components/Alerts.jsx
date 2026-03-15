import React from 'react'
import { CheckCircle, XCircle, AlertTriangle, Info } from "lucide-react";

const Alerts = () => {
  return (
    <div className="flex flex-col gap-2">
      <div className="alert alert-success text-sm py-2.5"><CheckCircle size={15} /><span>Pipeline passed all 48 checks.</span></div>
      <div className="alert alert-error   text-sm py-2.5"><XCircle size={15} /><span>Merge conflict in <code className="font-mono text-xs">src/auth/token.ts</code></span></div>
      <div className="alert alert-warning text-sm py-2.5"><AlertTriangle size={15} /><span>Branch is 14 commits behind main.</span></div>
      <div className="alert alert-info    text-sm py-2.5"><Info size={15} /><span>New SAP Horizon design tokens available.</span></div>
    </div>
  )
}

export default Alerts