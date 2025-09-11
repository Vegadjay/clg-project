"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Eye, Pencil, Plus } from "lucide-react";

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
  const [deleting, setDeleting] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchBooks();
  }, []);

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

  const handleDelete = async (id: number) => {
    const shouldDelete = window.confirm(
      "Are you sure you want to delete this book?"
    );
    if (!shouldDelete) return;
    setDeleting(id);
    const res = await fetch(`/api/books/${id}`, { method: "DELETE" });
    if (res.ok) {
      setBooks(books.filter((book) => book.id !== id));
    } else {
      alert("Error deleting book.");
    }
    setDeleting(null);
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
          {books.length > 0 && (
            <Button
              onClick={() => router.push("/addbook")}
              variant="primary"
              size="md"
              className="flex items-center space-x-2"
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
              className="bg-white rounded-xl border border-zinc-200 overflow-hidden hover:shadow-lg transition-all duration-300 group flex flex-col"
            >
              <div className="flex justify-center items-center overflow-hidden bg-zinc-100 w-full h-80">
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
                        className="w-12 h-12 mx-auto mb-2"
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
                      <span className="text-sm">No image</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Book Info */}
              <div className="p-4 flex flex-col flex-1">
                <h3 className="font-semibold truncate text-zinc-900 mb-2 line-clamp-2 group-hover:text-zinc-700 transition-colors">
                  {book.title}
                </h3>

                <p className="text-sm text-zinc-600 mb-3">by {book.author}</p>

                {/* Availability Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs text-zinc-500">
                    {book.category?.name || "Uncategorized"}
                  </span>
                  <div className="flex items-center space-x-1">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        book.availableCopies > 0 ? "bg-green-500" : "bg-red-500"
                      }`}
                    ></div>
                    <span className="text-xs font-medium text-zinc-700">
                      {book.availableCopies}/{book.totalCopies}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2 mt-auto">
                  <Button
                    onClick={() => router.push(`/books/${book.id}`)}
                    variant="primary"
                    size="sm"
                    className="flex-1 cursor-pointer"
                  >
                    <Eye />
                  </Button>
                  <Button
                    onClick={() => router.push(`/books/edit/${book.id}`)}
                    variant="outline"
                    size="sm"
                    className="flex-1 cursor-pointer"
                  >
                    <Pencil />
                  </Button>
                  <Button
                    onClick={() => handleDelete(book.id)}
                    variant="destructive"
                    size="sm"
                    disabled={deleting === book.id}
                    className="px-3"
                  >
                    {deleting === book.id ? (
                      <div className="w-4 h-4 border-2 border-white cursor-pointer border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <div className="cursor-pointer">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </div>
                    )}
                  </Button>
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
