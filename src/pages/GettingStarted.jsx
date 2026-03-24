import { NavLink } from "react-router-dom";
import Animate from "@/components/animation/Animate.jsx";
import { FileText, ShieldCheck, Users, Zap} from "lucide-react";
import GlassCard from "./homepage/components/GlassCard.jsx";
// if (user) navigate("/")

const BackgroundEffects = () => {
  return (
    <div className="absolute inset-0 z-0">
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[120px] animate-pulse delay-700" />
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
    </div>
  );
}

const GettingStarted = () => {
  return (
    
   <div className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center space-y-16 overflow-hidden">
    <div className="absolute w-[600px] h-[600px] bg-primary/10 blur-3xl rounded-full top-[-200px] left-[50%] translate-x-[-50%] -z-10" />
<BackgroundEffects />
      {/* HERO */}
      <Animate variant="fade-down">
        <div className="space-y-6 max-w-2xl">
         <div className="flex items-center justify-center gap-3 mb-2">

  <div className="w-12 h-12 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center shadow-lg shadow-primary/20">
    <Zap size={22} className="text-primary" />
  </div>

  <span className="text-3xl font-extrabold tracking-tight">
    SAP <span className="text-primary">Hub</span>
  </span>

</div>
          <h1 className="text-5xl font-bold tracking-tight">
            Manage your documents
            <span className="text-primary"> smarter</span>
          </h1>

          <p className="text-base-content/60 text-lg">
            Securely store, review and collaborate on documents with version tracking,
            status workflows and team visibility — all in one place.
          </p>

          <div className="flex justify-center gap-4 mt-8">

  <NavLink
  to="/login"
  className="group btn btn-primary px-10 shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all duration-300"
>
  Get Started

  <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">
    →
  </span>
</NavLink>

  {/* <NavLink
    to="/register"
    className="btn bg-base-200 border border-base-300 px-8 hover:bg-base-300 hover:scale-[1.03] transition"
  >
    Register
  </NavLink> */}

</div>

        </div>
      </Animate>


{/* FEATURES */}
<Animate>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl">

    <GlassCard bg="bg-primary/10" border="border-primary/20">
      <FileText className="mx-auto mb-3 text-primary" size={28} />
      <h3 className="font-semibold">Version Control</h3>
      <p className="text-sm text-base-content/60">
        Track document history and manage revisions easily.
      </p>
    </GlassCard>


    <GlassCard bg="bg-success/10" border="border-success/20">
      <ShieldCheck className="mx-auto mb-3 text-success" size={28} />
      <h3 className="font-semibold">Secure Access</h3>
      <p className="text-sm text-base-content/60">
        Only authorized users can view or modify documents.
      </p>
    </GlassCard>


    <GlassCard bg="bg-warning/10" border="border-warning/20">
      <Users className="mx-auto mb-3 text-warning" size={28} />
      <h3 className="font-semibold">Team Collaboration</h3>
      <p className="text-sm text-base-content/60">
        Share files and manage approval workflows together.
      </p>
    </GlassCard>

  </div>
</Animate>

    </div>
  );
};

export default GettingStarted;