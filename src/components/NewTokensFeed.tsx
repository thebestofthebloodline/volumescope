"use client";

import { motion, AnimatePresence } from "framer-motion";
import { shortenAddress } from "@/lib/utils";
import type { NewToken } from "@/lib/types";

interface NewTokensFeedProps {
  tokens: NewToken[];
}

export function NewTokensFeed({ tokens }: NewTokensFeedProps) {
  const display = tokens.slice(0, 30);

  return (
    <div className="glass-card flex flex-col h-[300px]">
      <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-border/40">
        <span className="text-[11px] text-muted uppercase tracking-wider">New tokens</span>
        <span className="text-[11px] text-dim">launches</span>
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-1">
        <AnimatePresence initial={false}>
          {display.map((token, i) => (
            <motion.div
              key={`${token.signature}-${i}`}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.12 }}
              className="flex items-center gap-2 px-2 sm:px-3 py-[7px] border-b border-border-subtle/50 text-xs transition-colors hover:bg-surface-hover/40 rounded-md"
            >
              <span className="font-medium font-mono px-1.5 py-0.5 rounded bg-blue/15 text-blue text-[11px]">
                ${token.symbol}
              </span>
              <span className="text-dim truncate flex-1">
                {token.name}
              </span>
              <span className="text-dim text-[10px] font-mono">
                {shortenAddress(token.mint)}
              </span>
              <span className="text-dim text-[10px] font-mono tabular-nums w-8 text-right">
                {Math.floor((Date.now() - token.timestamp) / 1000)}s
              </span>
            </motion.div>
          ))}
        </AnimatePresence>

        {display.length === 0 && (
          <div className="flex items-center justify-center h-full text-dim text-xs">
            Waiting for launches...
          </div>
        )}
      </div>
    </div>
  );
}
