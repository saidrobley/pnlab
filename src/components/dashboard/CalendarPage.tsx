"use client";

import { useEffect, useState, useMemo } from "react";
import { createBrowserClient } from "@/lib/supabase";
import { Trade } from "@/lib/types";
import StatCard from "./StatCard";

type ViewMode = "daily" | "weekly" | "monthly" | "quarterly" | "yearly";

const VIEW_MODES: { value: ViewMode; label: string }[] = [
  { value: "daily", label: "DAILY" },
  { value: "weekly", label: "WEEKLY" },
  { value: "monthly", label: "MONTHLY" },
  { value: "quarterly", label: "QUARTERLY" },
  { value: "yearly", label: "YEARLY" },
];

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const MONTH_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAY_NAMES = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const QUARTER_LABELS = [
  { label: "Q1", range: "Jan – Mar" },
  { label: "Q2", range: "Apr – Jun" },
  { label: "Q3", range: "Jul – Sep" },
  { label: "Q4", range: "Oct – Dec" },
];
const QUARTER_MONTHS = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [9, 10, 11]];

// ── Types ─────────────────────────────────────────────────────────

interface DayData {
  pnl: number;
  count: number;
}

// ── Formatting ────────────────────────────────────────────────────

function formatPnl(value: number): string {
  const abs = Math.abs(value);
  const sign = value >= 0 ? "+" : "-";
  if (abs >= 1000) return `${sign}$${(abs / 1000).toFixed(2)}k`;
  return `${sign}$${abs.toFixed(2)}`;
}

function formatPnlCompact(value: number): string {
  const abs = Math.abs(value);
  const sign = value >= 0 ? "+" : "-";
  if (abs >= 1000) return `${sign}$${(abs / 1000).toFixed(1)}k`;
  return `${sign}$${abs.toFixed(0)}`;
}

function formatPnlStat(value: number): string {
  const abs = Math.abs(value);
  const sign = value >= 0 ? "+$" : "-$";
  if (abs >= 1000) return `${sign}${(abs / 1000).toFixed(2)}k`;
  return `${sign}${abs.toFixed(2)}`;
}

// ── Color helpers ─────────────────────────────────────────────────

function cellBg(pnl: number, maxAbs: number): string {
  if (maxAbs === 0) return "";
  const ratio = Math.min(Math.abs(pnl) / maxAbs, 1);
  const alpha = (0.05 + ratio * 0.2).toFixed(3);
  return pnl > 0 ? `rgba(34,197,94,${alpha})` : `rgba(239,68,68,${alpha})`;
}

function borderCls(pnl: number): string {
  return pnl > 0 ? "border-l-2 border-l-green" : "border-l-2 border-l-red";
}

// ── Data helpers ──────────────────────────────────────────────────

function dateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function groupByDay(trades: Trade[]): Map<string, DayData> {
  const map = new Map<string, DayData>();
  for (const t of trades) {
    if (!t.closed_at || t.pnl === null) continue;
    const key = dateKey(new Date(t.closed_at));
    const d = map.get(key) || { pnl: 0, count: 0 };
    d.pnl += t.pnl;
    d.count += 1;
    map.set(key, d);
  }
  return map;
}

function getMonthData(byDay: Map<string, DayData>, year: number, month: number): DayData {
  const result = { pnl: 0, count: 0 };
  const days = new Date(year, month + 1, 0).getDate();
  for (let d = 1; d <= days; d++) {
    const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    const data = byDay.get(key);
    if (data) {
      result.pnl += data.pnl;
      result.count += data.count;
    }
  }
  return result;
}

function maxAbsOf(items: { pnl: number; count: number }[]): number {
  return Math.max(...items.filter((i) => i.count > 0).map((i) => Math.abs(i.pnl)), 0);
}

// ── Main Component ────────────────────────────────────────────────

