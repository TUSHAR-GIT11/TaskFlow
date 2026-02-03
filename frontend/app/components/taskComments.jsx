"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { TASK_COMMENTS } from "../graphql/queries";
import { ADD_COMMENT } from "../graphql/mutation";

export default function TaskComments({ taskId }) {
  const [text, setText] = useState("");

  const { data, loading } = useQuery(TASK_COMMENTS, {
    variables: { taskId },
  });

  const [addComment] = useMutation(ADD_COMMENT, {
    refetchQueries: [{ query: TASK_COMMENTS, variables: { taskId } }],
  });

  return (
    <div className="mt-4 border-t pt-3">
      <h4 className="text-sm font-semibold text-gray-700 mb-2">
        Comments
      </h4>

      {/* LIST */}
      <div className="space-y-2 mb-3">
        {loading ? (
          <p className="text-xs text-gray-400">Loading comments…</p>
        ) : data.taskComments.length === 0 ? (
          <p className="text-xs text-gray-400">No comments yet</p>
        ) : (
          data.taskComments.map((c) => (
            <div key={c.id} className="bg-gray-50 p-2 rounded">
              <p className="text-sm text-gray-800">{c.content}</p>
              <p className="text-xs text-gray-500 mt-1">
                {c.authorEmail} •{" "}
                {new Date(c.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>

      {/* INPUT */}
      <div className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a comment…"
          className="flex-1 border rounded px-2 py-1 text-sm"
        />
        <button
          onClick={() => {
            addComment({ variables: { taskId, content: text } });
            setText("");
          }}
          className="px-3 py-1 text-sm bg-blue-600 text-white rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
