"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@/lib/supabase";

interface HeroProps {
  onOpenModal: () => void;
}

export default function Hero({ onOpenModal }: HeroProps) {
  const [waitlistCount, setWaitlistCount] = useState<number | null>(null);

  useEffect(() => {
    const supabase = createBrowserClient();
    supabase
      .from("waitlist")
      .select("*", { count: "exact", head: true })
      .then(({ count }) => {
        setWaitlistCount(count ?? 0);
      });
  }, []);
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-10 pt-[120px] pb-20 relative max-md:px-5 max-md:pt-[100px] max-md:pb-[60px]">
      <div className="absolute w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(167,139,250,0.08),transparent_70%)] top-[10%] left-1/2 -translate-x-1/2 pointer-events-none" />
      <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-border rounded-full text-xs text-text-muted mb-8 animate-fadeUp">
        <span className="w-1.5 h-1.5 bg-green rounded-full animate-pulse" />
        Currently in private beta
      </div>
      <h1 className="font-serif text-[clamp(48px,8vw,96px)] font-normal text-center leading-[1.05] tracking-tight mb-6 animate-[fadeUp_0.8s_ease-out_0.1s_both]">
        Find your
        <br />
        trading{" "}
        <em className="italic bg-gradient-to-br from-green to-accent bg-clip-text text-transparent">
          edge
        </em>
      </h1>
      <p className="text-base text-text-muted text-center max-w-[480px] leading-[1.7] mb-12 font-light animate-[fadeUp_0.8s_ease-out_0.2s_both]">
        Log every trade. Analyze your performance. Understand what&apos;s actually
        working.
      </p>
      <div className="flex gap-4 animate-[fadeUp_0.8s_ease-out_0.3s_both]">
        <button
          className="bg-text text-bg border-none px-6 py-2.5 rounded-lg font-mono text-[13px] font-semibold cursor-pointer transition-all hover:-translate-y-px hover:shadow-[0_4px_20px_rgba(255,255,255,0.15)]"
          onClick={onOpenModal}
        >
          Join the Waitlist
        </button>
        <a
          href="#how"
          className="text-text-muted text-[13px] font-medium no-underline transition-colors hover:text-text"
        >
          See How It Works &darr;
        </a>
      </div>
      {waitlistCount !== null && waitlistCount >= 10 && (
        <p className="text-text-muted text-[13px] font-light mt-5 animate-[fadeUp_0.8s_ease-out_0.3s_both]">
          Join {waitlistCount}+ traders on the waitlist
        </p>
      )}
    </section>
  );
}
