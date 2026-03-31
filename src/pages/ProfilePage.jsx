import { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

import {
  User, Mail, Calendar, ShieldCheck,
  LogOut, Edit3, Trash2, Camera, BarChart3, EyeOff, Eye,
  Lock, ArrowLeft, Crown
} from "lucide-react";

import api from "@/components/api/api";
import FluidBackground from "@/components/background/FluidBackground.jsx";
import Animate from "@/components/animation/Animate.jsx";
import notify from "@/components/toaster/notify";

// Gradients
const GRADIENTS = [
  "from-[#00F5A0] to-[#00D9F5]", "from-[#00FFA3] to-[#2EC4B6]",
  "from-[#00C9FF] to-[#92FE9D]", "from-[#11998E] to-[#38EF7D]",
  "from-[#43E97B] to-[#38F9D7]", "from-[#3A86FF] to-[#00BBF9]",
  "from-[#4361EE] to-[#4CC9F0]", "from-[#007CF0] to-[#00DFD8]",
  "from-[#0575E6] to-[#00F260]", "from-[#00DBDE] to-[#0083B0]",
  "from-[#00C853] to-[#0091EA]", "from-[#1FA2FF] to-[#12D8FA]",
  "from-[#00B09B] to-[#96C93D]", "from-[#134E5E] to-[#71B280]",
  "from-[#F7971E] to-[#FFD200]", "from-[#FCE38A] to-[#F38181]",
  "from-[#F6D365] to-[#FDA085]", "from-[#FFB75E] to-[#ED8F03]",
  "from-[#F2994A] to-[#F2C94C]", "from-[#F83600] to-[#F9D423]",
  "from-[#FF4E50] to-[#F9D423]", "from-[#FF6A00] to-[#FFB347]",
  "from-[#E65100] to-[#FF8F00]", "from-[#56AB2F] to-[#F09819]",
  "from-[#A8E063] to-[#F76B1C]", "from-[#00C853] to-[#FF6D00]",
];

const pickGradient = () => {
  const picked = GRADIENTS[Math.floor(Math.random() * GRADIENTS.length)];
  const degree = Math.floor(Math.random() * 61);
  return {
    gradientClasses: picked,
    gradientStyle: { backgroundImage: `linear-gradient(${degree}deg, var(--tw-gradient-stops))` },
  };
};

// MAIN COMPONENT
const ProfilePage = () => {
  const { user: authUser, logout, setUser } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams(); // undefined on /profile, uuid on /profile/:id

  const isOwnProfile = !id; // true → /profile | false → /profile/:id

  // States
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deletePassword, setDeletePassword] = useState("");
  const [showDeletePassword, setShowDeletePassword] = useState(false);

  const [formData, setFormData] = useState({
    first_name: "", last_name: "", username: "",
    password: "", confirmPassword: "", avatar: "",
  });

  const { gradientClasses, gradientStyle } = useMemo(pickGradient, []);

  // Fetch
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (isOwnProfile) {
          // Own profile: /users/me/
          const { data } = await api.get("/users/me/");
          const mapped = mapUser(data);
          setUser(mapped);
          setProfileData(mapped);
          setFormData((prev) => ({
            ...prev,
            first_name: mapped.first_name,
            last_name: mapped.last_name,
            username: mapped.username,
            avatar: mapped.avatar,
          }));
        } else {
          // Other user: /users/<uuid>
          // Guard: only allow if the caller is authenticated
          if (!authUser) {
            navigate("/forbidden");
            return;
          }
          try {
            const { data } = await api.get(`/users/${id}/`);
            // If the server returns the own user's id, redirect to own profile
            if (data.id && authUser.id && data.id === authUser.id) {
              navigate("/profile", { replace: true });
              return;
            }
            setProfileData(mapUser(data));
          } catch (err) {
            if (err.response?.status === 403 || err.response?.status === 401) {
              navigate("/forbidden");
              return;
            }
            if (err.response?.status === 404) {
              navigate("/not-found");
              return;
            }
            throw err;
          }
        }
      } catch {
        notify.error("Failed to load profile.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [id]); // re-run if the :id param changes

  // Handlers (own profile only)
  const handleLogOut = async () => {
    notify.success("Logging out…");
    await logout();
    setTimeout(() => navigate("/"), 800);
  };

  const handleUpdateProfile = async () => {
    if (formData.password && formData.password !== formData.confirmPassword) {
      return notify.error("Passwords do not match");
    }
    try {
      const payload = {
        ...authUser,
        first_name: formData.first_name,
        last_name: formData.last_name,
        username: formData.username,
      };
      if (formData.password) payload.password = formData.password;
      const { data } = await api.put("/users/me/", payload);
      setUser((prev) => ({ ...prev, ...data }));
      setProfileData((prev) => ({ ...prev, ...data }));
      notify.success("Profile updated!");
      document.getElementById("edit_profile_modal").close();
    } catch {
      notify.error("Update failed");
    }
  };

  const handleAvatarUpdate = async () => {
    try {
      const { data } = await api.put("/users/me/", { ...authUser, avatar: formData.avatar });
      setUser((prev) => ({ ...prev, avatar: data.avatar }));
      setProfileData((prev) => ({ ...prev, avatar: data.avatar }));
      notify.success("Avatar updated!");
      document.getElementById("avatar_modal").close();
    } catch {
      notify.error("Avatar update failed");
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) { notify.error("Password required"); return; }
    try {
      await api.delete("/users/me/", { data: { password: deletePassword } });
      notify.success("Account deleted successfully");
      logout();
    } catch (err) {
      const msg = err.response?.data?.detail || err.response?.data?.error || "Server error. Please try again later.";
      notify.error(msg);
      if (err.response?.data?.code === "user_not_found") logout();
    }
  };

  // Loading 
  if (isLoading) return <LoadingSpinner />;

  // Render 
  const profile = profileData;

  return (
    <FluidBackground blobCount={6}>
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Back button when viewing someone else */}
        {!isOwnProfile && (
          <div className="max-w-5xl mx-auto mb-6">
            <button
              onClick={() => navigate(-1)}
              className="btn btn-ghost btn-sm gap-2 rounded-xl border border-white/10 hover:bg-white/10 transition-all"
            >
              <ArrowLeft size={14} /> Back
            </button>
          </div>
        )}

        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* LEFT: PROFILE CARD */}
          <div className="lg:col-span-4 space-y-6">
            <Animate variant="fade-right">
              <div className="card bg-base-200/40 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden">

                {/* Gradient banner */}
                <div
                  className={`h-28 w-full border-b border-white/10 bg-gradient-to-r ${gradientClasses}`}
                  style={gradientStyle}
                />

                <div className="px-6 pb-8 text-center -mt-14">
                  {/* Avatar */}
                  <div className="relative inline-block group">
                    <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-base-200 shadow-xl mx-auto transition-transform group-hover:scale-105 duration-300 relative z-0">
                      <img
                        src={profile?.avatar || "/avatar.png"}
                        alt="User"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 rounded-full shadow-inner pointer-events-none" />
                    </div>

                    {/* Camera button — own profile only */}
                    {isOwnProfile && (
                      <button
                        onClick={() => document.getElementById("avatar_modal").showModal()}
                        className="absolute bottom-0 right-1 p-2.5 bg-primary text-white rounded-2xl shadow-lg hover:bg-primary-focus transition-colors z-10 scale-90 group-hover:scale-100"
                      >
                        <Camera size={14} />
                      </button>
                    )}

                    {/* Lock badge — other user */}
                    {!isOwnProfile && (
                      <div className="absolute bottom-0 right-1 p-2.5 bg-base-300/80 text-base-content/40 rounded-2xl shadow z-10">
                        <Lock size={14} />
                      </div>
                    )}
                  </div>

                  <h2 className="mt-4 text-2xl font-bold tracking-tight">
                    {profile?.first_name} {profile?.last_name}
                  </h2>
                  <p className="text-secondary text-sm">@{profile?.username}</p>

                  {/* Viewing someone else's profile badge */}
                  {!isOwnProfile && (
                    <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-base-300/40 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-base-content/50">
                      <User size={10} /> Public Profile
                    </div>
                  )}

                  {/* Info rows */}
                  <div className="mt-6 space-y-3">
                    {/* Email — only show on own profile or if API exposes it */}
                    {(isOwnProfile || profile?.email) && (
                      <div className="flex items-center gap-3 px-4 py-2 bg-base-300/30 rounded-xl text-sm border border-white/5">
                        <Mail size={16} className="text-primary" />
                        <span className="truncate">{profile?.email}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-3 px-4 py-2 bg-base-300/30 rounded-xl text-sm border border-white/5">
                      <Calendar size={16} className="text-teal" />
                      <span>Joined {new Date(profile?.created_at).toLocaleDateString()}</span>
                    </div>

                    {profile?.is_superuser && (
                      <div className="flex items-center gap-3 px-4 py-2 bg-amber-500/10 rounded-xl text-sm border border-amber-500/30 text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.1)] backdrop-blur-md">
                        <Crown size={16} className="text-yellow-400 drop-shadow-[0_0_5px_rgba(250,204,21,0.6)]" />
                        <span className="font-bold tracking-wide uppercase text-[11px]">
                          Superuser Access
                        </span>
                      </div>
                    )}

                    {profile?.is_staff && (
                      <div className="flex items-center gap-3 px-4 py-2 bg-glass-purple rounded-xl text-sm border border-purple/20 text-purple">
                        <ShieldCheck size={16} />
                        <span className="font-medium">Administrator Access</span>
                      </div>
                    )}
                  </div>

                  {/* Action buttons — own profile only */}
                  {isOwnProfile && (
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
                  )}
                </div>
              </div>
            </Animate>
          </div>

          {/* RIGHT: STATS + MANAGEMENT */}
          <div className="lg:col-span-8 space-y-8">

            {/* Stats Grid */}
            <Animate variant="fade-up">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard
                  icon={<BarChart3 size={20} />}
                  label="Reviews"
                  value={profile?.reviews_count}
                  className="bg-glass-purple border-purple/20 text-purple"
                />
                <StatCard
                  icon={<Camera size={20} />}
                  label="Pending"
                  value={profile?.pending_count}
                  className="bg-glass-teal border-teal/20 text-teal"
                />
                <StatCard
                  icon={<User size={20} />}
                  label="Versions"
                  value={profile?.versions_count}
                  className="bg-primary/10 border-primary/20 text-primary"
                />
              </div>
            </Animate>

            {/* Account Management — own profile only */}
            {isOwnProfile && (
              <Animate variant="fade-up" delay={200}>
                <div className="card bg-base-200/40 backdrop-blur-xl border border-white/10">
                  <div className="card-body">
                    <h3 className="card-title text-lg mb-4 flex items-center gap-2">
                      <ShieldCheck size={20} className="text-secondary" />
                      Security & Account
                    </h3>

                    <div className="space-y-4">
                      <div className="p-4 rounded-2xl bg-error/5 border border-error/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
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
            )}

            {/* Read-only notice for other users */}
            {!isOwnProfile && (
              <Animate variant="fade-up" delay={200}>
                <div className="card bg-base-200/40 backdrop-blur-xl border border-white/10">
                  <div className="card-body flex flex-row items-center gap-4">
                    <div className="p-3 rounded-2xl bg-base-300/40 border border-white/10">
                      <Lock size={20} className="text-base-content/40" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">Read-only view</p>
                      <p className="text-xs text-base-content/50 mt-0.5">
                        You are viewing <strong>@{profile?.username}</strong>'s public profile.
                        Only their own account controls are visible to them.
                      </p>
                    </div>
                  </div>
                </div>
              </Animate>
            )}
          </div>
        </div>

        {/* MODALS (own profile only) */}
        {isOwnProfile && (
          <>
            {/* Avatar Modal */}
            <Modal id="avatar_modal" title="Update Avatar">
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
                    <div className="size-48 aspect-square rounded-full border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden relative group">
                      {formData.avatar ? (
                        <img
                          src={formData.avatar}
                          alt="Avatar Preview"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          onError={(e) => { e.target.src = "https://placehold.co/400x400/000000/FFF?text=Error"; }}
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-base-content/20 gap-2">
                          <div className="p-3 rounded-full bg-white/5 border border-white/5">
                            <Camera size={24} />
                          </div>
                          <span className="text-[10px] font-medium italic text-center px-4">
                            No image source provided
                          </span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                    </div>
                  </div>

                  <div className="form-control relative z-10">
                    <label className="label pt-0">
                      <span className="label-text text-xs font-bold text-secondary uppercase tracking-widest">Image Source URL</span>
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

                <div className="modal-action mt-8 flex-wrap gap-3 p-1">
                  <form method="dialog" className="flex-1 sm:flex-none">
                    <button className="btn btn-ghost btn-sm rounded-xl hover:bg-white/5 w-full transition-all">Cancel</button>
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

            {/* Edit Profile Modal */}
            <Modal id="edit_profile_modal" title="Personal Information">
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
                      <div className="w-full border-t border-white/10" />
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

                  <div className="form-control">
                    <label className="label pt-0">
                      <span className="label-text text-xs font-bold text-secondary uppercase tracking-widest">Confirm Password</span>
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="input input-bordered bg-white/5 border-white/10 backdrop-blur-md focus:border-primary focus:bg-white/10 transition-all text-sm"
                    />
                  </div>
                </div>

                <div className="modal-action mt-8 flex flex-col sm:flex-row gap-3 p-1">
                  <form method="dialog" className="w-full sm:w-auto order-2 sm:order-1">
                    <button className="btn btn-ghost btn-sm rounded-xl w-full px-6 transition-all">Cancel</button>
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

            {/* Delete Account Modal */}
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
                        To proceed with deleting your account, please enter your password. This action will purge
                        all data associated with <strong>{authUser?.username}</strong>.
                      </p>

                      <div className="form-control w-full">
                        <label className="label pt-0">
                          <span className="label-text text-xs font-bold text-error/80 uppercase tracking-widest">Current Password</span>
                        </label>
                        <div className="relative w-full group">
                          <input
                            type={showDeletePassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={deletePassword}
                            onChange={(e) => setDeletePassword(e.target.value)}
                            className="input input-bordered w-full bg-white/5 border-white/10 backdrop-blur-md focus:border-error focus:bg-error/5 transition-all text-sm pr-12"
                          />
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
                        <button className="btn btn-ghost btn-sm rounded-xl w-full px-6 hover:bg-white/5 transition-all">Cancel</button>
                      </form>
                      <button
                        className="btn btn-error btn-sm px-8 rounded-xl shadow-lg shadow-error/20 border-none hover:scale-105 active:scale-95 transition-all w-full sm:w-auto order-1 sm:order-2 disabled:opacity-50"
                        onClick={handleDeleteAccount}
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
          </>
        )}
      </div>
    </FluidBackground>
  );
};

// HELPERS - user data can be inconsistent so normilize it for easier use

const mapUser = (data) => ({
  id: data.id,
  username: data.username,
  email: data.email,
  avatar: data.avatar || data.profile?.avatar || "",
  is_superuser: data.is_superuser,
  is_staff: data.is_staff,
  is_active: data.is_active,
  created_at: data.created_at || data.date_joined,
  reviews_count: data.reviews_count || 0,
  pending_count: data.pending_count || 0,
  versions_count: data.versions_count || 0,
  first_name: data.first_name || data.firstName || data.profile?.first_name || "",
  last_name: data.last_name || data.lastName || data.profile?.last_name || "",
});

// Loading spinner
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-base-100 relative overflow-hidden">
    <div className="absolute w-64 h-64 bg-primary/20 blur-[100px] rounded-full animate-pulse" />
    <div className="flex flex-col items-center gap-6 relative z-10">
      <div className="relative flex items-center justify-center">
        <span className="loading loading-ring w-20 h-20 text-primary/30 absolute" />
        <span className="loading loading-ring w-12 h-12 text-primary" />
      </div>
      <p className="text-[10px] font-black text-primary/80 uppercase tracking-[0.4em] animate-pulse">
        Loading Profile…
      </p>
    </div>
  </div>
);

// Status card component
const StatCard = ({ icon, label, value, className }) => (
  <div className={`p-6 rounded-3xl border flex flex-col items-center justify-center gap-1 backdrop-blur-md transition-transform hover:scale-105 duration-300 ${className}`}>
    <div className="p-2 bg-white/10 rounded-xl mb-1">{icon}</div>
    <span className="text-3xl font-black">{value ?? 0}</span>
    <span className="text-[10px] uppercase font-bold tracking-tighter opacity-70">{label}</span>
  </div>
);

// Reuseable popup modal component
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