import { NextResponse, NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const role = request.cookies.get("role")?.value as
    | "ADMIN"
    | "LIBRARIAN"
    | "PATRON"
    | undefined;

  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/librarian") ||
    pathname.startsWith("/patron")
  ) {
    if (!role) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (pathname.startsWith("/admin") && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (pathname.startsWith("/librarian") && role !== "LIBRARIAN") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (pathname.startsWith("/patron") && role !== "PATRON") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // If hitting /login while already authenticated, send to their dashboard
  if (pathname === "/login" && role) {
    const dest =
      role === "ADMIN"
        ? "/admin/dashboard"
        : role === "LIBRARIAN"
        ? "/librarian/dashboard"
        : "/patron/dashboard";
    return NextResponse.redirect(new URL(dest, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/admin/:path*", "/librarian/:path*", "/patron/:path*"],
};
