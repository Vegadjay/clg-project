"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Eye, Pencil, Plus, BookOpen } from "lucide-react";

interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  publisher: string;
  publicationDate: string;
  description?: string;
  totalCopies: number;
  availableCopies: number;
  category?: { name: string };
  imageUrl?: string | null;
}

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "destructive" | "outline";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  className?: string;
}

const Button = ({
  children,
  onClick,
  variant = "primary",
  size = "md",
  disabled = false,
  className = "",
}: ButtonProps) => {
  const baseClasses =
    "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variantClasses = {
    primary: "bg-zinc-900 text-white hover:bg-zinc-800 focus:ring-zinc-500",
    secondary:
      "bg-zinc-100 text-zinc-900 hover:bg-zinc-200 focus:ring-zinc-500",
    destructive: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    outline:
      "border border-zinc-300 bg-white text-zinc-900 hover:bg-zinc-50 focus:ring-zinc-500",
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm rounded-md",
    md: "px-4 py-2 text-sm rounded-md",
    lg: "px-6 py-3 text-base rounded-lg",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </button>
  );
};

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchAuthStatus();
    fetchBooks();
  }, []);

  const fetchAuthStatus = async () => {
    try {
      const resp = await fetch("/api/users?me=true", {
        credentials: "include",
      });
      if (resp.ok) {
        const data = await resp.json();
        setRole(data?.user?.role || null);
        setIsAuthenticated(!!data?.user);
      } else {
        setRole(null);
        setIsAuthenticated(false);
      }
    } catch {
      setRole(null);
      setIsAuthenticated(false);
    }
  };

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/books", { cache: "no-store" });
      if (!res.ok) {
        setBooks([]);
        return;
      }
      const data = await res.json();
      setBooks(Array.isArray(data) ? data : []);
    } catch {
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px] w-full">
        <div className="flex items-center space-x-2 text-zinc-600">
          <div className="w-4 h-4 border-2 border-zinc-300 border-t-zinc-900 rounded-full animate-spin"></div>
          <span>Loading books...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-8 px-2 sm:px-4 lg:px-6 xl:px-8 mx-auto">
      {/* Header */}
      <div className="mb-12">
        <div className="flex justify-between items-start mb-2 w-full">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 mb-2">
              Library Collection
            </h1>
            <p className="text-zinc-600">
              {books.length > 0
                ? `${books.length} book${books.length > 1 ? "s" : ""} available`
                : "No books found in the database"}
            </p>
          </div>
          {books.length > 0 && (role === "ADMIN" || role === "LIBRARIAN") && (
            <Button
              onClick={() => router.push("/addbook")}
              variant="primary"
              size="md"
              className="flex items-center space-x-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Book</span>
            </Button>
          )}
        </div>
      </div>

      {/* Books Grid */}
      {books.length > 0 ? (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {books.map((book) => (
            <div
              key={book.id}
              className="bg-white rounded-2xl border border-zinc-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col shadow-md hover:border-zinc-300"
            >
              <div className="flex justify-center items-center overflow-hidden bg-gradient-to-br from-zinc-50 to-zinc-100 w-full h-80 relative">
                {book.imageUrl ? (
                  <img
                    src={book.imageUrl}
                    alt={book.title}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 20vw"
                    className="object-cover w-full h-80 group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-80 flex items-center justify-center">
                    <div className="text-center text-zinc-400">
                      <svg
                        className="w-16 h-16 mx-auto mb-3 opacity-60"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
                        />
                      </svg>
                      <span className="text-sm font-medium">
                        No image available
                      </span>
                    </div>
                  </div>
                )}
                {/* Availability overlay */}
                <div className="absolute top-3 right-3">
                  <div
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      book.availableCopies > 0
                        ? "bg-green-100 text-green-800 border border-green-200"
                        : "bg-red-100 text-red-800 border border-red-200"
                    }`}
                  >
                    {book.availableCopies > 0 ? "Available" : "Unavailable"}
                  </div>
                </div>
              </div>

              {/* Book Info */}
              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-bold text-lg text-zinc-900 mb-2 line-clamp-2 group-hover:text-zinc-700 transition-colors leading-tight">
                  {book.title}
                </h3>

                <p className="text-sm text-zinc-600 mb-3 font-medium">
                  by {book.author}
                </p>

                {/* Category and Availability */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs text-zinc-500 bg-zinc-100 px-2 py-1 rounded-full font-medium">
                    {book.category?.name || "Uncategorized"}
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className="text-right">
                      <div className="text-xs text-zinc-500">Copies</div>
                      <div className="text-sm font-semibold text-zinc-700">
                        {book.availableCopies}/{book.totalCopies}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2 mt-auto">
                  <Button
                    onClick={() => router.push(`/books/${book.id}`)}
                    variant="primary"
                    size="sm"
                    className="flex-1 cursor-pointer hover:shadow-md transition-all duration-200"
                  >
                    <Eye className="w-4 h-4" />
                    <span className="ml-1 hidden sm:inline">View</span>
                  </Button>
                  {isAuthenticated &&
                    role === "PATRON" &&
                    book.availableCopies > 0 && (
                      <Button
                        onClick={() => router.push(`/request-book/${book.id}`)}
                        variant="secondary"
                        size="sm"
                        className="flex-1 cursor-pointer hover:shadow-md transition-all duration-200"
                      >
                        <BookOpen className="w-4 h-4" />
                        <span className="ml-1 hidden sm:inline">Request</span>
                      </Button>
                    )}
                  {(role === "ADMIN" || role === "LIBRARIAN") && (
                    <Button
                      onClick={() => router.push(`/books/edit/${book.id}`)}
                      variant="outline"
                      size="sm"
                      className="flex-1 cursor-pointer hover:shadow-md transition-all duration-200 border-zinc-300 hover:border-zinc-400"
                    >
                      <Pencil className="w-4 h-4" />
                      <span className="ml-1 hidden sm:inline">Edit</span>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16 w-full">
          <div className="w-20 h-20 mx-auto mb-6 text-zinc-300">
            <svg
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              className="w-full h-full"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-zinc-900 mb-2">
            No Books Found
          </h3>
          <p className="text-zinc-600 mb-6 max-w-md mx-auto">
            Start building your library collection by adding some books to get
            started.
          </p>
          <Button
            onClick={() => router.push("/addbook")}
            variant="primary"
            size="lg"
          >
            Add Your First Book
          </Button>
        </div>
      )}
    </div>
  );
}
