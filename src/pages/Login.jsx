import { useState } from "react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  AlertCircle,
  Loader2,
  ArrowRight,
  Shield,
} from "lucide-react";
import Animate from "@/components/animation/Animate";
import { NavLink, useNavigate } from "react-router-dom";
import BackgroundEffects from "@/components/background/BackgroundEffects";
import { loginUser } from "@/api/auth";

const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

const LoginHeader = () => {
  return (
    <Animate variant="fade-up" delay={0} duration={600}>
      <div className="mb-10 text-center">
        <span className="rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
          Secure Access
        </span>
        <h1 className="mt-6 text-5xl font-black tracking-tight text-base-content">
          Welcome back
        </h1>
        <p className="mt-3 font-medium italic text-base-content/60">
          Enter your credentials to continue
        </p>
      </div>
    </Animate>
  );
};

const InputField = ({
  label,
  icon,
  error,
  isPassword,
  showPass,
  togglePass,
  hasForgot,
  ...props
}) => {
  return (
    <div className="space-y-2">
      <div className="ml-1 flex items-center justify-between">
        <label className="text-[10px] font-bold uppercase tracking-[0.25em] text-base-content/50">
          {label}
        </label>
        {hasForgot && (
          <button
            type="button"
            className="text-[10px] font-bold uppercase tracking-tighter text-primary transition-colors hover:text-primary-focus"
          >
            Forgot Password?
          </button>
        )}
      </div>

      <div
        className={`group flex items-center gap-3 rounded-2xl border-2 px-5 py-4 transition-all duration-300 ${
          error
            ? "border-error/40 bg-error/5"
            : "border-transparent bg-base-200/30 focus-within:border-primary/50 focus-within:bg-base-100/50"
        }`}
      >
        <div className="text-base-content/40 transition-colors group-focus-within:text-primary">
          {icon}
        </div>

        <input
          {...props}
          className="w-full bg-transparent text-sm outline-none placeholder:text-base-content/30"
        />

        {isPassword && (
          <button
            type="button"
            onClick={togglePass}
            className="text-base-content/30 transition-colors hover:text-primary"
          >
            {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      {error && (
        <Animate variant="fade-in" duration={300}>
          <p className="mt-1 ml-1 flex items-center gap-1.5 text-[11px] font-semibold text-error">
            <AlertCircle size={12} /> {error}
          </p>
        </Animate>
      )}
    </div>
  );
};

const SubmitButton = ({ submitting }) => {
  return (
    <button
      type="submit"
      disabled={submitting}
      className="btn btn-primary h-16 w-full rounded-2xl border-none text-lg font-bold normal-case shadow-2xl shadow-primary/20 transition-all hover:shadow-primary/40"
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
};

const LoginFooter = () => {
  return (
    <div className="mt-10 border-t border-white/5 pt-8">
      <p className="text-center text-sm font-medium text-base-content/60">
        Don't have an account?{" "}
        <NavLink
          to="/register"
          className="font-bold text-primary transition-colors hover:text-primary-focus"
        >
          Join us today
        </NavLink>
      </p>
    </div>
  );
};

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPass, setShowPass] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const setField = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

    if (errors[key] || serverError) {
      setErrors((prev) => ({ ...prev, [key]: "" }));
      setServerError("");
    }
  };

  const validate = () => {
    const nextErrors = {};

    if (!form.email.trim()) {
      nextErrors.email = "Email is required";
    } else if (!isValidEmail(form.email)) {
      nextErrors.email = "Invalid email address";
    }

    if (!form.password) {
      nextErrors.password = "Password is required";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();

    if (!validate()) return;

    setSubmitting(true);
    setServerError("");

    try {
      const data = await loginUser({
        email: form.email.trim(),
        password: form.password,
      });

      localStorage.setItem("accessToken", data.access);
      localStorage.setItem("refreshToken", data.refresh);
      localStorage.setItem("userEmail", form.email.trim());

      navigate("/documents");
    } catch (error) {
      setServerError(error.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-[100vh] w-full items-center justify-center overflow-hidden bg-base-100">
      <BackgroundEffects length={12} />

      <div className="relative z-10 w-full max-w-[550px] px-4 py-8">
        <LoginHeader />

        <Animate variant="fade-up" delay={100} duration={600}>
          <div className="rounded-[2.5rem] border border-white/5 bg-base-100/40 p-8 shadow-2xl backdrop-blur-3xl md:p-12">
            <form onSubmit={handleSubmit} noValidate className="space-y-6">
              <InputField
                label="Email Address"
                icon={<Mail size={18} />}
                type="email"
                placeholder="name@company.com"
                value={form.email}
                onChange={setField("email")}
                error={errors.email}
                autoComplete="email"
              />

              <InputField
                label="Password"
                icon={<Lock size={18} />}
                type={showPass ? "text" : "password"}
                placeholder="••••••••"
                value={form.password}
                onChange={setField("password")}
                error={errors.password}
                autoComplete="current-password"
                isPassword
                showPass={showPass}
                togglePass={() => setShowPass((prev) => !prev)}
                hasForgot
              />

              {serverError && (
                <Animate variant="fade-in" duration={300}>
                  <div className="alert alert-error">
                    <AlertCircle size={16} />
                    <span>{serverError}</span>
                  </div>
                </Animate>
              )}

              <div className="pt-4">
                <SubmitButton submitting={submitting} />
              </div>
            </form>

            <LoginFooter />
          </div>

          <div className="mt-8 flex items-center justify-center gap-1.5 opacity-40">
            <Shield size={12} className="text-base-content" />
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-base-content">
              Secure Cloud Infrastructure
            </span>
          </div>
        </Animate>
      </div>
    </div>
  );
};

export default Login;