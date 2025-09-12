"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";

interface UserForm {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  role: "PATRON" | "LIBRARIAN";
}

export default function Register() {
  const [form, setForm] = useState<UserForm>({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    role: "PATRON",
  });
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [otp, setOtp] = useState<string>("");
  const router = useRouter();

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value } as any);
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const resp = await fetch("/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await resp.json();
      if (!resp.ok) {
        setError(data?.error || "Registration failed");
        return;
      }
      setUserId(data.userId);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    setError("");
    setLoading(true);
    try {
      const resp = await fetch("/api/users/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, code: otp }),
      });
      const data = await resp.json();
      if (!resp.ok) {
        setError(data?.error || "Verification failed");
        return;
      }
      router.push("/login");
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    try {
      await fetch("/api/users/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email }),
      });
    } catch {}
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-lg shadow border border-zinc-200">
      <h1 className="text-3xl font-bold mb-6 text-zinc-900 text-center">
        Register
      </h1>
      {!userId ? (
        <form onSubmit={handleRegister} className="space-y-4" noValidate>
          <input
            className="w-full px-4 py-2 border border-zinc-300 text-zinc-900 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-500"
            type="text"
            name="name"
            placeholder="Full name"
            value={form.name}
            onChange={handleInputChange}
            required
          />
          <input
            className="w-full px-4 py-2 border border-zinc-300 text-zinc-900 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-500"
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleInputChange}
            required
          />
          <input
            className="w-full px-4 py-2 border border-zinc-300 text-zinc-900 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-500"
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleInputChange}
            required
          />
          <input
            className="w-full px-4 py-2 border border-zinc-300 text-zinc-900 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-500"
            type="tel"
            name="phone"
            placeholder="Phone number"
            value={form.phone}
            onChange={handleInputChange}
          />
          <input
            className="w-full px-4 py-2 border border-zinc-300 text-zinc-900 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-500"
            type="text"
            name="address"
            placeholder="Address"
            value={form.address}
            onChange={handleInputChange}
          />
          <select
            name="role"
            value={form.role}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-zinc-300 rounded-md bg-white text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-500"
          >
            <option value="PATRON">Patron</option>
            <option value="LIBRARIAN">Librarian</option>
          </select>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-zinc-900 text-zinc-50 font-semibold rounded-md hover:bg-zinc-800 transition disabled:opacity-70"
          >
            {loading ? "Submitting..." : "Register"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerify} className="space-y-4">
          <p className="text-sm text-zinc-600">
            Enter the 6-digit OTP sent to{" "}
            <span className="font-medium">{form.email}</span>.
          </p>
          <input
            className="w-full px-4 py-2 border border-zinc-300 text-zinc-900 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-500"
            maxLength={6}
            pattern="\\d{6}"
            inputMode="numeric"
            name="otp"
            placeholder="OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 bg-zinc-900 text-zinc-50 font-semibold rounded-md hover:bg-zinc-800 transition disabled:opacity-70"
            >
              {loading ? "Verifying..." : "Verify"}
            </button>
            <button
              type="button"
              onClick={resendOtp}
              className="px-4 py-2 border border-zinc-300 rounded-md"
            >
              Resend OTP
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
