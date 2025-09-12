"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: number;
  name: string;
  email: string;
}

export default function PatronDashboard() {
  const router = useRouter();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    let isMounted = true;
    const checkAuth = () => {
      // Check localStorage for authentication
      const isAuthenticated = localStorage.getItem("isAuthenticated");
      const userData = localStorage.getItem("user");

      if (isAuthenticated !== "true" || !userData) {
        router.push("/login");
        return;
      }

      try {
        const user = JSON.parse(userData);
        if (user.role !== "PATRON") {
          router.push("/login");
          return;
        }
        if (isMounted)
          setUserName(user?.name || user?.email?.split("@")[0] || "");
      } catch {
        router.push("/login");
      }
    };
    checkAuth();
    return () => {
      isMounted = false;
    };
  }, [router]);

  return (
    <div className="max-w-4xl mx-auto mt-16 px-6">
      <div className="rounded-lg border border-zinc-200 bg-white p-8 shadow">
        <h1 className="text-3xl font-bold mb-2 text-zinc-900">
          Welcome back{userName ? ", " : ""}
          {userName}!
        </h1>
        <p className="text-lg text-zinc-700 mb-6">
          Access your borrowed books, reservations, and profile from the menu.
        </p>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="rounded-md border border-zinc-200 p-4 bg-white">
            <p className="text-sm text-zinc-500">Borrowed Books</p>
            <p className="text-2xl font-semibold text-zinc-900">—</p>
          </div>
          <div className="rounded-md border border-zinc-200 p-4 bg-white">
            <p className="text-sm text-zinc-500">Reservations</p>
            <p className="text-2xl font-semibold text-zinc-900"></p>
          </div>
          <div className="rounded-md border border-zinc-200 p-4 bg-white">
            <p className="text-sm text-zinc-500">Profile</p>
            <p className="text-2xl font-semibold text-zinc-900"></p>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold text-zinc-900 mb-4">
            Quick Actions
          </h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => router.push("/books")}
              className="bg-zinc-900 text-white px-6 py-3 rounded-lg hover:bg-zinc-800 transition-colors duration-200"
            >
              Browse Books
            </button>
            <button
              onClick={() => router.push("/request-book")}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200"
            >
              My Book Requests
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
