"use client";

import { useMemo } from "react";
import { TrendingUp } from "lucide-react";
import { shortenAddress, formatNumber } from "@/lib/utils";
import type { Trade } from "@/lib/types";

interface TopMoversProps {
  trades: Trade[];
}

interface TokenAgg {
  mint: string;
  symbol: string;
  volume: number;
  trades: number;
  buys: number;
  sells: number;
}

export function TopMovers({ trades }: TopMoversProps) {
  const movers = useMemo(() => {
    const map = new Map<string, TokenAgg>();

    for (const t of trades) {
      const existing = map.get(t.mint);
      if (existing) {
        existing.volume += t.sol_amount;
        existing.trades += 1;
        if (t.is_buy) existing.buys += 1;
        else existing.sells += 1;
        if (t.symbol && existing.symbol === "???") {
          existing.symbol = t.symbol;
        }
      } else {
        map.set(t.mint, {
          mint: t.mint,
          symbol: t.symbol || "???",
          volume: t.sol_amount,
          trades: 1,
          buys: t.is_buy ? 1 : 0,
          sells: t.is_buy ? 0 : 1,
        });
      }
    }

    return Array.from(map.values())
      .sort((a, b) => b.volume - a.volume)
      .slice(0, 8);
  }, [trades]);

  return (
    <div className="card rounded-lg flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-green/10">
        <div className="flex items-center gap-2">
          <TrendingUp size={12} className="text-green/50" />
          <span className="text-[10px] uppercase tracking-[0.15em] text-foreground/40">
            Top Movers
          </span>
        </div>
        <span className="text-[10px] text-green/40">BY VOLUME</span>
      </div>

      <div className="px-3 py-2">
        <div className="grid grid-cols-[1fr_auto_auto_auto] gap-x-3 gap-y-0 text-[10px] text-foreground/30 uppercase tracking-wider px-1 py-1.5 border-b border-white/[0.03]">
          <span>Token</span>
          <span className="text-right">Volume</span>
          <span className="text-right">Trades</span>
          <span className="text-right">B/S</span>
        </div>

        {movers.map((m, i) => {
          const buyRatio = m.trades > 0 ? m.buys / m.trades : 0;
          return (
            <div
              key={m.mint}
              className="grid grid-cols-[1fr_auto_auto_auto] gap-x-3 items-center px-1 py-2 border-b border-white/[0.02] text-xs"
            >
              <div className="flex items-center gap-2">
                <span className="text-foreground/20 text-[10px] w-4">{i + 1}</span>
                <span className="text-green font-bold truncate">
                  ${m.symbol}
                </span>
                <span className="text-foreground/15 text-[10px] hidden sm:inline">
                  {shortenAddress(m.mint)}
                </span>
              </div>
              <span className="text-foreground/60 tabular-nums text-right">
                {formatNumber(m.volume)} SOL
              </span>
              <span className="text-foreground/40 tabular-nums text-right">
                {m.trades}
              </span>
              <div className="flex items-center gap-1 justify-end">
                <span className="text-green text-[10px] tabular-nums">{m.buys}</span>
                <div className="w-8 h-1.5 bg-red/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green rounded-full"
                    style={{ width: `${buyRatio * 100}%` }}
                  />
                </div>
                <span className="text-red text-[10px] tabular-nums">{m.sells}</span>
              </div>
            </div>
          );
        })}

        {movers.length === 0 && (
          <div className="flex items-center justify-center py-8 text-foreground/20 text-xs">
            Collecting data...
          </div>
        )}
      </div>
    </div>
  );
}