export default function CalendarPage() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("daily");
  const [viewMonth, setViewMonth] = useState(new Date().getMonth());
  const [viewYear, setViewYear] = useState(new Date().getFullYear());

  useEffect(() => {
    async function fetchTrades() {
      const supabase = createBrowserClient();
      const { data } = await supabase
        .from("trades")
        .select("*")
        .is("deleted_at", null)
        .not("pnl", "is", null)
        .order("closed_at", { ascending: true });
      setTrades((data as Trade[]) || []);
      setLoading(false);
    }
    fetchTrades();
  }, []);

  const byDay = useMemo(() => groupByDay(trades), [trades]);

  function navigatePrev() {
    if (viewMode === "daily") {
      if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1); }
      else setViewMonth(viewMonth - 1);
    } else {
      setViewYear(viewYear - 1);
    }
  }

  function navigateNext() {
    if (viewMode === "daily") {
      if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1); }
      else setViewMonth(viewMonth + 1);
    } else {
      setViewYear(viewYear + 1);
    }
  }

  const monthStats = useMemo(() => {
    const data = getMonthData(byDay, viewYear, viewMonth);
    let winDays = 0;
    let tradingDays = 0;
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    for (let d = 1; d <= daysInMonth; d++) {
      const key = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      const dd = byDay.get(key);
      if (dd && dd.count > 0) {
        tradingDays++;
        if (dd.pnl > 0) winDays++;
      }
    }
    const winRate = tradingDays > 0 ? Math.round((winDays / tradingDays) * 100) : 0;
    return { ...data, winDays, tradingDays, winRate };
  }, [byDay, viewYear, viewMonth]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-text-muted text-[13px] font-light">Loading...</p>
      </div>
    );
  }

  const navLabel = viewMode === "daily"
    ? `${MONTH_NAMES[viewMonth]} ${viewYear}`
    : String(viewYear);

  return (
    <div>
      <h1 className="font-serif text-2xl md:text-3xl mb-1">Calendar P&L</h1>
      <p className="text-text-muted text-[13px] font-light mb-6 md:mb-8">
        Performance across every timeframe
      </p>

      {viewMode === "daily" && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 md:mb-8">
          <StatCard label="Month P&L" value={formatPnlStat(monthStats.pnl)} colored />
          <StatCard label="Total Trades" value={String(monthStats.count)} />
          <StatCard label="Win Days" value={`${monthStats.winDays}/${monthStats.tradingDays}`} colored />
          <StatCard label="Day Win Rate" value={`${monthStats.winRate}%`} colored />
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex gap-1 bg-bg-card border border-border rounded-lg p-1">
          {VIEW_MODES.map((vm) => (
            <button
              key={vm.value}
              onClick={() => setViewMode(vm.value)}
              className={`px-3 py-1.5 rounded-md font-mono text-[12px] font-medium transition-colors ${
                viewMode === vm.value
                  ? "bg-text text-bg"
                  : "text-text-muted hover:text-text"
              }`}
            >
              {vm.label}
            </button>
          ))}
        </div>

        {viewMode !== "yearly" && (
          <div className="flex items-center gap-4">
            <button
              onClick={navigatePrev}
              className="text-text-muted hover:text-text transition-colors text-xl leading-none"
            >
              ‹
            </button>
            <span className="font-serif text-lg min-w-[180px] text-center">
              {navLabel}
            </span>
            <button
              onClick={navigateNext}
              className="text-text-muted hover:text-text transition-colors text-xl leading-none"
            >
              ›
            </button>
          </div>
        )}
      </div>

      {viewMode === "daily" && <DailyGrid byDay={byDay} month={viewMonth} year={viewYear} />}
      {viewMode === "weekly" && <WeeklyGrid byDay={byDay} year={viewYear} />}
      {viewMode === "monthly" && <MonthlyGrid byDay={byDay} year={viewYear} />}
      {viewMode === "quarterly" && <QuarterlyGrid byDay={byDay} year={viewYear} />}
      {viewMode === "yearly" && <YearlyGrid byDay={byDay} trades={trades} />}

      {viewMode === "daily" && (
        <div className="flex items-center justify-center gap-6 mt-6 text-[12px] text-text-muted">
          {[
            { color: "rgba(239,68,68,0.25)", label: "Big loss" },
            { color: "rgba(239,68,68,0.1)", label: "Small loss" },
            { color: "rgba(128,128,128,0.15)", label: "No trades" },
            { color: "rgba(34,197,94,0.1)", label: "Small win" },
            { color: "rgba(34,197,94,0.25)", label: "Big win" },
          ].map((l) => (
            <div key={l.label} className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: l.color }} />
              <span>{l.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Daily Grid ────────────────────────────────────────────────────

function DailyGrid({
  byDay,
  month,
  year,
}: {
  byDay: Map<string, DayData>;
  month: number;
  year: number;
}) {
  const todayKey = dateKey(new Date());
  const firstDow = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: Array<{ day: number; key: string; data: DayData | null } | null> = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    cells.push({ day: d, key, data: byDay.get(key) || null });
  }
  while (cells.length % 7 !== 0) cells.push(null);

  const maxAbs = maxAbsOf(
    cells.filter((c): c is NonNullable<typeof c> => c !== null && c.data !== null).map((c) => c.data!)
  );

  return (
    <div>
      <div className="grid grid-cols-7 mb-px">
        {DAY_NAMES.map((d) => (
          <div key={d} className="text-center text-[11px] text-text-muted font-medium uppercase tracking-wider py-2">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-px">
        {cells.map((cell, i) => {
          if (cell === null) return <div key={i} className="bg-bg-card/30 rounded-lg min-h-[110px]" />;
          const { day, key, data } = cell;
          const isToday = key === todayKey;
          const has = data !== null && data.count > 0;
          return (
            <div
              key={i}
              className={`bg-bg-card rounded-lg min-h-[110px] p-2.5 flex flex-col ${has ? borderCls(data.pnl) : ""}`}
              style={has ? { backgroundColor: cellBg(data.pnl, maxAbs) } : {}}
            >
              <div className="flex items-center gap-1">
                <span className="text-[13px] text-text-muted font-light">{day}</span>
                {isToday && <span className="w-1.5 h-1.5 rounded-full bg-green" />}
              </div>
              {has ? (
                <>
                  <div className={`text-[15px] font-semibold mt-1 ${data.pnl >= 0 ? "text-green" : "text-red"}`}>
                    {formatPnl(data.pnl)}
                  </div>
                  <div className="text-[11px] text-text-muted font-light">
                    {data.count} trade{data.count !== 1 ? "s" : ""}
                  </div>
                </>
              ) : (
                <div className="text-[13px] text-text-dim mt-2">—</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Weekly Grid ───────────────────────────────────────────────────

function WeeklyGrid({ byDay, year }: { byDay: Map<string, DayData>; year: number }) {
  const weeks: { week: number; startDate: Date; data: DayData }[] = [];
  const yearEnd = new Date(year, 11, 31);
  const current = new Date(year, 0, 1);
  let weekNum = 1;

  while (current <= yearEnd) {
    const weekStart = new Date(current);
    const data: DayData = { pnl: 0, count: 0 };
    for (let i = 0; i < 7 && current <= yearEnd; i++) {
      const d = byDay.get(dateKey(current));
      if (d) { data.pnl += d.pnl; data.count += d.count; }
      current.setDate(current.getDate() + 1);
    }
    weeks.push({ week: weekNum, startDate: weekStart, data });
    weekNum++;
  }

  const maxAbs = maxAbsOf(weeks.map((w) => w.data));

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
      {weeks.map((w) => {
        const has = w.data.count > 0;
        return (
          <div
            key={w.week}
            className={`bg-bg-card rounded-lg p-3 min-h-[120px] flex flex-col ${has ? borderCls(w.data.pnl) : ""}`}
            style={has ? { backgroundColor: cellBg(w.data.pnl, maxAbs) } : {}}
          >
            <div className="text-[11px] text-text-muted font-light">
              Wk {w.week} · {year}
            </div>
            {has ? (
              <>
                <div className={`text-[16px] font-semibold mt-1.5 ${w.data.pnl >= 0 ? "text-green" : "text-red"}`}>
                  {formatPnl(w.data.pnl)}
                </div>
                <div className="text-[11px] text-text-muted font-light">
                  {w.data.count} trade{w.data.count !== 1 ? "s" : ""}
                </div>
              </>
            ) : (
              <div className="text-[13px] text-text-dim mt-2">—</div>
            )}
            <div className="text-[11px] text-text-dim font-light mt-auto pt-2">
              {MONTH_SHORT[w.startDate.getMonth()]} {w.startDate.getDate()}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Monthly Grid ──────────────────────────────────────────────────

function MonthlyGrid({ byDay, year }: { byDay: Map<string, DayData>; year: number }) {
  const months = Array.from({ length: 12 }, (_, m) => ({ month: m, ...getMonthData(byDay, year, m) }));
  const maxAbs = maxAbsOf(months);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {months.map((m) => {
        const has = m.count > 0;
        return (
          <div
            key={m.month}
            className={`bg-bg-card rounded-xl p-4 min-h-[110px] flex flex-col ${has ? borderCls(m.pnl) : ""}`}
            style={has ? { backgroundColor: cellBg(m.pnl, maxAbs) } : {}}
          >
            <div className="text-[13px] text-text-muted font-light">{MONTH_NAMES[m.month]}</div>
            {has ? (
              <>
                <div className={`text-[20px] font-semibold mt-2 ${m.pnl >= 0 ? "text-green" : "text-red"}`}>
                  {formatPnl(m.pnl)}
                </div>
                <div className="text-[12px] text-text-muted font-light mt-1">
                  {m.count} trade{m.count !== 1 ? "s" : ""}
                </div>
              </>
            ) : (
              <div className="text-[13px] text-text-dim mt-2">—</div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Quarterly Grid ────────────────────────────────────────────────

function QuarterlyGrid({ byDay, year }: { byDay: Map<string, DayData>; year: number }) {
  const quarters = QUARTER_MONTHS.map((mi, qi) => {
    const months = mi.map((m) => ({ month: m, ...getMonthData(byDay, year, m) }));
    const total = months.reduce((a, m) => ({ pnl: a.pnl + m.pnl, count: a.count + m.count }), { pnl: 0, count: 0 });
    return { qi, months, total };
  });
  const maxAbs = maxAbsOf(quarters.map((q) => q.total));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {quarters.map((q) => {
        const has = q.total.count > 0;
        const monthMaxAbs = maxAbsOf(q.months);
        return (
          <div
            key={q.qi}
            className={`bg-bg-card rounded-xl p-4 ${has ? borderCls(q.total.pnl) : ""}`}
            style={has ? { backgroundColor: cellBg(q.total.pnl, maxAbs) } : {}}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="text-[13px] text-text-muted font-light">
                  {QUARTER_LABELS[q.qi].label} · {year}
                </div>
                <div className="text-[11px] text-text-dim font-light">
                  {QUARTER_LABELS[q.qi].range}
                </div>
              </div>
              {has ? (
                <div className="text-right">
                  <div className={`text-[20px] font-semibold ${q.total.pnl >= 0 ? "text-green" : "text-red"}`}>
                    {formatPnl(q.total.pnl)}
                  </div>
                  <div className="text-[11px] text-text-muted font-light">
                    {q.total.count} trade{q.total.count !== 1 ? "s" : ""}
                  </div>
                </div>
              ) : (
                <div className="text-[13px] text-text-dim">—</div>
              )}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {q.months.map((m) => {
                const mHas = m.count > 0;
                return (
                  <div
                    key={m.month}
                    className={`bg-bg/50 rounded-lg p-2.5 ${mHas ? borderCls(m.pnl) : ""}`}
                    style={mHas ? { backgroundColor: cellBg(m.pnl, monthMaxAbs) } : {}}
                  >
                    <div className="text-[11px] text-text-muted font-light">{MONTH_NAMES[m.month]}</div>
                    {mHas ? (
                      <>
                        <div className={`text-[13px] font-semibold mt-1 ${m.pnl >= 0 ? "text-green" : "text-red"}`}>
                          {formatPnl(m.pnl)}
                        </div>
                        <div className="text-[11px] text-text-muted font-light">
                          {m.count} trade{m.count !== 1 ? "s" : ""}
                        </div>
                      </>
                    ) : (
                      <div className="text-[11px] text-text-dim mt-1">—</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Yearly Grid ───────────────────────────────────────────────────

function YearlyGrid({ byDay, trades }: { byDay: Map<string, DayData>; trades: Trade[] }) {
  const currentYear = new Date().getFullYear();
  let minYear = currentYear;
  for (const t of trades) {
    if (t.closed_at) {
      const y = new Date(t.closed_at).getFullYear();
      if (y < minYear) minYear = y;
    }
  }
  // Show at least from minYear-1 to currentYear
  const startYear = Math.min(minYear, currentYear - 1);
  const years: number[] = [];
  for (let y = startYear; y <= currentYear; y++) years.push(y);

  const yearData = years.map((y) => {
    const months = Array.from({ length: 12 }, (_, m) => ({ month: m, ...getMonthData(byDay, y, m) }));
    const total = months.reduce((a, m) => ({ pnl: a.pnl + m.pnl, count: a.count + m.count }), { pnl: 0, count: 0 });
    return { year: y, months, total };
  });

  const maxYearAbs = maxAbsOf(yearData.map((y) => y.total));

  return (
    <div className="space-y-4">
      {yearData.map((yd) => {
        const has = yd.total.count > 0;
        const monthMaxAbs = maxAbsOf(yd.months);
        return (
          <div
            key={yd.year}
            className={`bg-bg-card rounded-xl p-4 ${has ? borderCls(yd.total.pnl) : ""}`}
            style={has ? { backgroundColor: cellBg(yd.total.pnl, maxYearAbs) } : {}}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="text-[22px] font-serif">{yd.year}</div>
              {has ? (
                <div className="text-right">
                  <div className={`text-[22px] font-semibold ${yd.total.pnl >= 0 ? "text-green" : "text-red"}`}>
                    {formatPnl(yd.total.pnl)}
                  </div>
                  <div className="text-[11px] text-text-muted font-light">
                    {yd.total.count} total trade{yd.total.count !== 1 ? "s" : ""}
                  </div>
                </div>
              ) : (
                <div className="text-[13px] text-text-dim">—</div>
              )}
            </div>
            <div className="grid grid-cols-6 lg:grid-cols-12 gap-2">
              {yd.months.map((m) => {
                const mHas = m.count > 0;
                return (
                  <div
                    key={m.month}
                    className="bg-bg/50 rounded-lg p-2 text-center"
                    style={mHas ? { backgroundColor: cellBg(m.pnl, monthMaxAbs) } : {}}
                  >
                    <div className="text-[11px] text-text-muted font-light">{MONTH_SHORT[m.month]}</div>
                    <div
                      className={`text-[11px] font-medium mt-0.5 ${
                        mHas ? (m.pnl >= 0 ? "text-green" : "text-red") : "text-text-dim"
                      }`}
                    >
                      {mHas ? formatPnlCompact(m.pnl) : "—"}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
