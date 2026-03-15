import React from 'react'

import { CheckCircle, Download, Lock, Plus } from 'lucide-react'

const TooltipKBD = () => {
  return (
    <div className="card bg-base-200 p-6">
      <h2 className="text-xs font-semibold tracking-widest uppercase text-base-content/50 mb-4">Tooltips & Keyboard Shortcuts</h2>
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="tooltip tooltip-primary" data-tip="Create repository"><button className="btn btn-primary btn-sm gap-1"><Plus size={13} />New</button></div>
        <div className="tooltip tooltip-success" data-tip="Pipeline passing"><button className="btn btn-success btn-sm gap-1"><CheckCircle size={13} />CI</button></div>
        <div className="tooltip tooltip-error" data-tip="Force-push blocked"><button className="btn btn-error btn-outline btn-sm gap-1"><Lock size={13} />Protected</button></div>
        <div className="tooltip" data-tip="Clone via SSH"><button className="btn btn-ghost btn-sm gap-1 text-base-content"><Download size={13} />Clone</button></div>
      </div>
      <div className="flex flex-wrap gap-3 items-center text-sm text-base-content/60">
        <span>Search</span><kbd className="kbd kbd-sm">⌘</kbd><kbd className="kbd kbd-sm">K</kbd>
        <span className="ml-3">Commit</span><kbd className="kbd kbd-sm">⌘</kbd><kbd className="kbd kbd-sm">Enter</kbd>
        <span className="ml-3">Branch</span><kbd className="kbd kbd-sm">⌘</kbd><kbd className="kbd kbd-sm">B</kbd>
      </div>
    </div>
  )
}

export default TooltipKBD