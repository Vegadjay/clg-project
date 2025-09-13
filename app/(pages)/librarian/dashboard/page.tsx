"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";

interface Book {
  id: number;
  title: string;
  availableCopies: number;
  totalCopies: number;
  author: string;
  isbn: string;
}

interface BookRequest {
  id: number;
  bookId: number;
  userId: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
  requestDate: string;
  book: Book;
  user: {
    name: string;
    email: string;
  };
}

export default function LibrarianDashboard() {
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);
  const [bookRequests, setBookRequests] = useState<BookRequest[]>([]);
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);

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
        if (isMounted) {
          setUserName(user?.name || user?.email?.split("@")[0] || "");
        }
      } catch {
        router.push("/login");
        return;
      }

      if (isMounted) {
        setBooks(JSON.parse(localStorage.getItem("books") || "[]"));
        setBookRequests(
          JSON.parse(localStorage.getItem("bookRequests") || "[]")
        );
        setLoading(false);
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
  const totalBooks = books.length;
  const pendingRequests = bookRequests.filter(
    (req) => req.status === "PENDING"
  ).length;
  const approvedRequests = bookRequests.filter(
    (req) => req.status === "APPROVED"
  ).length;
  const recentRequests = bookRequests.slice(0, 5);

  const stats = [
    {
      title: "Total Books",
      value: totalBooks,
      icon: "📚",
      color: "bg-blue-500",
      description: "Books in library",
    },
    {
      title: "Available Books",
      value: availableBooks,
      icon: "✅",
      color: "bg-green-500",
      description: "Ready to borrow",
    },
    {
      title: "Pending Requests",
      value: pendingRequests,
      icon: "⏳",
      color: "bg-yellow-500",
      description: "Awaiting approval",
    },
    {
      title: "Approved Requests",
      value: approvedRequests,
      icon: "👍",
      color: "bg-purple-500",
      description: "Recently approved",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <motion.div
            className="mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
              Librarian Dashboard
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Welcome back{userName ? `, ${userName}` : ""}! Manage your library
              efficiently
            </p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.title}
                className="bg-card rounded-lg border-2 border-dashed border-border p-6 transition-colors duration-300 min-h-[180px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-muted-foreground">
                      {stat.title}
                    </p>
                    <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center text-foreground text-lg border border-border">
                      {stat.icon}
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <p className="text-4xl font-bold text-foreground mb-2">
                      {stat.value}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {stat.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Actions */}
            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="bg-card rounded-lg border-2 border-dashed border-border p-8 transition-colors duration-300">
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  Quick Actions
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <motion.button
                    onClick={() => router.push("/books")}
                    className="group p-6 bg-card border-2 border-dashed border-border rounded-lg transition-all duration-300 text-left min-h-[150px]"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="w-14 h-14 bg-muted rounded-lg flex items-center justify-center border border-border">
                        <svg
                          className="w-7 h-7"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-base">
                          Manage Books
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          Add, edit, and organize books
                        </p>
                      </div>
                    </div>
                  </motion.button>

                  <motion.button
                    onClick={() => router.push("/librarian/requests")}
                    className="group p-6 bg-card border-2 border-dashed border-border rounded-lg transition-all duration-300 text-left min-h-[150px]"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="w-14 h-14 bg-muted rounded-lg flex items-center justify-center border border-border">
                        <svg
                          className="w-7 h-7"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-base">
                          Manage Requests
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          Review and approve book requests
                        </p>
                      </div>
                    </div>
                  </motion.button>

                  <motion.button
                    onClick={() => router.push("/addbook")}
                    className="group p-6 bg-card border-2 border-dashed border-border rounded-lg transition-all duration-300 text-left min-h-[150px]"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="w-14 h-14 bg-muted rounded-lg flex items-center justify-center border border-border">
                        <svg
                          className="w-7 h-7"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-base">
                          Add New Book
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          Add books to the library
                        </p>
                      </div>
                    </div>
                  </motion.button>

                  <motion.button
                    onClick={() => router.push("/books")}
                    className="group p-6 bg-card border-2 border-dashed border-border rounded-lg transition-all duration-300 text-left min-h-[150px]"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="w-14 h-14 bg-muted rounded-lg flex items-center justify-center border border-border">
                        <svg
                          className="w-7 h-7"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-base">
                          Browse Library
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          View all available books
                        </p>
                      </div>
                    </div>
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* Recent Requests */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <div className="bg-card rounded-lg border-2 border-dashed border-border p-8 transition-colors duration-300">
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  Recent Requests
                </h2>
                {recentRequests.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 text-muted-foreground">
                      <svg
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        className="w-full h-full"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                    </div>
                    <p className="text-muted-foreground text-base">
                      No recent requests
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentRequests.map((request, index) => (
                      <motion.div
                        key={request.id}
                        className="p-4 bg-muted rounded-lg border-2 border-dashed border-border transition-colors duration-300"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-sm text-foreground truncate">
                            {request.book?.title || "Unknown Book"}
                          </h4>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              request.status === "PENDING"
                                ? "bg-yellow-100 text-yellow-800"
                                : request.status === "APPROVED"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {request.status}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          By: {request.user?.name || "Unknown User"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(request.requestDate).toLocaleDateString()}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                )}
                {recentRequests.length > 0 && (
                  <motion.button
                    onClick={() => router.push("/librarian/requests")}
                    className="w-full mt-4 px-4 py-3 bg-card border-2 border-dashed border-border rounded-lg transition-all duration-300 text-sm font-medium"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    View All Requests
                  </motion.button>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
