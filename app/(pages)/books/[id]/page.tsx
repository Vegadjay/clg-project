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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
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
    <div className="min-h-screen bg-gray-50 py-8 w-full">
      <div className="w-full px-0 flex flex-col gap-8">
        {/* Responsive two-column layout for full width */}
        <div className="flex flex-col lg:flex-row gap-8 w-full">
          {/* Book Image & Actions */}
          <Card className="flex-1 w-full lg:max-w-[420px] lg:min-w-[340px] self-start">
            <CardContent className="p-8 flex flex-col items-center">
              {book.imageUrl ? (
                <div className="w-full h-[420px] relative mb-6 flex justify-center items-center">
                  <img
                    src={book.imageUrl}
                    alt={book.title}
                    sizes="100vw"
                    className="object-cover rounded-lg border border-gray-200 w-full h-full max-h-[420px]"
                  />
                </div>
              ) : (
                <div className="w-full h-[420px] bg-gray-200 rounded-lg flex items-center justify-center mb-6">
                  <BookOpen className="h-24 w-24 text-gray-400" />
                </div>
              )}

              {/* Availability Status */}
              <div className="text-center mb-6 w-full">
                <Badge
                  variant={isAvailable ? "default" : "destructive"}
                  className="text-base px-4 py-2"
                >
                  {isAvailable ? "Available" : "Not Available"}
                </Badge>
                <p className="text-base text-gray-600 mt-2">
                  {book.availableCopies} of {book.totalCopies} copies available
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4 w-full">
                <Button
                  onClick={handleIssueBook}
                  disabled={!isAvailable || isIssuing}
                  className="w-full text-lg py-3"
                  size="lg"
                >
                  {isIssuing ? "Processing..." : "Issue Book"}
                </Button>

                {issueError && (
                  <div className="text-red-600 text-sm mt-2 text-center">{issueError}</div>
                )}
                {issueSuccess && (
                  <div className="text-green-600 text-sm mt-2 text-center">{issueSuccess}</div>
                )}

                {book.ebookUrl && (
                  <Button
                    variant="outline"
                    className="w-full text-lg py-3"
                    size="lg"
                    asChild
                  >
                    <a
                      href={book.ebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 justify-center"
                    >
                      <ExternalLink className="h-5 w-5" />
                      Read E-book
                    </a>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Book Details */}
          <Card className="flex-[2] w-full">
            <CardHeader>
              <CardTitle className="text-4xl font-bold text-gray-900 mb-4 text-left lg:text-5xl">
                {book.title}
              </CardTitle>
              <div className="flex justify-start">
                <Badge variant="secondary" className="text-base px-3 py-1">
                  {book.category?.name || "Uncategorized"}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-10">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex items-start gap-4">
                  <User className="h-6 w-6 text-gray-500 mt-1" />
                  <div>
                    <p className="text-base text-gray-600">Author</p>
                    <p className="font-semibold text-gray-900 text-lg">
                      {book.author}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Building className="h-6 w-6 text-gray-500 mt-1" />
                  <div>
                    <p className="text-base text-gray-600">Publisher</p>
                    <p className="font-semibold text-gray-900 text-lg">
                      {book.publisher}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Hash className="h-6 w-6 text-gray-500 mt-1" />
                  <div>
                    <p className="text-base text-gray-600">ISBN</p>
                    <p className="font-semibold text-gray-900 text-lg">
                      {book.isbn}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Calendar className="h-6 w-6 text-gray-500 mt-1" />
                  <div>
                    <p className="text-base text-gray-600">Publication Date</p>
                    <p className="font-semibold text-gray-900 text-lg">
                      {new Date(book.publicationDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Description Section */}
              <div className="border-t pt-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
                  <h3 className="text-2xl font-semibold text-gray-900 flex items-center gap-3">
                    <FileText className="h-6 w-6" />
                    Description
                  </h3>
                  {shouldTruncate && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setShowFullDescription(!showFullDescription)
                      }
                      className="flex items-center gap-2"
                    >
                      {showFullDescription ? (
                        <>
                          <EyeOff className="h-5 w-5" />
                          Show Less
                        </>
                      ) : (
                        <>
                          <Eye className="h-5 w-5" />
                          Show More
                        </>
                      )}
                    </Button>
                  )}
                </div>

                <div className="text-gray-700 leading-relaxed text-lg">
                  {shouldTruncate && !showFullDescription
                    ? `${description.substring(0, 400)}...`
                    : description}
                </div>
              </div>

              {/* Additional Information */}
              <div className="border-t pt-8">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  Additional Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-base">
                  <div>
                    <span className="text-gray-600">Total Copies: </span>
                    <span className="font-semibold">{book.totalCopies}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Available Copies: </span>
                    <span className="font-semibold">
                      {book.availableCopies}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Borrowed Copies: </span>
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
