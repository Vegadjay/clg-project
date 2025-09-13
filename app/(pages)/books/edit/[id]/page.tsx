"use client";
import { useEffect, useState, FormEvent, ChangeEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading book...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Edit Book
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdate} className="space-y-4">
              <Input
                name="title"
                value={book.title}
                onChange={handleChange}
                required
                placeholder="Title"
              />
              <Input
                name="author"
                value={book.author}
                onChange={handleChange}
                required
                placeholder="Author"
              />
              <Input
                name="isbn"
                value={book.isbn}
                onChange={handleChange}
                required
                placeholder="ISBN"
              />
              <Select
                value={book.category}
                onValueChange={(value) =>
                  handleChange({ target: { name: "category", value } } as any)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                name="publisher"
                value={book.publisher}
                onChange={handleChange}
                required
                placeholder="Publisher"
              />
              <Input
                type="date"
                name="publicationDate"
                value={book.publicationDate}
                onChange={handleChange}
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  name="totalCopies"
                  value={book.totalCopies}
                  onChange={handleChange}
                  required
                  type="number"
                  min={1}
                  placeholder="Total Copies"
                />
                <Input
                  name="availableCopies"
                  value={book.availableCopies}
                  onChange={handleChange}
                  required
                  type="number"
                  min={0}
                  max={book.totalCopies}
                  placeholder="Available Copies"
                />
              </div>
              <Input
                name="imageUrl"
                value={book.imageUrl}
                onChange={handleChange}
                type="url"
                placeholder="Image URL (optional)"
              />
              {/* Preview image if imageUrl is present and valid */}
              {book.imageUrl && (
                <div className="flex justify-center">
                  <img
                    src={book.imageUrl}
                    alt="Book cover preview"
                    className="max-h-48 rounded shadow border"
                    style={{ objectFit: "contain" }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
              )}
              <Input
                name="ebookUrl"
                value={book.ebookUrl}
                onChange={handleChange}
                type="url"
                placeholder="E-book URL (optional)"
              />
              <Textarea
                name="description"
                value={book.description}
                onChange={handleChange}
                placeholder="Description"
                rows={3}
              />
              {error && (
                <p className="text-red-600 text-sm text-center">{error}</p>
              )}
              {success && (
                <p className="text-green-600 text-sm text-center">{success}</p>
              )}
              <Button type="submit" className="w-full">
                Update Book
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
