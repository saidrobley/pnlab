"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createBrowserClient } from "@/lib/supabase";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createBrowserClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push(redirectTo);
    router.refresh();
  }

  return (
    <div className="bg-bg-card border border-border rounded-2xl p-10 max-w-[420px] w-[90%] text-center relative z-10">
      {/* Logo */}
      <div className="flex items-center justify-center gap-2 mb-8">
        <div className="w-7 h-7 bg-gradient-to-br from-green to-accent rounded-md flex items-center justify-center text-sm font-bold">
          P
        </div>
        <span className="text-xl font-bold tracking-tight">PnLab</span>
      </div>

      <h3 className="font-serif text-[28px] mb-2">Welcome back</h3>
      <p className="text-[13px] text-text-muted mb-6 font-light">
        Sign in to your account
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
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
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
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <p className="text-text-muted text-[13px] mt-6 font-light">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="text-accent no-underline hover:underline"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center relative">
      {/* Grid background */}
      <div className="fixed inset-0 pointer-events-none bg-[linear-gradient(rgba(167,139,250,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(167,139,250,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
