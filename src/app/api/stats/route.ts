import { NextResponse } from "next/server";
import type { PlatformStats, DefiLlamaVolume } from "@/lib/types";

let cache: { data: PlatformStats; timestamp: number } | null = null;
const CACHE_TTL = 30_000;

const EMPTY_VOLUME: DefiLlamaVolume = {
  total24h: 0,
  total48hto24h: 0,
  total7d: 0,
  total30d: 0,
  change_1d: 0,
  change_7d: 0,
  change_1m: 0,
};

async function fetchSolPrice(): Promise<number> {
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd",
      { cache: "no-store" }
    );
    const data = await res.json();
    if (data.solana?.usd) return data.solana.usd;
  } catch {}

  try {
    const res = await fetch(
      "https://api.jup.ag/price/v2?ids=So11111111111111111111111111111111111111112",
      { cache: "no-store" }
    );
    const data = await res.json();
    const sol = data.data?.["So11111111111111111111111111111111111111112"];
    if (sol?.price) return parseFloat(sol.price);
  } catch {}

  return 140;
}

async function fetchDefiLlamaVolume(protocol: string): Promise<DefiLlamaVolume> {
  try {
    const res = await fetch(
      `https://api.llama.fi/summary/dexs/${protocol}`,
      { cache: "no-store" }
    );
    const data = await res.json();

    return {
      total24h: data.total24h ?? 0,
      total48hto24h: data.total48hto24h ?? 0,
      total7d: data.total7d ?? 0,
      total30d: data.total30d ?? 0,
      change_1d: data.change_1d ?? 0,
      change_7d: data.change_7d ?? 0,
      change_1m: data.change_1m ?? 0,
    };
  } catch {
    return { ...EMPTY_VOLUME };
  }
}

export async function GET() {
  const now = Date.now();

  if (cache && now - cache.timestamp < CACHE_TTL) {
    return NextResponse.json(cache.data);
  }

  try {
    const [solPrice, pumpswap] = await Promise.all([
      fetchSolPrice(),
      fetchDefiLlamaVolume("pumpswap"),
    ]);

    const stats: PlatformStats = {
      pumpfun: { ...EMPTY_VOLUME },
      pumpswap,
      combined24h: pumpswap.total24h,
      combined7d: pumpswap.total7d,
      combinedChange1d: pumpswap.change_1d,
      solPrice,
      timestamp: now,
    };

    cache = { data: stats, timestamp: now };
    return NextResponse.json(stats);
  } catch {
    const fallback: PlatformStats = {
      pumpfun: { ...EMPTY_VOLUME },
      pumpswap: { ...EMPTY_VOLUME, total24h: 45_000_000 },
      combined24h: 45_000_000,
      combined7d: 315_000_000,
      combinedChange1d: 0,
      solPrice: 140,
      timestamp: now,
    };
    return NextResponse.json(fallback);
  }
}
