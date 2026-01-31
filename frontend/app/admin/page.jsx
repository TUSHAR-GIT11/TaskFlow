"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { UPDATE_ROLE, TOGGLE_USER } from "../graphql/mutation";
import { GET_USERS } from "../graphql/queries";

export default function AdminPage() {
  const [role, setRole] = useState(null);

  
  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);
  }, []);

  const { data, loading, error } = useQuery(GET_USERS, {
    skip: role !== "ADMIN", // 👈 don't even query if not admin
  });

  const [updateRole] = useMutation(UPDATE_ROLE, {
    refetchQueries: [GET_USERS],
  });

  const [toggleUser] = useMutation(TOGGLE_USER, {
    refetchQueries: [GET_USERS],
  });

  // ⏳ while role is loading
  if (role === null) return <p>Checking permissions…</p>;

  // ❌ not admin
  if (role !== "ADMIN") {
    return <p className="text-red-500">Forbidden</p>;
  }

  if (loading) return <p>Loading users…</p>;
  if (error) return <p>{error.message}</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Admin Panel</h1>

      <table className="w-full border">
        <thead>
          <tr>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {data.users.map((u) => (
            <tr key={u.id} className="border-t">
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>{u.isActive ? "Active" : "Disabled"}</td>

              <td className="space-x-2">
                <button
                  onClick={() =>
                    updateRole({
                      variables: {
                        userId: u.id,
                        role: u.role === "ADMIN" ? "USER" : "ADMIN",
                      },
                    })
                  }
                  className="px-2 py-1 bg-blue-200 rounded"
                >
                  Toggle Role
                </button>

                <button
                  onClick={() =>
                    toggleUser({ variables: { userId: u.id } })
                  }
                  className="px-2 py-1 bg-red-200 rounded"
                >
                  {u.isActive ? "Disable" : "Enable"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
