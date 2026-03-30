import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import api from "@/components/api/api";
import Animate from "@/components/animation/Animate.jsx";
import notify from "@/components/toaster/notify";

const BackgroundEffects = () => (
  <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
    <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
    <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[120px] animate-pulse delay-700" />
    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" />
  </div>
);

const ProfilePage = () => {
  const { user, logout, setUser } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    password: "",
    confirmPassword: "",
    avatar: "",
  });

  // --- FETCH PROFILE ---
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
        const msg = error.response?.status === 401 
          ? "Session expired - Please login again" 
          : "Failed to load profile.";
        setApiError(msg);
        notify.error(msg);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [setUser]);

  // --- HANDLERS ---

  const handleLogOut = async () => {
    try {
      notify.success("Logging out...");
      await logout();
      setTimeout(() => {
        navigate("/getting-started");
      }, 800);
    } catch (error) {
      navigate("/getting-started");
    }
  };

  const handleUpdateProfile = async () => {
    if (formData.password && formData.password !== formData.confirmPassword) {
      return notify.error("Passwords do not match");
    }
    try {
      // NOTE: Using PUT often requires the full object. 
      // We merge current user data with form updates to be safe.
      const payload = { 
        ...user,
        first_name: formData.first_name, 
        last_name: formData.last_name, 
        username: formData.username 
      };
      if (formData.password) payload.password = formData.password;

      const response = await api.put("/users/me/", payload);
      
      setUser(prev => ({ ...prev, ...response.data }));
      setFormData(prev => ({ ...prev, password: "", confirmPassword: "" }));
      
      notify.success("Profile updated successfully!");
      
      setTimeout(() => {
        document.getElementById("edit_profile_modal").close();
      }, 500);
    } catch (error) {
      notify.error(error.response?.data?.detail || "Update failed");
    }
  };

  const handleAvatarUpdate = async () => {
    if (!formData.avatar.trim().startsWith("http")) {
      return notify.error("Please enter a valid image URL");
    }
    try {
      // FIXED: Switched to PUT and included existing user data to satisfy "Full Update" requirements
      const payload = { 
        ...user, 
        avatar: formData.avatar 
      };

      const response = await api.put("/users/me/", payload);
      
      setUser(prev => ({ ...prev, avatar: response.data.avatar }));
      setFormData(prev => ({ ...prev, avatar: response.data.avatar }));
      
      notify.success("Avatar updated!");
      
      setTimeout(() => {
        document.getElementById("avatar_modal").close();
      }, 500);
    } catch (error) {
      notify.error("Avatar update failed. Check console.");
      console.error("PUT Error:", error.response?.data);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await api.delete("/users/me/");
      notify.success("Account deleted. Farewell!");
      
      setTimeout(async () => {
        await logout();
        navigate("/getting-started");
      }, 1000);
    } catch (error) {
      notify.error("Action failed");
    }
  };

  const getDisplayName = () => {
    const first = user?.first_name || "";
    const last = user?.last_name || "";
    return [first, last].filter(Boolean).join(" ") || "User";
  };

  // --- RENDER LOGIC ---

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen gap-4">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <p className="text-sm text-base-content/50">Fetching profile...</p>
      </div>
    );
  }

  if (apiError || !user) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen gap-6 px-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-error mb-2">Could Not Load Profile</p>
          <p className="text-base-content/70 mb-1">{apiError}</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate("/getting-started")}>
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-12 overflow-hidden relative pb-10">
      <BackgroundEffects />

      {/* Profile Header */}
      <Animate variant="fade-down">
        <div className="max-w-4xl mx-auto mt-10 relative z-10">
          <div className="card bg-base-200/70 backdrop-blur border border-base-300/40 p-8 flex flex-col md:flex-row items-center md:items-start gap-8 shadow-md">
            
            {/* Avatar */}
            <div 
              className="relative group cursor-pointer" 
              onClick={() => document.getElementById("avatar_modal").showModal()}
            >
              <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-base-300 transition-all duration-200 group-hover:border-primary group-hover:shadow-lg group-hover:shadow-primary/30">
                <img 
                  src={user.avatar || "/avatar.png"} 
                  alt="Profile" 
                  className="w-full h-full object-cover" 
                  onError={(e) => { e.target.src = "/avatar.png"; }} 
                />
              </div>
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white text-xs font-medium rounded-full opacity-0 group-hover:opacity-100 transition">
                Edit
              </div>
              <span className={`absolute bottom-1 right-1 w-4 h-4 border-2 border-base-200 rounded-full ${user.is_active ? 'bg-success' : 'bg-gray-400'}`} />
            </div>

            {/* User Info */}
            <div className="flex flex-col items-center md:items-start gap-2 flex-1">
              <div className="flex items-center gap-3 flex-wrap justify-center md:justify-start">
                <span className="text-3xl font-bold">{getDisplayName()}</span>
                <span className="text-xl text-base-content/50">(@{user.username})</span>
                {user.is_superuser && <span className="badge badge-primary badge-md">Superuser</span>}
              </div>
              
              <span className="text-m text-base-content/60">{user.email}</span>
              <span className="text-sm text-base-content/40">
                Member since {user.created_at ? new Date(user.created_at).toLocaleDateString() : "N/A"}
              </span>

              <div className="flex gap-3 mt-4">
                <button 
                  className="btn btn-sm btn-primary shadow-md shadow-primary/30" 
                  onClick={() => document.getElementById("edit_profile_modal").showModal()}
                >
                  Edit Profile
                </button>
                <button 
                  onClick={handleLogOut} 
                  className="btn btn-sm btn-ghost border border-base-300 hover:border-error hover:text-error transition"
                >
                  Log Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </Animate>

      {/* Avatar Modal */}
      <dialog id="avatar_modal" className="modal">
        <div className="modal-box bg-base-200 border border-base-300 shadow-xl">
          <h3 className="font-bold text-lg mb-4">Update Avatar</h3>
          <label className="label text-xs">Image URL</label>
          <input 
            type="text" 
            placeholder="https://example.com/image.png" 
            value={formData.avatar} 
            onChange={(e) => setFormData({ ...formData, avatar: e.target.value })} 
            className="input input-bordered w-full mb-4 bg-base-300" 
          />
          <div className="modal-action">
            <form method="dialog"><button className="btn btn-ghost">Cancel</button></form>
            <button className="btn btn-primary" onClick={handleAvatarUpdate}>Save</button>
          </div>
        </div>
      </dialog>

      {/* Edit Profile Modal */}
      <dialog id="edit_profile_modal" className="modal">
        <div className="modal-box bg-base-200 border border-base-300 shadow-xl">
          <h3 className="font-bold text-lg mb-5">Edit Profile</h3>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="label text-xs">First Name</label>
              <input 
                type="text" 
                value={formData.first_name} 
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })} 
                className="input input-bordered w-full bg-base-300" 
              />
            </div>
            <div>
              <label className="label text-xs">Last Name</label>
              <input 
                type="text" 
                value={formData.last_name} 
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })} 
                className="input input-bordered w-full bg-base-300" 
              />
            </div>
          </div>

          <label className="label text-xs">Username</label>
          <input 
            type="text" 
            value={formData.username} 
            onChange={(e) => setFormData({ ...formData, username: e.target.value })} 
            className="input input-bordered w-full mb-4 bg-base-300" 
          />

          <div className="divider my-4">Change Password</div>

          <label className="label text-xs">New Password</label>
          <input 
            type="password" 
            value={formData.password} 
            onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
            placeholder="Leave blank to keep current" 
            className="input input-bordered w-full mb-4 bg-base-300" 
          />

          <label className="label text-xs">Confirm New Password</label>
          <input 
            type="password" 
            value={formData.confirmPassword} 
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} 
            placeholder="Confirm new password" 
            className="input input-bordered w-full mb-4 bg-base-300" 
          />

          <div className="modal-action">
            <form method="dialog"><button className="btn btn-ghost">Cancel</button></form>
            <button 
              className="btn btn-primary shadow-md shadow-primary/30" 
              onClick={handleUpdateProfile}
            >
              Save Changes
            </button>
          </div>
        </div>
      </dialog>

      {/* Stats Section */}
      <Animate>
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 relative z-10">
          {[
            { val: user.reviews_count, label: "Reviews completed" }, 
            { val: user.pending_count, label: "Pending approvals" }, 
            { val: user.versions_count, label: "Versions uploaded" }
          ].map((stat, i) => (
            <div key={i} className="card bg-base-200/70 border border-base-300/40 backdrop-blur p-6 text-center">
              <p className="text-2xl font-bold">{stat.val || 0}</p>
              <p className="text-xs text-base-content/60">{stat.label}</p>
            </div>
          ))}
        </div>
      </Animate>

      {/* Danger Zone */}
      <Animate>
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="card bg-base-200/70 backdrop-blur border border-error/30 shadow-md">
            <div className="card-body flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-error font-semibold text-lg">Danger Zone</h2>
                <p className="text-sm text-base-content/60">Permanently delete your account and all associated data.</p>
              </div>
              <button 
                className="btn btn-error btn-sm" 
                onClick={() => document.getElementById("delete_account_modal").showModal()}
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </Animate>

      {/* Delete Modal */}
      <dialog id="delete_account_modal" className="modal">
        <div className="modal-box bg-base-200 border border-error/40 shadow-xl">
          <h3 className="font-bold text-lg text-error mb-3">Delete Account</h3>
          <p className="text-sm text-base-content/60 mb-6">This action is permanent and cannot be undone.</p>
          <div className="modal-action">
            <form method="dialog"><button className="btn btn-ghost">Cancel</button></form>
            <button className="btn btn-error" onClick={handleDeleteAccount}>Yes, Delete</button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default ProfilePage;