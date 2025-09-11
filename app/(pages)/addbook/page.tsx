"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";

interface Book {
  title: string;
  author: string;
  isbn: string;
  category: string;
  publisher: string;
  publicationDate: string;
  totalCopies: number;
  availableCopies: number;
  description?: string;
  imageUrl?: string;
  ebookUrl?: string;
}

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

export default function AddBook() {
  const [book, setBook] = useState<Book>({
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

  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const router = useRouter();

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

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation checks
    if (book.availableCopies > book.totalCopies) {
      setError("Available copies cannot exceed total copies");
      return;
    }

    if (book.description && book.description.length > 10000) {
      setError(
        "Description is too long. Please keep it under 10,000 characters."
      );
      return;
    }

    if (book.imageUrl && book.imageUrl.length > 2000) {
      setError("Image URL is too long. Please keep it under 2,000 characters.");
      return;
    }

    if (book.ebookUrl && book.ebookUrl.length > 2000) {
      setError(
        "E-book URL is too long. Please keep it under 2,000 characters."
      );
      return;
    }

    try {
      const res = await fetch("/api/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(book),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to add book");
      }

      setSuccess("Book added successfully!");
      setBook({
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

      // Optionally redirect after success
      // router.push('/admin/books')
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    }
  }

  return (
    <div className="max-w-3xl mx-auto mt-16 p-8 bg-white rounded-lg shadow border border-zinc-200">
      <h1 className="text-3xl font-semibold mb-8 text-center text-zinc-900">
        Add New Book
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="title"
            className="block text-zinc-700 mb-2 font-medium"
          >
            Title
          </label>
          <input
            id="title"
            name="title"
            value={book.title}
            onChange={handleChange}
            required
            type="text"
            placeholder="Book Title"
            className="w-full px-4 py-2 bg-white border border-zinc-300 rounded-md focus:ring-2 focus:ring-zinc-500 focus:border-transparent text-zinc-900"
          />
        </div>

        <div>
          <label
            htmlFor="author"
            className="block text-zinc-700 mb-2 font-medium"
          >
            Author
          </label>
          <input
            id="author"
            name="author"
            value={book.author}
            onChange={handleChange}
            required
            type="text"
            placeholder="Author Name"
            className="w-full px-4 py-2 bg-white border border-zinc-300 rounded-md focus:ring-2 focus:ring-zinc-500 focus:border-transparent text-zinc-900"
          />
        </div>

        <div>
          <label
            htmlFor="isbn"
            className="block text-zinc-700 mb-2 font-medium"
          >
            ISBN
          </label>
          <input
            id="isbn"
            name="isbn"
            value={book.isbn}
            onChange={handleChange}
            required
            type="text"
            placeholder="ISBN Number"
            className="w-full px-4 py-2 bg-white border border-zinc-300 rounded-md focus:ring-2 focus:ring-zinc-500 focus:border-transparent text-zinc-900"
          />
        </div>

        <div>
          <label
            htmlFor="category"
            className="block text-zinc-700 mb-2 font-medium"
          >
            Category
          </label>
          <select
            id="category"
            name="category"
            value={book.category}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-white border border-zinc-300 rounded-md focus:ring-2 focus:ring-zinc-500 focus:border-transparent text-zinc-900"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="publisher"
            className="block text-zinc-700 mb-2 font-medium"
          >
            Publisher
          </label>
          <input
            id="publisher"
            name="publisher"
            value={book.publisher}
            onChange={handleChange}
            required
            type="text"
            placeholder="Publisher Name"
            className="w-full px-4 py-2 bg-white border border-zinc-300 rounded-md focus:ring-2 focus:ring-zinc-500 focus:border-transparent text-zinc-900"
          />
        </div>

        <div>
          <label
            htmlFor="publicationDate"
            className="block text-zinc-700 mb-2 font-medium"
          >
            Publication Date
          </label>
          <input
            id="publicationDate"
            name="publicationDate"
            value={book.publicationDate}
            onChange={handleChange}
            required
            type="date"
            className="w-full px-4 py-2 bg-white border border-zinc-300 rounded-md focus:ring-2 focus:ring-zinc-500 focus:border-transparent text-zinc-900"
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label
              htmlFor="totalCopies"
              className="block text-zinc-700 mb-2 font-medium"
            >
              Total Copies
            </label>
            <input
              id="totalCopies"
              name="totalCopies"
              value={book.totalCopies || ""}
              onChange={handleChange}
              required
              type="number"
              min={1}
              placeholder="1"
              className="w-full px-4 py-2 bg-white border border-zinc-300 rounded-md focus:ring-2 focus:ring-zinc-500 focus:border-transparent text-zinc-900"
            />
          </div>
          <div className="flex-1">
            <label
              htmlFor="availableCopies"
              className="block text-zinc-700 mb-2 font-medium"
            >
              Available Copies
            </label>
            <input
              id="availableCopies"
              name="availableCopies"
              value={book.availableCopies || ""}
              onChange={handleChange}
              required
              type="number"
              min={0}
              max={book.totalCopies}
              placeholder="1"
              className="w-full px-4 py-2 bg-white border border-zinc-300 rounded-md focus:ring-2 focus:ring-zinc-500 focus:border-transparent text-zinc-900"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="imageUrl"
            className="block text-zinc-700 mb-2 font-medium"
          >
            Image URL (optional)
          </label>
          <input
            id="imageUrl"
            name="imageUrl"
            value={book.imageUrl || ""}
            onChange={handleChange}
            type="url"
            placeholder="https://..."
            maxLength={2000}
            className="w-full px-4 py-2 bg-white border border-zinc-300 rounded-md focus:ring-2 focus:ring-zinc-500 focus:border-transparent text-zinc-900"
          />
          <div className="flex justify-end mt-1">
            <span className="text-sm text-zinc-500">
              {book.imageUrl?.length || 0}/2,000 characters
            </span>
          </div>
        </div>

        <div>
          <label
            htmlFor="ebookUrl"
            className="block text-zinc-700 mb-2 font-medium"
          >
            E-book URL (optional)
          </label>
          <input
            id="ebookUrl"
            name="ebookUrl"
            value={book.ebookUrl || ""}
            onChange={handleChange}
            type="url"
            placeholder="https://..."
            maxLength={2000}
            className="w-full px-4 py-2 bg-white border border-zinc-300 rounded-md focus:ring-2 focus:ring-zinc-500 focus:border-transparent text-zinc-900"
          />
          <div className="flex justify-end mt-1">
            <span className="text-sm text-zinc-500">
              {book.ebookUrl?.length || 0}/2,000 characters
            </span>
          </div>
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-zinc-700 mb-2 font-medium"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={book.description}
            onChange={handleChange}
            placeholder="Optional description"
            rows={4}
            maxLength={10000}
            className="w-full px-4 py-2 bg-white border border-zinc-300 rounded-md focus:ring-2 focus:ring-zinc-500 focus:border-transparent text-zinc-900"
          />
          <div className="flex justify-between items-center mt-1">
            <span className="text-sm text-zinc-500">
              Optional field for book description
            </span>
            <span
              className={`text-sm ${
                book.description && book.description.length > 8000
                  ? "text-orange-500"
                  : "text-zinc-500"
              }`}
            >
              {book.description?.length || 0}/10,000 characters
            </span>
          </div>
        </div>

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
          Add Book
        </button>
      </form>
    </div>
  );
}
