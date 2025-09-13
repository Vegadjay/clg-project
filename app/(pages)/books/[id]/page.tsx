"use client";

import { notFound, useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ExternalLink,
  BookOpen,
  Eye,
  EyeOff,
  Calendar,
  User,
  Building,
  Hash,
  FileText,
} from "lucide-react";

interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  publisher: string;
  publicationDate: string;
  totalCopies: number;
  availableCopies: number;
  description: string | null;
  imageUrl: string | null;
  ebookUrl: string | null;
  category: {
    name: string;
  } | null;
}

export default function BookPage() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isIssuing, setIsIssuing] = useState(false);
  const [issueError, setIssueError] = useState<string | null>(null);
  const [issueSuccess, setIssueSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchBook = async () => {
      try {
        const response = await fetch(`/api/books/${id}`);
        if (!response.ok) {
          notFound();
        }
        const bookData = await response.json();
        setBook(bookData);
      } catch (error) {
        console.error("Error fetching book:", error);
        notFound();
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  // Helper to get user from localStorage (as in login page)
  const getUserFromLocalStorage = () => {
    if (typeof window === "undefined") return null;
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    const userData = localStorage.getItem("user");
    if (isAuthenticated === "true" && userData) {
      try {
        return JSON.parse(userData);
      } catch {
        return null;
      }
    }
    return null;
  };

  const handleIssueBook = async () => {
    setIssueError(null);
    setIssueSuccess(null);

    if (!book || book.availableCopies <= 0) return;

    // Check authentication using localStorage (as in login page)
    const user = getUserFromLocalStorage();

    if (!user) {
      router.push("/login");
      return;
    }

    setIsIssuing(true);

    try {
      // Make a POST request to /api/book-requests
      const resp = await fetch("/api/book-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookId: book.id,
          userId: user.id,
        }),
      });

      if (!resp.ok) {
        const errorData = await resp.json().catch(() => ({}));
        setIssueError(
          errorData?.message ||
            "Failed to request book. Please try again or contact support."
        );
        router.push("/login");
        return;
      } else {
        setIssueSuccess("Book request submitted successfully!");
        // Optionally, you could update book.availableCopies here or refetch book data
      }
    } catch (err) {
      setIssueError("Something went wrong. Please try again.");
    } finally {
      setIsIssuing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading book details...</p>
        </div>
      </div>
    );
  }

  if (!book) {
    notFound();
  }

  const isAvailable = book.availableCopies > 0;
  const description = book.description || "No description available.";
  const shouldTruncate = description.length > 200;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Book Image & Actions */}
          <Card className="w-full lg:w-96">
            <CardContent className="p-6">
              {book.imageUrl ? (
                <div className="w-full h-80 mb-4">
                  <img
                    src={book.imageUrl}
                    alt={book.title}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              ) : (
                <div className="w-full h-80 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                  <BookOpen className="h-16 w-16 text-gray-400" />
                </div>
              )}

              {/* Availability Status */}
              <div className="text-center mb-4">
                <Badge
                  variant={isAvailable ? "default" : "destructive"}
                  className="mb-2"
                >
                  {isAvailable ? "Available" : "Not Available"}
                </Badge>
                <p className="text-sm text-gray-600">
                  {book.availableCopies} of {book.totalCopies} copies available
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={handleIssueBook}
                  disabled={!isAvailable || isIssuing}
                  className="w-full"
                >
                  {isIssuing ? "Processing..." : "Issue Book"}
                </Button>

                {issueError && (
                  <div className="text-red-600 text-sm text-center">
                    {issueError}
                  </div>
                )}
                {issueSuccess && (
                  <div className="text-green-600 text-sm text-center">
                    {issueSuccess}
                  </div>
                )}

                {book.ebookUrl && (
                  <Button variant="outline" className="w-full" asChild>
                    <a
                      href={book.ebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 justify-center"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Read E-book
                    </a>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Book Details */}
          <Card className="flex-1">
            <CardHeader>
              <CardTitle className="text-3xl font-bold mb-2">
                {book.title}
              </CardTitle>
              <Badge variant="secondary">
                {book.category?.name || "Uncategorized"}
              </Badge>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Author</p>
                    <p className="font-semibold">{book.author}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Building className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Publisher</p>
                    <p className="font-semibold">{book.publisher}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Hash className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">ISBN</p>
                    <p className="font-semibold">{book.isbn}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Publication Date</p>
                    <p className="font-semibold">
                      {new Date(book.publicationDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Description Section */}
              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Description
                  </h3>
                  {shouldTruncate && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setShowFullDescription(!showFullDescription)
                      }
                      className="flex items-center gap-1"
                    >
                      {showFullDescription ? (
                        <>
                          <EyeOff className="h-4 w-4" />
                          Show Less
                        </>
                      ) : (
                        <>
                          <Eye className="h-4 w-4" />
                          Show More
                        </>
                      )}
                    </Button>
                  )}
                </div>

                <div className="text-gray-700 leading-relaxed">
                  {shouldTruncate && !showFullDescription
                    ? `${description.substring(0, 300)}...`
                    : description}
                </div>
              </div>

              {/* Additional Information */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-3">
                  Additional Information
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Total Copies: </span>
                    <span className="font-semibold">{book.totalCopies}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Available: </span>
                    <span className="font-semibold">
                      {book.availableCopies}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Borrowed: </span>
                    <span className="font-semibold">
                      {book.totalCopies - book.availableCopies}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Category: </span>
                    <span className="font-semibold">
                      {book.category?.name || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
