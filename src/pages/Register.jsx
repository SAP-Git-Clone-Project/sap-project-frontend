import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, AlertCircle, Loader2, ArrowRight, User, CheckCircle2 } from "lucide-react";
import Animate from "@/components/animation/Animate";
import { Link, NavLink } from "react-router-dom";

const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

export default function Register({ onNavigateToLogin }) {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [showPass, setShowPass] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    if (errors[key]) setErrors((p) => ({ ...p, [key]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Full name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!isValidEmail(form.email)) e.email = "Enter a valid email address";
    if (form.password.length < 6) e.password = "Minimum 6 characters";
    if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords do not match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setTimeout(() => setSubmitting(false), 2000);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-base-100">
      
      <BackgroundEffects />

      <div className="relative z-10 w-full max-w-[600px] px-4 py-10">
        
        <RegisterHeader />

        <Animate variant="fade-up" delay={100} duration={600}>
          <div className="bg-base-100/60 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl p-8 md:p-10">
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              
              <InputField
                label="Full Name"
                icon={<User size={18} />}
                placeholder="John Doe"
                value={form.name}
                onChange={set("name")}
                error={errors.name}
              />

              <InputField
                label="Email Address"
                icon={<Mail size={18} />}
                type="email"
                placeholder="name@company.com"
                value={form.email}
                onChange={set("email")}
                error={errors.email}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Password"
                  icon={<Lock size={18} />}
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={set("password")}
                  error={errors.password}
                  isPassword
                  showPass={showPass}
                  togglePass={() => setShowPass(!showPass)}
                />

                <InputField
                  label="Confirm"
                  icon={<CheckCircle2 size={18} />}
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.confirmPassword}
                  onChange={set("confirmPassword")}
                  error={errors.confirmPassword}
                />
              </div>

              <div className="pt-2">
                <SubmitButton submitting={submitting} />
              </div>
            </form>

            <RegisterFooter onNavigate={onNavigateToLogin} />
          </div>
        </Animate>
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS (Scoped to Register) ---

function BackgroundEffects() {
  return (
    <div className="absolute inset-0 z-0">
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] animate-pulse delay-1000" />
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
    </div>
  );
}

function RegisterHeader() {
  return (
    <Animate variant="fade-up" delay={0} duration={600}>
      <div className="text-center mb-8">
        <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest border border-primary/20">
          Start your journey
        </span>
        <h1 className="text-4xl font-black tracking-tight text-base-content mt-4">Create an Account</h1>
        <p className="text-base-content mt-2 font-medium text-sm">Join 10,000+ developers worldwide</p>
      </div>
    </Animate>
  );
}

function InputField({ label, icon, error, isPassword, showPass, togglePass, ...props }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-base-content/70 ml-1">
        {label}
      </label>
      <div className={`group flex items-center gap-3 px-4 py-3 rounded-xl bg-base-200/40 border-2 transition-all duration-200 
        ${error ? "border-error/50" : "border-transparent focus-within:border-primary focus-within:bg-base-100"}`}>
        <div className="text-base-content/70 group-focus-within:text-primary transition-colors">
          {icon}
        </div>
        <input {...props} className="bg-transparent w-full text-sm outline-none placeholder:text-base-content/60" />
        {isPassword && (
          <button type="button" onClick={togglePass} className="text-base-content/70 hover:text-primary transition-colors">
            {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
      {error && <p className="text-error text-[10px] font-medium ml-1 mt-1">{error}</p>}
    </div>
  );
}

function SubmitButton({ submitting }) {
  return (
    <button
      type="submit"
      disabled={submitting}
      className="btn btn-primary w-full h-14 rounded-xl shadow-xl shadow-primary/15 hover:shadow-primary/30 transition-all border-none normal-case text-base duration-normal"
    >
      {submitting ? (
        <span className="flex items-center gap-2"><Loader2 size={20} className="animate-spin" /> Creating...</span>
      ) : (
        <span className="flex items-center gap-2">Get Started <ArrowRight size={18} /></span>
      )}
    </button>
  );
}

function RegisterFooter({ onNavigate }) {
  return (
    <div className="mt-8 pt-6 border-t border-base-content/5 text-center">
      <p className="text-sm text-base-content font-medium">
        Already have an account?{" "}
        <NavLink to="/login" className="text-primary font-bold hover:underline underline-offset-4">
          Sign In
        </NavLink>
      </p>
    </div>
  );
}