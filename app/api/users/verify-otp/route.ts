import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const VerifySchema = z.object({
  userId: z.number(),
  code: z.string().length(6),
});

export async function POST(request: NextRequest) {
  try {
    const json = await request.json();
    const parsed = VerifySchema.safeParse(json);
    if (!parsed.success)
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    const { userId, code } = parsed.data;

    const otp = await prisma.otpVerification.findFirst({
      where: { userId, code, consumed: false, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: "desc" },
    });
    if (!otp)
      return NextResponse.json(
        { error: "Invalid or expired OTP" },
        { status: 400 }
      );

    await prisma.$transaction([
      prisma.user.update({ where: { id: userId }, data: { isVerified: true } }),
      prisma.otpVerification.update({
        where: { id: otp.id },
        data: { consumed: true },
      }),
    ]);

    return NextResponse.json({ message: "Verified" });
  } catch (error) {
    console.error("Verify OTP error", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
