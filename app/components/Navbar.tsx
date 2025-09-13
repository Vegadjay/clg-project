"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAlert } from "@/components/ui/custom-alert";
import { motion, AnimatePresence } from "motion/react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);
  const { showAlert, AlertComponent } = useAlert();

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
    ...(role === "PATRON"
      ? [{ href: "/request-book", label: "My Requests" }]
      : []),
    ...(role === "LIBRARIAN" || role === "ADMIN"
      ? [{ href: "/librarian/requests", label: "Manage Requests" }]
      : []),
    { href: "/login", label: getLoginLabel() },
  ];

  // Fix: Use router.refresh() after logout to update UI, and clear cookies if needed
  const handleLogout = async () => {
    if (loggingOut) return;
    showAlert({
      title: "Logout",
      description: "Are you sure you want to logout?",
      type: "warning",
      showCancel: true,
      confirmText: "Yes, Logout",
      cancelText: "Cancel",
      onConfirm: () => submitLogout(),
    });
  };

  const submitLogout = async () => {
    try {
      setLoggingOut(true);
      const resp = await fetch("/api/users/logout", {
        method: "POST",
        credentials: "include",
      });
      // Remove cookies client-side for immediate effect (if any)
      if (typeof document !== "undefined") {
        document.cookie = "auth=; Max-Age=0; path=/";
        document.cookie = "role=; Max-Age=0; path=/";
      }
      setRole(null);
      setMenuOpen(false);
      // Use router.refresh() to update the UI and re-fetch server components if needed
      router.push("/");
      router.refresh();
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <>
      <AlertComponent />
      <nav className="bg-white/90 backdrop-blur-md supports-[backdrop-filter]:bg-white/80 shadow-soft sticky top-0 z-50 border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="relative">
              <Link
                href="/"
                className="text-2xl font-bold text-foreground hover:text-primary transition-colors duration-200"
              >
                KitabGhar
              </Link>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              {links.map(({ href, label }) => (
                <div key={href}>
                  <Link
                    href={href}
                    className={`text-foreground/80 hover:text-primary font-medium transition-colors duration-200 px-3 py-2 rounded-lg ${
                      pathname === href
                        ? "text-primary bg-primary/10"
                        : "hover:bg-muted/50"
                    }`}
                  >
                    {label}
                  </Link>
                </div>
              ))}
              {role && (
                <div className="relative">
                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="text-foreground/80 hover:text-destructive font-medium transition-colors duration-200 border border-border rounded-lg px-4 py-2 hover:bg-destructive/10 hover:border-destructive/20"
                  >
                    {loggingOut ? "Logging out..." : "Logout"}
                  </button>
                </div>
              )}
            </div>

            <div className="md:hidden">
              <button
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-lg text-foreground/80 hover:text-primary hover:bg-muted/50 transition-colors duration-200"
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

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              className="md:hidden bg-white/95 backdrop-blur-md shadow-strong border-t border-border/50"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="px-4 pt-2 pb-3 space-y-1">
                {links.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors duration-200 ${
                      pathname === href
                        ? "text-primary bg-primary/10"
                        : "text-foreground/80 hover:text-primary hover:bg-muted/50"
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
                    className="block w-full text-left px-4 py-3 rounded-lg text-base font-medium text-foreground/80 hover:text-destructive hover:bg-destructive/10 transition-colors duration-200 border border-border/50 mt-2"
                  >
                    {loggingOut ? "Logging out..." : "Logout"}
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}
