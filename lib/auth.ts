import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export type AuthPayload = {
  sub: number;
  role: "ADMIN" | "LIBRARIAN" | "PATRON";
  email: string;
  iat?: number;
  exp?: number;
};

export function verifyJwtToken(token: string): AuthPayload | null {
  try {
    const secret = process.env.JWT_SECRET || "dev_secret";
    return jwt.verify(token, secret) as AuthPayload;
  } catch {
    return null;
  }
}

export function getAuthFromCookies(): AuthPayload | null {
  const cookieStore = cookies();
  const token = cookieStore.get("auth")?.value;
  if (!token) return null;
  return verifyJwtToken(token);
}
