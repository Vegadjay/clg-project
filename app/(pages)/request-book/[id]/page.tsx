"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import { useAlert } from "@/components/ui/custom-alert";

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
  imageUrl?: string;
}

export default function RequestBookPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);
  const [userName, setUserName] = useState("");
  const { showAlert, AlertComponent } = useAlert();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // Check localStorage for authentication
      const isAuthenticated = localStorage.getItem("isAuthenticated");
      const userData = localStorage.getItem("user");

      if (isAuthenticated !== "true" || !userData) {
        router.push("/login");
        return;
      }

      const user = JSON.parse(userData);
      if (user.role !== "PATRON") {
        router.push("/login");
        return;
      }

      setUserName(user?.name || user?.email?.split("@")[0] || "");
      await fetchBook();
    } catch (error) {
      console.error("Auth check failed:", error);
      router.push("/login");
    }
  };

  const fetchBook = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/books/${resolvedParams.id}`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch book");
      }

      const bookData = await response.json();
      setBook(bookData);
    } catch (error) {
      console.error("Error fetching book:", error);
      showAlert({
        title: "Error",
        description: "Failed to load book details",
        type: "error",
        onConfirm: () => router.push("/books"),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRequestBook = async () => {
    if (!book) return;

    if (book.availableCopies <= 0) {
      showAlert({
        title: "Not Available",
        description: "This book is not available for request",
        type: "warning",
      });
      return;
    }

    showAlert({
      title: "Confirm Request",
      description: `Are you sure you want to request "${book.title}"?`,
      type: "info",
      showCancel: true,
      confirmText: "Yes, Request",
      cancelText: "Cancel",
      onConfirm: () => submitRequest(),
    });
  };

  const submitRequest = async () => {
    try {
      setRequesting(true);
      const response = await fetch("/api/book-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          bookId: book.id,
        }),
      });

      if (response.ok) {
        showAlert({
          title: "Success",
          description:
            "Book request submitted successfully! You will be notified when it's processed.",
          type: "success",
          onConfirm: () => router.push("/request-book"),
        });
      } else {
        const error = await response.json();
        showAlert({
          title: "Error",
          description: error.error || "Failed to submit book request",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error requesting book:", error);
      showAlert({
        title: "Error",
        description: "Failed to submit book request",
        type: "error",
      });
    } finally {
      setRequesting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px] w-full">
        <div className="flex items-center space-x-2 text-zinc-600">
          <div className="w-4 h-4 border-2 border-zinc-300 border-t-zinc-900 rounded-full animate-spin"></div>
          <span>Loading book details...</span>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="max-w-4xl mx-auto mt-16 px-6">
        <div className="text-center py-16">
          <AlertCircle className="w-20 h-20 mx-auto mb-6 text-red-300" />
          <h3 className="text-lg font-semibold text-zinc-900 mb-2">
            Book Not Found
          </h3>
          <p className="text-zinc-600 mb-6">
            The book you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => router.push("/books")}
            className="bg-zinc-900 text-white px-6 py-3 rounded-lg hover:bg-zinc-800 transition-colors duration-200"
          >
            Back to Books
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-16 px-6">
      <AlertComponent />
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-zinc-600 hover:text-zinc-900 mb-4 transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <h1 className="text-3xl font-bold text-zinc-900 mb-2">Request Book</h1>
        <p className="text-lg text-zinc-700">
          Request to borrow this book from the library
        </p>
      </div>

      {/* Book Details */}
      <div className="bg-white rounded-xl border border-zinc-200 p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Book Cover */}
          <div className="flex-shrink-0">
            {book.imageUrl ? (
              <img
                src={book.imageUrl}
                alt={book.title}
                className="w-64 h-80 object-cover rounded-lg shadow-md"
              />
            ) : (
              <div className="w-64 h-80 bg-zinc-100 rounded-lg flex items-center justify-center shadow-md">
                <BookOpen className="w-16 h-16 text-zinc-400" />
              </div>
            )}
          </div>

          {/* Book Information */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-zinc-900 mb-2">
              {book.title}
            </h2>
            <p className="text-lg text-zinc-600 mb-4">by {book.author}</p>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-zinc-500 w-24">
                  ISBN:
                </span>
                <span className="text-sm text-zinc-900">{book.isbn}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-zinc-500 w-24">
                  Publisher:
                </span>
                <span className="text-sm text-zinc-900">{book.publisher}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-zinc-500 w-24">
                  Published:
                </span>
                <span className="text-sm text-zinc-900">
                  {formatDate(book.publicationDate)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-zinc-500 w-24">
                  Category:
                </span>
                <span className="text-sm text-zinc-900">
                  {book.category?.name || "Uncategorized"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-zinc-500 w-24">
                  Available:
                </span>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      book.availableCopies > 0 ? "bg-green-500" : "bg-red-500"
                    }`}
                  ></div>
                  <span className="text-sm text-zinc-900">
                    {book.availableCopies}/{book.totalCopies} copies
                  </span>
                </div>
              </div>
            </div>

            {book.description && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-zinc-900 mb-2">
                  Description
                </h3>
                <p className="text-zinc-700 leading-relaxed">
                  {book.description}
                </p>
              </div>
            )}

            {/* Request Button */}
            <div className="pt-6 border-t border-zinc-200">
              {book.availableCopies > 0 ? (
                <button
                  onClick={handleRequestBook}
                  disabled={requesting}
                  className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-2"
                >
                  {requesting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Requesting...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Request This Book
                    </>
                  )}
                </button>
              ) : (
                <div className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="w-5 h-5" />
                  <span className="font-medium">
                    This book is not available for request
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Request Information */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          How Book Requests Work
        </h3>
        <ul className="text-blue-800 space-y-2">
          <li>• Your request will be reviewed by a librarian</li>
          <li>
            • You'll be notified when your request is approved or rejected
          </li>
          <li>• If approved, you can pick up the book from the library</li>
          <li>• Books are typically loaned for 14 days</li>
          <li>• You can cancel your request anytime before it's processed</li>
        </ul>
      </div>
    </div>
  );
}
