"use client";

interface PricingProps {
  onOpenModal: () => void;
}

export default function Pricing({ onOpenModal }: PricingProps) {
  return (
    <section className="px-10 py-[120px] max-w-[900px] mx-auto max-md:px-5 max-md:py-20" id="pricing">
      <div className="text-[11px] font-semibold tracking-[2px] uppercase text-accent mb-4">
        Pricing
      </div>
      <h2 className="font-serif text-[clamp(32px,5vw,56px)] font-normal tracking-tight mb-4 text-center">
        Simple pricing
      </h2>
      <p className="text-center text-text-muted text-sm mb-12 font-light">
        Start free. Upgrade when you&apos;re ready.
      </p>
      <div className="grid grid-cols-2 gap-5 max-md:grid-cols-1">
        {/* Free tier */}
        <div className="bg-bg-card border border-border rounded-2xl p-9">
          <div className="text-[13px] text-text-muted mb-2">Free</div>
          <div className="font-serif text-5xl mb-1">$0</div>
          <div className="text-xs text-text-dim mb-6">forever</div>
          <ul className="price-features list-none mb-8">
            <li className="text-[13px] text-text-muted py-2 border-b border-[rgba(39,39,42,0.5)] font-light">
              50 trades / month
            </li>
            <li className="text-[13px] text-text-muted py-2 border-b border-[rgba(39,39,42,0.5)] font-light">
              Manual entry + CSV import
            </li>
            <li className="text-[13px] text-text-muted py-2 border-b border-[rgba(39,39,42,0.5)] font-light">
              Basic analytics
            </li>
            <li className="text-[13px] text-text-muted py-2 border-b border-[rgba(39,39,42,0.5)] font-light">
              Equity curve
            </li>
            <li className="text-[13px] text-text-muted py-2 border-b border-[rgba(39,39,42,0.5)] font-light">
              1 exchange connection
            </li>
          </ul>
          <button
            className="w-full text-center bg-transparent text-text border border-border px-6 py-2.5 rounded-lg font-mono text-[13px] font-medium cursor-pointer transition-all hover:border-text-muted hover:bg-bg-elevated"
            onClick={onOpenModal}
          >
            Get Started
          </button>
        </div>

        {/* Pro tier */}
        <div className="price-card-featured bg-bg-card border border-accent rounded-2xl p-9 relative">
          <div className="text-[13px] text-text-muted mb-2">Pro</div>
          <div className="font-serif text-5xl mb-1">
            $12<span className="text-base text-text-dim font-mono">/mo</span>
          </div>
          <div className="text-xs text-text-dim mb-6">
            billed monthly &middot; cancel anytime
          </div>
          <ul className="price-features list-none mb-8">
            <li className="text-[13px] text-text-muted py-2 border-b border-[rgba(39,39,42,0.5)] font-light">
              Unlimited trades
            </li>
            <li className="text-[13px] text-text-muted py-2 border-b border-[rgba(39,39,42,0.5)] font-light">
              Unlimited exchange connections
            </li>
            <li className="text-[13px] text-text-muted py-2 border-b border-[rgba(39,39,42,0.5)] font-light">
              AI weekly insights
            </li>
            <li className="text-[13px] text-text-muted py-2 border-b border-[rgba(39,39,42,0.5)] font-light">
              Advanced analytics &amp; filters
            </li>
            <li className="text-[13px] text-text-muted py-2 border-b border-[rgba(39,39,42,0.5)] font-light">
              Webhook API for bots
            </li>
            <li className="text-[13px] text-text-muted py-2 border-b border-[rgba(39,39,42,0.5)] font-light">
              Export reports
            </li>
          </ul>
          <button
            className="w-full text-center bg-text text-bg border-none px-6 py-2.5 rounded-lg font-mono text-[13px] font-semibold cursor-pointer transition-all hover:-translate-y-px hover:shadow-[0_4px_20px_rgba(255,255,255,0.15)]"
            onClick={onOpenModal}
          >
            Join Waitlist
          </button>
        </div>
      </div>
    </section>
  );
}
