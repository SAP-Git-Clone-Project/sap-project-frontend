import { Zap } from "lucide-react";

const LINKS = ["Docs", "API", "Status", "Privacy", "Terms"];

export default function Footer() {
  return (
    <footer className="bg-base-200 border-t border-base-300">
      <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-base-content/50">

        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-primary flex items-center justify-center">
            <Zap size={10} className="text-primary-content" />
          </div>
          <span className="text-base-content/60">
            SAP VersionHub · <span className="text-primary font-semibold">v1.0.0</span>
          </span>
        </div>

        <div className="flex gap-4">
          {LINKS.map((l) => (
            <a key={l} className="hover:text-primary transition-colors cursor-pointer">{l}</a>
          ))}
        </div>

        <span>© 2026 SAP SE. All rights reserved.</span>
      </div>
    </footer>
  );
}