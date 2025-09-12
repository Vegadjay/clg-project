"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { useAlert } from "@/components/ui/custom-alert";

interface BookRequest {
  id: number;
  requestDate: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
  book: {
    id: number;
    title: string;
    author: string;
    isbn: string;
    availableCopies: number;
    totalCopies: number;
    imageUrl?: string;
  };
  librarian?: {
    name: string;
    email: string;
  };
  processedAt?: string;
  notes?: string;
}

export default function BookRequestPage() {
  const router = useRouter();
  const [bookRequests, setBookRequests] = useState<BookRequest[]>([]);
  const [loading, setLoading] = useState(true);
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
      await fetchBookRequests();
    } catch (error) {
      console.error("Auth check failed:", error);
      router.push("/login");
    }
  };

  const fetchBookRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/book-requests", {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch book requests");
      }

      const requests = await response.json();
      setBookRequests(requests);
    } catch (error) {
      console.error("Error fetching book requests:", error);
      setBookRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRequest = async (requestId: number) => {
    showAlert({
      title: "Cancel Request",
      description: "Are you sure you want to cancel this book request?",
      type: "warning",
      showCancel: true,
      confirmText: "Yes, Cancel",
      cancelText: "Keep Request",
      onConfirm: () => submitCancelRequest(requestId),
    });
  };

  const submitCancelRequest = async (requestId: number) => {
    try {
      const response = await fetch(`/api/book-requests/${requestId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        await fetchBookRequests(); // Refresh the list
        showAlert({
          title: "Success",
          description: "Book request cancelled successfully",
          type: "success",
        });
      } else {
        const error = await response.json();
        showAlert({
          title: "Error",
          description: error.error || "Failed to cancel request",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error cancelling request:", error);
      showAlert({
        title: "Error",
        description: "Failed to cancel request",
        type: "error",
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case "APPROVED":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "REJECTED":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "CANCELLED":
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "APPROVED":
        return "bg-green-100 text-green-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      case "CANCELLED":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px] w-full">
        <div className="flex items-center space-x-2 text-zinc-600">
          <div className="w-4 h-4 border-2 border-zinc-300 border-t-zinc-900 rounded-full animate-spin"></div>
          <span>Loading your book requests...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mt-16 px-6">
      <AlertComponent />
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-zinc-900">
          My Book Requests
        </h1>
        <p className="text-lg text-zinc-700">
          Welcome back, {userName}! Here are your book requests and their
          status.
        </p>
      </div>

      {bookRequests.length === 0 ? (
        <div className="text-center py-16">
          <BookOpen className="w-20 h-20 mx-auto mb-6 text-zinc-300" />
          <h3 className="text-lg font-semibold text-zinc-900 mb-2">
            No Book Requests Yet
          </h3>
          <p className="text-zinc-600 mb-6 max-w-md mx-auto">
            You haven't requested any books yet. Browse our collection and
            request books you'd like to borrow.
          </p>
          <button
            onClick={() => router.push("/books")}
            className="bg-zinc-900 text-white px-6 py-3 rounded-lg hover:bg-zinc-800 transition-colors duration-200"
          >
            Browse Books
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {bookRequests.map((request) => (
            <div
              key={request.id}
              className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                {/* Book Info */}
                <div className="flex gap-4 flex-1">
                  <div className="flex-shrink-0">
                    {request.book.imageUrl ? (
                      <img
                        src={request.book.imageUrl}
                        alt={request.book.title}
                        className="w-20 h-28 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-20 h-28 bg-zinc-100 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-8 h-8 text-zinc-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-zinc-900 mb-1">
                      {request.book.title}
                    </h3>
                    <p className="text-zinc-600 mb-2">
                      by {request.book.author}
                    </p>
                    <p className="text-sm text-zinc-500 mb-2">
                      ISBN: {request.book.isbn}
                    </p>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm text-zinc-500">
                        Availability:
                      </span>
                      <span className="text-sm font-medium">
                        {request.book.availableCopies}/
                        {request.book.totalCopies} copies
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status and Actions */}
                <div className="flex flex-col lg:items-end gap-3">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(request.status)}
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        request.status
                      )}`}
                    >
                      {request.status}
                    </span>
                  </div>

                  <div className="text-sm text-zinc-500 text-right">
                    <p>Requested: {formatDate(request.requestDate)}</p>
                    {request.processedAt && (
                      <p>Processed: {formatDate(request.processedAt)}</p>
                    )}
                    {request.librarian && <p>By: {request.librarian.name}</p>}
                  </div>

                  {request.status === "PENDING" && (
                    <button
                      onClick={() => handleCancelRequest(request.id)}
                      className="text-red-600 hover:text-red-700 text-sm font-medium px-3 py-1 border border-red-200 rounded-md hover:bg-red-50 transition-colors duration-200"
                    >
                      Cancel Request
                    </button>
                  )}

                  {request.status === "REJECTED" && request.notes && (
                    <div className="text-sm text-zinc-600 bg-red-50 p-2 rounded-md">
                      <p className="font-medium text-red-800">Reason:</p>
                      <p>{request.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
