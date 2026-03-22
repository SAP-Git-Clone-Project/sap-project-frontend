import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import Animate from "@/components/animation/Animate.jsx";
import notify from "@/components/toaster/notify";

const ProfilePage = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("Name Name");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignOut = () => {
    notify.success("Signed out successfully");
    navigate("/getting-started");
  };

  return (
    <div className="space-y-12 overflow-hidden">

      {/* ── Profile Header ───────────────────────── */}
      <Animate variant="fade-down">
        <div className="max-w-4xl mx-auto mt-10">

          <div className="card bg-base-200/70 backdrop-blur border border-base-300/40 p-8 flex flex-col md:flex-row items-center md:items-start gap-8 shadow-md">

            {/* Avatar */}
            <div className="relative group">
              <div className="
                w-28 h-28
                rounded-full
                overflow-hidden
                border-2 border-base-300
                transition-all duration-200
                group-hover:border-primary
                group-hover:shadow-lg
                group-hover:shadow-primary/30
              ">
                <img
                  src="/avatar.png"
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Status indicator */}
              <span className="
                absolute bottom-2 right-2
                w-4 h-4
                bg-success
                border-2 border-base-200
                rounded-full
              "/>
            </div>

            {/* Identity Block */}
            <div className="flex flex-col items-center md:items-start gap-2 flex-1">

              {/* Name + role */}
              <div className="flex items-center gap-3 flex-wrap justify-center md:justify-start">
                <span className="text-3xl font-bold">{name}</span>
                <span className="badge badge-primary badge-md">Admin</span>
              </div>

              {/* Email */}
              <span className="text-m text-base-content/60">
                email@example.com
              </span>

              {/* Created date */}
              <span className="text-sm text-base-content/40">
                Member since Jan 12, 2024
              </span>

              {/* Buttons */}
              <div className="flex gap-3 mt-4">
                <button
                  className="btn btn-sm btn-primary shadow-md shadow-primary/30"
                  onClick={() =>
                    document.getElementById("edit_profile_modal").showModal()
                  }
                >
                  Edit Profile
                </button>

                <button
                  onClick={handleSignOut}
                  className="btn btn-sm btn-ghost border border-base-300 hover:border-error hover:text-error transition"
                >
                  Sign Out
                </button>
              </div>

            </div>
          </div>
        </div>
      </Animate>

      {/* ── Edit Profile Modal ───────────────────────── */}
      <dialog id="edit_profile_modal" className="modal">
        <div className="modal-box bg-base-200 border border-base-300 shadow-xl">

          <h3 className="font-bold text-lg mb-5">Edit Profile</h3>

          {/* Name */}
          <label className="label text-xs">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input input-bordered w-full mb-4 bg-base-300"
          />

          {/* Password */}
          <label className="label text-xs">New Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter new password"
            className="input input-bordered w-full mb-4 bg-base-300"
          />

          {/* Confirm Password */}
          <label className="label text-xs">Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            className="input input-bordered w-full mb-6 bg-base-300"
          />

          <div className="modal-action flex justify-end gap-2">
            <form method="dialog">
              <button className="btn btn-ghost">Cancel</button>
            </form>
            <button
              className="btn btn-primary shadow-md shadow-primary/30"
              onClick={() => {
                if (password !== confirmPassword) {
                  alert("Passwords do not match");
                  return;
                }

                console.log("Saved:", { name, password });
                document.getElementById("edit_profile_modal").close();
              }}
            >
              Save
            </button>
          </div>
        </div>
      </dialog>

      {/* ── Danger Zone ─────────────────────────── */}
      <Animate>
        <div className="card bg-base-200 border border-error/30 p-6">
          <h2 className="text-error font-semibold mb-4">Danger Zone</h2>
          <button className="btn btn-error btn-sm">Delete Account</button>
        </div>
      </Animate>

    </div>
  );
};

export default ProfilePage;