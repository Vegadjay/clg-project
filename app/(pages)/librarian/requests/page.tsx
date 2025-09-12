"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  BookOpen,
  Filter,
  Search,
} from "lucide-react";
import { useAlert } from "@/components/ui/custom-alert";
import { useInputDialog } from "@/components/ui/input-dialog";

interface BookRequest {
  id: number;
  requestDate: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
  user: {
    id: number;
    name: string;
    email: string;
    libraryCardNumber: string;
  };
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

export default function LibrarianRequestsPage() {
  const router = useRouter();
  const [bookRequests, setBookRequests] = useState<BookRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [processing, setProcessing] = useState<number | null>(null);
  const { showAlert, AlertComponent } = useAlert();
  const { showInputDialog, InputDialogComponent } = useInputDialog();

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
      if (user.role !== "LIBRARIAN" && user.role !== "ADMIN") {
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

  const handleProcessRequest = async (
    requestId: number,
    status: "APPROVED" | "REJECTED",
    notes?: string
  ) => {
    try {
      setProcessing(requestId);
      const response = await fetch(`/api/book-requests/${requestId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          status,
          notes: notes || null,
        }),
      });

      if (response.ok) {
        await fetchBookRequests(); // Refresh the list
        showAlert({
          title: "Success",
          description: `Request ${status.toLowerCase()} successfully`,
          type: "success",
        });
      } else {
        const error = await response.json();
        showAlert({
          title: "Error",
          description: error.error || "Failed to process request",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error processing request:", error);
      showAlert({
        title: "Error",
        description: "Failed to process request",
        type: "error",
      });
    } finally {
      setProcessing(null);
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

  // Filter and search requests
  const filteredRequests = bookRequests.filter((request) => {
    const matchesStatus =
      filterStatus === "ALL" || request.status === filterStatus;
    const matchesSearch =
      request.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.book.author.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const pendingCount = bookRequests.filter(
    (r) => r.status === "PENDING"
  ).length;
  const approvedCount = bookRequests.filter(
    (r) => r.status === "APPROVED"
  ).length;
  const rejectedCount = bookRequests.filter(
    (r) => r.status === "REJECTED"
  ).length;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px] w-full">
        <div className="flex items-center space-x-2 text-zinc-600">
          <div className="w-4 h-4 border-2 border-zinc-300 border-t-zinc-900 rounded-full animate-spin"></div>
          <span>Loading book requests...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto mt-16 px-6">
      <AlertComponent />
      <InputDialogComponent />
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-zinc-900">
          Book Request Management
        </h1>
        <p className="text-lg text-zinc-700">
          Welcome back, {userName}! Manage book requests from patrons.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg border border-zinc-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-500">Total Requests</p>
              <p className="text-2xl font-semibold text-zinc-900">
                {bookRequests.length}
              </p>
            </div>
            <AlertCircle className="w-8 h-8 text-zinc-400" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-zinc-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-500">Pending</p>
              <p className="text-2xl font-semibold text-yellow-600">
                {pendingCount}
              </p>
            </div>
            <Clock className="w-8 h-8 text-yellow-400" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-zinc-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-500">Approved</p>
              <p className="text-2xl font-semibold text-green-600">
                {approvedCount}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-zinc-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-500">Rejected</p>
              <p className="text-2xl font-semibold text-red-600">
                {rejectedCount}
              </p>
            </div>
            <XCircle className="w-8 h-8 text-red-400" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-zinc-200 p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by user name, email, book title, or author..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-zinc-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-zinc-500" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-zinc-500 focus:border-transparent"
            >
              <option value="ALL">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Requests List */}
      {filteredRequests.length === 0 ? (
        <div className="text-center py-16">
          <AlertCircle className="w-20 h-20 mx-auto mb-6 text-zinc-300" />
          <h3 className="text-lg font-semibold text-zinc-900 mb-2">
            No Book Requests Found
          </h3>
          <p className="text-zinc-600">
            {searchTerm || filterStatus !== "ALL"
              ? "No requests match your current filters."
              : "No book requests have been submitted yet."}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredRequests.map((request) => (
            <div
              key={request.id}
              className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                {/* Request Info */}
                <div className="flex gap-4 flex-1">
                  {/* Book Cover */}
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

                  {/* Details */}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-zinc-900 mb-2">
                      {request.book.title}
                    </h3>
                    <p className="text-zinc-600 mb-3">
                      by {request.book.author}
                    </p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-zinc-500" />
                        <span className="text-sm text-zinc-700">
                          {request.user.name} ({request.user.email})
                        </span>
                      </div>
                      <div className="text-sm text-zinc-500">
                        Library Card: {request.user.libraryCardNumber}
                      </div>
                      <div className="text-sm text-zinc-500">
                        ISBN: {request.book.isbn}
                      </div>
                      <div className="text-sm text-zinc-500">
                        Available: {request.book.availableCopies}/
                        {request.book.totalCopies} copies
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status and Actions */}
                <div className="flex flex-col lg:items-end gap-4">
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

                  {/* Action Buttons */}
                  {request.status === "PENDING" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          showInputDialog({
                            title: "Approve Request",
                            description:
                              "Add optional notes for this approval:",
                            placeholder: "Enter notes (optional)",
                            multiline: true,
                            confirmText: "Approve",
                            cancelText: "Cancel",
                            onConfirm: (notes) => {
                              handleProcessRequest(
                                request.id,
                                "APPROVED",
                                notes.trim() || undefined
                              );
                            },
                          });
                        }}
                        disabled={processing === request.id}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 text-sm"
                      >
                        {processing === request.id
                          ? "Processing..."
                          : "Approve"}
                      </button>
                      <button
                        onClick={() => {
                          showInputDialog({
                            title: "Reject Request",
                            description:
                              "Please provide a reason for rejection:",
                            placeholder: "Enter reason for rejection",
                            multiline: true,
                            confirmText: "Reject",
                            cancelText: "Cancel",
                            required: true,
                            onConfirm: (notes) => {
                              handleProcessRequest(
                                request.id,
                                "REJECTED",
                                notes
                              );
                            },
                          });
                        }}
                        disabled={processing === request.id}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 text-sm"
                      >
                        Reject
                      </button>
                    </div>
                  )}

                  {request.status === "REJECTED" && request.notes && (
                    <div className="text-sm text-zinc-600 bg-red-50 p-3 rounded-md max-w-xs">
                      <p className="font-medium text-red-800 mb-1">
                        Rejection Reason:
                      </p>
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
