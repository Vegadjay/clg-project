import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthFromCookies } from "@/lib/auth";

// GET /api/book-requests/[id] - Get a specific book request
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = getAuthFromCookies();
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const bookRequest = await prisma.bookRequest.findUnique({
      where: { id: parseInt(params.id) },
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
    });

    if (!bookRequest) {
      return NextResponse.json(
        { error: "Book request not found" },
        { status: 404 }
      );
    }

    // PATRONs can only view their own requests
    if (auth.role === "PATRON" && bookRequest.userId !== auth.sub) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(bookRequest);
  } catch (error) {
    console.error("Error fetching book request:", error);
    return NextResponse.json(
      { error: "Failed to fetch book request" },
      { status: 500 }
    );
  }
}

// PATCH /api/book-requests/[id] - Update book request status (for librarians/admins)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = getAuthFromCookies();
    if (!auth || (auth.role !== "LIBRARIAN" && auth.role !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { status, notes } = body;

    if (!status || !["APPROVED", "REJECTED", "CANCELLED"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status. Must be APPROVED, REJECTED, or CANCELLED" },
        { status: 400 }
      );
    }

    const bookRequest = await prisma.bookRequest.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        book: true,
      },
    });

    if (!bookRequest) {
      return NextResponse.json(
        { error: "Book request not found" },
        { status: 404 }
      );
    }

    if (bookRequest.status !== "PENDING") {
      return NextResponse.json(
        { error: "Book request has already been processed" },
        { status: 400 }
      );
    }

    // If approving, check if book is still available
    if (status === "APPROVED" && bookRequest.book.availableCopies <= 0) {
      return NextResponse.json(
        { error: "Book is no longer available" },
        { status: 400 }
      );
    }

    // Update the book request
    const updatedRequest = await prisma.bookRequest.update({
      where: { id: parseInt(params.id) },
      data: {
        status: status as "APPROVED" | "REJECTED" | "CANCELLED",
        librarianId: auth.sub,
        processedAt: new Date(),
        notes: notes || null,
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
        librarian: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // If approved, create a transaction (book loan)
    if (status === "APPROVED") {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 14); // 14 days loan period

      await prisma.transaction.create({
        data: {
          userId: bookRequest.userId,
          bookId: bookRequest.bookId,
          dueDate: dueDate,
          status: "ACTIVE",
        },
      });

      // Update book available copies
      await prisma.book.update({
        where: { id: bookRequest.bookId },
        data: {
          availableCopies: bookRequest.book.availableCopies - 1,
        },
      });
    }

    return NextResponse.json(updatedRequest);
  } catch (error) {
    console.error("Error updating book request:", error);
    return NextResponse.json(
      { error: "Failed to update book request" },
      { status: 500 }
    );
  }
}

// DELETE /api/book-requests/[id] - Cancel a book request (for patrons)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = getAuthFromCookies();
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const bookRequest = await prisma.bookRequest.findUnique({
      where: { id: parseInt(params.id) },
    });

    if (!bookRequest) {
      return NextResponse.json(
        { error: "Book request not found" },
        { status: 404 }
      );
    }

    // PATRONs can only cancel their own pending requests
    if (auth.role === "PATRON") {
      if (bookRequest.userId !== auth.sub) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      if (bookRequest.status !== "PENDING") {
        return NextResponse.json(
          { error: "Only pending requests can be cancelled" },
          { status: 400 }
        );
      }
    }

    await prisma.bookRequest.update({
      where: { id: parseInt(params.id) },
      data: {
        status: "CANCELLED",
        processedAt: new Date(),
      },
    });

    return NextResponse.json({
      message: "Book request cancelled successfully",
    });
  } catch (error) {
    console.error("Error cancelling book request:", error);
    return NextResponse.json(
      { error: "Failed to cancel book request" },
      { status: 500 }
    );
  }
}
