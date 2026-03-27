"use client";

import { formatCompactUSD, formatDelta } from "@/lib/utils";
import { AnimatedNumber } from "./AnimatedNumber";
import type { VolumeLevel, PlatformStats, TimeRange } from "@/lib/types";
import { Activity, Zap, Coins, TrendingUp, BarChart3 } from "lucide-react";

interface StatsBarProps {
  volume: number;
  volumeChange: number;
  tradesPerMin: number;
  tokensPerHour: number;
  solPrice: number;
  volumeLevel: VolumeLevel;
  timeRange: TimeRange;
}

function StatCard({
  label,
  icon: Icon,
  iconColor,
  children,
}: {
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  iconColor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="glass-card p-3.5 sm:p-4 flex items-start gap-3">
      <div
        className="flex items-center justify-center w-9 h-9 rounded-lg shrink-0"
        style={{ backgroundColor: iconColor + "15", color: iconColor }}
      >
        <Icon size={16} />
      </div>
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="text-[10px] text-muted uppercase tracking-wider">{label}</span>
        {children}
      </div>
    </div>
  );
}

export function StatsBar({
  volume,
  volumeChange,
  tradesPerMin,
  tokensPerHour,
  solPrice,
  volumeLevel,
  timeRange,
}: StatsBarProps) {
  const levelLabel: Record<VolumeLevel, string> = {
    dead: "Quiet",
    low: "Low",
    medium: "Active",
    high: "High",
    extreme: "Extreme",
  };

  const levelColor: Record<VolumeLevel, string> = {
    dead: "var(--dim)",
    low: "var(--muted)",
    medium: "var(--foreground)",
    high: "var(--accent)",
    extreme: "var(--accent)",
  };

  const changeColor = volumeChange >= 0 ? "text-accent" : "text-negative";
  const rangeLabel = timeRange === "24h" ? "24h" : timeRange;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      <StatCard label={`Volume (${rangeLabel})`} icon={BarChart3} iconColor="oklch(0.72 0.19 160)">
        <AnimatedNumber
          value={volume}
          format={formatCompactUSD}
          className="text-lg font-semibold font-mono tabular-nums text-foreground"
        />
        {volumeChange !== 0 && (
          <span className={`text-[11px] font-mono ${changeColor}`}>
            {formatDelta(volumeChange)}
          </span>
        )}
      </StatCard>

      <StatCard label="Trades / min" icon={Activity} iconColor="oklch(0.62 0.19 270)">
        <AnimatedNumber
          value={tradesPerMin}
          format={(n) => Math.round(n).toString()}
          className="text-lg font-semibold font-mono tabular-nums text-foreground"
        />
      </StatCard>

      <StatCard label="New tokens / hr" icon={Coins} iconColor="oklch(0.72 0.17 60)">
        <AnimatedNumber
          value={tokensPerHour}
          format={(n) => Math.round(n).toString()}
          className="text-lg font-semibold font-mono tabular-nums text-foreground"
        />
      </StatCard>

      <StatCard label="SOL" icon={TrendingUp} iconColor="oklch(0.65 0.15 300)">
        <AnimatedNumber
          value={solPrice}
          format={(n) => "$" + n.toFixed(2)}
          className="text-lg font-semibold font-mono tabular-nums text-foreground"
        />
      </StatCard>

      <StatCard label="Market pulse" icon={Zap} iconColor={levelColor[volumeLevel]}>
        <span
          className="text-lg font-semibold"
          style={{ color: levelColor[volumeLevel] }}
        >
          {levelLabel[volumeLevel]}
        </span>
      </StatCard>
    </div>
  );
}
