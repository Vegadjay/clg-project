"use client";
import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";

const ROLES = [
  { value: "ADMIN", label: "Admin" },
  { value: "LIBRARIAN", label: "Librarian" },
  { value: "PATRON", label: "Patron" },
];

export default function Login() {
  const [role, setRole] = useState<string>("LIBRARIAN");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user is already authenticated
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    const userData = localStorage.getItem("user");

    if (isAuthenticated === "true" && userData) {
      const user = JSON.parse(userData);
      // Redirect to appropriate dashboard based on role
      if (user.role === "ADMIN") {
        router.push("/admin/dashboard");
      } else if (user.role === "LIBRARIAN") {
        router.push("/librarian/dashboard");
      } else if (user.role === "PATRON") {
        router.push("/patron/dashboard");
      }
    }
  }, [router]);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const resp = await fetch("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          role: role.toUpperCase(),
        }),
      });
      const data = await resp.json();
      if (!resp.ok) {
        setError(data?.error || "Login failed");
        return;
      }

      window.location.reload();

      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("isAuthenticated", "true");
      }

      if (role === "ADMIN") {
        router.push("/admin/dashboard");
      } else if (role === "LIBRARIAN") {
        router.push("/librarian/dashboard");
      } else if (role === "PATRON") {
        router.push("/patron/dashboard");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-gradient-to-br from-zinc-50 to-zinc-200 rounded-2xl shadow-2xl border border-zinc-200">
      <div className="flex flex-col items-center mb-6">
        <div className="bg-zinc-900 text-white rounded-full p-4 mb-2 shadow-lg">
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-extrabold mb-1 text-zinc-900 text-center tracking-tight">
          Welcome Back
        </h1>
        <p className="text-zinc-600 text-center text-sm">
          Please login to your Library System account
        </p>
      </div>
      <form onSubmit={handleLogin} className="space-y-5" noValidate>
        <div>
          <label
            htmlFor="role"
            className="block text-zinc-700 font-medium mb-1"
          >
            Select Role
          </label>
          <div className="flex items-center space-x-2">
            <select
              id="role"
              className="w-full px-4 py-2 border border-zinc-300 rounded-md bg-white text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-500"
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
              }}
              required
            >
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-zinc-700 font-medium mb-1"
          >
            Email
          </label>
          <input
            id="email"
            className="w-full px-4 py-2 border border-zinc-300 rounded-md bg-white text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-500"
            type="email"
            placeholder="Enter your email"
            value={email}
            autoComplete="username"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-zinc-700 font-medium mb-1"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              className="w-full px-4 py-2 border border-zinc-300 rounded-md bg-white text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-500 pr-10"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700"
              tabIndex={-1}
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-9-7s4-7 9-7c1.657 0 3.216.41 4.575 1.125M19.07 4.93l-14.14 14.14M9.88 9.88A3 3 0 0112 9c1.657 0 3 1.343 3 3 0 .512-.13.995-.36 1.41"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm7 0c0 3-4 7-10 7S2 15 2 12s4-7 10-7 10 4 10 7z"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
        {error && <p className="text-red-600 text-sm text-center">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-zinc-900 text-zinc-50 font-semibold rounded-md hover:bg-zinc-800 transition text-lg shadow disabled:opacity-70"
        >
          {loading ? "Signing in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
