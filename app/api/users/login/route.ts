import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["ADMIN", "LIBRARIAN", "PATRON"]).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = LoginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    const { email, password, role } = parsed.data;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    if (role && user.role !== role) {
      return NextResponse.json({ error: "Role mismatch" }, { status: 403 });
    }
    if (!user.isVerified) {
      return NextResponse.json(
        { error: "Email not verified" },
        { status: 403 }
      );
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );

    const token = jwt.sign(
      { sub: user.id, role: user.role, email: user.email },
      process.env.JWT_SECRET || "dev_secret",
      { expiresIn: "7d" }
    );

    const res = NextResponse.json({
      message: "Logged in",
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
      },
    });
    res.cookies.set("auth", token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    });
    res.cookies.set("role", user.role, {
      httpOnly: false,
      sameSite: "lax",
      path: "/",
    });
    return res;
  } catch (error) {
    console.error("Login error", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
