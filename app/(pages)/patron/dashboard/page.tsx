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
    const role = localStorage.getItem("userRole");
    if (role !== "patron") router.push("/login");
    const users: User[] = JSON.parse(localStorage.getItem("users") || "[]");
    const currentUserEmail = localStorage.getItem("userEmail");
    const currentUser = users.find((u) => u.email === currentUserEmail);
    setUserName(currentUser?.name || "");
  }, [router]);

  return (
    <div className="max-w-4xl mx-auto mt-16 px-6">
      <div className="rounded-lg border border-zinc-200 bg-white p-8 shadow">
        <h1 className="text-3xl font-bold mb-2 text-zinc-900">
          Welcome back{userName ? ", " : ""}{userName}!
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
      </div>
    </div>
  );
}