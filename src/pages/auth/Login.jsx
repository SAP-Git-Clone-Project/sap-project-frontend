import { useState, useEffect } from "react";
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
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import Animate from "@/components/animation/Animate";
import BackgroundEffects from "@/components/background/BackgroundEffects";
import { useAuth } from "@/context/AuthContext";
import api from "@/components/api/api";
import notify from "@/components/toaster/notify";
import InputField from "./components/InputField";


const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());


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
          Log In <ArrowRight size={20} />
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
  const { isAuthenticated, login, ready } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPass, setShowPass] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Redirect if user is already logged in
  useEffect(() => {
    if (ready && isAuthenticated) {
      const from = location.state?.from?.pathname || "/documents";
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, ready, navigate, location]);

  // Show success message if coming from a successful Registration
  useEffect(() => {
    if (location.state?.registered) {
      // Clean up the location state so the message doesn't repeat on refresh
      navigate(location.pathname, { replace: true, state: {} });
      
      notify.success("Account created! You can now log in.");
    }
  }, [location, navigate]);

  const setField = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: "" }));
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
    if (!validate() || submitting) return;

    setSubmitting(true);
    // Clear previous errors so the user starts fresh
    setErrors({}); 

    try {
      const res = await api.post("/users/login/", {
        email: form.email.trim(),
        password: form.password,
      });

      const { user: apiUser, access, refresh } = res.data;

      const userData = {
        id: apiUser?.id,
        name: `${apiUser?.first_name || ""} ${apiUser?.last_name || ""}`.trim() || apiUser?.username,
        username: apiUser?.username,
        email: apiUser?.email,
        avatar: apiUser?.avatar ?? null,
        is_superuser: apiUser?.is_superuser ?? false,
        is_staff: apiUser?.is_staff ?? false,
        is_active: apiUser?.is_active ?? false,
        first_name: apiUser?.first_name ?? "",
        last_name: apiUser?.last_name ?? "",
      };

      login({ access, refresh }, userData);
      notify.success("Welcome back!");

    } catch (err) {
      // Improved error parsing
      const backendErrors = err.response?.data;

      if (backendErrors && typeof backendErrors === 'object') {
        // If the backend sent field-specific errors, highlight the inputs
        // This maps backend keys (email, password) directly to your local errors state
        setErrors(backendErrors);

        // Show a general toast - if there's no "detail" key, use a generic message
        notify.error("Please check your credentials.");
      } else {
        // Fallback for network issues or server 500 crashes
        notify.error("Connection lost. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (!ready) return null;

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

export default Login;