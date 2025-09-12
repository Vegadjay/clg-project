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
    const action = _req.nextUrl.searchParams.get("action");
    if (action === "logout") {
      const res = NextResponse.json({ message: "Logged out" });
      res.cookies.set("auth", "", {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 0,
      });
      return res;
    }
    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
