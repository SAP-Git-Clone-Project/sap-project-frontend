import { useState } from "react";
import Animate from "@/components/animation/Animate.jsx";
import { User, XCircle, CheckCircle, Trash2, Clock } from "lucide-react";
import notify from "@/components/toaster/notify";

// MOCK DATA — replace with backend later
const MOCK_USERS = [
  {
    id: 1,
    name: "Ivan Petrov",
    email: "ivan@example.com",
    status: "active",
    joined: "Jan 12, 2024",
  },
  {
    id: 2,
    name: "Maria Ivanova",
    email: "maria@example.com",
    status: "active",
    joined: "Feb 5, 2024",
  },
  {
    id: 3,
    name: "Georgi Dimitrov",
    email: "georgi@example.com",
    status: "pending_deletion",
    joined: "Mar 1, 2024",
  },
  {
    id: 4,
    name: "Anna Petrova",
    email: "anna@example.com",
    status: "active",
    joined: "Apr 20, 2024",
  },
];

export default function AdminPage() {
  const [users, setUsers] = useState(MOCK_USERS);

  // Approve / Reject deletion requests
  const handleDeletionDecision = (id, approve) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, status: approve ? "deleted" : "active" } : u,
      ),
    );
    notify.success(
      approve ? "User deletion approved" : "User deletion rejected",
    );
  };

  return (
    <div className="px-6 pt-10 pb-16 space-y-12">
      {/* Header */}
      <Animate variant="fade-down">
        <div className="max-w-6xl mx-auto space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-base-content/60">
            Manage users, monitor requests, and oversee platform activity.
          </p>
        </div>
      </Animate>

      {/* Stats cards */}
      <Animate>
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="card bg-base-200/70 border border-base-300/40 backdrop-blur p-6 text-center">
            <p className="text-2xl font-bold">{users.length}</p>
            <p className="text-xs text-base-content/60">Total Users</p>
          </div>

          <div className="card bg-warning/10 border border-warning/20 backdrop-blur p-6 text-center">
            <p className="text-2xl font-bold">
              {users.filter((u) => u.status === "pending_deletion").length}
            </p>
            <p className="text-xs text-base-content/60">Deletion Requests</p>
          </div>

          <div className="card bg-base-200/70 border border-base-300/40 backdrop-blur p-6 text-center">
            <p className="text-2xl font-bold">
              {users.filter((u) => u.status === "deleted").length}
            </p>
            <p className="text-xs text-base-content/60">Deleted Users</p>
          </div>
        </div>
      </Animate>

      {/* Users table */}
      <Animate>
        <div className="max-w-6xl mx-auto">
          <div className="card bg-base-200/70 border border-base-300/40 backdrop-blur shadow-sm overflow-x-auto rounded-2xl p-4">
            <table className="table text-base w-full">
              <thead className="bg-base-300/40 text-base-content/80">
                <tr className="h-12 text-left">
                  <th>Name</th>
                  <th>Email</th>
                  <th className="text-center">Status</th>
                  <th className="text-center">Joined</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-base-300/30 transition h-[72px]"
                  >
                    {/* Name */}
                    <td className="font-semibold text-base">{user.name}</td>

                    {/* Email */}
                    <td className="text-base-content/90">{user.email}</td>

                    {/* Status */}
                    <td className="text-center">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold capitalize shadow-md ${
                          user.status === "active"
                            ? "text-success bg-success/10 shadow-success/30"
                            : user.status === "pending_deletion"
                              ? "text-warning bg-warning/10 shadow-warning/30"
                              : "text-error bg-error/10 shadow-error/30"
                        }`}
                      >
                        {user.status.replace("_", " ")}
                      </span>
                    </td>

                    {/* Joined */}
                    <td className="text-center text-base-content/70">
                      {user.joined}
                    </td>

                    {/* Actions */}
                    <td className="text-right flex gap-2 justify-end">
                      {user.status === "pending_deletion" && (
                        <>
                          <button
                            className="btn btn-success btn-sm shadow-md shadow-success/30 flex-1"
                            onClick={() =>
                              handleDeletionDecision(user.id, true)
                            }
                          >
                            <CheckCircle size={16} />
                            Approve
                          </button>
                          <button
                            className="btn btn-error btn-sm shadow-md shadow-error/30 flex-1"
                            onClick={() =>
                              handleDeletionDecision(user.id, false)
                            }
                          >
                            <XCircle size={16} />
                            Reject
                          </button>
                        </>
                      )}

                      {user.status === "deleted" && (
                        <button
                          className="btn btn-warning btn-sm shadow-md shadow-warning/30 flex-1"
                          disabled
                        >
                          <Trash2 size={16} /> Deleted
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Animate>

      {/* Future sections */}
      <Animate>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6">
          {/* Could add logs, stats charts, recent activity */}
          <div className="card bg-base-200/70 border border-base-300/40 backdrop-blur p-6 flex-1">
            <h2 className="font-semibold mb-3">Recent Activity</h2>
            <p className="text-sm text-base-content/50">
              No activity yet. Backend needed.
            </p>
          </div>

          <div className="card bg-base-200/70 border border-base-300/40 backdrop-blur p-6 flex-1">
            <h2 className="font-semibold mb-3">Platform Stats</h2>
            <p className="text-sm text-base-content/50">
              User engagement, uploads, and review metrics can appear here
              later.
            </p>
          </div>
        </div>
      </Animate>
    </div>
  );
}
