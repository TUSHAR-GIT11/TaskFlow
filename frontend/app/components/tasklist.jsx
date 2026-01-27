"use client";

import { useQuery, useMutation } from "@apollo/client/react";
import { MY_TASKS } from "../graphql/queries";
import { TRANSITION_TASK } from "../graphql/mutation";


const STATUS_ACTIONS = {
  BACKLOG: ["TODO"],
  TODO: ["IN_PROGRESS"],
  IN_PROGRESS: ["BLOCKED", "DONE"],
  BLOCKED: ["IN_PROGRESS"],
  DONE: [],
  ARCHIVED: [],
};

function TaskList() {
  const { data, loading, error } = useQuery(MY_TASKS);

  const [transitionTask] = useMutation(TRANSITION_TASK, {
    refetchQueries: [MY_TASKS],
  });

  if (loading) return <p>Loading tasks...</p>;
  if (error) return <p>{error.message}</p>;

  if (data.myTasks.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow p-6 text-gray-500">
        No tasks yet. Create one 👆
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {data.myTasks.map((task) => (
        <div
          key={task.id}
          className="bg-white rounded-xl shadow p-5"
        >
          {/* Task info */}
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                {task.title}
              </h3>
              <p className="text-sm text-gray-500">
                Status: {task.status}
              </p>
            </div>

            {/* Priority badge */}
            <span
              className={`px-3 py-1 text-sm rounded-full ${
                task.priority === "HIGH"
                  ? "bg-red-100 text-red-600"
                  : task.priority === "MEDIUM"
                  ? "bg-yellow-100 text-yellow-600"
                  : "bg-green-100 text-green-600"
              }`}
            >
              {task.priority}
            </span>
          </div>

          {/* Workflow actions */}
          {STATUS_ACTIONS[task.status].length > 0 && (
            <div className="flex gap-2 mt-4">
              {STATUS_ACTIONS[task.status].map((nextStatus) => (
                <button
                  key={nextStatus}
                  onClick={() =>
                    transitionTask({
                      variables: {
                        taskId: task.id,
                        nextStatus,
                      },
                    })
                  }
                  className="px-3 py-1 text-xs rounded bg-gray-200 hover:bg-gray-300 transition"
                >
                  Move to {nextStatus}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default TaskList;