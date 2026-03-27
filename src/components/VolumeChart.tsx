"use client";

import { useRef, useEffect, useCallback } from "react";

interface VolumeChartProps {
  dataPoints: number[];
}

export function VolumeChart({ dataPoints }: VolumeChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;
    const padding = { top: 16, right: 12, bottom: 28, left: 44 };
    const chartW = w - padding.left - padding.right;
    const chartH = h - padding.top - padding.bottom;

    ctx.clearRect(0, 0, w, h);

    const data = dataPoints.length > 0 ? dataPoints : [0];
    const max = Math.max(...data, 1);

    // Grid lines
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (chartH / 4) * i;
      ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(w - padding.right, y);
      ctx.stroke();

      ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
      ctx.font = "10px monospace";
      ctx.textAlign = "right";
      const val = Math.round(max - (max / 4) * i);
      ctx.fillText(String(val), padding.left - 8, y + 3);
    }

    if (data.length < 2) return;

    const step = chartW / (data.length - 1);

    // Area fill
    ctx.beginPath();
    ctx.moveTo(padding.left, padding.top + chartH);

    for (let i = 0; i < data.length; i++) {
      const x = padding.left + step * i;
      const y = padding.top + chartH - (data[i] / max) * chartH;

      if (i === 0) {
        ctx.lineTo(x, y);
      } else {
        const prevX = padding.left + step * (i - 1);
        const prevY =
          padding.top + chartH - (data[i - 1] / max) * chartH;
        const cpx = (prevX + x) / 2;
        ctx.bezierCurveTo(cpx, prevY, cpx, y, x, y);
      }
    }

    ctx.lineTo(padding.left + step * (data.length - 1), padding.top + chartH);
    ctx.closePath();

    const gradient = ctx.createLinearGradient(
      0,
      padding.top,
      0,
      padding.top + chartH
    );
    gradient.addColorStop(0, "rgba(16, 185, 129, 0.15)");
    gradient.addColorStop(1, "rgba(16, 185, 129, 0)");
    ctx.fillStyle = gradient;
    ctx.fill();

    // Line
    ctx.beginPath();
    for (let i = 0; i < data.length; i++) {
      const x = padding.left + step * i;
      const y = padding.top + chartH - (data[i] / max) * chartH;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        const prevX = padding.left + step * (i - 1);
        const prevY =
          padding.top + chartH - (data[i - 1] / max) * chartH;
        const cpx = (prevX + x) / 2;
        ctx.bezierCurveTo(cpx, prevY, cpx, y, x, y);
      }
    }

    ctx.strokeStyle = "#10b981";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // End dot
    const lastX = padding.left + step * (data.length - 1);
    const lastY =
      padding.top + chartH - (data[data.length - 1] / max) * chartH;

    ctx.beginPath();
    ctx.arc(lastX, lastY, 3, 0, Math.PI * 2);
    ctx.fillStyle = "#10b981";
    ctx.fill();

    // Time labels
    ctx.fillStyle = "rgba(255,255,255,0.15)";
    ctx.font = "10px monospace";
    ctx.textAlign = "center";
    const labelCount = Math.min(6, data.length);
    for (let i = 0; i < labelCount; i++) {
      const idx = Math.floor((data.length - 1) * (i / (labelCount - 1)));
      const x = padding.left + step * idx;
      const minutesAgo = data.length - 1 - idx;
      ctx.fillText(`-${minutesAgo}m`, x, h - 6);
    }
  }, [dataPoints]);

  useEffect(() => {
    draw();
    const handleResize = () => draw();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [draw]);

  return (
    <div className="rounded-xl border border-border bg-surface p-4 sm:p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] text-muted">
          Trades per minute
        </span>
        <span className="text-[11px] text-dim">real-time</span>
      </div>
      <canvas
        ref={canvasRef}
        className="w-full h-[180px] sm:h-[220px]"
        style={{ display: "block" }}
      />
    </div>
  );
}
