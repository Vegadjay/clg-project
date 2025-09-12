import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyJwtToken } from "@/lib/auth";

export async function GET(_req: NextRequest) {
  try {
    const token = _req.cookies.get("auth")?.value;
    const meParam = _req.nextUrl.searchParams.get("me");
    if (meParam === "true") {
      if (!token) return NextResponse.json({ user: null }, { status: 401 });
      const payload = verifyJwtToken(token);
      if (!payload) return NextResponse.json({ user: null }, { status: 401 });
      return NextResponse.json({
        user: { id: payload.sub, email: payload.email, role: payload.role },
      });
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        role: true,
        libraryCardNumber: true,
        isVerified: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

export async function POST(_req: NextRequest) {
  try {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const token = req.cookies.get("auth")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyJwtToken(token);
    if (!payload || payload.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { userId, isVerified } = await req.json();

    if (typeof userId !== "number" || typeof isVerified !== "boolean") {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { isVerified },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        role: true,
        libraryCardNumber: true,
        isVerified: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      message: `User ${isVerified ? "verified" : "unverified"} successfully`,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Failed to update user verification:", error);
    return NextResponse.json(
      { error: "Failed to update user verification" },
      { status: 500 }
    );
  }
}
