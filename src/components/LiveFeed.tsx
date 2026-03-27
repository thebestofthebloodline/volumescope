"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { shortenAddress } from "@/lib/utils";
import type { Trade } from "@/lib/types";

interface LiveFeedProps {
  trades: Trade[];
}

export function LiveFeed({ trades }: LiveFeedProps) {
  const displayTrades = trades.slice(0, 50);

  return (
    <div className="card rounded-lg flex flex-col h-[400px]">
      <div className="flex items-center justify-between px-4 py-3 border-b border-green/10">
        <span className="text-[10px] uppercase tracking-[0.15em] text-foreground/40">
          Live Feed
        </span>
        <div className="flex items-center gap-1.5">
          <div className="h-1.5 w-1.5 rounded-full bg-green live-dot" />
          <span className="text-[10px] text-green/50">STREAMING</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-1">
        <AnimatePresence initial={false}>
          {displayTrades.map((trade, i) => (
            <motion.div
              key={`${trade.signature}-${i}`}
              initial={{ opacity: 0, x: -20, height: 0 }}
              animate={{ opacity: 1, x: 0, height: "auto" }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2 px-2 py-1.5 border-b border-white/[0.02] text-xs"
            >
              {trade.is_buy ? (
                <ArrowUpRight size={12} className="text-green shrink-0" />
              ) : (
                <ArrowDownRight size={12} className="text-red shrink-0" />
              )}
              <span className={`font-bold ${trade.is_buy ? "text-green" : "text-red"}`}>
                {trade.is_buy ? "BUY" : "SELL"}
              </span>
              <span className="text-foreground/50 truncate max-w-[80px]">
                {trade.symbol || shortenAddress(trade.mint)}
              </span>
              <span className="ml-auto text-foreground/60 tabular-nums">
                {trade.sol_amount.toFixed(2)} SOL
              </span>
              <span className="text-foreground/20 text-[10px] tabular-nums w-[32px] text-right">
                {Math.floor((Date.now() - trade.timestamp) / 1000)}s
              </span>
            </motion.div>
          ))}
        </AnimatePresence>

        {displayTrades.length === 0 && (
          <div className="flex items-center justify-center h-full text-foreground/20 text-xs">
            Waiting for trades...
          </div>
        )}
      </div>
    </div>
  );
}
