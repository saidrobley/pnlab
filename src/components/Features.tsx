const features = [
  {
    icon: "\uD83D\uDCCA",
    title: "Smart Analytics",
    description:
      "Win rate by symbol, time of day, strategy, and entry price. See where you're bleeding and where you're printing.",
  },
  {
    icon: "\uD83D\uDD0C",
    title: "Exchange Sync",
    description:
      "Connect Binance, Bybit, Polymarket, and more with read-only API keys. Trades import automatically.",
  },
  {
    icon: "\uD83E\uDDE0",
    title: "AI Insights",
    description:
      'Weekly reports that find patterns you\'d miss. "You lose 80% of trades after 2am" \u2014 that kind of thing.',
  },
  {
    icon: "\uD83D\uDCC8",
    title: "Equity Curve",
    description:
      "Track your growth over time with beautiful, interactive charts. See drawdowns, peaks, and recovery periods.",
  },
  {
    icon: "\uD83D\uDCE5",
    title: "CSV Import",
    description:
      "Upload trade history from any exchange. Works with any CSV format \u2014 we'll auto-detect the columns.",
  },
  {
    icon: "\uD83C\uDFF7\uFE0F",
    title: "Strategy Tags",
    description:
      "Tag trades by strategy, setup, or thesis. Compare performance across different approaches.",
  },
];

export default function Features() {
  return (
    <section className="px-10 py-[120px] max-w-[1200px] mx-auto max-md:px-5 max-md:py-20" id="features">
      <div className="text-[11px] font-semibold tracking-[2px] uppercase text-accent mb-4">
        Features
      </div>
      <h2 className="font-serif text-[clamp(32px,5vw,56px)] font-normal tracking-tight mb-16 max-w-[600px] leading-[1.15]">
        Everything a trader needs. Nothing you don&apos;t.
      </h2>
      <div className="grid grid-cols-3 gap-5 max-md:grid-cols-1">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="feature-card bg-bg-card border border-border rounded-2xl p-8 transition-all duration-300 relative overflow-hidden hover:border-[rgba(167,139,250,0.3)] hover:-translate-y-0.5"
          >
            <span className="text-[28px] mb-5 block">{feature.icon}</span>
            <h3 className="text-[15px] font-semibold mb-2.5 tracking-tight">
              {feature.title}
            </h3>
            <p className="text-[13px] text-text-muted leading-[1.7] font-light">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
