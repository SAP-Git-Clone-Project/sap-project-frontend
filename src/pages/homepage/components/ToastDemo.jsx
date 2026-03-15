import React from 'react'
import notify from "@/components/toaster/notify";

const ToastDemo = () => {
  return (
    <div className="card bg-base-200 p-5">
      <h2 className="text-xs font-semibold tracking-widest uppercase text-base-content/50 mb-3">Notifications</h2>
      <div className="flex flex-wrap gap-2">
        <button className="btn btn-success btn-sm" onClick={() => notify.success("Branch merged successfully.")}>Success</button>
        <button className="btn btn-error btn-sm" onClick={() => notify.error("Pipeline failed on SAST stage.")}>Error</button>
        <button className="btn btn-warning btn-sm" onClick={() => notify.warning("Branch is 14 commits behind.")}>Warning</button>
        <button className="btn btn-info btn-sm" onClick={() => notify.info("New design tokens available.")}>Info</button>
        <button className="btn btn-ghost btn-sm" onClick={() => notify.loading("Deploying to staging...")}>Loading</button>
      </div>
    </div>
  )
}

export default ToastDemo