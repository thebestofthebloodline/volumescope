import type { TimeRange, Trade, PlatformStats } from "./types";

export function formatNumber(n: number): string {
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(2) + "B";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(2) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toFixed(0);
}

export function formatUSD(n: number): string {
  return "$" + formatNumber(n);
}

export function formatCompactUSD(n: number): string {
  if (n >= 1_000_000_000) return "$" + (n / 1_000_000_000).toFixed(1) + "B";
  if (n >= 1_000_000) return "$" + (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return "$" + (n / 1_000).toFixed(1) + "K";
  return "$" + n.toFixed(0);
}

export function formatDelta(pct: number): string {
  const sign = pct >= 0 ? "+" : "";
  return sign + pct.toFixed(1) + "%";
}

export function shortenAddress(addr: string): string {
  if (!addr || addr.length < 8) return addr;
  return addr.slice(0, 4) + "..." + addr.slice(-4);
}

export function getTimeRangeMs(range: TimeRange): number {
  const map: Record<TimeRange, number> = {
    "5m": 5 * 60_000,
    "30m": 30 * 60_000,
    "1h": 60 * 60_000,
    "4h": 4 * 60 * 60_000,
    "24h": 24 * 60 * 60_000,
    "2d": 2 * 24 * 60 * 60_000,
    "1w": 7 * 24 * 60 * 60_000,
  };
  return map[range];
}

export function filterTradesByRange(trades: Trade[], range: TimeRange): Trade[] {
  const cutoff = Date.now() - getTimeRangeMs(range);
  return trades.filter((t) => t.timestamp >= cutoff);
}

export function getVolumeForRange(stats: PlatformStats | null, range: TimeRange): number {
  if (!stats) return 0;
  switch (range) {
    case "5m":
    case "30m":
    case "1h":
    case "4h":
      // Sub-24h ranges use live trade data, not DefiLlama
      return 0;
    case "24h":
      return stats.combined24h;
    case "2d":
      // Approximate: 24h * 2
      return stats.combined24h * 2;
    case "1w":
      return stats.combined7d;
  }
}

export function getNextMondayEST(): Date {
  const now = new Date();
  const est = new Date(
    now.toLocaleString("en-US", { timeZone: "America/New_York" })
  );

  const currentDay = est.getDay();
  const currentHour = est.getHours();

  let daysUntilMonday: number;

  if (currentDay === 1 && currentHour < 10) {
    daysUntilMonday = 0;
  } else if (currentDay === 1 && currentHour >= 10 && currentHour < 13) {
    return new Date(0);
  } else {
    daysUntilMonday = ((8 - currentDay) % 7) || 7;
  }

  const target = new Date(est);
  target.setDate(est.getDate() + daysUntilMonday);
  target.setHours(10, 0, 0, 0);

  const estOffset = getESTOffset(target);
  const utcTarget = new Date(target.getTime() + estOffset * 60 * 60 * 1000);

  return utcTarget;
}

function getESTOffset(date: Date): number {
  const jan = new Date(date.getFullYear(), 0, 1);
  const jul = new Date(date.getFullYear(), 6, 1);
  const stdOffset = Math.max(
    jan.getTimezoneOffset(),
    jul.getTimezoneOffset()
  );
  const isDST = date.getTimezoneOffset() < stdOffset;
  return isDST ? 4 : 5;
}

export function isLiveNow(): boolean {
  const now = new Date();
  const est = new Date(
    now.toLocaleString("en-US", { timeZone: "America/New_York" })
  );
  return est.getDay() === 1 && est.getHours() >= 10 && est.getHours() < 13;
}

export function getLiveEndTime(): Date {
  const now = new Date();
  const est = new Date(
    now.toLocaleString("en-US", { timeZone: "America/New_York" })
  );
  est.setHours(13, 0, 0, 0);

  const estOffset = getESTOffset(est);
  return new Date(est.getTime() + estOffset * 60 * 60 * 1000);
}

export function getTimeRemaining(target: Date): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
} {
  const total = target.getTime() - Date.now();
  if (total <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };

  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));

  return { days, hours, minutes, seconds, total };
}
