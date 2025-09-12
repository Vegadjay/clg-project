import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthFromCookies } from "@/lib/auth";

// GET /api/book-requests - Get all book requests (for librarians/admins) or user's own requests
export async function GET(request: NextRequest) {
  try {
    const auth = getAuthFromCookies();
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const status = searchParams.get("status");

    let whereClause: any = {};

    // If user is PATRON, only show their own requests
    if (auth.role === "PATRON") {
      whereClause.userId = auth.sub;
    } else if (userId) {
      // Librarians/Admins can filter by specific user
      whereClause.userId = parseInt(userId);
    }

    // Filter by status if provided
    if (status) {
      whereClause.status = status;
    }

    const bookRequests = await prisma.bookRequest.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            libraryCardNumber: true,
          },
        },
        book: {
          select: {
            id: true,
            title: true,
            author: true,
            isbn: true,
            availableCopies: true,
            totalCopies: true,
            imageUrl: true,
          },
        },
        librarian: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(bookRequests);
  } catch (error) {
    console.error("Error fetching book requests:", error);
    return NextResponse.json(
      { error: "Failed to fetch book requests" },
      { status: 500 }
    );
  }
}

// POST /api/book-requests - Create a new book request
export async function POST(request: NextRequest) {
  try {
    const auth = getAuthFromCookies();
    if (!auth || auth.role !== "PATRON") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { bookId } = body;

    if (!bookId) {
      return NextResponse.json(
        { error: "Book ID is required" },
        { status: 400 }
      );
    }

    // Check if book exists and is available
    const book = await prisma.book.findUnique({
      where: { id: parseInt(bookId) },
    });

    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    if (book.availableCopies <= 0) {
      return NextResponse.json(
        { error: "Book is not available for request" },
        { status: 400 }
      );
    }

    // Check if user already has a pending request for this book
    const existingRequest = await prisma.bookRequest.findFirst({
      where: {
        userId: auth.sub,
        bookId: parseInt(bookId),
        status: "PENDING",
      },
    });

    if (existingRequest) {
      return NextResponse.json(
        { error: "You already have a pending request for this book" },
        { status: 400 }
      );
    }

    // Create the book request
    const bookRequest = await prisma.bookRequest.create({
      data: {
        userId: auth.sub,
        bookId: parseInt(bookId),
        status: "PENDING",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            libraryCardNumber: true,
          },
        },
        book: {
          select: {
            id: true,
            title: true,
            author: true,
            isbn: true,
            availableCopies: true,
            totalCopies: true,
            imageUrl: true,
          },
        },
      },
    });

    return NextResponse.json(bookRequest, { status: 201 });
  } catch (error) {
    console.error("Error creating book request:", error);
    return NextResponse.json(
      { error: "Failed to create book request" },
      { status: 500 }
    );
  }
}
