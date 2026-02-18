const stats = [
  {
    value: (
      <>
        <span className="text-green">15</span>+
      </>
    ),
    label: "Exchanges supported",
  },
  {
    value: (
      <>
        2.4<span className="text-green">M</span>
      </>
    ),
    label: "Trades analyzed",
  },
  {
    value: (
      <>
        <span className="text-green">$</span>847
        <span className="text-green">K</span>
      </>
    ),
    label: "Avg. edge found per user/yr",
  },
  {
    value: (
      <>
        &lt;3<span className="text-green">s</span>
      </>
    ),
    label: "Sync time",
  },
];

export default function StatsBar() {
  return (
    <div className="px-10 py-[60px] border-t border-b border-border">
      <div className="max-w-[1200px] mx-auto flex justify-between items-center max-md:flex-col max-md:gap-8">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="font-serif text-5xl font-normal tracking-tight">
              {stat.value}
            </div>
            <div className="text-xs text-text-dim mt-1">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
