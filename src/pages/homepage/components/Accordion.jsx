import React from 'react'
import { useState } from 'react'
const Accordion = () => {

  const [openItem, setOpenItem] = useState(null)

  const toggleItem = (index) => {
    setOpenItem(openItem === index ? null : index)
  }

  return (
    <div className="card bg-base-200 p-6">
      <h2 className="text-xs font-semibold tracking-widest uppercase text-base-content/50 mb-4">Accordion</h2>
      <div className="flex flex-col gap-2">
        {[
          { q: "How are protected branches enforced?", a: "Require passing CI and 2+ approvals. Force-push is disabled." },
          { q: "What triggers a pipeline run?", a: "Every push to any branch, plus MR pipelines against merged result." },
          { q: "How do I configure code owners?", a: "Add a CODEOWNERS file at repo root using .gitignore-style patterns." },
        ].map((item, index) => (
          <div key={item.q} className="collapse collapse-arrow bg-base-300 rounded-lg">
            <input type="checkbox" checked={openItem === index} onChange={() => toggleItem(index)} />
            <div className="collapse-title text-sm font-medium py-3 min-h-0 text-base-content">{item.q}</div>
            <div className="collapse-content text-xs text-base-content/60 leading-relaxed pb-3">{item.a}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Accordion