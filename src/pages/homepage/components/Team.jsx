import React from 'react'
import { Edit, Eye, MoreHorizontal, Plus, Trash2 } from 'lucide-react'
import notify from "@/components/toaster/notify";

const Team = ({ members }) => {
  return (
    <div className="card bg-base-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs font-semibold tracking-widest uppercase text-base-content/50">Team</h2>
        <button className="btn btn-primary btn-xs gap-1" onClick={() => notify.info("Invite sent.")}><Plus size={11} />Invite</button>
      </div>
      <div className="flex flex-col gap-3">
        {members.map((m) => (
          <div key={m.name} className="flex items-center gap-3 py-2 border-b border-base-300 last:border-0">
            <div className={`w-9 h-9 rounded-full ${m.bg} flex items-center justify-center text-white text-xs font-bold shrink-0`}>{m.av}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-base-content">{m.name}</p>
              <p className="text-xs text-base-content/50">{m.role}</p>
            </div>
            <span className={`badge badge-sm ${m.tagCls}`}>{m.tag}</span>
            <div className="dropdown dropdown-end">
              <button tabIndex={0} className="btn btn-ghost btn-xs btn-circle text-base-content"><MoreHorizontal size={13} /></button>
              <ul tabIndex={0} className="dropdown-content menu menu-sm bg-base-100 shadow-lg rounded-box w-36 z-10 border border-base-300 text-xs">
                <li><a className="gap-2 text-base-content"><Edit size={11} />Edit Role</a></li>
                <li><a className="gap-2 text-base-content"><Eye size={11} />View Profile</a></li>
                <li><a className="gap-2 text-error" onClick={() => notify.error("Member removed.")}><Trash2 size={11} />Remove</a></li>
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Team