"use client";

import { useState, useEffect } from "react";
import { createBrowserClient } from "@/lib/supabase";

interface NavbarProps {
  onOpenModal: () => void;
}

export default function Navbar({ onOpenModal }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const supabase = createBrowserClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      setLoggedIn(!!session);
    });
  }, []);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [menuOpen]);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <>
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
          {loggedIn ? (
            <a
              href="/dashboard"
              className="bg-text text-bg border-none px-6 py-2.5 rounded-lg font-mono text-[13px] font-semibold no-underline transition-all hover:-translate-y-px hover:shadow-[0_4px_20px_rgba(255,255,255,0.15)] max-md:hidden"
            >
              Go to Dashboard
            </a>
          ) : (
            <>
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
                className="bg-text text-bg border-none px-6 py-2.5 rounded-lg font-mono text-[13px] font-semibold cursor-pointer transition-all hover:-translate-y-px hover:shadow-[0_4px_20px_rgba(255,255,255,0.15)] max-md:hidden"
                onClick={onOpenModal}
              >
                Join Waitlist
              </button>
            </>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 -mr-2 text-text-muted hover:text-text transition-colors bg-transparent border-none cursor-pointer"
            aria-label="Open menu"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M3 5h14M3 10h14M3 15h14" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile drawer overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-[99]" onClick={closeMenu}>
          {/* Backdrop */}
          <div className="absolute inset-0 bg-[rgba(0,0,0,0.6)]" />

          {/* Slide-down panel */}
          <div
            className="absolute top-[73px] left-0 w-full bg-bg border-b border-border p-5 flex flex-col gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            <a
              href="#features"
              onClick={closeMenu}
              className="text-text-muted text-[14px] no-underline transition-colors hover:text-text py-2"
            >
              Features
            </a>
            <a
              href="#pricing"
              onClick={closeMenu}
              className="text-text-muted text-[14px] no-underline transition-colors hover:text-text py-2"
            >
              Pricing
            </a>
            <a
              href="#how"
              onClick={closeMenu}
              className="text-text-muted text-[14px] no-underline transition-colors hover:text-text py-2"
            >
              How It Works
            </a>

            <hr className="border-border my-1" />

            {loggedIn ? (
              <a
                href="/dashboard"
                onClick={closeMenu}
                className="block w-full text-center bg-text text-bg border-none px-6 py-2.5 rounded-lg font-mono text-[13px] font-semibold no-underline transition-all hover:-translate-y-px hover:shadow-[0_4px_20px_rgba(255,255,255,0.15)]"
              >
                Go to Dashboard
              </a>
            ) : (
              <>
                <a
                  href="/login"
                  onClick={closeMenu}
                  className="block w-full text-center border border-border px-4 py-2.5 rounded-lg text-text-muted text-[13px] no-underline transition-colors hover:text-text hover:border-text-muted"
                >
                  Log In
                </a>
                <a
                  href="/signup"
                  onClick={closeMenu}
                  className="block w-full text-center border border-border px-4 py-2.5 rounded-lg text-text-muted text-[13px] no-underline transition-colors hover:text-text hover:border-text-muted"
                >
                  Sign Up
                </a>
                <button
                  className="w-full bg-text text-bg border-none px-6 py-2.5 rounded-lg font-mono text-[13px] font-semibold cursor-pointer transition-all hover:-translate-y-px hover:shadow-[0_4px_20px_rgba(255,255,255,0.15)]"
                  onClick={() => {
                    onOpenModal();
                    closeMenu();
                  }}
                >
                  Join Waitlist
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
