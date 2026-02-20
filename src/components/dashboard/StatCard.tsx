interface StatCardProps {
  label: string;
  value: string;
  colored?: boolean;
  suffix?: React.ReactNode;
}

export default function StatCard({ label, value, colored, suffix }: StatCardProps) {
  let colorClass = "text-text";
  if (colored) {
    const num = parseFloat(value.replace(/[^-\d.]/g, ""));
    if (!isNaN(num)) {
      colorClass = num > 0 ? "text-green" : num < 0 ? "text-red" : "text-text";
    }
  }

  return (
    <div className="bg-bg-card border border-border rounded-2xl p-4 md:p-5">
      <div className="text-[11px] text-text-muted font-medium uppercase tracking-wider mb-2 flex items-center gap-2">
        {label}
        {suffix}
      </div>
      <div className={`text-2xl font-semibold tracking-tight ${colorClass}`}>
        {value}
      </div>
    </div>
  );
}
