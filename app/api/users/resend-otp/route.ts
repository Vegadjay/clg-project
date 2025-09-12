import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { sendOtpEmail } from "@/lib/mailer";

const ResendSchema = z.object({ email: z.string().email() });

function generateOtpCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: NextRequest) {
  try {
    const json = await request.json();
    const parsed = ResendSchema.safeParse(json);
    if (!parsed.success)
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    const { email } = parsed.data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    if (user.isVerified)
      return NextResponse.json({ message: "Already verified" });

    const code = generateOtpCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await prisma.otpVerification.create({
      data: { userId: user.id, code, expiresAt },
    });
    await sendOtpEmail({ to: user.email, name: user.name, code });

    return NextResponse.json({ message: "OTP sent" });
  } catch (error) {
    console.error("Resend OTP error", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
