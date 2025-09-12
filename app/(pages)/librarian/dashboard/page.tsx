"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Book {
  id: number;
  title: string;
  availableCopies: number;
}

export default function LibrarianDashboard() {
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);

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
        if (user.role !== "LIBRARIAN") {
          router.push("/login");
          return;
        }
      } catch {
        router.push("/login");
        return;
      }

      if (isMounted) {
        setBooks(JSON.parse(localStorage.getItem("books") || "[]"));
      }
    };
    checkAuth();
    return () => {
      isMounted = false;
    };
  }, [router]);

  const availableBooks = books.filter(
    (book) => book.availableCopies > 0
  ).length;

  return (
    <div className="max-w-5xl mx-auto mt-16 px-6">
      <h1 className="text-4xl font-bold mb-8 text-center text-zinc-900">
        Librarian Dashboard
      </h1>
      <div className="grid grid-cols-2 gap-10 text-center mb-8">
        <div className="bg-zinc-100 rounded-lg p-8 shadow border border-zinc-200">
          <h2 className="text-6xl font-extrabold text-zinc-900">
            {availableBooks}
          </h2>
          <p className="text-lg font-semibold text-zinc-600">Books Available</p>
        </div>
        <div className="bg-zinc-100 rounded-lg p-8 shadow border border-zinc-200">
          <h2 className="text-6xl font-extrabold text-zinc-900">
            {books.length}
          </h2>
          <p className="text-lg font-semibold text-zinc-600">Total Books</p>
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-xl font-semibold text-zinc-900 mb-4">
          Quick Actions
        </h2>
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={() => router.push("/books")}
            className="bg-zinc-900 text-white px-6 py-3 rounded-lg hover:bg-zinc-800 transition-colors duration-200"
          >
            Manage Books
          </button>
          <button
            onClick={() => router.push("/librarian/requests")}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200"
          >
            Manage Book Requests
          </button>
        </div>
      </div>
    </div>
  );
}
