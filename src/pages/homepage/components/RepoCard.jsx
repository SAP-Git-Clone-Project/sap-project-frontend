import React from 'react'
import Animate from "@/components/animation/Animate.jsx";
import { GitBranch, Star, CheckCircle } from "lucide-react"

const RepoCard = ({ repos }) => {
  return (
    <>
      <h2 className="text-xs font-semibold tracking-widest uppercase text-base-content/50 mb-4">Repositories</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {repos.map((r, i) => (
          <Animate key={r.name} delay={i * 80}>
            <div className={`card ${r.glass} border ${r.border} hover:scale-[1.02] transition-transform cursor-pointer`}>
              <div className="card-body p-4 gap-3">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-lg ${r.iconBg} flex items-center justify-center`}>
                    <GitBranch size={14} className="text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-base-content leading-none">{r.name}</p>
                    <p className="text-[10px] text-base-content/50 mt-0.5">{r.lang}</p>
                  </div>
                </div>
                <p className="text-xs text-base-content/60">{r.desc}</p>
                <div className="flex items-center gap-4 text-xs text-base-content/50 pt-1 border-t border-base-300">
                  <span className="flex items-center gap-1"><Star size={10} />{r.stars}</span>
                  <span className="flex items-center gap-1"><GitBranch size={10} />{r.forks}</span>
                  <span className="ml-auto flex items-center gap-1 text-success font-medium"><CheckCircle size={10} />Active</span>
                </div>
              </div>
            </div>
          </Animate>
        ))}
      </div>
    </>
  )
}

export default RepoCard