import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, AlertCircle, Loader2, ArrowRight, Shield } from "lucide-react";
import Animate from "@/components/animation/Animate";
import { Link, NavLink } from "react-router-dom";

const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

const BackgroundEffects = () => {
  return (
    <div className="absolute inset-0 z-0">
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[120px] animate-pulse delay-700" />
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
    </div>
  );
}

const LoginHeader = () => {
  return (
    <Animate variant="fade-up" delay={0} duration={600}>
      <div className="text-center mb-10">
        <h1 className="text-4xl font-black tracking-tight text-base-content">Welcome back</h1>
        <p className="text-base-content mt-3 font-medium">Enter your credentials to continue</p>
      </div>
    </Animate>
  );
}

const InputField = ({ label, icon, error, isPassword, showPass, togglePass, hasForgot, ...props }) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between ml-1">
        <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-base-content/70">
          {label}
        </label>
        {hasForgot && (
          <button type="button" className="text-[11px] font-bold text-primary hover:underline uppercase tracking-tighter">
            Forgot?
          </button>
        )}
      </div>

      <div className={`group flex items-center gap-3 px-4 py-3 rounded-xl bg-base-200/50 border-2 transition-all duration-200 
        ${error ? "border-error/50" : "border-transparent focus-within:border-primary focus-within:bg-base-100"}`}>

        <div className="text-base-content/70 group-focus-within:text-primary transition-colors">
          {icon}
        </div>

        <input
          {...props}
          className="bg-transparent w-full text-sm outline-none placeholder:text-base-content/60"
        />

        {isPassword && (
          <button
            type="button"
            onClick={togglePass}
            className="text-base-content/70 hover:text-primary transition-colors"
          >
            {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      {error && (
        <p className="flex items-center gap-1.5 text-error text-[11px] font-medium ml-1 animate-in fade-in slide-in-from-left-1">
          <AlertCircle size={12} /> {error}
        </p>
      )}
    </div>
  );
}

const SubmitButton = ({ submitting }) => {
  return (
    <button
      type="submit"
      disabled={submitting}
      className="btn btn-primary w-full h-14 rounded-xl shadow-xl shadow-primary/15 hover:shadow-primary/30 transition-all border-none normal-case text-base duration-normal"
    >
      {submitting ? (
        <span className="flex items-center gap-2">
          <Loader2 size={20} className="animate-spin" /> Authenticating...
        </span>
      ) : (
        <span className="flex items-center gap-2">
          Sign In <ArrowRight size={18} />
        </span>
      )}
    </button>
  );
}

const LoginFooter = ({ onNavigate }) => {
  return (
    <div className="mt-8 pt-6 border-t border-base-content/5">
      <p className="text-center text-sm text-base-content">
        Don't have an account?{" "}
        <NavLink to="/register"
          className="text-primary font-bold hover:underline underline-offset-4"
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

  // Helper to update state
  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    if (errors[key]) setErrors((p) => ({ ...p, [key]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.email.trim()) e.email = "Email is required";
    else if (!isValidEmail(form.email)) e.email = "Enter a valid email address";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 6) e.password = "Minimum 6 characters";
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
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-base-100">

      <BackgroundEffects />

      <div className="relative z-10 w-full max-w-[600px] px-4">

        <LoginHeader />

        <Animate variant="fade-up" delay={100} duration={600}>
          <div className="bg-base-100/60 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl p-8 md:p-10">
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

              <SubmitButton submitting={submitting} />
            </form>

            <LoginFooter onNavigate={onNavigateToRegister} />
          </div>
          <div>
            {/* Security badge */}
            <div className="flex items-center justify-center gap-1.5 mt-5">
              <Shield size={11} className="text-base-content/70" />
              <span className="text-[10.5px] font-mono text-base-content/70">
                End-to-end encrypted
              </span>
            </div>
          </div>
        </Animate>
      </div>
    </div>
  );
}

export default Login;