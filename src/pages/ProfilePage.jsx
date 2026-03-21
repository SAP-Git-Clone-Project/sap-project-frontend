import { Link, NavLink } from "react-router-dom";

import Animate from "@/components/animation/Animate.jsx";
import RepoCard from "./homepage/components/RepoCard.jsx";

const REPOS = [
  { name: "auth-service", lang: "Java", stars: 89, forks: 7, iconBg: "bg-primary", glass: "bg-primary/10", border: "border-primary/20", desc: "JWT + SSO microservice" },
  { name: "ui-components", lang: "TypeScript", stars: 142, forks: 22, iconBg: "bg-purple", glass: "bg-glass-purple", border: "border-purple/20", desc: "Shared React component library" },
  { name: "data-pipeline", lang: "Python", stars: 34, forks: 4, iconBg: "bg-teal", glass: "bg-glass-teal", border: "border-teal/20", desc: "ETL pipeline for analytics" },
];

const ProfilePage = () => {
  return (
    <div className="space-y-8 overflow-hidden">

      {/* ── Profile Header ───────────────────────── */}
      <Animate variant="fade-down">
        <div className="card bg-base-200 p-6 flex items-center gap-6">

          <div className="avatar placeholder">
            <div className="w-20 rounded-full bg-primary text-primary-content">
              <span className="text-xl text-xs font-bold">MP</span>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2">

            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold">Name Name</span>
                <span className="indicator-item badge badge-success badge-xs"></span>
              </div>

              <span className="badge badge-primary">Admin</span>
            </div>

            {/* Email */}
            <span className="text-sm text-base-content/60">
              email@example.com
            </span>

            {/* Created on */}
            <span className="text-sm text-base-content/40">
              Created on: Jan 12, 2024
            </span>

            {/* Edit Profile */}
            <button
              className="btn btn-sm btn-outline mt-2"
              onClick={() => document.getElementById('edit_profile_modal').showModal()}
            >
              Edit Profile
            </button>

            {/* Sign Out */}
            <NavLink to="/login"
              className="btn btn-sm btn-outline mt-2"
            // onClick={() => document.getElementById('edit_profile_modal').showModal()}
            >
              Sign Out
            </NavLink>

          </div>
          <dialog id="edit_profile_modal" className="modal">
            <div className="modal-box">
              <h3 className="font-bold text-lg mb-4">Edit Profile</h3>

              {/* Name */}
              <label className="label text-xs">Name</label>
              <input
                type="text"
                placeholder="New name"
                className="input input-bordered w-full mb-3"
              />

              {/* Password */}
              <label className="label text-xs">Password</label>
              <input
                type="password"
                placeholder="New password"
                className="input input-bordered w-full mb-4"
              />

              <div className="modal-action">
                <form method="dialog">
                  <button className="btn btn-ghost">Cancel</button>
                  <button className="btn btn-primary">Save</button>
                </form>
              </div>
            </div>
          </dialog>


        </div>
      </Animate>

      {/* ── Stats Row ───────────────────────────── */}
      <Animate>
        <div className="stats shadow w-full">
          <div className="stat">
            <div className="stat-title">Repos</div>
            <div className="stat-value text-primary">12</div>
          </div>

          <div className="stat">
            <div className="stat-title">Commits</div>
            <div className="stat-value">1.2k</div>
          </div>

          <div className="stat">
            <div className="stat-title">Teams</div>
            <div className="stat-value">3</div>
          </div>
        </div>
      </Animate>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Recent Activity */}
        <Animate variant="fade-right">
          <div className="card bg-base-200 p-6">
            <h2 className="text-sm font-semibold uppercase text-base-content/50 mb-4">
              Recent Activity
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Pushed to main</span>
                <span className="text-base-content/40">2h ago</span>
              </div>

              <div className="flex justify-between">
                <span>Opened PR</span>
                <span className="text-base-content/40">5h ago</span>
              </div>

              <div className="flex justify-between">
                <span>Merged feature branch</span>
                <span className="text-base-content/40">1d ago</span>
              </div>
            </div>
          </div>
        </Animate>

        {/* Teams */}
        <Animate variant="fade-left">
          <div className="card bg-base-200 p-6">
            <h2 className="text-sm font-semibold uppercase text-base-content/50 mb-4">
              Teams
            </h2>

            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span>Frontend Team</span>
                <span className="badge badge-ghost">Member</span>
              </div>

              <div className="flex items-center justify-between">
                <span>Backend Team</span>
                <span className="badge badge-primary">Admin</span>
              </div>
            </div>
          </div>
        </Animate>

      </div>

      {/* ── Repos Section ───────────────────────── */}
      <Animate>
        <div className="card bg-base-200 p-6">

          <div className="space-y-3">
            <Animate>
              <RepoCard repos={REPOS} />
            </Animate>
          </div>
        </div>
      </Animate>

      {/* ── Danger Zone ─────────────────────────── */}
      <Animate>
        <div className="card bg-base-200 border border-error/30 p-6">
          <h2 className="text-error font-semibold mb-4">Danger Zone</h2>

          <button className="btn btn-error btn-sm">
            Delete Account
          </button>
        </div>
      </Animate>

    </div>
  );
};

export default ProfilePage;