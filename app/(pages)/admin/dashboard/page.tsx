"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface Book {
  id: number;
  title: string;
  availableCopies: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (role !== "admin") router.push("/login");

    setUsers(JSON.parse(localStorage.getItem("users") || "[]"));
    setBooks(JSON.parse(localStorage.getItem("books") || "[]"));
  }, [router]);

  return (
    <div className="max-w-5xl mx-auto mt-16 px-6">
      <h1 className="text-4xl font-bold mb-8 text-center text-zinc-900">
        Admin Dashboard
      </h1>
      <div className="grid grid-cols-2 gap-10 text-center">
        <div className="bg-zinc-100  rounded-lg p-8 shadow border border-zinc-200">
          <p className="text-lg font-semibold text-zinc-600">Total Users</p>
        </div>
        <div className="bg-zinc-100  rounded-lg p-8 shadow border border-zinc-200">
          <h2 className="text-6xl font-extrabold text-zinc-900">
            {" "}
            {books.length}
          </h2>
          <p className="text-lg font-semibold text-zinc-600"></p>
        </div>
      </div>
    </div>
  );
}
