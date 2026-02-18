"use client";

import { useState } from "react";
import Link from "next/link";
import { createBrowserClient } from "@/lib/supabase";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createBrowserClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSubmitted(true);
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center relative">
      {/* Grid background */}
      <div className="fixed inset-0 pointer-events-none bg-[linear-gradient(rgba(167,139,250,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(167,139,250,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="bg-bg-card border border-border rounded-2xl p-10 max-w-[420px] w-[90%] text-center relative z-10">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-7 h-7 bg-gradient-to-br from-green to-accent rounded-md flex items-center justify-center text-sm font-bold">
            P
          </div>
          <span className="text-xl font-bold tracking-tight">PnLab</span>
        </div>

        {submitted ? (
          <>
            <div className="text-5xl mb-4">&check;</div>
            <h3 className="font-serif text-[28px] mb-2">Check your email</h3>
            <p className="text-text-muted text-[13px] mt-2 font-light">
              We sent a confirmation link to{" "}
              <span className="text-accent">{email}</span>.
              <br />
              Click it to activate your account.
            </p>
            <p className="text-text-muted text-[13px] mt-6 font-light">
              Already confirmed?{" "}
              <Link
                href="/login"
                className="text-accent no-underline hover:underline"
              >
                Sign in
              </Link>
            </p>
          </>
        ) : (
          <>
            <h3 className="font-serif text-[28px] mb-2">Create an account</h3>
            <p className="text-[13px] text-text-muted mb-6 font-light">
              Start tracking your trades with PnLab
            </p>

            <form onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-bg border border-border rounded-lg text-text font-mono text-[13px] mb-3 outline-none transition-colors focus:border-accent"
              />
              <input
                type="password"
                placeholder="Password (min 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 bg-bg border border-border rounded-lg text-text font-mono text-[13px] mb-3 outline-none transition-colors focus:border-accent"
              />

              {error && (
                <p className="text-red text-[13px] mb-3 font-light">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-text text-bg border-none py-3.5 rounded-lg font-mono text-sm font-semibold cursor-pointer transition-all hover:-translate-y-px hover:shadow-[0_4px_20px_rgba(255,255,255,0.15)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {loading ? "Creating account..." : "Sign Up"}
              </button>
            </form>

            <p className="text-text-muted text-[13px] mt-6 font-light">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-accent no-underline hover:underline"
              >
                Sign in
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
