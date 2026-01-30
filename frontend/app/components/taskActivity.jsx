"use client";

import { useQuery } from "@apollo/client/react";
import { TASK_ACTIVITY } from "../graphql/queries";

function TaskActivity({ taskId }) {
  const { data, loading, error } = useQuery(TASK_ACTIVITY, {
    variables: { taskId },
  });

  if (loading) return <p className="text-sm text-gray-400">Loading activity…</p>;
  if (error) return <p className="text-red-500 text-sm">{error.message}</p>;

  if (data.taskActivity.length === 0) {
    return <p className="text-sm text-gray-400">No activity yet</p>;
  }

  return (
    <div className="mt-4 border-t pt-3">
      <h4 className="text-sm font-semibold text-gray-600 mb-2">
        Activity
      </h4>

      <ul className="space-y-1 text-sm text-gray-500">
        {data.taskActivity.map((log) => (
          <li key={log.id}>
            {log.fromStatus} → {log.toStatus}
            <span className="ml-2 text-xs text-gray-400">
              ({new Date(log.createdAt).toLocaleString()})
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TaskActivity;
