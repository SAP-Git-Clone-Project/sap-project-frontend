import React from 'react'
import { useState } from 'react'

const Tabs = () => {

  const [activeTab, setActiveTab] = useState(0);
  
  return (
    <div className="card bg-base-200 p-6">
      <h2 className="text-xs font-semibold tracking-widest uppercase text-base-content/50 mb-4">Tabs</h2>
      <div className="tabs tabs-bordered mb-4">
        {["Overview", "Pipelines", "Security", "Settings"].map((t, i) => (
          <button
            key={t}
            className={`tab text-sm ${activeTab === i ? "tab-active text-primary border-primary font-medium" : "text-base-content/60"}`}
            onClick={() => setActiveTab(i)}
          >{t}</button>
        ))}
      </div>
      <p className="text-sm text-base-content/70 min-h-[48px]">
        {["1,247 commits · 5 branches · 34 open MRs · 89 stars.",
          "Build 2m 14s · Test 4m 38s · Deploy 1m 02s — all passing.",
          "SAST: 0 critical · 2 medium · 5 low. Last scanned 2h ago.",
          "Auto-merge on, protected branches enforced, CODEOWNERS active.",
        ][activeTab]}
      </p>
    </div>
  )
}

export default Tabs