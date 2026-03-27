"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Navbar } from "@/components/Navbar";
import { Countdown } from "@/components/Countdown";
import { StatsBar } from "@/components/StatsBar";
import { VolumeChart } from "@/components/VolumeChart";
import { LiveFeed } from "@/components/LiveFeed";
import { VolumeHeatmap } from "@/components/VolumeHeatmap";
import { TopMovers } from "@/components/TopMovers";
import { NewTokensFeed } from "@/components/NewTokensFeed";
import { usePumpPortal } from "@/hooks/usePumpPortal";
import { useCountdown } from "@/hooks/useCountdown";
import { getVolumeLevel, getGlowIntensity } from "@/lib/types";

export default function Home() {
  const { trades, newTokens, connected, tradesPerMin, tokensPerHour } =
    usePumpPortal();
  const { isLive, countdown, liveRemaining } = useCountdown();

  const [solPrice, setSolPrice] = useState(0);
  const [chartData, setChartData] = useState<number[]>([]);
  const [heatmapData, setHeatmapData] = useState<number[]>(
    new Array(24).fill(0)
  );
  const tradeCountRef = useRef(0);
  const chartIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Fetch SOL price
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/stats");
        const data = await res.json();
        if (data.solPrice) setSolPrice(data.solPrice);
      } catch {
        // silent
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 30_000);
    return () => clearInterval(interval);
  }, []);

  // Build chart data (trades per minute, sampled every 5 seconds)
  useEffect(() => {
    tradeCountRef.current = 0;

    chartIntervalRef.current = setInterval(() => {
      setChartData((prev) => {
        const next = [...prev, tradesPerMin];
        if (next.length > 60) next.shift();
        return next;
      });
    }, 5000);

    return () => {
      if (chartIntervalRef.current) clearInterval(chartIntervalRef.current);
    };
  }, [tradesPerMin]);

  // Build heatmap data
  useEffect(() => {
    if (trades.length === 0) return;

    setHeatmapData((prev) => {
      const next = [...prev];
      const currentHour = new Date().getUTCHours();
      next[currentHour] = tradesPerMin;
      return next;
    });
  }, [trades.length, tradesPerMin]);

  // Glow effect based on volume
  const volumeLevel = getVolumeLevel(tradesPerMin);
  const glowIntensity = getGlowIntensity(volumeLevel);

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--glow-intensity",
      String(glowIntensity)
    );
    if (volumeLevel === "extreme") {
      document.body.classList.add("glow-extreme");
    } else {
      document.body.classList.remove("glow-extreme");
    }
  }, [glowIntensity, volumeLevel]);

  // Estimate 24h volume from trades
  const volume24h =
    trades.reduce((sum, t) => sum + t.sol_amount, 0) * solPrice;

  return (
    <div className="relative z-10 min-h-screen flex flex-col">
      <Navbar connected={connected} isLive={isLive} />

      <main className="flex-1 mx-auto w-full max-w-[1400px] px-4 py-6 space-y-6">
        {/* Countdown */}
        <Countdown
          isLive={isLive}
          countdown={countdown}
          liveRemaining={liveRemaining}
        />

        {/* Stats Bar */}
        <StatsBar
          volume24h={volume24h}
          tradesPerMin={tradesPerMin}
          tokensPerHour={tokensPerHour}
          solPrice={solPrice}
          volumeLevel={volumeLevel}
        />

        {/* Volume Chart */}
        <VolumeChart dataPoints={chartData} />

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LiveFeed trades={trades} />
          <VolumeHeatmap tradeHistory={heatmapData} />
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TopMovers trades={trades} />
          <NewTokensFeed tokens={newTokens} />
        </div>

        {/* Footer */}
        <footer className="border-t border-green/5 py-6 text-center">
          <p className="text-[10px] text-foreground/20 uppercase tracking-[0.2em]">
            VOLUMESCOPE / Real-Time PumpFun Volume Terminal
          </p>
        </footer>
      </main>
    </div>
  );
}
