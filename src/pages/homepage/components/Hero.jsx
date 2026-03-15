import React from "react";
import { Link } from "react-router-dom";
import { GitBranch, Users, BarChart2 } from "lucide-react";

const Hero = () => {
  return (
    <div className="rounded-2xl bg-gradient-to-r from-primary to-primary/70 p-8 overflow-hidden">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="badge bg-glass-white text-white border-white/20 mb-3">v2.5.0 · Internal</div>
          <h1 className="text-white text-3xl font-bold">Auth Service</h1>
          <p className="text-white/75 text-sm mt-1">JWT · SSO · Azure AD · Spring Boot 3.3</p>
          <div className="flex gap-2 mt-4">
            <Link to="/repos" className="btn btn-sm bg-white text-primary hover:bg-white/90 gap-1 font-semibold"><GitBranch size={12} />Repos</Link>
            <Link to="/teams" className="btn btn-sm bg-glass-white border-white/20 text-white hover:bg-white/20 gap-1"><Users size={12} />Teams</Link>
            <Link to="/analytics" className="btn btn-sm bg-glass-white border-white/20 text-white hover:bg-white/20 gap-1"><BarChart2 size={12} />Analytics</Link>
          </div>
        </div>
        <div className="flex flex-col gap-2 items-end">
          <div className="stats bg-glass-white border-white/20 text-white shadow-none">
            <div className="stat py-3 px-5">
              <div className="stat-title text-white/70 text-xs">Last Deploy</div>
              <div className="stat-value text-white text-lg">2h ago</div>
              <div className="stat-desc text-white/60 text-xs">Staging · Passed</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero