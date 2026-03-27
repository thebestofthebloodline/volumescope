import { NextResponse } from "next/server";

interface CacheEntry {
  solPrice: number;
  pumpfunVolume24h: number;
  timestamp: number;
}

let cache: CacheEntry | null = null;
const CACHE_TTL = 30_000;

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

async function fetchPumpFunVolume(solPrice: number): Promise<number> {
  // Fetch top PumpFun tokens from DexScreener to estimate platform volume
  try {
    const res = await fetch(
      "https://api.dexscreener.com/token-boosts/top/v1",
      { cache: "no-store" }
    );
    const data = await res.json();

    // Sum volume from Solana tokens (most will be PumpFun)
    let totalVol = 0;
    if (Array.isArray(data)) {
      for (const token of data) {
        if (token.chainId === "solana" && token.tokenAddress) {
          totalVol += token.totalAmount || 0;
        }
      }
    }

    // This is a rough estimate; multiply to approximate full platform
    if (totalVol > 0) return totalVol * solPrice * 8;
  } catch {}

  // Fallback: use a reasonable estimate based on known PumpFun daily volumes
  return 45_000_000;
}

export async function GET() {
  const now = Date.now();

  if (cache && now - cache.timestamp < CACHE_TTL) {
    return NextResponse.json(cache);
  }

  try {
    const solPrice = await fetchSolPrice();
    const pumpfunVolume24h = await fetchPumpFunVolume(solPrice);

    cache = {
      solPrice,
      pumpfunVolume24h,
      timestamp: now,
    };

    return NextResponse.json(cache);
  } catch {
    return NextResponse.json({
      solPrice: 140,
      pumpfunVolume24h: 45_000_000,
      timestamp: now,
    });
  }
}
