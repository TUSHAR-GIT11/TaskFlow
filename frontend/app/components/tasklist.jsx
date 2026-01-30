"use client";

import { useQuery, useMutation } from "@apollo/client/react";
import { MY_TASKS, TASK_ACTIVITY } from "../graphql/queries";
import { TRANSITION_TASK } from "../graphql/mutation";
import TaskActivity from "./taskActivity";
import toast from "react-hot-toast";

const STATUS_ACTIONS = {
  BACKLOG: ["TODO"],
  TODO: ["IN_PROGRESS"],
  IN_PROGRESS: ["BLOCKED", "DONE"],
  BLOCKED: ["IN_PROGRESS"],
  DONE: ["ARCHIVED"],
  ARCHIVED: [],
};

function TaskList() {
  const { data, loading, error } = useQuery(MY_TASKS);

  // ✅ read role ONCE
  const role =
    typeof window !== "undefined" ? localStorage.getItem("role") : null;

  const [transitionTask, { loading: transitioning }] = useMutation(
    TRANSITION_TASK,
    {
      onCompleted: () => {
        toast.success("Task status updated");
      },
      onError: (error) => {
        toast.error(error.message || "Failed to update task");
      },
      refetchQueries: (result) => [
        MY_TASKS,
        {
          query: TASK_ACTIVITY,
          variables: {
            taskId: result.data.transitionTask.id,
          },
        },
      ],
    },
  );

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
        <div key={task.id} className="bg-white rounded-xl shadow p-5">
          {/* Task info */}
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                {task.title}

                {/* ✅ ADMIN BADGE */}
                {role === "ADMIN" && (
                  <span className="text-xs bg-black text-white px-2 py-0.5 rounded">
                    ADMIN
                  </span>
                )}
              </h3>

              <p className="text-sm text-gray-500">Status: {task.status}</p>
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
              {STATUS_ACTIONS[task.status]
                // ✅ hide ARCHIVE for non-admin
                .filter(
                  (nextStatus) =>
                    !(nextStatus === "ARCHIVED" && role !== "ADMIN"),
                )
                .map((nextStatus) => (
                  <button
                    key={nextStatus}
                    disabled={transitioning}
                    onClick={async () => {
                      let reason = null;

                      // ❌ Non-admin cannot archive
                      if (nextStatus === "ARCHIVED" && role !== "ADMIN") {
                        toast.error("Only admin can archive tasks");
                        return;
                      }

                      // BLOCKED needs reason
                      if (nextStatus === "BLOCKED") {
                        reason = prompt("Why is this task blocked?");
                        if (!reason) return;
                      }

                      // Confirm archive
                      if (nextStatus === "ARCHIVED") {
                        const ok = confirm(
                          "Are you sure you want to archive this task?",
                        );
                        if (!ok) return;
                      }

                      await transitionTask({
                        variables: {
                          taskId: task.id,
                          nextStatus,
                          reason, // ✅ FIXED
                        },
                        optimisticResponse: {
                          transitionTask: {
                            __typename: "Task",
                            id: task.id,
                            status: nextStatus,
                          },
                        },
                      });
                    }}
                    className={`px-3 py-1 text-xs rounded transition ${
                      transitioning
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    {transitioning ? "Moving..." : `Move to ${nextStatus}`}
                  </button>
                ))}
            </div>
          )}

          {task.status !== "ARCHIVED" && (
            <TaskActivity taskId={task.id} onRefetchedRequest={() => {}} />
          )}
        </div>
      ))}
    </div>
  );
}

export default TaskList;
