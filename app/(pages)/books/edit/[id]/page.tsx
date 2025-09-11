"use client";
import { useEffect, useState, FormEvent, ChangeEvent } from "react";
import { useRouter, useParams } from "next/navigation";

const categories = [
  "Fiction",
  "Non-Fiction",
  "Science",
  "Technology",
  "History",
  "Biography",
  "Business",
  "Self-Help",
  "Fantasy",
  "Psychology",
];

export default function EditBook() {
  const router = useRouter();
  const params = useParams();
  const bookId = params?.id as string;
  const [book, setBook] = useState({
    title: "",
    author: "",
    isbn: "",
    category: "",
    publisher: "",
    publicationDate: "",
    totalCopies: 1,
    availableCopies: 1,
    description: "",
    imageUrl: "",
    ebookUrl: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!bookId) return;
    fetch(`/api/books/${bookId}`)
      .then((res) => res.json())
      .then((data) => {
        setBook({
          title: data.title,
          author: data.author,
          isbn: data.isbn,
          category: data.category?.name || "",
          publisher: data.publisher,
          publicationDate: data.publicationDate
            ? data.publicationDate.slice(0, 10)
            : "",
          totalCopies: data.totalCopies,
          availableCopies: data.availableCopies,
          description: data.description || "",
          imageUrl: data.imageUrl || "",
          ebookUrl: data.ebookUrl || "",
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [bookId]);

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setBook((prev) => ({
      ...prev,
      [name]:
        name === "totalCopies" || name === "availableCopies"
          ? Number(value)
          : value,
    }));
  }

  async function handleUpdate(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`/api/books/${bookId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(book),
      });
      if (!res.ok) throw new Error("Failed to update book");
      setSuccess("Book updated successfully!");
      setTimeout(() => {
        router.push("/books");
      }, 1000);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      setError(message);
    }
  }

  if (loading) {
    return (
      <div className="p-8 text-zinc-700 font-semibold">Loading book...</div>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-16 p-8 bg-white rounded-lg shadow border border-zinc-200">
      <h1 className="text-2xl font-bold mb-6 text-center text-zinc-900">
        Edit Book
      </h1>
      <form onSubmit={handleUpdate} className="space-y-6">
        <input
          name="title"
          value={book.title}
          onChange={handleChange}
          required
          type="text"
          placeholder="Title"
          className="w-full px-4 py-2 bg-white text-zinc-900 border border-zinc-300 rounded-md"
        />
        <input
          name="author"
          value={book.author}
          onChange={handleChange}
          required
          type="text"
          placeholder="Author"
          className="w-full px-4 py-2 bg-white text-zinc-900 border border-zinc-300 rounded-md"
        />
        <input
          name="isbn"
          value={book.isbn}
          onChange={handleChange}
          required
          type="text"
          placeholder="ISBN"
          className="w-full px-4 py-2 bg-white text-zinc-900 border border-zinc-300 rounded-md"
        />
        <select
          name="category"
          value={book.category}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 bg-white text-zinc-900 border border-zinc-300 rounded-md"
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <input
          name="publisher"
          value={book.publisher}
          onChange={handleChange}
          required
          type="text"
          placeholder="Publisher"
          className="w-full px-4 py-2 bg-white text-zinc-900 border border-zinc-300 rounded-md"
        />
        <input
          type="date"
          name="publicationDate"
          value={book.publicationDate}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 bg-white text-zinc-900 border border-zinc-300 rounded-md"
        />
        <div className="flex gap-4">
          <input
            name="totalCopies"
            value={book.totalCopies}
            onChange={handleChange}
            required
            type="number"
            min={1}
            placeholder="Total Copies"
            className="flex-1 px-4 py-2 bg-white text-zinc-900 border border-zinc-300 rounded-md"
          />
          <input
            name="availableCopies"
            value={book.availableCopies}
            onChange={handleChange}
            required
            type="number"
            min={0}
            max={book.totalCopies}
            placeholder="Available Copies"
            className="flex-1 px-4 py-2 bg-white text-zinc-900 border border-zinc-300 rounded-md"
          />
        </div>
        <input
          name="imageUrl"
          value={book.imageUrl}
          onChange={handleChange}
          type="url"
          placeholder="Image URL (optional)"
          className="w-full px-4 py-2 bg-white text-zinc-900 border border-zinc-300 rounded-md"
        />
        {/* Preview image if imageUrl is present and valid */}
        {book.imageUrl && (
          <div className="flex justify-center mb-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={book.imageUrl}
              alt="Book cover preview"
              className="max-h-48 rounded shadow border border-zinc-200"
              style={{ objectFit: "contain" }}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
        )}
        <input
          name="ebookUrl"
          value={book.ebookUrl}
          onChange={handleChange}
          type="url"
          placeholder="E-book URL (optional)"
          className="w-full px-4 py-2 bg-white text-zinc-900 border border-zinc-300 rounded-md"
        />
        <textarea
          name="description"
          value={book.description}
          onChange={handleChange}
          placeholder="Description"
          rows={3}
          className="w-full px-4 py-2 bg-white text-zinc-900 border border-zinc-300 rounded-md"
        />
        {error && (
          <p className="text-red-600 font-semibold text-center mb-2">{error}</p>
        )}
        {success && (
          <p className="text-green-600 font-semibold text-center mb-2">
            {success}
          </p>
        )}
        <button
          type="submit"
          className="w-full py-3 bg-zinc-900 hover:bg-zinc-800 rounded-md text-zinc-50 font-semibold transition"
        >
          Update Book
        </button>
      </form>
    </div>
  );
}
