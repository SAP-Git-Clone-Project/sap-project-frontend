import React from 'react'
import { GitBranch, Info, Plus, Trash2 } from 'lucide-react'
import notify from "@/components/toaster/notify";

const Modals = () => {
  return (
    <div className="card bg-base-200 p-6">
      <h2 className="text-xs font-semibold tracking-widest uppercase text-base-content/50 mb-4">Modals</h2>
      <div className="flex flex-wrap gap-3">
        <button className="btn btn-error btn-sm gap-1" onClick={() => document.getElementById("modal-delete").showModal()}><Trash2 size={13} />Delete</button>
        <button className="btn btn-outline btn-sm gap-1 text-base-content" onClick={() => document.getElementById("modal-info").showModal()}><Info size={13} />Info</button>
        <button className="btn btn-primary btn-sm gap-1" onClick={() => document.getElementById("modal-form").showModal()}><Plus size={13} />New Branch</button>
      </div>

      <dialog id="modal-delete" className="modal">
        <div className="modal-box max-w-sm bg-base-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-error/15 flex items-center justify-center shrink-0"><Trash2 size={16} className="text-error" /></div>
            <div>
              <h3 className="font-bold text-base-content">Delete Repository</h3>
              <p className="text-xs text-base-content/50">This cannot be undone.</p>
            </div>
          </div>
          <p className="text-sm text-base-content/70 mb-4">Permanently delete <strong className="text-base-content">auth-service</strong>?</p>
          <div className="modal-action gap-2">
            <form method="dialog"><button className="btn btn-ghost btn-sm text-base-content">Cancel</button></form>
            <form method="dialog">
              <button className="btn btn-error btn-sm gap-1" onClick={() => notify.error("Repository deleted.")}><Trash2 size={12} />Delete</button>
            </form>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop"><button>close</button></form>
      </dialog>

      <dialog id="modal-info" className="modal">
        <div className="modal-box max-w-sm bg-base-100">
          <h3 className="font-bold flex items-center gap-2 mb-4 text-base-content"><Info size={16} className="text-info" />Pipeline Details</h3>
          <div className="flex flex-col gap-2 text-sm">
            {[["Build", "Passed ✓", "text-success"], ["Tests (48)", "Passed ✓", "text-success"], ["SAST", "Passed ✓", "text-success"], ["Deploy", "Running…", "text-warning"]].map(([k, v, c]) => (
              <div key={k} className="flex justify-between border-b border-base-300 pb-2 last:border-0">
                <span className="text-base-content/60">{k}</span>
                <span className={`font-semibold ${c}`}>{v}</span>
              </div>
            ))}
          </div>
          <div className="modal-action mt-4"><form method="dialog"><button className="btn btn-primary btn-sm">Close</button></form></div>
        </div>
        <form method="dialog" className="modal-backdrop"><button>close</button></form>
      </dialog>

      <dialog id="modal-form" className="modal">
        <div className="modal-box max-w-sm bg-base-100">
          <h3 className="font-bold mb-4 flex items-center gap-2 text-base-content"><GitBranch size={16} className="text-primary" />New Branch</h3>
          <div className="flex flex-col gap-3">
            <div className="form-control">
              <label className="label pb-1"><span className="label-text text-xs text-base-content/70">Branch Name</span></label>
              <input className="input input-bordered input-sm text-base-content" placeholder="feature/my-feature" />
            </div>
            <div className="form-control">
              <label className="label pb-1"><span className="label-text text-xs text-base-content/70">Source</span></label>
              <select className="select select-bordered select-sm text-base-content"><option>main</option><option>develop</option></select>
            </div>
          </div>
          <div className="modal-action gap-2">
            <form method="dialog"><button className="btn btn-ghost btn-sm text-base-content">Cancel</button></form>
            <form method="dialog">
              <button className="btn btn-primary btn-sm gap-1" onClick={() => notify.success("Branch created.")}><Plus size={12} />Create</button>
            </form>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop"><button>close</button></form>
      </dialog>
    </div>
  )
}

export default Modals