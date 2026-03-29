import { useState, useEffect } from "react";
import { Eye, EyeOff, Mail, Lock, Loader2, ArrowRight, User, CheckCircle2, AtSign } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import Animate from "@/components/animation/Animate";
import BackgroundEffects from "@/components/background/BackgroundEffects";
import { useAuth } from "@/context/AuthContext"; // ← adjust path to match your project
import api from "@/components/api/api"; // ← adjust path to match your project

const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

/**
 * Register
 *
 * Behaviour:
 *  • If the user is already authenticated, immediately redirect to "/".
 *  • On submit, POST to your registration endpoint.
 *  • On success, redirect to "/login" with a success flash so the user
 *    knows they can now sign in.
 *  • On API error, surface the server message in the form.
 */
export default function Register() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Guard: kick out logged-in users immediately
  useEffect(() => {
    if (isAuthenticated) navigate("/", { replace: true });
  }, [isAuthenticated, navigate]);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(""); // server-level error
  const [showPass, setShowPass] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    if (errors[key]) setErrors((p) => ({ ...p, [key]: "" }));
    if (apiError) setApiError("");
  };

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "Required";
    if (!form.lastName.trim()) e.lastName = "Required";
    if (!form.username.trim()) e.username = "Username is required";
    else if (form.username.length < 3) e.username = "Too short (min 3 chars)";

    if (!form.email.trim()) e.email = "Email is required";
    else if (!isValidEmail(form.email)) e.email = "Invalid email";

    if (form.password.length < 6) e.password = "Min 6 characters";
    if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords don't match";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setApiError("");

    try {
      await api.post("/users/register/", {
        first_name: form.firstName.trim(),
        last_name: form.lastName.trim(),
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
      });

      // Success → send to login with the success banner
      navigate("/login", { replace: true, state: { registered: true } });

    } catch (err) {
      const data = err.response?.data;

      if (data) {
        // Map DRF field errors back into inline form errors
        const fieldMap = {
          first_name: "firstName",
          last_name: "lastName",
          username: "username",
          email: "email",
          password: "password",
        };
        const fieldErrors = {};
        let hasFieldError = false;

        for (const [key, value] of Object.entries(data)) {
          const local = fieldMap[key];
          if (local) {
            fieldErrors[local] = Array.isArray(value) ? value[0] : value;
            hasFieldError = true;
          }
        }

        if (hasFieldError) {
          setErrors((prev) => ({ ...prev, ...fieldErrors }));
        } else {
          setApiError(data.detail ?? "Registration failed. Please try again.");
        }
      } else {
        setApiError("Network error. Please check your connection and try again.");
      }

      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-[100vh] w-full flex items-center justify-center overflow-hidden bg-base-100">

      <BackgroundEffects length={10} />

      <div className="relative z-10 w-full max-w-[650px] px-4 py-10">

        <RegisterHeader />

        <Animate variant="fade-up" delay={100} duration={600}>
          <div className="bg-base-100/40 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] shadow-2xl p-8 md:p-12">
            <form onSubmit={handleSubmit} noValidate className="space-y-5">

              {/* API-level error banner */}
              {apiError && (
                <Animate variant="fade-in" duration={300}>
                  <div className="px-5 py-3 rounded-2xl bg-error/10 border border-error/20 text-error text-sm font-semibold">
                    {apiError}
                  </div>
                </Animate>
              )}

              {/* Row 1: First and Last Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="First Name"
                  icon={<User size={18} />}
                  placeholder="John"
                  value={form.firstName}
                  onChange={set("firstName")}
                  error={errors.firstName}
                />
                <InputField
                  label="Last Name"
                  icon={<User size={18} />}
                  placeholder="Doe"
                  value={form.lastName}
                  onChange={set("lastName")}
                  error={errors.lastName}
                />
              </div>

              {/* Row 2: Username */}
              <InputField
                label="Username"
                icon={<AtSign size={18} />}
                placeholder="johndoe_dev"
                value={form.username}
                onChange={set("username")}
                error={errors.username}
              />

              {/* Row 3: Email */}
              <InputField
                label="Email Address"
                icon={<Mail size={18} />}
                type="email"
                placeholder="name@company.com"
                value={form.email}
                onChange={set("email")}
                error={errors.email}
              />

              {/* Row 4: Password grid */}
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

              <div className="pt-4">
                <SubmitButton submitting={submitting} />
              </div>
            </form>

            <RegisterFooter />
          </div>
        </Animate>
      </div>
    </div>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function RegisterHeader() {
  return (
    <Animate variant="fade-up" delay={0} duration={600}>
      <div className="text-center mb-10">
        <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-[0.2em] border border-primary/20">
          Create Account
        </span>
        <h1 className="text-5xl font-black tracking-tight text-base-content mt-6">Get Started</h1>
        <p className="text-base-content/60 mt-3 font-medium italic">Your journey begins here</p>
      </div>
    </Animate>
  );
}

function InputField({ label, icon, error, isPassword, showPass, togglePass, ...props }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold uppercase tracking-[0.25em] text-base-content/50 ml-1">
        {label}
      </label>
      <div className={`group flex items-center gap-3 px-5 py-4 rounded-2xl bg-base-200/30 border-2 transition-all duration-300
        ${error ? "border-error/40 bg-error/5" : "border-transparent focus-within:border-primary/50 focus-within:bg-base-100/50"}`}>
        <div className="text-base-content/40 group-focus-within:text-primary transition-colors">
          {icon}
        </div>
        <input {...props} className="bg-transparent w-full text-sm outline-none placeholder:text-base-content/30" />
        {isPassword && (
          <button type="button" onClick={togglePass} className="text-base-content/30 hover:text-primary transition-colors">
            {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && (
        <Animate variant="fade-in" duration={300}>
          <p className="text-error text-[10px] font-semibold ml-1 mt-1">{error}</p>
        </Animate>
      )}
    </div>
  );
}

function SubmitButton({ submitting }) {
  return (
    <button
      type="submit"
      disabled={submitting}
      className="btn btn-primary w-full h-16 rounded-2xl shadow-2xl shadow-primary/20 hover:shadow-primary/40 transition-all border-none normal-case text-lg font-bold"
    >
      {submitting ? (
        <span className="flex items-center gap-3"><Loader2 size={22} className="animate-spin" /> Processing...</span>
      ) : (
        <span className="flex items-center gap-2">Create Account <ArrowRight size={20} /></span>
      )}
    </button>
  );
}

function RegisterFooter() {
  return (
    <div className="mt-10 pt-8 border-t border-white/5 text-center">
      <p className="text-sm text-base-content/60 font-medium">
        Already a member?{" "}
        <NavLink to="/login" className="text-primary font-bold hover:text-primary-focus transition-colors">
          Sign In
        </NavLink>
      </p>
    </div>
  );
}