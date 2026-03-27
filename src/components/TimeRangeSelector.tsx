"use client";

import { motion } from "framer-motion";
import type { TimeRange } from "@/lib/types";

const RANGES: TimeRange[] = ["5m", "30m", "1h", "4h", "24h", "2d", "1w"];

interface TimeRangeSelectorProps {
  value: TimeRange;
  onChange: (range: TimeRange) => void;
}

export function TimeRangeSelector({ value, onChange }: TimeRangeSelectorProps) {
  return (
    <div className="relative flex items-center gap-0.5 rounded-lg bg-background/60 p-0.5 border border-border-subtle">
      {RANGES.map((range) => (
        <button
          key={range}
          onClick={() => onChange(range)}
          className="relative z-10 px-2.5 py-1 text-[11px] font-medium font-mono transition-colors"
          style={{
            color: value === range
              ? "var(--foreground)"
              : "var(--muted)",
          }}
        >
          {value === range && (
            <motion.div
              layoutId="time-range-highlight"
              className="absolute inset-0 rounded-md bg-surface border border-border/60"
              style={{ zIndex: -1 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
          {range}
        </button>
      ))}
    </div>
  );
}
