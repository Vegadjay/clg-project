"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BooksTab } from "@/app/components/AdminBooks";
import { AdminUsers } from "@/app/components/AdminUsers";
import { AddNewUser } from "@/app/components/AddNewUser";

const TABS = [
  { key: "books", label: "Books" },
  { key: "users", label: "Users" },
  { key: "librarians", label: "Librarians" },
  { key: "AddUser", label: "Add User" },
];

function LibrariansTab() {
  return (
    <div className="py-6">
      <h2 className="text-2xl font-bold mb-4">Librarians Management</h2>
      <p className="text-zinc-600">
        Add or remove librarian accounts and manage their permissions.
      </p>
      <div className="mt-4 p-4 bg-zinc-50 border rounded">
        Librarians table and actions go here.
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("books");
  const router = useRouter();

  useEffect(() => {
    // Check localStorage for authentication
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    const userData = localStorage.getItem("user");

    if (isAuthenticated !== "true" || !userData) {
      router.push("/login");
      return;
    }

    try {
      const user = JSON.parse(userData);
      if (user.role !== "ADMIN") {
        router.push("/login");
        return;
      }
    } catch {
      router.push("/login");
      return;
    }
  }, [router]);

  let TabContent;
  if (activeTab === "books") TabContent = <BooksTab />;
  else if (activeTab === "users") TabContent = <AdminUsers />;
  else if (activeTab === "librarians") TabContent = <LibrariansTab />;
  else if (activeTab === "AddUser") TabContent = <AddNewUser />;

  return (
    <div className="max-w-7xl mx-auto mt-16 px-6">
      <div>
        <div className="flex border-b border-zinc-200 mb-6">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              className={`px-6 py-3 text-lg font-medium cursor-pointer focus:outline-none transition-colors ${
                activeTab === tab.key
                  ? "border-b-4 border-zinc-900 text-zinc-900 bg-zinc-50"
                  : "text-zinc-500 hover:text-zinc-900"
              }`}
              onClick={() => setActiveTab(tab.key)}
              type="button"
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div>{TabContent}</div>
      </div>
    </div>
  );
}
