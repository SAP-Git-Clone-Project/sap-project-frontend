import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

import {
  User, Mail, Calendar, ShieldCheck,
  LogOut, Edit3, Trash2, Camera, BarChart3, EyeOff, Eye
} from "lucide-react";

import api from "@/components/api/api";
import FluidBackground from "@/components/background/FluidBackground.jsx";
import Animate from "@/components/animation/Animate.jsx";
import notify from "@/components/toaster/notify";

const ProfilePage = () => {

  // State and Context
  const { user, logout, setUser } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [deletePassword, setDeletePassword] = useState("");
  const [showDeletePassword, setShowDeletePassword] = useState(false);
  const [apiError, setApiError] = useState(null);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    password: "",
    confirmPassword: "",
    avatar: "",
  });

  // --- RANDOM GRADIENT FOR THE TOP CARD ---
  const randomGradient = useMemo(() => {
    const gradients = [
      "from-purple-500/40 to-teal-400/40",    // Original Cyber
      "from-blue-600/40 to-violet-500/40",    // Deep Sea
      "from-rose-500/40 to-orange-400/40",    // Sunset Glow
      "from-emerald-500/40 to-cyan-400/40",   // Bio-Tech
      "from-indigo-500/40 via-purple-500/40 to-pink-500/40", // Aurora
      "from-amber-400/40 to-red-500/40"       // Volcanic
    ];
    return gradients[Math.floor(Math.random() * gradients.length)];
  }, []); // Only picks once per page load

  // --- FETCH PROFILE DATA ON MOUNT ---
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/users/me/");
        const data = response.data;
        const mappedData = {
          username: data.username,
          email: data.email,
          avatar: data.avatar || data.profile?.avatar || "",
          is_superuser: data.is_superuser,
          is_active: data.is_active,
          created_at: data.created_at || data.date_joined,
          reviews_count: data.reviews_count || 0,
          pending_count: data.pending_count || 0,
          versions_count: data.versions_count || 0,
          first_name: data.first_name || data.firstName || data.profile?.first_name || "",
          last_name: data.last_name || data.lastName || data.profile?.last_name || "",
        };
        setUser(mappedData);
        setFormData((prev) => ({
          ...prev,
          first_name: mappedData.first_name,
          last_name: mappedData.last_name,
          username: mappedData.username,
          avatar: mappedData.avatar,
        }));
      } catch (error) {
        setApiError("Failed to load profile.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [setUser]);

  // ============================ HANDLERS ============================
  // Handle logout
  const handleLogOut = async () => {
    notify.success("Logging out...");
    await logout();
    setTimeout(() => navigate("/getting-started"), 800);
  };

  // Handle profile update
  const handleUpdateProfile = async () => {
    if (formData.password && formData.password !== formData.confirmPassword) {
      return notify.error("Passwords do not match");
    }
    try {
      const payload = { ...user, first_name: formData.first_name, last_name: formData.last_name, username: formData.username };
      if (formData.password) payload.password = formData.password;
      const response = await api.put("/users/me/", payload);
      setUser(prev => ({ ...prev, ...response.data }));
      notify.success("Profile updated!");
      document.getElementById("edit_profile_modal").close();
    } catch (e) { notify.error("Update failed"); }
  };

  // Handle avatar update
  const handleAvatarUpdate = async () => {
    try {
      const response = await api.put("/users/me/", { ...user, avatar: formData.avatar });
      setUser(prev => ({ ...prev, avatar: response.data.avatar }));
      notify.success("Avatar updated!");
      document.getElementById("avatar_modal").close();
    } catch (e) { notify.error("Avatar update failed"); }
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    // Local Validation
    if (!deletePassword) {
      notify.error("Password required");
      return;
    }

    try {
      console.log("Attempting account deletion...");

      await api.delete("/users/me/", {
        data: { password: deletePassword }
      });

      // Success Path
      notify.success("Account deleted successfully");

      // Clear the session and go to login
      logout();

    } catch (err) {
      console.error("Full Error Object:", err);

      // Use the helper message or a fallback
      const errorMessage = err.response?.data?.detail ||
        err.response?.data?.error ||
        "Server error. Please try again later.";

      notify.error(errorMessage);

      // If the error is "User not found", they are already gone, so just log out
      if (err.response?.data?.code === 'user_not_found') {
        logout();
      }
    }
  };
  // ==================================================================

  // Loading state when fetching profile data
  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-base-100 relative overflow-hidden">
      {/* Animated background glow */}
      <div className="absolute w-64 h-64 bg-primary/20 blur-[100px] rounded-full animate-pulse" />

      <div className="flex flex-col items-center gap-6 relative z-10">
        {/* Modern Ring Loader */}
        <div className="relative flex items-center justify-center">
          <span className="loading loading-ring w-20 h-20 text-primary/30 absolute"></span>
          <span className="loading loading-ring w-12 h-12 text-primary"></span>
        </div>

        {/* Subtle Text with Letter Spacing */}
        <div className="flex flex-col items-center gap-1">
          <p className="text-[10px] font-black text-primary/80 uppercase tracking-[0.4em] animate-pulse">
            Loading Profile...
          </p>
        </div>
      </div>
    </div>
  );

  // Profile page code
  return (
    <FluidBackground blobCount={6}>
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* LEFT COLUMN: PROFILE CARD (Glassmorphic Sidebar) */}
          <div className="lg:col-span-4 space-y-6">
            <Animate variant="fade-right">
              <div className="card bg-base-200/40 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden">
                <div className={`h-24 bg-gradient-to-r ${randomGradient} border-b border-white/10 backdrop-blur-sm`} />
                <div className="px-6 pb-8 text-center -mt-12">
                  <div className="relative inline-block group">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-base-200 shadow-xl mx-auto transition-transform group-hover:scale-105 duration-300 relative z-0">
                      <img src={user.avatar || "/avatar.png"} alt="User" className="w-full h-full object-cover" />

                      {/* Optimization: Added a subtle inner shadow to enhance the circle depth */}
                      <div className="absolute inset-0 rounded-full shadow-inner pointer-events-none" />
                    </div>

                    <button
                      onClick={() => document.getElementById("avatar_modal").showModal()}
                      /* Updated position slightly to "hug" the circle curve better */
                      className="absolute bottom-0 right-1 p-2.5 bg-primary text-white rounded-xl shadow-lg hover:bg-primary-focus transition-colors z-10 scale-90 group-hover:scale-100"
                    >
                      <Camera size={14} />
                    </button>
                  </div>

                  <h2 className="mt-4 text-2xl font-bold tracking-tight">{user.first_name} {user.last_name}</h2>
                  <p className="text-secondary text-sm">@{user.username}</p>

                  <div className="mt-6 space-y-3">
                    <div className="flex items-center gap-3 px-4 py-2 bg-base-300/30 rounded-xl text-sm border border-white/5">
                      <Mail size={16} className="text-primary" />
                      <span className="truncate">{user.email}</span>
                    </div>
                    <div className="flex items-center gap-3 px-4 py-2 bg-base-300/30 rounded-xl text-sm border border-white/5">
                      <Calendar size={16} className="text-teal" />
                      <span>Joined {new Date(user.created_at).toLocaleDateString()}</span>
                    </div>
                    {user.is_superuser && (
                      <div className="flex items-center gap-3 px-4 py-2 bg-glass-purple rounded-xl text-sm border border-purple/20 text-purple">
                        <ShieldCheck size={16} />
                        <span className="font-medium">Administrator Access</span>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-8">
                    <button
                      onClick={() => document.getElementById("edit_profile_modal").showModal()}
                      className="btn btn-primary btn-sm rounded-xl gap-2 shadow-lg shadow-primary/20"
                    >
                      <Edit3 size={14} /> Edit
                    </button>
                    <button
                      onClick={handleLogOut}
                      className="btn btn-ghost btn-sm rounded-xl border border-base-300 hover:bg-error/10 hover:text-error hover:border-error/20"
                    >
                      <LogOut size={14} /> Logout
                    </button>
                  </div>
                </div>
              </div>
            </Animate>
          </div>

          {/* RIGHT COLUMN: CONTENT & STATS */}
          <div className="lg:col-span-8 space-y-8">

            {/* Stats Grid */}
            <Animate variant="fade-up">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard
                  icon={<BarChart3 size={20} />}
                  label="Reviews"
                  value={user.reviews_count}
                  className="bg-glass-purple border-purple/20 text-purple"
                />
                <StatCard
                  icon={<Camera size={20} />}
                  label="Pending"
                  value={user.pending_count}
                  className="bg-glass-teal border-teal/20 text-teal"
                />
                <StatCard
                  icon={<User size={20} />}
                  label="Versions"
                  value={user.versions_count}
                  className="bg-primary/10 border-primary/20 text-primary"
                />
              </div>
            </Animate>

            {/* Account Management Card */}
            <Animate variant="fade-up" delay={200}>
              <div className="card bg-base-200/40 backdrop-blur-xl border border-white/10">
                <div className="card-body">
                  <h3 className="card-title text-lg mb-4 flex items-center gap-2">
                    <ShieldCheck size={20} className="text-secondary" />
                    Security & Account
                  </h3>

                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-error/5 border border-error/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group">
                      <div className="space-y-1">
                        <p className="font-semibold text-error">Destructive Actions</p>
                        <p className="text-xs text-error/60">Permanently remove all your data</p>
                      </div>

                      <button
                        onClick={() => document.getElementById("delete_account_modal").showModal()}
                        className="btn btn-error btn-sm rounded-xl px-4 w-full sm:w-auto"
                      >
                        <Trash2 size={16} />
                        <span>Delete Account</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Animate>
          </div>
        </div>

        {/* MODALS (Enhanced with Glass Design) */}
        <Modal id="avatar_modal" title="Update Avatar">
          {/* Added px-2 and pb-4 to give space for the hover scaling effects */}
          <div className="max-w-full overflow-x-hidden px-2 pb-2">
            <p className="text-[10px] font-black text-primary/70 uppercase tracking-[0.2em] mb-6">
              Personalization Engine
            </p>

            <div className="space-y-6 relative">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 blur-3xl rounded-full pointer-events-none" />

              <div className="flex flex-col items-center gap-3">
                <label className="label self-start pb-0">
                  <span className="label-text text-xs font-bold text-secondary uppercase tracking-widest">Preview</span>
                </label>

                <div className="w-full aspect-video rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden relative group">
                  {formData.avatar ? (
                    <img
                      src={formData.avatar}
                      alt="Avatar Preview"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        e.target.src = "https://placehold.co/600x400/000000/FFF?text=Invalid+Image+URL";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-base-content/20 gap-2">
                      <div className="p-3 rounded-full bg-white/5 border border-white/5">
                        <Camera size={24} />
                      </div>
                      <span className="text-xs font-medium italic text-center px-4">No image source provided</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
                </div>
              </div>

              <div className="form-control relative z-10">
                <label className="label pt-0">
                  <span className="label-text text-xs font-bold text-secondary uppercase tracking-widest">
                    Image Source URL
                  </span>
                </label>

                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.avatar}
                  onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                  className="input input-bordered w-full bg-white/5 border-white/10 backdrop-blur-md focus:border-primary focus:bg-white/10 transition-all duration-300 placeholder:text-base-content/20 text-sm"
                />

                <label className="label">
                  <span className="label-text-alt text-base-content/40 italic break-words max-w-full">
                    Supports JPG, PNG, and WebP.
                  </span>
                </label>
              </div>
            </div>

            {/* Added p-1 to allow buttons to scale without hitting edges */}
            <div className="modal-action mt-8 flex-wrap gap-3 p-1">
              <form method="dialog" className="flex-1 sm:flex-none">
                <button className="btn btn-ghost btn-sm rounded-xl hover:bg-white/5 w-full transition-all">
                  Cancel
                </button>
              </form>
              <button
                className="btn btn-primary btn-sm px-8 rounded-xl shadow-lg shadow-primary/30 border-none bg-gradient-to-tr from-primary to-blue-600 hover:scale-105 active:scale-95 transition-all flex-1 sm:flex-none"
                onClick={handleAvatarUpdate}
              >
                Update Avatar
              </button>
            </div>
          </div>
        </Modal>

        <Modal id="edit_profile_modal" title="Personal Information">
          {/* px-2 provides space for the button scale animation so it doesn't trigger overflow */}
          <div className="max-w-full overflow-x-hidden px-2 pb-2">
            <p className="text-[10px] font-black text-primary/70 uppercase tracking-[0.2em] mb-6">
              Identity Management
            </p>

            <div className="space-y-4 relative">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/5 blur-3xl rounded-full pointer-events-none" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label pt-0">
                    <span className="label-text text-xs font-bold text-secondary uppercase tracking-widest">First Name</span>
                  </label>
                  <input
                    type="text"
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    className="input input-bordered bg-white/5 border-white/10 backdrop-blur-md focus:border-primary focus:bg-white/10 transition-all text-sm"
                  />
                </div>

                <div className="form-control">
                  <label className="label pt-0">
                    <span className="label-text text-xs font-bold text-secondary uppercase tracking-widest">Last Name</span>
                  </label>
                  <input
                    type="text"
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    className="input input-bordered bg-white/5 border-white/10 backdrop-blur-md focus:border-primary focus:bg-white/10 transition-all text-sm"
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text text-xs font-bold text-secondary uppercase tracking-widest">Username</span>
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="input input-bordered bg-white/5 border-white/10 backdrop-blur-md focus:border-primary focus:bg-white/10 transition-all text-sm"
                />
              </div>

              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold">
                  <span className="bg-transparent px-4 text-base-content/40">Security</span>
                </div>
              </div>

              <div className="form-control">
                <label className="label pt-0">
                  <span className="label-text text-xs font-bold text-secondary uppercase tracking-widest">New Password</span>
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="input input-bordered bg-white/5 border-white/10 backdrop-blur-md focus:border-primary focus:bg-white/10 transition-all text-sm"
                />
              </div>
            </div>

            {/* p-1 allows the Save button to scale up without hitting the overflow-hidden boundary */}
            <div className="modal-action mt-8 flex flex-col sm:flex-row gap-3 p-1">
              <form method="dialog" className="w-full sm:w-auto order-2 sm:order-1">
                <button className="btn btn-ghost btn-sm rounded-xl w-full px-6 transition-all">
                  Cancel
                </button>
              </form>
              <button
                className="btn btn-primary btn-sm px-10 rounded-xl shadow-lg shadow-primary/20 border-none bg-gradient-to-tr from-primary to-blue-600 hover:scale-105 active:scale-95 transition-all w-full sm:w-auto order-1 sm:order-2"
                onClick={handleUpdateProfile}
              >
                Save Changes
              </button>
            </div>
          </div>
        </Modal>

        <dialog id="delete_account_modal" className="modal backdrop-blur-md transition-all duration-300">
          <div className="modal-box bg-base-200/60 backdrop-blur-2xl border border-error/20 shadow-2xl overflow-hidden relative p-0">
            <div className="absolute -top-20 -right-20 w-48 h-48 bg-error/10 blur-3xl rounded-full pointer-events-none" />

            <div className="max-w-full overflow-x-hidden p-6 sm:p-8">
              <div className="relative z-10">
                <h3 className="font-bold text-2xl text-error flex items-center gap-3 tracking-tight">
                  <Trash2 size={24} />
                  Confirm Deletion
                </h3>

                <p className="text-[10px] font-black text-error/50 uppercase tracking-[0.2em] mt-2 mb-6">
                  Security Verification Required
                </p>

                <div className="space-y-6">
                  <p className="text-sm leading-relaxed text-base-content/70">
                    To proceed with deleting your account, please enter your password. This action will purge all data associated with <strong>{user?.username}</strong>.
                  </p>

                  <div className="form-control w-full">
                    <label className="label pt-0">
                      <span className="label-text text-xs font-bold text-error/80 uppercase tracking-widest">Current Password</span>
                    </label>

                    {/* Input Container */}
                    <div className="relative w-full group">
                      <input
                        type={showDeletePassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={deletePassword}
                        onChange={(e) => setDeletePassword(e.target.value)}
                        className="input input-bordered w-full bg-white/5 border-white/10 backdrop-blur-md focus:border-error focus:bg-error/5 transition-all text-sm pr-12"
                      />

                      {/* Toggle Eye Button */}
                      <button
                        type="button"
                        onClick={() => setShowDeletePassword(!showDeletePassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-white/10 text-base-content/40 hover:text-error transition-colors"
                      >
                        {showDeletePassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-error/5 border border-error/10 text-[11px] text-error/80 italic">
                    This is a destructive action and cannot be undone.
                  </div>
                </div>

                <div className="modal-action mt-10 flex flex-col sm:flex-row gap-3 p-1">
                  <form method="dialog" className="w-full sm:w-auto order-2 sm:order-1">
                    <button className="btn btn-ghost btn-sm rounded-xl w-full px-6 hover:bg-white/5 transition-all">
                      Cancel
                    </button>
                  </form>

                  <button
                    className="btn btn-error btn-sm px-8 rounded-xl shadow-lg shadow-error/20 border-none hover:scale-105 active:scale-95 transition-all w-full sm:w-auto order-1 sm:order-2 disabled:opacity-50"
                    onClick={() => handleDeleteAccount(deletePassword)}
                    disabled={!deletePassword}
                  >
                    Confirm Permanent Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop bg-black/40"><button>close</button></form>
        </dialog>
      </div>
    </FluidBackground>
  );
};

// Reusable Sub-components for cleaner code
const StatCard = ({ icon, label, value, className }) => (
  <div className={`p-6 rounded-3xl border flex flex-col items-center justify-center gap-1 backdrop-blur-md transition-transform hover:scale-105 duration-300 ${className}`}>
    <div className="p-2 bg-white/10 rounded-xl mb-1">{icon}</div>
    <span className="text-3xl font-black">{value || 0}</span>
    <span className="text-[10px] uppercase font-bold tracking-tighter opacity-70">{label}</span>
  </div>
);

const Modal = ({ id, title, children }) => (
  <dialog id={id} className="modal backdrop-blur-md">
    <div className="modal-box bg-base-200/80 border border-white/10 shadow-2xl max-w-lg">
      <h3 className="font-bold text-2xl mb-6 tracking-tight">{title}</h3>
      {children}
      <form method="dialog">
        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
      </form>
    </div>
  </dialog>
);

export default ProfilePage;