const steps = [
  {
    number: "01",
    title: "Connect Your Exchange",
    description:
      "Link your exchange with a read-only API key, upload a CSV, or log trades manually. Takes under 60 seconds.",
  },
  {
    number: "02",
    title: "Trade Like Normal",
    description:
      "PnLab runs in the background, syncing every trade and building a complete picture of your performance.",
  },
  {
    number: "03",
    title: "Get Smarter Weekly",
    description:
      "Every week, PnLab surfaces the patterns, blind spots, and edges hiding in your data. Act on them or ignore them \u2014 your call.",
  },
];

export default function HowItWorks() {
  return (
    <section className="px-10 py-[120px] max-w-[1200px] mx-auto max-md:px-5 max-md:py-20" id="how">
      <div className="text-[11px] font-semibold tracking-[2px] uppercase text-accent mb-4">
        How It Works
      </div>
      <h2 className="font-serif text-[clamp(32px,5vw,56px)] font-normal tracking-tight mb-16 leading-[1.15]">
        Three steps to finding your edge
      </h2>
      <div className="grid grid-cols-3 gap-10 max-md:grid-cols-1 max-md:gap-8">
        {steps.map((step) => (
          <div key={step.number} className="relative">
            <div className="step-number font-serif text-[72px] text-bg-elevated leading-none mb-4">
              {step.number}
            </div>
            <h3 className="text-base font-semibold mb-2.5">{step.title}</h3>
            <p className="text-[13px] text-text-muted leading-[1.7] font-light">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
