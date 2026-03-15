import React from 'react'

import Animate from "@/components/animation/Animate.jsx";
import notify from "@/components/toaster/notify";
import { Check } from "lucide-react";

const FormsAndProgress = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Animate variant="fade-right">
        <div className="card bg-base-200 p-6">
          <h2 className="text-xs font-semibold tracking-widest uppercase text-base-content/50 mb-4">Form Controls</h2>
          <div className="flex flex-col gap-3">
            <div className="form-control">
              <label className="label pb-1"><span className="label-text text-xs text-base-content/70">Repository Name</span></label>
              <input className="input input-bordered input-sm text-base-content" defaultValue="auth-service" />
            </div>
            <div className="form-control">
              <label className="label pb-1"><span className="label-text text-xs text-base-content/70">Default Branch</span></label>
              <select className="select select-bordered select-sm text-base-content">
                <option>main</option><option>develop</option><option>staging</option>
              </select>
            </div>
            <div className="form-control">
              <label className="label pb-1"><span className="label-text text-xs text-base-content/70">Description</span></label>
              <textarea className="textarea textarea-bordered text-sm resize-none text-base-content" rows={2} defaultValue="SAP authentication microservice." />
            </div>
            <div className="flex flex-wrap gap-4">
              {["Protected", "Auto-merge", "Require CI"].map((l, i) => (
                <label key={l} className="flex items-center gap-2 cursor-pointer text-sm text-base-content">
                  <input type="checkbox" className="checkbox checkbox-primary checkbox-sm" defaultChecked={i !== 1} />{l}
                </label>
              ))}
            </div>
            <div className="form-control">
              <label className="label pb-1">
                <span className="label-text text-xs text-base-content/70">Coverage Threshold</span>
                <span className="label-text-alt text-primary font-mono text-xs font-semibold">80%</span>
              </label>
              <input type="range" min={0} max={100} defaultValue={80} className="range range-primary range-sm" />
            </div>
            <div className="flex gap-4">
              {["Internal", "Private", "Public"].map((v) => (
                <label key={v} className="flex items-center gap-2 cursor-pointer text-sm text-base-content">
                  <input type="radio" name="vis" className="radio radio-primary radio-sm" defaultChecked={v === "Internal"} />{v}
                </label>
              ))}
            </div>
            <button
              className="btn btn-primary btn-sm self-start gap-1"
              onClick={() => notify.success("Settings saved.")}
            >
              <Check size={13} />Save
            </button>
          </div>
        </div>
      </Animate>

      <div className="flex flex-col gap-4">
        <Animate variant="fade-left">
          <div className="card bg-base-200 p-6">
            <h2 className="text-xs font-semibold tracking-widest uppercase text-base-content/50 mb-4">Progress</h2>
            <div className="flex flex-col gap-3">
              {[
                { label: "Test Coverage", val: 82, cls: "progress-primary" },
                { label: "Build Progress", val: 65, cls: "progress-warning" },
                { label: "Deployment", val: 100, cls: "progress-success" },
                { label: "Migration", val: 38, cls: "progress-error" },
              ].map(({ label, val, cls }) => (
                <div key={label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-base-content/60">{label}</span>
                    <span className="font-mono font-semibold text-base-content">{val}%</span>
                  </div>
                  <progress className={`progress ${cls} h-2`} value={val} max={100} />
                </div>
              ))}
            </div>
          </div>
        </Animate>

        <Animate variant="fade-left" delay={80}>
          <div className="card bg-base-200 p-6">
            <h2 className="text-xs font-semibold tracking-widest uppercase text-base-content/50 mb-4">Loading States</h2>
            <div className="flex gap-5 items-center flex-wrap">
              {[
                { type: "loading-spinner", color: "text-primary", label: "spinner" },
                { type: "loading-dots", color: "text-purple", label: "dots" },
                { type: "loading-ring", color: "text-teal", label: "ring" },
                { type: "loading-bars", color: "text-accent", label: "bars" },
                { type: "loading-ball", color: "text-success", label: "ball" },
              ].map(({ type, color, label }) => (
                <div key={label} className="flex flex-col items-center gap-1">
                  <span className={`loading ${type} loading-md ${color}`} />
                  <span className="text-[10px] text-base-content/50">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </Animate>
      </div>
    </div>
  )
}

export default FormsAndProgress