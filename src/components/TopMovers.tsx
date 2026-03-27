"use client";

import { useMemo } from "react";
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
    <div className="rounded-xl border border-border bg-surface flex flex-col">
      <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-border">
        <span className="text-[11px] text-muted">Top movers</span>
        <span className="text-[11px] text-dim">by volume</span>
      </div>

      <div className="px-3 sm:px-4 py-1">
        <div className="grid grid-cols-[1fr_auto_auto_auto] gap-x-4 text-[10px] text-dim uppercase tracking-wider px-1 py-2 border-b border-border-subtle">
          <span>Token</span>
          <span className="text-right">Vol</span>
          <span className="text-right">Txs</span>
          <span className="text-right w-16">B / S</span>
        </div>

        {movers.map((m, i) => {
          const buyRatio = m.trades > 0 ? m.buys / m.trades : 0;
          return (
            <div
              key={m.mint}
              className="grid grid-cols-[1fr_auto_auto_auto] gap-x-4 items-center px-1 py-2.5 border-b border-border-subtle text-xs"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-dim text-[10px] font-mono w-4 shrink-0">
                  {i + 1}
                </span>
                <span className="text-foreground font-medium truncate">
                  ${m.symbol}
                </span>
                <span className="text-dim text-[10px] font-mono hidden sm:inline">
                  {shortenAddress(m.mint)}
                </span>
              </div>
              <span className="font-mono text-muted tabular-nums text-right">
                {formatNumber(m.volume)}
              </span>
              <span className="font-mono text-dim tabular-nums text-right">
                {m.trades}
              </span>
              <div className="flex items-center gap-1.5 justify-end w-16">
                <span className="text-accent text-[10px] font-mono tabular-nums">
                  {m.buys}
                </span>
                <div className="w-6 h-1 bg-negative/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent rounded-full transition-all"
                    style={{ width: `${buyRatio * 100}%` }}
                  />
                </div>
                <span className="text-negative text-[10px] font-mono tabular-nums">
                  {m.sells}
                </span>
              </div>
            </div>
          );
        })}

        {movers.length === 0 && (
          <div className="flex items-center justify-center py-10 text-dim text-xs">
            Collecting data...
          </div>
        )}
      </div>
    </div>
  );
}
