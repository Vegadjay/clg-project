"use client";

import { useState } from "react";

interface FormState {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  role: "ADMIN" | "LIBRARIAN" | "PATRON";
}

const initialState: FormState = {
  name: "",
  email: "",
  password: "",
  phone: "",
  address: "",
  role: "PATRON",
};

export function AddNewUser() {
  const [form, setForm] = useState<FormState>(initialState);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Basic validation
    if (!form.name || !form.email || !form.password) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data?.error || "Failed to register user.");
      } else {
        setSuccess("User registered successfully!");
        setForm(initialState);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 bg-white border border-zinc-200 rounded-lg shadow p-8">
      <h2 className="text-2xl font-bold mb-6 text-zinc-900 text-center">
        Register New User
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label
            className="block text-zinc-700 mb-1 font-medium"
            htmlFor="name"
          >
            Name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            className="w-full border border-zinc-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-400"
            required
          />
        </div>
        {/* Email */}
        <div>
          <label
            className="block text-zinc-700 mb-1 font-medium"
            htmlFor="email"
          >
            Email <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border border-zinc-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-400"
            required
          />
        </div>
        {/* Password */}
        <div>
          <label
            className="block text-zinc-700 mb-1 font-medium"
            htmlFor="password"
          >
            Password <span className="text-red-500">*</span>
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            className="w-full border border-zinc-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-400"
            required
          />
        </div>
        {/* Phone */}
        <div>
          <label
            className="block text-zinc-700 mb-1 font-medium"
            htmlFor="phone"
          >
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            className="w-full border border-zinc-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-400"
            placeholder="Optional"
          />
        </div>
        {/* Address */}
        <div>
          <label
            className="block text-zinc-700 mb-1 font-medium"
            htmlFor="address"
          >
            Address
          </label>
          <input
            id="address"
            name="address"
            type="text"
            value={form.address}
            onChange={handleChange}
            className="w-full border border-zinc-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-400"
            placeholder="Optional"
          />
        </div>
        {/* Role */}
        <div>
          <label
            className="block text-zinc-700 mb-1 font-medium"
            htmlFor="role"
          >
            Role
          </label>
          <select
            id="role"
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full border border-zinc-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-400"
          >
            <option value="PATRON">Patron</option>
            <option value="LIBRARIAN">Librarian</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>
        {/* Feedback */}
        {error && (
          <div className="text-red-600 text-sm text-center">{error}</div>
        )}
        {success && (
          <div className="text-green-600 text-sm text-center">{success}</div>
        )}
        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-zinc-900 text-white py-2 rounded font-semibold hover:bg-zinc-800 transition disabled:opacity-60"
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}
