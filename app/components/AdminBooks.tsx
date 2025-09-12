import { useEffect, useState } from "react";
import { useAlert } from "@/components/ui/custom-alert";

interface Book {
  id: number;
  title: string;
  author: string;
  totalCopies: number;
  availableCopies: number;
  category?: { name: string };
  imageUrl?: string | null;
}

export function BooksTab() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState<number | null>(null);
  const { showAlert, AlertComponent } = useAlert();

  const BOOKS_PER_PAGE = 15;

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
    showAlert({
      title: "Delete Book",
      description:
        "Are you sure you want to delete this book? This action cannot be undone.",
      type: "warning",
      showCancel: true,
      confirmText: "Yes, Delete",
      cancelText: "Cancel",
      onConfirm: () => submitDelete(id),
    });
  };

  const submitDelete = async (id: number) => {
    setDeleting(id);
    const res = await fetch(`/api/books/${id}`, { method: "DELETE" });
    if (res.ok) {
      setBooks((prev) => prev.filter((book) => book.id !== id));
      showAlert({
        title: "Success",
        description: "Book deleted successfully",
        type: "success",
      });
    } else {
      showAlert({
        title: "Error",
        description: "Error deleting book.",
        type: "error",
      });
    }
    setDeleting(null);
  };

  // Filter books by search
  const filteredBooks = books.filter((book) => {
    const q = search.toLowerCase();
    return (
      book.title.toLowerCase().includes(q) ||
      book.author.toLowerCase().includes(q) ||
      (book.category?.name?.toLowerCase().includes(q) ?? false)
    );
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredBooks.length / BOOKS_PER_PAGE);
  const paginatedBooks = filteredBooks.slice(
    (page - 1) * BOOKS_PER_PAGE,
    page * BOOKS_PER_PAGE
  );

  const handlePrev = () => setPage((p) => Math.max(1, p - 1));
  const handleNext = () => setPage((p) => Math.min(totalPages, p + 1));

  // Reset to page 1 when search changes
  useEffect(() => {
    setPage(1);
  }, [search]);

  return (
    <div className="py-6">
      <AlertComponent />
      <h2 className="text-2xl font-bold mb-4">Books Management</h2>
      <p className="text-zinc-600">
        Here you can view, add, edit, or remove books from the library.
      </p>
      <div className="mt-4">
        {/* Search bar */}
        <div className="mb-4 flex items-center gap-2">
          <input
            type="text"
            placeholder="Search by title, author, or category..."
            className="w-full max-w-xs px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {loading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="flex items-center space-x-2 text-zinc-600">
              <div className="w-4 h-4 border-2 border-zinc-300 border-t-zinc-900 rounded-full animate-spin"></div>
              <span>Loading books...</span>
            </div>
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="p-4 bg-zinc-50 border rounded text-zinc-500 text-center">
            No books found.
          </div>
        ) : (
          <>
            <div className="overflow-x-auto rounded-2xl border border-zinc-200">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border-b text-left">Image</th>
                    <th className="px-4 py-2 border-b text-left">Title</th>
                    <th className="px-4 py-2 border-b text-left">Author</th>
                    <th className="px-4 py-2 border-b text-left">Category</th>
                    <th className="px-4 py-2 border-b text-left">
                      Total Copies
                    </th>
                    <th className="px-4 py-2 border-b text-left">Available</th>
                    <th className="px-4 py-2 border-b text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedBooks.map((book) => (
                    <tr key={book.id} className="hover:bg-zinc-50">
                      <td className="px-4 py-2 border-b">
                        {book.imageUrl ? (
                          <img
                            src={book.imageUrl}
                            alt={book.title}
                            className="w-12 h-16 object-cover rounded shadow"
                          />
                        ) : (
                          <div className="w-12 h-16 flex items-center justify-center bg-zinc-100 rounded text-zinc-400">
                            <svg
                              className="w-6 h-6"
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
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-2 border-b text-md font-bold">
                        {book.title}
                      </td>
                      <td className="px-4 py-2 border-b">{book.author}</td>
                      <td className="px-4 py-2 border-b">
                        {book.category?.name || "-"}
                      </td>
                      <td className="px-4 py-2 border-b">{book.totalCopies}</td>
                      <td className="px-4 py-2 border-b">
                        {book.availableCopies}
                      </td>
                      <td className="px-4 py-2 border-b">
                        <button
                          onClick={() => handleDelete(book.id)}
                          disabled={deleting === book.id}
                          className={`px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 transition ${
                            deleting === book.id
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          {deleting === book.id ? "Deleting..." : "Delete"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={handlePrev}
                disabled={page === 1}
                className={`px-4 py-2 rounded border bg-zinc-100 hover:bg-zinc-200 transition ${
                  page === 1
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                }`}
              >
                Previous
              </button>
              <span className="text-zinc-700">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={handleNext}
                disabled={page === totalPages || totalPages === 0}
                className={`px-4 py-2 rounded border bg-zinc-100 hover:bg-zinc-200 transition ${
                  page === totalPages || totalPages === 0
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                }`}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
