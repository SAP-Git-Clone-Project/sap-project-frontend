import React from 'react'
import Animate from "@/components/animation/Animate.jsx";
import { TrendingUp } from "lucide-react";

const Stats = ({stats}) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s, i) => (
        <Animate key={s.label} delay={i * 60}>
          <div className={`card ${s.bg} border border-base-300 p-4`}>
            <p className="text-xs text-base-content/50 mb-1">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className={`text-xs mt-1 flex items-center gap-1 ${s.up ? "text-success" : "text-error"}`}>
              <TrendingUp size={10} />{s.trend}
            </p>
          </div>
        </Animate>
      ))}
    </div>
  )
}

export default Stats