import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, AlertCircle, Loader2, ArrowRight, Shield } from "lucide-react";
import Animate from "@/components/animation/Animate";
import { NavLink } from "react-router-dom";
import BackgroundEffects from "@/components/background/BackgroundEffects";

const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

const LoginHeader = () => {
  return (
    <Animate variant="fade-up" delay={0} duration={600}>
      <div className="text-center mb-10">
        <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-[0.2em] border border-primary/20">
          Secure Access
        </span>
        <h1 className="text-5xl font-black tracking-tight text-base-content mt-6">Welcome back</h1>
        <p className="text-base-content/60 mt-3 font-medium italic">Enter your credentials to continue</p>
      </div>
    </Animate>
  );
}

const InputField = ({ label, icon, error, isPassword, showPass, togglePass, hasForgot, ...props }) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between ml-1">
        <label className="text-[10px] font-bold uppercase tracking-[0.25em] text-base-content/50">
          {label}
        </label>
        {hasForgot && (
          <button type="button" className="text-[10px] font-bold text-primary hover:text-primary-focus uppercase tracking-tighter transition-colors">
            Forgot Password?
          </button>
        )}
      </div>

      <div className={`group flex items-center gap-3 px-5 py-4 rounded-2xl bg-base-200/30 border-2 transition-all duration-300 
        ${error ? "border-error/40 bg-error/5" : "border-transparent focus-within:border-primary/50 focus-within:bg-base-100/50"}`}>

        <div className="text-base-content/40 group-focus-within:text-primary transition-colors">
          {icon}
        </div>

        <input
          {...props}
          className="bg-transparent w-full text-sm outline-none placeholder:text-base-content/30"
        />

        {isPassword && (
          <button
            type="button"
            onClick={togglePass}
            className="text-base-content/30 hover:text-primary transition-colors"
          >
            {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      {error && (
        <Animate variant="fade-in" duration={300}>
          <p className="flex items-center gap-1.5 text-error text-[11px] font-semibold ml-1 mt-1">
            <AlertCircle size={12} /> {error}
          </p>
        </Animate>
      )}
    </div>
  );
}

const SubmitButton = ({ submitting }) => {
  return (
    <button
      type="submit"
      disabled={submitting}
      className="btn btn-primary w-full h-16 rounded-2xl shadow-2xl shadow-primary/20 hover:shadow-primary/40 transition-all border-none normal-case text-lg font-bold"
    >
      {submitting ? (
        <span className="flex items-center gap-3">
          <Loader2 size={22} className="animate-spin" /> Verifying...
        </span>
      ) : (
        <span className="flex items-center gap-2">
          Sign In <ArrowRight size={20} />
        </span>
      )}
    </button>
  );
}

const LoginFooter = () => {
  return (
    <div className="mt-10 pt-8 border-t border-white/5">
      <p className="text-center text-sm text-base-content/60 font-medium">
        Don't have an account?{" "}
        <NavLink to="/register"
          className="text-primary font-bold hover:text-primary-focus transition-colors"
        >
          Join us today
        </NavLink>
      </p>
    </div>
  );
}

const Login = ({ onNavigateToRegister }) => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPass, setShowPass] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    if (errors[key]) setErrors((p) => ({ ...p, [key]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.email.trim()) e.email = "Email is required";
    else if (!isValidEmail(form.email)) e.email = "Invalid email address";
    if (!form.password) e.password = "Password is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setTimeout(() => setSubmitting(false), 1800);
  };

  return (
    <div className="relative min-h-[100vh] w-full flex items-center justify-center overflow-hidden bg-base-100">

      {/* DYNAMIC CANVAS BACKGROUND WITH 12 BLOBS */}
      <BackgroundEffects length={12} />

      <div className="relative z-10 w-full max-w-[550px] px-4 py-8">

        <LoginHeader />

        <Animate variant="fade-up" delay={100} duration={600}>
          <div className="bg-base-100/40 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] shadow-2xl p-8 md:p-12">
            <form onSubmit={handleSubmit} noValidate className="space-y-6">

              <InputField
                label="Email Address"
                icon={<Mail size={18} />}
                type="email"
                placeholder="name@company.com"
                value={form.email}
                onChange={set("email")}
                error={errors.email}
                autoComplete="email"
              />

              <InputField
                label="Password"
                icon={<Lock size={18} />}
                type={showPass ? "text" : "password"}
                placeholder="••••••••"
                value={form.password}
                onChange={set("password")}
                error={errors.password}
                autoComplete="current-password"
                isPassword
                showPass={showPass}
                togglePass={() => setShowPass(!showPass)}
                hasForgot
              />

              <div className="pt-4">
                <SubmitButton submitting={submitting} />
              </div>
            </form>

            <LoginFooter onNavigate={onNavigateToRegister} />
          </div>

          <div className="flex items-center justify-center gap-1.5 mt-8 opacity-40">
            <Shield size={12} className="text-base-content" />
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-base-content">
              Secure Cloud Infrastructure
            </span>
          </div>
        </Animate>
      </div>
    </div>
  );
}

export default Login;