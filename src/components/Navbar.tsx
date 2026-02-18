"use client";

interface NavbarProps {
  onOpenModal: () => void;
}

export default function Navbar({ onOpenModal }: NavbarProps) {
  return (
    <nav className="fixed top-0 w-full z-[100] px-10 py-5 flex justify-between items-center bg-[rgba(10,10,11,0.8)] backdrop-blur-[20px] border-b border-border max-md:px-5 max-md:py-4">
      <div className="text-xl font-bold tracking-tight flex items-center gap-2">
        <div className="w-7 h-7 bg-gradient-to-br from-green to-accent rounded-md flex items-center justify-center text-sm font-bold">
          P
        </div>
        PnLab
      </div>
      <div className="flex gap-8 items-center">
        <a
          href="#features"
          className="text-text-muted text-[13px] no-underline transition-colors hover:text-text max-md:hidden"
        >
          Features
        </a>
        <a
          href="#pricing"
          className="text-text-muted text-[13px] no-underline transition-colors hover:text-text max-md:hidden"
        >
          Pricing
        </a>
        <a
          href="#how"
          className="text-text-muted text-[13px] no-underline transition-colors hover:text-text max-md:hidden"
        >
          How It Works
        </a>
        <a
          href="/login"
          className="text-text-muted text-[13px] no-underline transition-colors hover:text-text max-md:hidden"
        >
          Log In
        </a>
        <a
          href="/signup"
          className="border border-border px-4 py-1.5 rounded-lg text-text-muted text-[13px] no-underline transition-colors hover:text-text hover:border-text-muted max-md:hidden"
        >
          Sign Up
        </a>
        <button
          className="bg-text text-bg border-none px-6 py-2.5 rounded-lg font-mono text-[13px] font-semibold cursor-pointer transition-all hover:-translate-y-px hover:shadow-[0_4px_20px_rgba(255,255,255,0.15)]"
          onClick={onOpenModal}
        >
          Join Waitlist
        </button>
      </div>
    </nav>
  );
}
