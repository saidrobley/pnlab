export default function TerminalPreview() {
  return (
    <div className="mt-20 w-full max-w-[900px] mx-auto px-10 animate-[fadeUp_0.8s_ease-out_0.5s_both] max-md:px-5">
      <div className="bg-bg-card border border-border rounded-2xl overflow-hidden shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_20px_60px_rgba(0,0,0,0.5),0_0_120px_rgba(167,139,250,0.05)]">
        <div className="px-5 py-4 border-b border-border flex items-center gap-2.5">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#facc15]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e]" />
          </div>
          <span className="text-xs text-text-dim ml-2">
            pnlab — weekly recap
          </span>
        </div>
        <div className="p-6 text-[13px] leading-8">
          <div className="flex justify-between py-1 opacity-0 animate-terminal-1">
            <span className="text-text-dim">Period</span>
            <span className="text-text font-medium">
              Feb 10 — Feb 17, 2026
            </span>
          </div>
          <div className="flex justify-between py-1 opacity-0 animate-terminal-2">
            <span className="text-text-dim">Total Trades</span>
            <span className="text-text font-medium">47</span>
          </div>
          <div className="flex justify-between py-1 opacity-0 animate-terminal-3">
            <span className="text-text-dim">Win Rate</span>
            <span className="text-green">68.1%</span>
          </div>
          <div className="flex justify-between py-1 opacity-0 animate-terminal-4">
            <span className="text-text-dim">Net P&amp;L</span>
            <span className="text-green">+$1,247.33</span>
          </div>
          <div className="flex justify-between py-1 opacity-0 animate-terminal-5">
            <span className="text-text-dim">Best Trade</span>
            <span className="text-green">BTC Long &rarr; +$312.00</span>
          </div>
          <div className="flex justify-between py-1 opacity-0 animate-terminal-6">
            <span className="text-text-dim">Worst Trade</span>
            <span className="text-red">SOL Short &rarr; -$89.50</span>
          </div>
          <hr className="border-0 border-t border-border my-3 opacity-0 animate-terminal-divider" />
          <div className="flex justify-between py-1 opacity-0 animate-terminal-7">
            <span className="text-text-dim">Win Rate by Hour</span>
            <span className="text-yellow">&#9888; 23% WR after midnight</span>
          </div>
          <div className="t-insight mt-3 px-4 py-3 bg-accent-dim border border-[rgba(167,139,250,0.2)] rounded-lg text-xs text-accent leading-[1.6] opacity-0 animate-terminal-insight">
            Your SOL short entries below $0.40 have a 34% win rate — half your
            overall average. Consider skipping SOL shorts or raising your entry
            threshold to $0.45+.
          </div>
        </div>
      </div>
    </div>
  );
}
