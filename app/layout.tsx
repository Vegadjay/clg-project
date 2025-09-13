import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Library Management System",
  description:
    "A modern, comprehensive library management system with multi-role support, advanced search, and beautiful interface.",
  keywords: [
    "library",
    "books",
    "management",
    "system",
    "borrowing",
    "catalog",
  ],
  authors: [{ name: "Library System Team" }],
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#fafafa",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} antialiased bg-background text-foreground`}
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}
