import React from "react";
import { Zap, Github, Linkedin, ExternalLink, Mail } from "lucide-react";

const LINKS = [
  { name: "Documentation", url: "#" },
  { name: "API Reference", url: "#" },
  { name: "System Status", url: "#", external: true },
  { name: "Community", url: "#" },
];

const LEGAL = [
  { name: "Privacy Policy", url: "#" },
  { name: "Terms of Service", url: "#" },
  { name: "Cookie Policy", url: "#" },
];

const XIcon = ({ size = 18, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932L18.901 1.153ZM17.61 20.644h2.039L6.486 3.24H4.298L17.61 20.644Z" />
  </svg>
);


const TEAM = [
  { name: "Jewel Shahi", url: "https://github.com/JewelShahi" },
  { name: "Plamen Nikolov", url: "https://github.com/plamennf" },
  { name: "Alexander Iliev", url: "https://github.com/TheGitlex" },
  { name: "Alexander Ivanov", url: "https://github.com/Aleksandar-coder" },
  { name: "Krasimir Milanov", url: "https://github.com/milanov966" },
];

const Footer = () => {
  return (
    <footer className="relative w-full border-t border-base-300 bg-base-200/50 backdrop-blur-md text-base-content pt-20 pb-8 transition-all duration-500">
      <div className="max-w-7xl mx-auto px-6">

        {/* Main Grid: Changed sm:grid-cols-2 to md:grid-cols-4 for better control */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20 text-center md:text-left">

          {/* 1. Branding Section */}
          <div className="flex flex-col items-center md:items-start space-y-6">
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-content transition-transform duration-500 group-hover:rotate-[10deg]">
                <Zap size={20} className="fill-current" />
              </div>
              <span className="text-2xl font-black tracking-tight">
                SAP <span className="text-primary not-italic">Hub</span>
              </span>
            </div>

            <p className="text-sm text-base-content/60 leading-relaxed max-w-[240px]">
              The professional standard for document lifecycle management and secure versioning.
            </p>
          </div>

          {/* 2. Resources */}
          <div className="flex flex-col items-center md:items-start space-y-6">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary/80">Resources</h4>
            <ul className="w-full space-y-4 flex flex-col items-center md:items-start">
              {LINKS.map((link) => (
                <li className="w-full text-center" key={link.name}>
                  <a href={link.url} className="group flex items-center justify-center md:justify-start text-sm font-medium text-base-content/60 transition-all hover:text-primary">
                    <div className="relative">
                      {link.name}
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                    </div>
                    {link.external && <ExternalLink size={12} className="ml-2 opacity-40" />}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Company/Legal */}
          <div className="flex flex-col items-center md:items-start space-y-6">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary/80">Company</h4>
            <ul className="space-y-4">
              {LEGAL.map((link) => (
                <li key={link.name}>
                  <a href={link.url} className="text-sm font-medium text-base-content/60 transition-colors hover:text-primary">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* 4. Support Info */}
          <div className="flex flex-col items-center md:items-start space-y-6 w-full">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary/80">Support</h4>
            <div className="w-full space-y-4 flex flex-col items-center md:items-start">
              <a
                href="mailto:support@saphub.com"
                className="group flex items-center gap-4 p-4 rounded-2xl bg-base-100 border border-base-300 transition-all duration-300 hover:border-primary/50 hover:shadow-xl w-full max-w-xs"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-content">
                  <Mail size={18} />
                </div>
                <div className="min-w-0 flex-1 text-left">
                  <span className="block text-[10px] font-bold uppercase text-base-content/40 tracking-tight">
                    Get in touch
                  </span>
                  <span className="block text-sm font-bold truncate">
                    support@saphub.com
                  </span>
                </div>
              </a>

              <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-success/5 border border-success/10 w-fit">
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
                </span>
                <span className="text-[10px] font-bold text-success uppercase tracking-wider">
                  Systems Operational
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-base-300 flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start gap-2">
            <span className="text-[10px] font-bold text-base-content/30 uppercase tracking-[0.3em]">
              © {new Date().getFullYear()} SAP Hub • Enterprise Grade
            </span>
            <p className="text-[11px] text-base-content/50">
              Created by{" "}
              {TEAM.map((member, index) => (
                <React.Fragment key={member.name}>
                  <a href={member.url} target="_blank" rel="noreferrer" className="text-base-content/80 hover:text-primary font-bold transition-colors">
                    {member.name}
                  </a>
                  {index < TEAM.length - 2 ? ", " : index === TEAM.length - 2 ? " & " : ""}
                </React.Fragment>
              ))}.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[10px] font-black text-base-content/40 uppercase tracking-widest bg-base-300/30 px-4 py-1.5 rounded-full border border-base-300">
              v1 - stable
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;