"use client";

import { useQuery } from "@apollo/client/react";
import { useRouter } from "next/navigation";
import { ME_QUERY } from "../graphql/queries";
import { useEffect } from "react";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const { data, loading, error } = useQuery(ME_QUERY);

  useEffect(() => {
    if (!loading && (error || !data?.me)) {
      router.push("/login");
    }
  }, [loading, error, data, router]);

  if (loading) return <p>Loading...</p>;

  if (error || !data?.me) {
    return null; // 👈 stop rendering
  }

  return (
    <div>
      <h1>Welcome {data.me.name}</h1>
      {children}
    </div>
  );
}
