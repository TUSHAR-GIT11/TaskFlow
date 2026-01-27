"use client";

import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { CREATE_TASK } from "../graphql/mutation";
import { MY_TASKS } from "../graphql/queries";

function CreateTaskForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("LOW");

  const [createTask, { loading, error }] = useMutation(CREATE_TASK, {
    refetchQueries: [MY_TASKS],
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !description) return;

    createTask({
      variables: { title, description, priority },
    });

    setTitle("");
    setDescription("");
    setPriority("LOW");
  };

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-semibold mb-4">
        Create New Task
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="text"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Task description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <select
          className="w-full border rounded-lg px-4 py-2"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="LOW">Low Priority</option>
          <option value="MEDIUM">Medium Priority</option>
          <option value="HIGH">High Priority</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Task"}
        </button>

        {error && (
          <p className="text-red-500 text-sm">{error.message}</p>
        )}
      </form>
    </div>
  );
}

export default CreateTaskForm;
