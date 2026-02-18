export default function Footer() {
  return (
    <footer className="border-t border-border px-10 py-10 flex justify-between items-center text-xs text-text-dim max-md:flex-col max-md:gap-4 max-md:text-center">
      <div className="text-base font-bold tracking-tight flex items-center gap-2">
        <div className="w-[22px] h-[22px] bg-gradient-to-br from-green to-accent rounded-md flex items-center justify-center text-[11px] font-bold">
          P
        </div>
        PnLab
      </div>
      <div className="flex gap-6">
        <a
          href="#"
          className="text-text-muted no-underline hover:text-text transition-colors"
        >
          Twitter
        </a>
        <a
          href="#"
          className="text-text-muted no-underline hover:text-text transition-colors"
        >
          Discord
        </a>
        <a
          href="#"
          className="text-text-muted no-underline hover:text-text transition-colors"
        >
          Blog
        </a>
        <a
          href="#"
          className="text-text-muted no-underline hover:text-text transition-colors"
        >
          Privacy
        </a>
      </div>
      <div>&copy; 2026 PnLab. All rights reserved.</div>
    </footer>
  );
}
