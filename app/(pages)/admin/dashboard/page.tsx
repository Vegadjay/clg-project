"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BooksTab } from "@/app/components/AdminBooks";
import { AdminUsers } from "@/app/components/AdminUsers";
import { AddNewUser } from "@/app/components/AddNewUser";
import { motion, AnimatePresence } from "motion/react";

const TABS = [
  { key: "books", label: "Books" },
  { key: "users", label: "Users" },
  { key: "AddUser", label: "Add User" },
];

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
  else if (activeTab === "AddUser") TabContent = <AddNewUser />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="max-w-7xl mx-auto pt-16 px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage your library system efficiently
            </p>
          </motion.div>

          {/* Tab Navigation */}
          <motion.div
            className="flex border-b border-border/50 mb-8 bg-card/50 backdrop-blur-sm rounded-t-2xl overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {TABS.map((tab, index) => (
              <motion.button
                key={tab.key}
                className={`relative px-6 py-4 text-lg font-medium cursor-pointer focus:outline-none transition-all duration-300 flex-1 ${
                  activeTab === tab.key
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
                onClick={() => setActiveTab(tab.key)}
                type="button"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {tab.label}
                {activeTab === tab.key && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-1 bg-primary"
                    layoutId="admin-tab-indicator"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </motion.button>
            ))}
          </motion.div>

          {/* Tab Content */}
          <motion.div
            className="bg-card/50 backdrop-blur-sm rounded-b-2xl shadow-soft border border-border/50 p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {TabContent}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
