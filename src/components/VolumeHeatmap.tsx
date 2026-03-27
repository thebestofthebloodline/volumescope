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
    <div className="card rounded-lg p-4 h-[400px] flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] uppercase tracking-[0.15em] text-foreground/40">
          Volume Heatmap (24H)
        </span>
        <span className="text-[10px] text-green/40">HOURLY</span>
      </div>

      <div className="flex-1 grid grid-cols-6 gap-1.5 auto-rows-fr">
        {grid.map((cell) => {
          const green = Math.round(cell.intensity * 255);
          const bg =
            cell.intensity < 0.05
              ? "rgba(0, 255, 65, 0.03)"
              : `rgba(0, ${Math.max(green, 80)}, ${Math.round(green * 0.25)}, ${0.1 + cell.intensity * 0.7})`;

          return (
            <div
              key={cell.hour}
              className="rounded-sm flex flex-col items-center justify-center border border-green/5 transition-all duration-500"
              style={{ backgroundColor: bg }}
              title={`${cell.hour}:00 UTC - ${cell.value} trades`}
            >
              <span className="text-[10px] text-foreground/30">
                {String(cell.hour).padStart(2, "0")}:00
              </span>
              <span
                className="text-xs font-bold"
                style={{
                  color: `rgba(0, 255, 65, ${0.3 + cell.intensity * 0.7})`,
                }}
              >
                {cell.value}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-2 mt-3 justify-center">
        <span className="text-[9px] text-foreground/20">LOW</span>
        <div className="flex gap-0.5">
          {[0.05, 0.2, 0.4, 0.6, 0.8, 1].map((intensity) => (
            <div
              key={intensity}
              className="w-4 h-2 rounded-sm"
              style={{
                backgroundColor: `rgba(0, ${Math.round(intensity * 255)}, ${Math.round(intensity * 65)}, ${0.1 + intensity * 0.7})`,
              }}
            />
          ))}
        </div>
        <span className="text-[9px] text-foreground/20">HIGH</span>
      </div>
    </div>
  );
}
