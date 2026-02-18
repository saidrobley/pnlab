"use client";

import { useState, useEffect, useCallback } from "react";
import { createBrowserClient } from "@/lib/supabase";

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WaitlistModal({ isOpen, onClose }: WaitlistModalProps) {
  const [email, setEmail] = useState("");
  const [trades, setTrades] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [waitlistPosition, setWaitlistPosition] = useState(0);

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose]
  );

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  async function handleSubmit() {
    if (!email) return;

    console.log("[waitlist] submitting:", { email, trades });
    console.log("[waitlist] SUPABASE_URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log("[waitlist] ANON_KEY (first 20):", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.slice(0, 20));

    try {
      const supabase = createBrowserClient();
      console.log("[waitlist] client created");

      const { error } = await supabase
        .from("waitlist")
        .insert({ email, trades });

      console.log("[waitlist] insert result:", { error });

      if (error) {
        console.error("[waitlist] insert error:", error.message, error.code, error.details, error.hint);
      }

      const { count, error: countError } = await supabase
        .from("waitlist")
        .select("*", { count: "exact", head: true });

      console.log("[waitlist] count result:", { count, countError });

      setWaitlistPosition(count ?? 0);
    } catch (e) {
      console.error("[waitlist] exception:", e);
      setWaitlistPosition(0);
    }
    setSubmitted(true);
  }

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-[rgba(0,0,0,0.7)] backdrop-blur-[8px] z-[200] flex items-center justify-center"
      onClick={handleOverlayClick}
    >
      <div className="bg-bg-card border border-border rounded-2xl p-10 max-w-[420px] w-[90%] text-center">
        {submitted ? (
          <>
            <div className="text-5xl mb-4">&check;</div>
            <h3 className="font-serif text-[28px] mb-2">You&apos;re in!</h3>
            <p className="text-text-muted text-[13px] mt-2 font-light">
              We&apos;ll email you when PnLab is ready.
              {waitlistPosition > 0 && (
                <>
                  <br />
                  <span className="text-green">
                    Position #{waitlistPosition} on the waitlist
                  </span>
                </>
              )}
            </p>
          </>
        ) : (
          <>
            <h3 className="font-serif text-[28px] mb-2">Join the waitlist</h3>
            <p className="text-[13px] text-text-muted mb-6 font-light">
              Be the first to know when PnLab launches. Early access users get
              Pro free for 3 months.
            </p>
            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-bg border border-border rounded-lg text-text font-mono text-[13px] mb-3 outline-none transition-colors focus:border-accent"
            />
            <input
              type="text"
              placeholder="What do you trade? (crypto, stocks, forex...)"
              value={trades}
              onChange={(e) => setTrades(e.target.value)}
              className="w-full px-4 py-3 bg-bg border border-border rounded-lg text-text font-mono text-[13px] mb-3 outline-none transition-colors focus:border-accent"
            />
            <button
              className="w-full bg-text text-bg border-none py-3.5 rounded-lg font-mono text-sm font-semibold cursor-pointer transition-all hover:-translate-y-px hover:shadow-[0_4px_20px_rgba(255,255,255,0.15)]"
              onClick={handleSubmit}
            >
              Get Early Access
            </button>
          </>
        )}
      </div>
    </div>
  );
}
