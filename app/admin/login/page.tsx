"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

export default function AdminLoginPage() {
  const router = useRouter();
  const { adminLogin, isAuthenticated, user } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === "admin" || user.role === "super-admin") {
        router.push("/dashboard");
      }
    }
  }, [isAuthenticated, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await adminLogin(email, password);
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Invalid credentials or insufficient permissions");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-[#1a0a12] to-[#2d1a24] flex items-center justify-center px-4 font-nunito">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2">
            <span className="text-4xl">🌸</span>
            <span className="font-playfair text-2xl font-extrabold text-[#f48fb1]">KineDeo</span>
            <span className="font-playfair text-2xl font-normal text-[#f8bbd0]">Admin</span>
          </div>
          <p className="text-sm text-[#f8bbd0]/50 mt-2">Admin Panel Access</p>
        </div>

        {/* Card */}
        <div className="bg-[#2d1a24]/80 backdrop-blur-sm rounded-3xl border border-[#f48fb1]/20 p-8 shadow-2xl">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-2 h-2 rounded-full bg-[#e91e8c] animate-pulse"></div>
            <h2 className="text-lg font-bold text-white font-playfair">Admin Login</h2>
          </div>

          {error && (
            <div className="bg-red-900/30 border border-red-500/30 text-red-300 text-sm rounded-xl px-4 py-3 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#f8bbd0]/80 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@kinedeo.com"
                className="w-full px-4 py-2.5 rounded-xl border border-[#f48fb1]/20 bg-[#1a0a12]/50 text-sm text-white outline-none focus:border-[#e91e8c] focus:ring-2 focus:ring-[#e91e8c]/20 transition-all placeholder:text-[#f8bbd0]/30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#f8bbd0]/80 mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-2.5 rounded-xl border border-[#f48fb1]/20 bg-[#1a0a12]/50 text-sm text-white outline-none focus:border-[#e91e8c] focus:ring-2 focus:ring-[#e91e8c]/20 transition-all placeholder:text-[#f8bbd0]/30"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-linear-to-r from-[#e91e8c] to-[#c2185b] text-white py-3 rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-[#e91e8c]/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? "Authenticating..." : "Login to Dashboard"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-[#f48fb1]/10 text-center">
            <Link href="/login" className="text-xs text-[#f8bbd0]/40 hover:text-[#f48fb1] transition-colors">
              ← Back to Customer Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
