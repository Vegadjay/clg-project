"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";

interface Book {
  id: number;
  title: string;
  author: string;
  imageUrl?: string | null;
  category?: { name: string } | null;
}

export default function FeaturedBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/books", { cache: "no-store" });
        if (!res.ok) return setBooks([]);
        const data = await res.json();
        setBooks(Array.isArray(data) ? data.slice(0, 6) : []);
      } catch {
        setBooks([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse"
          >
            <div className="w-full h-48 bg-zinc-200"></div>
            <div className="p-6">
              <div className="h-4 bg-zinc-200 rounded mb-2"></div>
              <div className="h-3 bg-zinc-200 rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!books.length) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📚</div>
        <h3 className="text-xl font-semibold text-zinc-900 mb-2">
          No books available
        </h3>
        <p className="text-zinc-600">
          Check back later for new additions to our collection
        </p>
      </div>
    );
  }

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, staggerChildren: 0.1 }}
    >
      {books.map((b, index) => (
        <motion.div
          key={b.id}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
        >
          <Link
            href={`/books/${b.id}`}
            className="group bg-white rounded-2xl shadow-soft overflow-hidden hover:shadow-strong hover-lift transition-all duration-300 relative"
          >
            <div className="relative w-full h-48 overflow-hidden">
              {b.imageUrl ? (
                <img
                  src={b.imageUrl}
                  alt={b.title}
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                  <div className="text-center">
                    <div className="text-4xl mb-2">📖</div>
                    <div className="text-muted-foreground text-sm font-medium">
                      No image
                    </div>
                  </div>
                </div>
              )}
              {b.category && (
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-xs font-medium text-foreground rounded-full shadow-soft">
                    {b.category.name}
                  </span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                {b.title}
              </h3>
              <p className="text-muted-foreground text-sm mb-4 font-medium">
                by {b.author}
              </p>
              <div className="flex items-center text-primary text-sm font-semibold group-hover:translate-x-1 transition-transform duration-300">
                View Details
                <svg
                  className="w-4 h-4 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}
