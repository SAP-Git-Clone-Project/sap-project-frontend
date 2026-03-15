import React from 'react'
import { Clock, Download, Filter, GitBranch } from "lucide-react";

const CommitTable = ({ commits, statusMap }) => {
  return (
    <div className="card bg-base-200 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-base-300">
        <div>
          <p className="font-semibold text-sm text-base-content">Recent Commits</p>
          <p className="text-xs text-base-content/50">main · 1,247 total</p>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-ghost btn-xs gap-1 text-base-content"><Filter size={11} />Filter</button>
          <button className="btn btn-primary btn-xs gap-1"><Download size={11} />Export</button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="table table-sm">
          <thead>
            <tr className="bg-base-300 text-xs text-base-content/60">
              <th>Commit</th><th>Author</th>
              <th className="hidden sm:table-cell">Branch</th>
              <th className="hidden md:table-cell">Changes</th>
              <th>Status</th><th>Time</th>
            </tr>
          </thead>
          <tbody>
            {commits.map((c) => {
              const s = statusMap[c.status];
              const Icon = s.icon;
              return (
                <tr key={c.hash} className="hover cursor-pointer">
                  <td>
                    <p className="font-medium text-sm text-base-content">{c.msg}</p>
                    <code className="text-xs font-mono text-primary">{c.hash}</code>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-full ${c.avBg} flex items-center justify-center text-primary-content text-[10px] font-bold`}>{c.av}</div>
                      <span className="text-xs text-base-content/70 hidden lg:block">{c.author}</span>
                    </div>
                  </td>
                  <td className="hidden sm:table-cell">
                    <span className="badge badge-ghost badge-sm font-mono text-[10px] gap-1 text-base-content/70">
                      <GitBranch size={8} />{c.branch}
                    </span>
                  </td>
                  <td className="hidden md:table-cell">
                    <span className="text-success text-xs font-mono font-medium">+{c.adds}</span>{" "}
                    <span className="text-error text-xs font-mono font-medium">-{c.dels}</span>
                  </td>
                  <td>
                    <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${s.bg} ${s.cls}`}>
                      <Icon size={9} />{c.status}
                    </span>
                  </td>
                  <td className="text-xs text-base-content/50 whitespace-nowrap">
                    <Clock size={10} className="inline mr-1" />{c.time}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default CommitTable