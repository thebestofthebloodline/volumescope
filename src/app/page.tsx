"use client";

import { useState, useEffect, useRef } from "react";
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
import { getVolumeLevel } from "@/lib/types";
import { filterTradesByRange, getVolumeForRange } from "@/lib/utils";
import type { TimeRange, PlatformStats } from "@/lib/types";

export default function Home() {
  const { trades, newTokens, connected, tradesPerMin, tokensPerHour } =
    usePumpPortal();
  const { isLive, countdown, liveRemaining } = useCountdown();

  const [platformStats, setPlatformStats] = useState<PlatformStats | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>("24h");
  const [chartData, setChartData] = useState<number[]>([]);
  const [heatmapData, setHeatmapData] = useState<number[]>(
    new Array(24).fill(0)
  );
  const chartIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Fetch platform stats from DefiLlama API
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/stats");
        const data = await res.json();
        setPlatformStats(data);
      } catch {}
    };

    fetchStats();
    const interval = setInterval(fetchStats, 30_000);
    return () => clearInterval(interval);
  }, []);

  // Chart data (sampled every 5s)
  useEffect(() => {
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

  // Heatmap
  useEffect(() => {
    if (trades.length === 0) return;
    setHeatmapData((prev) => {
      const next = [...prev];
      next[new Date().getUTCHours()] = tradesPerMin;
      return next;
    });
  }, [trades.length, tradesPerMin]);

  const volumeLevel = getVolumeLevel(tradesPerMin);
  const solPrice = platformStats?.solPrice ?? 0;

  // Filter trades by selected time range
  const filteredTrades = filterTradesByRange(trades, timeRange);

  // Compute displayed volume
  const defiLlamaVolume = getVolumeForRange(platformStats, timeRange);
  const liveVolumeUSD =
    filteredTrades.reduce((sum, t) => sum + t.sol_amount, 0) * solPrice;

  // For sub-24h ranges, use only live trades. For 24h+, use DefiLlama + live.
  const isSubDay = ["5m", "30m", "1h", "4h"].includes(timeRange);
  const displayVolume = isSubDay ? liveVolumeUSD : defiLlamaVolume + liveVolumeUSD;

  const volumeChange = platformStats?.combinedChange1d ?? 0;

  return (
    <div className="min-h-screen flex flex-col relative z-10">
      <Navbar connected={connected} isLive={isLive} />

      <main className="flex-1 mx-auto w-full max-w-[1400px] px-4 sm:px-6 py-6 space-y-5">
        <Countdown
          isLive={isLive}
          countdown={countdown}
          liveRemaining={liveRemaining}
        />

        <StatsBar
          volume={displayVolume}
          volumeChange={volumeChange}
          tradesPerMin={tradesPerMin}
          tokensPerHour={tokensPerHour}
          solPrice={solPrice}
          volumeLevel={volumeLevel}
          timeRange={timeRange}
        />

        <VolumeChart
          dataPoints={chartData}
          timeRange={timeRange}
          onTimeRangeChange={setTimeRange}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <LiveFeed trades={filteredTrades} />
          <VolumeHeatmap tradeHistory={heatmapData} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <TopMovers trades={filteredTrades} />
          <NewTokensFeed tokens={newTokens} />
        </div>

        <footer className="border-t border-border/40 pt-5 pb-6 text-center">
          <p className="text-[11px] text-dim">
            Volumescope &middot; Real-time PumpFun volume tracker
          </p>
        </footer>
      </main>
    </div>
  );
}
