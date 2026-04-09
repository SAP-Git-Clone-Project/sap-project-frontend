import React from 'react'
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import Animate from "@/components/animation/Animate";

const InputField = ({ label, icon, error, isPassword, showPass, togglePass, hasForgot, ...props }) => {
  return (
    <div className="space-y-2">
      <div className="ml-1 flex items-center justify-between">
        <label className="text-[10px] font-bold uppercase tracking-[0.25em] text-base-content/50">
          {label}
        </label>
        {hasForgot && (
          <button
            type="button"
            className="text-[10px] font-bold uppercase tracking-tighter text-primary transition-colors hover:text-primary-focus"
          >
            Forgot Password?
          </button>
        )}
      </div>

      <div
        className={`group flex items-center gap-3 rounded-2xl border-2 px-5 py-4 transition-all duration-300 ${error
          ? "border-error/40 bg-error/5"
          : "border-transparent bg-base-200/30 focus-within:border-primary/50 focus-within:bg-base-100/50"
          }`}
      >
        <div className="text-base-content/40 transition-colors group-focus-within:text-primary">
          {icon}
        </div>

        <input
          {...props}
          className="w-full bg-transparent text-sm outline-none placeholder:text-base-content/30"
        />

        {isPassword && (
          <button
            type="button"
            onClick={togglePass}
            className="text-base-content/30 transition-colors hover:text-primary"
          >
            {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      {error && (
        <Animate variant="fade-in" duration={300}>
          <p className="mt-1 ml-1 flex items-center gap-1.5 text-[11px] font-semibold text-error">
            <AlertCircle size={12} />
            {/* If error is an array, take the first one; otherwise render as is */}
            {Array.isArray(error) ? error[0] : error}
          </p>
        </Animate>
      )}
    </div>
  )
}

export default InputField
