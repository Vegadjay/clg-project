import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const book = await prisma.book.findUnique({
    where: { id: Number(params.id) },
    include: { category: true },
  });
  if (!book) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(book);
}

// UPDATE book
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const data = await request.json();
  // Find or create category
  let category = await prisma.category.findUnique({
    where: { name: data.category },
  });
  if (!category) {
    category = await prisma.category.create({
      data: { name: data.category },
    });
  }
  // Update book and link category
  const updatedBook = await prisma.book.update({
    where: { id: Number(params.id) },
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
  return NextResponse.json(updatedBook);
}

// DELETE book
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await prisma.book.delete({
    where: { id: Number(params.id) },
  });
  return NextResponse.json({ success: true });
}
