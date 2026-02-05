"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { MY_NOTIFICATIONS } from "../graphql/queries";
import { MARK_NOTIFICATION_READ } from "../graphql/mutation";

export default function NotificationBell() {
  const [open, setOpen] = useState(false);

  const { data, loading } = useQuery(MY_NOTIFICATIONS, {
    pollInterval: 10000, // refresh every 10s
  });

  const [markRead] = useMutation(MARK_NOTIFICATION_READ, {
    refetchQueries: [{ query: MY_NOTIFICATIONS }],
  });

  const notifications = data?.myNotifications || [];
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="relative">
      {/* BELL BUTTON */}
      <button
        onClick={() => setOpen(!open)}
        className="relative text-gray-600 hover:text-gray-900"
      >
        🔔
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full px-1">
            {unreadCount}
          </span>
        )}
      </button>

      {/* DROPDOWN */}
      {open && (
        <div className="absolute right-0 mt-3 w-80 bg-white border rounded-xl shadow-lg z-50">
          <div className="px-4 py-2 border-b text-sm font-semibold">
            Notifications
          </div>

          {loading ? (
            <p className="p-4 text-sm text-gray-500">Loading…</p>
          ) : notifications.length === 0 ? (
            <p className="p-4 text-sm text-gray-400">No notifications</p>
          ) : (
            <ul className="max-h-80 overflow-y-auto">
              {notifications.map((n) => (
                <li
                  key={n.id}
                  onClick={() =>
                    !n.isRead &&
                    markRead({ variables: { notificationId: n.id } })
                  }
                  className={`px-4 py-3 text-sm cursor-pointer border-b last:border-b-0 ${
                    n.isRead
                      ? "text-gray-500"
                      : "bg-blue-50 text-gray-900"
                  }`}
                >
                  <p>{n.message}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(n.createdAt).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
