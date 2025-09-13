"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, Pencil, Plus, BookOpen, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
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

  const deleteBook = async (bookId: number) => {
    try {
      const res = await fetch(`/api/books/${bookId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        // Remove the book from the local state
        setBooks(books.filter((book) => book.id !== bookId));
      } else {
        console.error("Failed to delete book");
      }
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

  // Filter books based on search query
  const filteredBooks = books.filter((book) => {
    const query = searchQuery.toLowerCase();
    return (
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query) ||
      book.category?.name.toLowerCase().includes(query)
    );
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px] w-full">
        <div className="flex items-center space-x-3 text-muted-foreground">
          <div className="w-5 h-5 border-2 border-muted-foreground/30 border-t-muted-foreground rounded-full animate-spin" />
          <span className="font-medium">Loading books...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-8 px-2 sm:px-4 lg:px-6 xl:px-8 mx-auto animate-in fade-in-0 duration-500">
      {/* Header */}
      <div className="mb-12 animate-in slide-in-from-top-4 duration-700">
        <div className="flex justify-between items-start mb-6 w-full">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Library Collection
            </h1>
            <p className="text-muted-foreground">
              {books.length > 0
                ? `${filteredBooks.length} of ${books.length} book${
                    books.length > 1 ? "s" : ""
                  } ${searchQuery ? "matching your search" : "available"}`
                : "No books found in the database"}
            </p>
          </div>
          {books.length > 0 && (role === "ADMIN" || role === "LIBRARIAN") && (
            <Button
              onClick={() => router.push("/addbook")}
              size="default"
              className="flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Book</span>
            </Button>
          )}
        </div>

        <div className="relative max-w-md animate-in slide-in-from-top-4 duration-700">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            type="text"
            placeholder="Search books by title, author, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 w-full"
          />
        </div>
      </div>

      {filteredBooks.length > 0 ? (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 my-8 animate-in slide-in-from-bottom-4 duration-1000">
          {filteredBooks.map((book, index) => (
            <Card
              key={book.id}
              className="overflow-hidden shadow-none hover:shadow-lg hover:shadow-black/10 animate-in fade-in-0 slide-in-from-bottom-4"
            >
              <div className="relative">
                <div className="flex justify-center items-center overflow-hidden w-full h-80">
                  {book.imageUrl ? (
                    <img
                      src={book.imageUrl}
                      alt={book.title}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 20vw"
                      className="object-contain w-full h-80"
                    />
                  ) : (
                    <div className="w-full h-80 flex items-center justify-center">
                      <div className="text-center text-muted-foreground">
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
                </div>
                {/* Availability Badge */}
                <div className="absolute top-3 right-3 animate-in fade-in-0 slide-in-from-top-2 duration-500">
                  <Badge
                    variant={
                      book.availableCopies > 0 ? "default" : "destructive"
                    }
                    className="text-xs transition-all duration-300 hover:scale-110"
                  >
                    {book.availableCopies > 0 ? "Available" : "Unavailable"}
                  </Badge>
                </div>
              </div>

              <CardHeader className="pb-4 animate-in fade-in-0 slide-in-from-bottom-2 duration-700">
                <CardTitle className="text-lg line-clamp-2 mb-2 transition-colors duration-300 hover:text-primary">
                  {book.title}
                </CardTitle>
                <p className="text-sm text-muted-foreground transition-colors duration-300">
                  by {book.author}
                </p>
              </CardHeader>

              <CardContent className="pt-0 pb-6 animate-in fade-in-0 slide-in-from-bottom-2 duration-800">
                {/* Category and Availability */}
                <div className="flex items-center justify-between mb-4 animate-in fade-in-0 slide-in-from-left-2 duration-600">
                  <Badge
                    variant="secondary"
                    className="text-xs transition-all duration-300 hover:scale-105"
                  >
                    {book.category?.name || "Uncategorized"}
                  </Badge>
                  <div className="text-right animate-in fade-in-0 slide-in-from-right-2 duration-600">
                    <div className="text-xs text-muted-foreground">Copies</div>
                    <div className="text-sm font-semibold transition-colors duration-300">
                      {book.availableCopies}/{book.totalCopies}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2 mt-auto animate-in fade-in-0 slide-in-from-bottom-2 duration-900">
                  <Button
                    onClick={() => router.push(`/books/${book.id}`)}
                    size="sm"
                    className="flex-1 hover:scale-105 transition-all duration-300 hover:shadow-md"
                  >
                    <Eye className="w-4 h-4 transition-transform duration-300" />
                    <span className="ml-1 hidden sm:inline">View</span>
                  </Button>
                  {isAuthenticated &&
                    role === "PATRON" &&
                    book.availableCopies > 0 && (
                      <Button
                        onClick={() => router.push(`/request-book/${book.id}`)}
                        variant="secondary"
                        size="sm"
                        className="flex-1 hover:scale-105 transition-all duration-300 hover:shadow-md"
                      >
                        <BookOpen className="w-4 h-4 transition-transform duration-300" />
                        <span className="ml-1 hidden sm:inline">Request</span>
                      </Button>
                    )}
                  {(role === "ADMIN" || role === "LIBRARIAN") && (
                    <>
                      <Button
                        onClick={() => router.push(`/books/edit/${book.id}`)}
                        variant="outline"
                        size="sm"
                        className="flex-1 hover:scale-105 transition-all duration-300 hover:shadow-md"
                      >
                        <Pencil className="w-4 h-4 transition-transform duration-300" />
                        <span className="ml-1 hidden sm:inline">Edit</span>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="flex-1 hover:scale-105 transition-all duration-300 hover:shadow-md"
                          >
                            <Trash2 className="w-4 h-4 transition-transform duration-300" />
                            <span className="ml-1 hidden sm:inline">
                              Delete
                            </span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will
                              permanently delete the book "{book.title}" from
                              the library.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteBook(book.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete Book
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : books.length > 0 ? (
        /* No Search Results */
        <div className="text-center py-16 w-full my-8 animate-in fade-in-0 slide-in-from-bottom-4 duration-1000">
          <div className="w-20 h-20 mx-auto mb-6 text-muted-foreground animate-in fade-in-0 slide-in-from-top-4 duration-800">
            <Search className="w-full h-full transition-all duration-500 hover:scale-110" />
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-3 animate-in fade-in-0 slide-in-from-bottom-2 duration-700">
            No Books Found
          </h3>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto animate-in fade-in-0 slide-in-from-bottom-2 duration-800">
            No books match your search for "{searchQuery}". Try adjusting your
            search terms.
          </p>
          <Button
            onClick={() => setSearchQuery("")}
            variant="outline"
            size="lg"
            className="animate-in fade-in-0 slide-in-from-bottom-2 duration-900 hover:scale-105 transition-transform"
          >
            Clear Search
          </Button>
        </div>
      ) : (
        /* Empty Library */
        <div className="text-center py-16 w-full my-8 animate-in fade-in-0 slide-in-from-bottom-4 duration-1000">
          <div className="w-20 h-20 mx-auto mb-6 text-muted-foreground animate-in fade-in-0 slide-in-from-top-4 duration-800">
            <svg
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              className="w-full h-full transition-all duration-500 hover:scale-110"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
              />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-3 animate-in fade-in-0 slide-in-from-bottom-2 duration-700">
            No Books Found
          </h3>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto animate-in fade-in-0 slide-in-from-bottom-2 duration-800">
            Start building your library collection by adding some books to get
            started.
          </p>
          <Button
            onClick={() => router.push("/addbook")}
            size="lg"
            className="animate-in fade-in-0 slide-in-from-bottom-2 duration-900 hover:scale-105 transition-transform"
          >
            Add Your First Book
          </Button>
        </div>
      )}
    </div>
  );
}
