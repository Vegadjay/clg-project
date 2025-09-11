"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    if (email === "admin@library.com" && password === "admin123") {
      localStorage.setItem("userRole", "admin");
      localStorage.setItem("userEmail", email);
      router.push("/admin/dashboard");
    } else if (email === "librarian@library.com" && password === "lib123") {
      localStorage.setItem("userRole", "librarian");
      localStorage.setItem("userEmail", email);
      router.push("/librarian/dashboard");
    } else if (email === "prince@gmail.com" && password === "prince123") {
      localStorage.setItem("userRole", "patron");
      localStorage.setItem("userEmail", email);
      router.push("/patron/dashboard");
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-lg shadow border border-zinc-200">
      <h1 className="text-3xl font-bold mb-6 text-zinc-900 text-center">
        Login to Library System
      </h1>
      <form onSubmit={handleLogin} className="space-y-6" noValidate>
        <input
          className="w-full px-4 py-2 border border-zinc-300 rounded-md bg-white text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-500"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="w-full px-4 py-2 border border-zinc-300 rounded-md bg-white text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-500"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && (
          <p className="text-red-600 text-sm">
            {error}
          </p>
        )}
        <button
          type="submit"
          className="w-full py-2 bg-zinc-900 text-zinc-50 font-semibold rounded-md hover:bg-zinc-800 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
}