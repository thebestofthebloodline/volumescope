"use client";

import { motion } from "framer-motion";
import { Activity, Zap, Coins, DollarSign } from "lucide-react";
import { formatUSD } from "@/lib/utils";
import type { VolumeLevel } from "@/lib/types";

interface StatsBarProps {
  volume24h: number;
  tradesPerMin: number;
  tokensPerHour: number;
  solPrice: number;
  volumeLevel: VolumeLevel;
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="card rounded-lg px-4 py-3 flex-1 min-w-[160px]">
      <div className="flex items-center gap-2 mb-1">
        <Icon size={12} className="text-green/50" />
        <span className="text-[10px] uppercase tracking-[0.15em] text-foreground/40">
          {label}
        </span>
      </div>
      <motion.p
        key={value}
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 1 }}
        className="text-xl sm:text-2xl font-bold text-green"
      >
        {value}
      </motion.p>
      {sub && <p className="text-[10px] text-foreground/30 mt-0.5">{sub}</p>}
    </div>
  );
}

export function StatsBar({ volume24h, tradesPerMin, tokensPerHour, solPrice, volumeLevel }: StatsBarProps) {
  const levelLabel: Record<VolumeLevel, string> = {
    dead: "DEAD",
    low: "LOW",
    medium: "ACTIVE",
    high: "HIGH",
    extreme: "EXTREME",
  };

  const levelColor: Record<VolumeLevel, string> = {
    dead: "text-foreground/30",
    low: "text-green-dark",
    medium: "text-green-dim",
    high: "text-green",
    extreme: "text-cyan",
  };

  return (
    <div className="flex flex-wrap gap-3">
      <StatCard
        icon={Activity}
        label="Volume 24H"
        value={formatUSD(volume24h)}
      />
      <StatCard
        icon={Zap}
        label="Trades/Min"
        value={String(tradesPerMin)}
        sub={`Market: ${levelLabel[volumeLevel]}`}
      />
      <StatCard
        icon={Coins}
        label="New Tokens/H"
        value={String(tokensPerHour)}
      />
      <StatCard
        icon={DollarSign}
        label="SOL Price"
        value={`$${solPrice.toFixed(2)}`}
      />
      <div className="card rounded-lg px-4 py-3 min-w-[160px] flex flex-col items-center justify-center">
        <span className="text-[10px] uppercase tracking-[0.15em] text-foreground/40 mb-1">
          Market Pulse
        </span>
        <span className={`text-xl font-bold uppercase tracking-wider ${levelColor[volumeLevel]}`}>
          {levelLabel[volumeLevel]}
        </span>
      </div>
    </div>
  );
}
