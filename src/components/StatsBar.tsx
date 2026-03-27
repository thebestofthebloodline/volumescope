"use client";

import { formatUSD } from "@/lib/utils";
import type { VolumeLevel } from "@/lib/types";

interface StatsBarProps {
  volume24h: number;
  tradesPerMin: number;
  tokensPerHour: number;
  solPrice: number;
  volumeLevel: VolumeLevel;
}

function Stat({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="flex flex-col gap-1 min-w-0">
      <span className="text-[11px] text-muted truncate">{label}</span>
      <span className="text-lg sm:text-xl font-semibold font-mono tabular-nums text-foreground truncate">
        {value}
      </span>
      {sub && <span className="text-[11px] text-dim truncate">{sub}</span>}
    </div>
  );
}

export function StatsBar({
  volume24h,
  tradesPerMin,
  tokensPerHour,
  solPrice,
  volumeLevel,
}: StatsBarProps) {
  const levelLabel: Record<VolumeLevel, string> = {
    dead: "Quiet",
    low: "Low",
    medium: "Active",
    high: "High",
    extreme: "Extreme",
  };

  const levelColor: Record<VolumeLevel, string> = {
    dead: "text-dim",
    low: "text-muted",
    medium: "text-foreground",
    high: "text-accent",
    extreme: "text-accent",
  };

  return (
    <div className="rounded-xl border border-border bg-surface p-4 sm:p-5">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
        <Stat label="Volume (24h)" value={formatUSD(volume24h)} />
        <Stat label="Trades / min" value={String(tradesPerMin)} />
        <Stat label="New tokens / hr" value={String(tokensPerHour)} />
        <Stat label="SOL" value={`$${solPrice.toFixed(2)}`} />
        <div className="flex flex-col gap-1">
          <span className="text-[11px] text-muted">Market pulse</span>
          <span
            className={`text-lg sm:text-xl font-semibold ${levelColor[volumeLevel]}`}
          >
            {levelLabel[volumeLevel]}
          </span>
        </div>
      </div>
    </div>
  );
}
