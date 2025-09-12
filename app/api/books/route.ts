import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const books = await prisma.book.findMany({ include: { category: true } });
  return NextResponse.json(books);
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    if (data.description && data.description.length > 10000) {
      return NextResponse.json(
        {
          error:
            "Description is too long. Please keep it under 10,000 characters.",
        },
        { status: 400 }
      );
    }

    if (data.imageUrl && data.imageUrl.length > 2000) {
      return NextResponse.json(
        {
          error:
            "Image URL is too long. Please keep it under 2,000 characters.",
        },
        { status: 400 }
      );
    }

    if (data.ebookUrl && data.ebookUrl.length > 2000) {
      return NextResponse.json(
        
        {
          error:
            "E-book URL is too long. Please keep it under 2,000 characters.",
        },
        { status: 400 }
      );
    }

    let category = await prisma.category.findUnique({
      where: { name: data.category },
    });

    if (!category) {
      category = await prisma.category.create({
        data: { name: data.category },
      });
    }

    // Create the book, connecting the category by id
    const newBook = await prisma.book.create({
      data: {
        title: data.title,
        author: data.author,
        isbn: data.isbn,
        category: { connect: { id: category.id } },
        publisher: data.publisher,
        publicationDate: new Date(data.publicationDate),
        totalCopies: data.totalCopies,
        availableCopies: data.availableCopies,
        description: data.description || "",
        imageUrl: data.imageUrl || null,
        ebookUrl: data.ebookUrl || null,
      },
    });

    return NextResponse.json(newBook);
  } catch (error: any) {
    console.error("Error creating book:", error);

    // Handle specific Prisma errors
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "A book with this ISBN already exists." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create book. Please try again." },
      { status: 500 }
    );
  }
}
