import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const RegisterSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  phone: z.string().optional(),
  address: z.string().optional(),
  role: z.enum(["PATRON", "LIBRARIAN"]).default("PATRON"),
});

function generateLibraryCardNumber() {
  const random = Math.floor(100000 + Math.random() * 900000);
  return `LIB-${random}`;
}

export async function POST(request: NextRequest) {
  try {
    const json = await request.json();
    const parsed = RegisterSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { name, email, password, phone, address, role } = parsed.data;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 409 }
      );
    }

    const hashed = await bcrypt.hash(password, 10);
    const libraryCardNumber = generateLibraryCardNumber();

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
        phone: phone || null,
        address: address || null,
        role: role as any,
        libraryCardNumber,
        isVerified: false,
      },
    });

    return NextResponse.json({
      message: "Registered successfully.",
      userId: user.id,
    });
  } catch (error: any) {
    console.error("Register error", error);
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Duplicate field" }, { status: 409 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
