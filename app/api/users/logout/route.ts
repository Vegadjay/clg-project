import { NextRequest, NextResponse } from "next/server";

export async function POST(_req: NextRequest) {
  try {
    // Create response with success message
    const res = NextResponse.json({
      message: "Successfully logged out",
    });

    // Remove the auth cookie by setting it to empty with maxAge: 0
    res.cookies.set("auth", "", {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });

    // Also remove the role cookie if it exists
    res.cookies.set("role", "", {
      httpOnly: false,
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });

    return res;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ error: "Failed to logout" }, { status: 500 });
  }
}
