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

export default function Home() {
  const { trades, newTokens, connected, tradesPerMin, tokensPerHour } =
    usePumpPortal();
  const { isLive, countdown, liveRemaining } = useCountdown();

  const [solPrice, setSolPrice] = useState(0);
  const [volume24h, setVolume24h] = useState(0);
  const [chartData, setChartData] = useState<number[]>([]);
  const [heatmapData, setHeatmapData] = useState<number[]>(
    new Array(24).fill(0)
  );
  const chartIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Fetch stats (SOL price + 24h volume)
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/stats");
        const data = await res.json();
        if (data.solPrice) setSolPrice(data.solPrice);
        if (data.pumpfunVolume24h) setVolume24h(data.pumpfunVolume24h);
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

  // Add live volume to baseline 24h volume
  const liveVolumeUSD =
    trades.reduce((sum, t) => sum + t.sol_amount, 0) * solPrice;
  const totalVolume = volume24h + liveVolumeUSD;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar connected={connected} isLive={isLive} />

      <main className="flex-1 mx-auto w-full max-w-[1400px] px-4 sm:px-6 py-6 space-y-5">
        <Countdown
          isLive={isLive}
          countdown={countdown}
          liveRemaining={liveRemaining}
        />

        <StatsBar
          volume24h={totalVolume}
          tradesPerMin={tradesPerMin}
          tokensPerHour={tokensPerHour}
          solPrice={solPrice}
          volumeLevel={volumeLevel}
        />

        <VolumeChart dataPoints={chartData} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <LiveFeed trades={trades} />
          <VolumeHeatmap tradeHistory={heatmapData} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <TopMovers trades={trades} />
          <NewTokensFeed tokens={newTokens} />
        </div>

        <footer className="border-t border-border pt-5 pb-6 text-center">
          <p className="text-[11px] text-dim">
            Volumescope &middot; Real-time PumpFun volume tracker
          </p>
        </footer>
      </main>
    </div>
  );
}
