"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const [role, setRole] = useState<string | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchMe = async () => {
      try {
        const resp = await fetch("/api/users?me=true", {
          credentials: "include",
        });
        if (!resp.ok) {
          if (isMounted) setRole(null);
          return;
        }
        const data = await resp.json();
        if (isMounted) setRole(data?.user?.role || null);
      } catch {
        if (isMounted) setRole(null);
      }
    };
    fetchMe();
    return () => {
      isMounted = false;
    };
  }, []);

  const getLoginLabel = () => {
    if (!role) return "Login";
    if (role === "ADMIN") return "Admin Dashboard";
    if (role === "LIBRARIAN") return "Librarian Panel";
    if (role === "PATRON") return "My Account";
    return "Login";
  };

  const links = [
    { href: "/", label: "Home" },
    { href: "/books", label: "Books" },
    { href: "/login", label: getLoginLabel() },
  ];

  const handleLogout = async () => {
    if (loggingOut) return;
    const confirmed = window.confirm("Are you sure you want to logout?");
    if (!confirmed) return;
    try {
      setLoggingOut(true);
      const resp = await fetch("/api/users?action=logout", {
        method: "POST",
        credentials: "include",
      });
      if (resp.ok) {
        try {
          // Clean up any legacy/local session data
          localStorage.removeItem("role");
          localStorage.removeItem("userRole");
          localStorage.removeItem("users");
          localStorage.removeItem("userEmail");
          localStorage.removeItem("books");
        } catch {}
        setRole(null);
        setMenuOpen(false);
        // Optionally reload to refresh server components that depend on cookies
        window.location.href = "/";
      }
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <nav className="bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-md sticky top-0 z-50 border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="text-2xl font-bold text-zinc-900">
            KitabGhar
          </Link>
          <div className="hidden md:flex items-center space-x-6">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`text-zinc-700 hover:text-zinc-900 font-medium transition-colors duration-200 ${
                  pathname === href
                    ? "text-zinc-900 border-b-2 border-zinc-900"
                    : ""
                }`}
              >
                {label}
              </Link>
            ))}
            {role && (
              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="text-zinc-700 hover:text-red-700 font-medium transition-colors duration-200 border border-zinc-300 rounded-md px-3 py-1"
              >
                {loggingOut ? "Logging out..." : "Logout"}
              </button>
            )}
          </div>
          <div className="md:hidden">
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-zinc-700 hover:text-zinc-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-zinc-500"
              aria-expanded={menuOpen}
              aria-label="Toggle menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {menuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white shadow-inner border-t border-zinc-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium text-zinc-700 hover:text-zinc-900 transition-colors duration-200 ${
                  pathname === href ? "bg-zinc-100 text-zinc-900" : ""
                }`}
              >
                {label}
              </Link>
            ))}
            {role && (
              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-zinc-700 hover:text-red-700 transition-colors duration-200 border border-zinc-200"
              >
                {loggingOut ? "Logging out..." : "Logout"}
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
