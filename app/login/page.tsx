"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

type LoginMode = "phone" | "email";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";
  const { phoneLogin, login, isAuthenticated, user } = useAuth();

  const [mode, setMode] = useState<LoginMode>("phone");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Phone fields
  const [phone, setPhone] = useState("");

  // Email fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === "admin" || user.role === "super-admin") {
        router.push("/dashboard");
      } else {
        router.push(redirectTo);
      }
    }
  }, [isAuthenticated, user, router, redirectTo]);

  const handlePhoneLogin = async () => {
    if (phone.length !== 11) {
      setError("Please enter a valid 11-digit phone number");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await phoneLogin(phone);
      router.push(redirectTo);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await login(email, password);
      router.push(redirectTo);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fff0f5] flex items-center justify-center px-4 font-nunito">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="text-4xl">🌸</span>
            <span className="font-playfair text-2xl font-extrabold text-[#e91e8c]">Kine</span>
            <span className="font-playfair text-2xl font-normal text-[#ad1457]">Deo</span>
          </Link>
          <p className="text-sm text-[#6d1b3b]/60 mt-2">Welcome back! Login to continue shopping.</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl border border-pink-100 p-8 shadow-sm">
          {/* Mode toggle */}
          <div className="flex bg-pink-50 rounded-xl p-1 mb-6">
            <button
              onClick={() => { setMode("phone"); setError(""); }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                mode === "phone"
                  ? "bg-white text-[#e91e8c] shadow-sm"
                  : "text-[#6d1b3b]/60 hover:text-[#6d1b3b]"
              }`}
            >
              📱 Phone
            </button>
            <button
              onClick={() => { setMode("email"); setError(""); }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                mode === "email"
                  ? "bg-white text-[#e91e8c] shadow-sm"
                  : "text-[#6d1b3b]/60 hover:text-[#6d1b3b]"
              }`}
            >
              ✉️ Email
            </button>
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-4">
              {error}
            </div>
          )}

          {/* Phone Login Flow */}
          {mode === "phone" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#2d1a24] mb-1.5">
                  Phone Number
                </label>
                <div className="flex items-center gap-2">
                  <span className="bg-pink-50 border border-pink-200 rounded-xl px-3 py-2.5 text-sm text-[#6d1b3b] font-medium">
                    +880
                  </span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 11))}
                    placeholder="Enter 11-digit number"
                    className="flex-1 px-4 py-2.5 rounded-xl border border-pink-200 text-sm text-[#2d1a24] outline-none focus:border-[#e91e8c] focus:ring-2 focus:ring-[#e91e8c]/10 transition-all placeholder:text-[#ad1457]/30"
                    maxLength={11}
                  />
                </div>
              </div>
              <button
                onClick={handlePhoneLogin}
                disabled={loading || phone.length !== 11}
                className="w-full bg-linear-to-r from-[#e91e8c] to-[#c2185b] text-white py-3 rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-pink-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Logging in..." : "Login with Phone"}
              </button>
            </div>
          )}

          {/* Email Login Flow */}
          {mode === "email" && (
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#2d1a24] mb-1.5">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-pink-200 text-sm text-[#2d1a24] outline-none focus:border-[#e91e8c] focus:ring-2 focus:ring-[#e91e8c]/10 transition-all placeholder:text-[#ad1457]/30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2d1a24] mb-1.5">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-2.5 rounded-xl border border-pink-200 text-sm text-[#2d1a24] outline-none focus:border-[#e91e8c] focus:ring-2 focus:ring-[#e91e8c]/10 transition-all placeholder:text-[#ad1457]/30"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-linear-to-r from-[#e91e8c] to-[#c2185b] text-white py-3 rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-pink-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
          )}

          {/* Divider */}
          <div className="mt-6 pt-6 border-t border-pink-100 text-center">
            <p className="text-sm text-[#6d1b3b]/50">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-[#e91e8c] font-semibold hover:underline">
                Register
              </Link>
            </p>
          </div>
        </div>

        {/* Admin link */}
        <div className="text-center mt-4">
          <Link href="/admin/login" className="text-xs text-[#6d1b3b]/40 hover:text-[#ad1457] transition-colors">
            Admin Login →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#fff0f5]" />}>
      <LoginForm />
    </Suspense>
  );
}
