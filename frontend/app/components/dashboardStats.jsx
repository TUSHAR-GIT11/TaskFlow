"use client";

import { useQuery } from "@apollo/client/react";
import { TASK_STATS } from "../graphql/queries";

function DashboardStats() {
  const { data, loading, error } = useQuery(TASK_STATS);

  if (loading) return <p className="text-gray-500">Loading...</p>;
  if (error) return <p className="text-red-500">{error.message}</p>;

  const stats = data.taskStats;

  return (
    <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
      <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
        <h1 className="text-sm font-medium text-gray-500">Total</h1>
        <p className="mt-1 text-2xl font-semibold text-gray-900">
          {stats.total}
        </p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
        <h1 className="text-sm font-medium text-gray-500">Backlog</h1>
        <p className="mt-1 text-2xl font-semibold text-gray-700">
          {stats.backlog}
        </p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
        <h1 className="text-sm font-medium text-gray-500">Todo</h1>
        <p className="mt-1 text-2xl font-semibold text-blue-600">
          {stats.todo}
        </p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
        <h1 className="text-sm font-medium text-gray-500">
          In Progress
        </h1>
        <p className="mt-1 text-2xl font-semibold text-yellow-600">
          {stats.inProgress}
        </p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
        <h1 className="text-sm font-medium text-gray-500">Blocked</h1>
        <p className="mt-1 text-2xl font-semibold text-red-600">
          {stats.blocked}
        </p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
        <h1 className="text-sm font-medium text-gray-500">Done</h1>
        <p className="mt-1 text-2xl font-semibold text-green-600">
          {stats.done}
        </p>
      </div>
    </div>
  );
}

export default DashboardStats;
