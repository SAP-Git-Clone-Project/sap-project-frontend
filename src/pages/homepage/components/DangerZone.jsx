import React from 'react'
import notify from "@/components/toaster/notify";
import { GitBranch, Info, Plus, Trash2 } from 'lucide-react'

const DangerZone = () => {
  return (
    <div className="card bg-base-200 p-6 border border-error/20">
      <h2 className="text-xs font-semibold tracking-widest uppercase text-error mb-4">Danger Zone</h2>
      <div className="flex flex-col gap-3">
        {[
          { label: "Archive Repository", desc: "Mark as archived. No new commits or MRs.", btn: "Archive", cls: "btn-warning btn-outline", toast: () => notify.warning("Repository archived.") },
          { label: "Transfer Ownership", desc: "Transfer this repo to another namespace.", btn: "Transfer", cls: "btn-warning btn-outline", toast: () => notify.warning("Ownership transferred.") },
          { label: "Delete Repository", desc: "Permanently delete all data.", btn: "Delete", cls: "btn-error", toast: () => notify.error("Repository deleted.") },
        ].map(({ label, desc, btn, cls, toast }) => (
          <div key={label} className="flex items-center justify-between gap-4 py-3 border-b border-base-300 last:border-0">
            <div>
              <p className="text-sm font-medium text-base-content">{label}</p>
              <p className="text-xs text-base-content/50">{desc}</p>
            </div>
            <button className={`btn btn-sm ${cls} shrink-0`} onClick={toast}>{btn}</button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DangerZone