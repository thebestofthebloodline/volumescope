"use client";

import { useMemo } from "react";

interface VolumeHeatmapProps {
  tradeHistory: number[];
}

export function VolumeHeatmap({ tradeHistory }: VolumeHeatmapProps) {
  const grid = useMemo(() => {
    const cells: { hour: number; value: number; intensity: number }[] = [];
    const maxVal = Math.max(...tradeHistory, 1);

    for (let i = 0; i < 24; i++) {
      const val = tradeHistory[i] || 0;
      cells.push({
        hour: i,
        value: val,
        intensity: val / maxVal,
      });
    }
    return cells;
  }, [tradeHistory]);

  return (
    <div className="glass-card flex flex-col h-[380px]">
      <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-border/40">
        <span className="text-[11px] text-muted uppercase tracking-wider">Volume heatmap (24h)</span>
        <span className="text-[11px] text-dim">hourly</span>
      </div>

      <div className="flex-1 p-3 sm:p-4">
        <div className="grid grid-cols-6 gap-1.5 h-full auto-rows-fr">
          {grid.map((cell) => (
            <div
              key={cell.hour}
              className="rounded-lg flex flex-col items-center justify-center border border-border-subtle/40 transition-all duration-700 hover:border-accent/30 hover:scale-[1.02]"
              style={{
                backgroundColor:
                  cell.intensity < 0.05
                    ? "transparent"
                    : `oklch(0.72 0.19 160 / ${cell.intensity * 0.20})`,
              }}
              title={`${String(cell.hour).padStart(2, "0")}:00 UTC - ${cell.value} trades/min`}
            >
              <span className="text-[10px] text-dim font-mono">
                {String(cell.hour).padStart(2, "0")}
              </span>
              <span
                className="text-xs font-mono font-medium tabular-nums"
                style={{
                  color:
                    cell.intensity < 0.05
                      ? "var(--dim)"
                      : `oklch(0.72 0.19 160 / ${0.5 + cell.intensity * 0.5})`,
                }}
              >
                {cell.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 px-4 pb-3">
        <span className="text-[10px] text-dim">low</span>
        <div className="flex gap-0.5">
          {[0.05, 0.15, 0.3, 0.5, 0.75, 1].map((v) => (
            <div
              key={v}
              className="w-5 h-1.5 rounded-sm"
              style={{
                backgroundColor: `oklch(0.72 0.19 160 / ${v * 0.30})`,
              }}
            />
          ))}
        </div>
        <span className="text-[10px] text-dim">high</span>
      </div>
    </div>
  );
}
