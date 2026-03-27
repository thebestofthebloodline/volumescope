"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import { shortenAddress } from "@/lib/utils";
import type { NewToken } from "@/lib/types";

interface NewTokensFeedProps {
  tokens: NewToken[];
}

export function NewTokensFeed({ tokens }: NewTokensFeedProps) {
  const display = tokens.slice(0, 30);

  return (
    <div className="card rounded-lg flex flex-col h-[300px]">
      <div className="flex items-center justify-between px-4 py-3 border-b border-green/10">
        <div className="flex items-center gap-2">
          <Sparkles size={12} className="text-amber" />
          <span className="text-[10px] uppercase tracking-[0.15em] text-foreground/40">
            New Tokens
          </span>
        </div>
        <span className="text-[10px] text-amber/50">LAUNCHES</span>
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-1">
        <AnimatePresence initial={false}>
          {display.map((token, i) => (
            <motion.div
              key={`${token.signature}-${i}`}
              initial={{ opacity: 0, x: -10, height: 0 }}
              animate={{ opacity: 1, x: 0, height: "auto" }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex items-center gap-2 px-2 py-1.5 border-b border-white/[0.02] text-xs"
            >
              <Sparkles size={10} className="text-amber/40 shrink-0" />
              <span className="text-amber font-bold">
                ${token.symbol}
              </span>
              <span className="text-foreground/30 truncate flex-1">
                {token.name}
              </span>
              <span className="text-foreground/15 text-[10px] tabular-nums">
                {shortenAddress(token.mint)}
              </span>
              <span className="text-foreground/20 text-[10px] tabular-nums w-[32px] text-right">
                {Math.floor((Date.now() - token.timestamp) / 1000)}s
              </span>
            </motion.div>
          ))}
        </AnimatePresence>

        {display.length === 0 && (
          <div className="flex items-center justify-center h-full text-foreground/20 text-xs">
            Waiting for launches...
          </div>
        )}
      </div>
    </div>
  );
}
