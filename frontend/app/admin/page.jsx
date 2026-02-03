"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { UPDATE_ROLE, TOGGLE_USER } from "../graphql/mutation";
import { GET_USERS, GET_ACTIVITY_LOG } from "../graphql/queries";

export default function AdminPage() {
  const ACTION_UI = {
    ROLE_CHANGED: { icon: "🔁", label: "Role changed" },
    USER_ENABLED: { icon: "✅", label: "User enabled" },
    USER_DISABLED: { icon: "⛔", label: "User disabled" },
    COMMENT_ADDED: {
      icon: "💬",
      label: "Comment added",
    },
  };

  const timeAgo = (date) => {
    const seconds = Math.floor((Date.now() - new Date(date)) / 1000);
    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hr ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  };

  const [role, setRole] = useState(null);

  useEffect(() => {
    setRole(localStorage.getItem("role"));
  }, []);

  const { data, loading, error } = useQuery(GET_USERS, {
    skip: role !== "ADMIN",
  });

  const {
    data: logData,
    loading: logLoading,
    error: logError,
  } = useQuery(GET_ACTIVITY_LOG, {
    skip: role !== "ADMIN",
  });

  const [updateRole] = useMutation(UPDATE_ROLE);
  const [toggleUser] = useMutation(TOGGLE_USER);

  if (role === null) {
    return (
      <div className="flex items-center justify-center h-40 text-gray-500">
        Checking permissions…
      </div>
    );
  }

  if (role !== "ADMIN") {
    return (
      <div className="flex items-center justify-center h-40 text-red-500 font-medium">
        Forbidden
      </div>
    );
  }

  if (loading) return <p className="p-6 text-gray-500">Loading users…</p>;
  if (error) return <p className="p-6 text-red-500">{error.message}</p>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Admin Panel</h1>
        <p className="text-sm text-gray-500">
          Manage users, roles and access control
        </p>
      </div>

      {/* GRID LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* USER MANAGEMENT */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow border overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold text-gray-800">
              User Management
            </h2>
            <p className="text-sm text-gray-500">
              Control user roles and status
            </p>
          </div>

          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-6 py-4 text-left">Email</th>
                <th className="px-6 py-4 text-left">Role</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {data.users.map((u) => (
                <tr key={u.id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4">{u.email}</td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        u.role === "ADMIN"
                          ? "bg-black text-white"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        u.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {u.isActive ? "Active" : "Disabled"}
                    </span>
                  </td>

                  <td className="px-6 py-4 space-x-2">
                    <button
                      onClick={() =>
                        updateRole({
                          variables: {
                            userId: u.id,
                            role: u.role === "ADMIN" ? "USER" : "ADMIN",
                          },
                          refetchQueries: [{ query: GET_USERS }],
                        })
                      }
                      className="px-3 py-1.5 text-xs rounded-md bg-blue-600 text-white hover:bg-blue-700"
                    >
                      Toggle Role
                    </button>

                    <button
                      onClick={() =>
                        toggleUser({
                          variables: { userId: u.id },
                          refetchQueries: [{ query: GET_USERS }],
                        })
                      }
                      className={`px-3 py-1.5 text-xs rounded-md text-white ${
                        u.isActive
                          ? "bg-red-600 hover:bg-red-700"
                          : "bg-green-600 hover:bg-green-700"
                      }`}
                    >
                      {u.isActive ? "Disable" : "Enable"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {data.users.length === 0 && (
            <div className="p-6 text-center text-gray-500">No users found.</div>
          )}
        </div>

        {/* ACTIVITY SIDEBAR */}
        <div className="bg-white rounded-xl shadow border max-h-[520px] overflow-y-auto">
          <div className="px-6 py-4 border-b sticky top-0 bg-white">
            <h2 className="text-sm font-semibold text-gray-800">
              Recent Activity
            </h2>
            <p className="text-xs text-gray-500">Admin actions only</p>
          </div>

          {logLoading ? (
            <p className="p-4 text-gray-500 text-sm">Loading activity…</p>
          ) : logError ? (
            <p className="p-4 text-red-500 text-sm">{logError.message}</p>
          ) : (
            <ul className="divide-y">
              {logData.activityLogs
                .filter((log) => log.entityType === "USER")
                .map((log) => (
                  <li key={log.id} className="px-4 py-3 text-sm">
                    <div className="flex gap-2">
                      <span>{ACTION_UI[log.action]?.icon}</span>

                      <div>
                        <p className="text-gray-800 text-sm">
                          <span className="font-semibold">
                            {log.performedByEmail}
                          </span>{" "}
                          {log.action === "ROLE_CHANGED" && "changed role of "}
                          {log.action === "USER_ENABLED" && "enabled "}
                          {log.action === "USER_DISABLED" && "disabled "}
                          <span className="font-semibold">
                            {log.targetEmail}
                          </span>
                          {log.action === "STATUS_CHANGED" && (
                            <>
                              {" "}
                              from{" "}
                              <span className="font-mono bg-gray-100 px-1 rounded">
                                {log.fromValue}
                              </span>{" "}
                              →{" "}
                              <span className="font-mono bg-gray-100 px-1 rounded">
                                {log.toValue}
                              </span>
                            </>
                          )}
                        </p>

                        <p className="text-xs text-gray-400 mt-1">
                          {timeAgo(log.createdAt)}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
