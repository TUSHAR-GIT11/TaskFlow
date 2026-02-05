"use client";

import { useQuery } from "@apollo/client/react";
import { useRouter } from "next/navigation";
import { ME_QUERY } from "../graphql/queries";
import { useEffect } from "react";
import Link from "next/link";
import NotificationBell from "../components/notificationBell";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const { data, loading, error } = useQuery(ME_QUERY);

  useEffect(() => {
    if (!loading && (error || !data?.me)) {
      router.push("/login");
    }
  }, [loading, error, data, router]);

  if (loading) return <p className="p-4">Loading...</p>;
  if (error || !data?.me) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* TOP BAR */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* LEFT */}
          <h1 className="text-lg font-semibold text-gray-800">
            Welcome, {data.me.name}
          </h1>

          {/* RIGHT */}
          <div className="flex items-center gap-4">
            {/* 🔔 Notification Bell */}
            <NotificationBell />

            {/* 🛠 Admin Button */}
            {data.me.role === "ADMIN" && (
              <Link
                href="/admin"
                className="px-4 py-2 text-sm font-medium rounded-md bg-black text-white hover:bg-gray-800 transition"
              >
                Admin Panel
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* PAGE CONTENT */}
      <main>{children}</main>
    </div>
  );
}
