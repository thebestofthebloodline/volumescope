"use client";

import { motion, AnimatePresence } from "framer-motion";
import { shortenAddress } from "@/lib/utils";
import type { Trade } from "@/lib/types";

interface LiveFeedProps {
  trades: Trade[];
}

export function LiveFeed({ trades }: LiveFeedProps) {
  const displayTrades = trades.slice(0, 50);

  return (
    <div className="glass-card flex flex-col h-[380px]">
      <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-border/40">
        <span className="text-[11px] text-muted uppercase tracking-wider">Live trades</span>
        <div className="flex items-center gap-1.5">
          <div className="h-1.5 w-1.5 rounded-full bg-accent live-dot" />
          <span className="text-[11px] text-dim">streaming</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-1">
        <AnimatePresence initial={false}>
          {displayTrades.map((trade, i) => (
            <motion.div
              key={`${trade.signature}-${i}`}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.15 }}
              className="flex items-center gap-2 px-2 sm:px-3 py-[7px] border-b border-border-subtle/50 text-xs transition-colors hover:bg-surface-hover/40 rounded-md"
            >
              <span
                className={`font-mono text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                  trade.is_buy
                    ? "bg-accent/15 text-accent"
                    : "bg-negative/15 text-negative"
                }`}
              >
                {trade.is_buy ? "BUY" : "SELL"}
              </span>
              <span className="text-foreground font-medium truncate max-w-[90px]">
                {trade.symbol || shortenAddress(trade.mint)}
              </span>
              <span className="ml-auto font-mono text-muted tabular-nums">
                {trade.sol_amount.toFixed(2)} SOL
              </span>
              <span className="font-mono text-dim text-[10px] tabular-nums w-8 text-right">
                {Math.floor((Date.now() - trade.timestamp) / 1000)}s
              </span>
            </motion.div>
          ))}
        </AnimatePresence>

        {displayTrades.length === 0 && (
          <div className="flex items-center justify-center h-full text-dim text-xs">
            Waiting for trades...
          </div>
        )}
      </div>
    </div>
  );
}
