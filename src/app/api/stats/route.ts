import { NextResponse } from "next/server";

let cachedSolPrice = 0;
let lastSolFetch = 0;

async function fetchSolPrice(): Promise<number> {
  const now = Date.now();
  if (cachedSolPrice > 0 && now - lastSolFetch < 30_000) {
    return cachedSolPrice;
  }

  try {
    // Use CoinGecko simple price API (free, no auth, reliable)
    const res = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd",
      { cache: "no-store" }
    );
    const data = await res.json();
    if (data.solana?.usd) {
      cachedSolPrice = data.solana.usd;
      lastSolFetch = now;
      return cachedSolPrice;
    }
  } catch {
    // fallback below
  }

  // Fallback: use Jupiter price API
  try {
    const res = await fetch(
      "https://api.jup.ag/price/v2?ids=So11111111111111111111111111111111111111112",
      { cache: "no-store" }
    );
    const data = await res.json();
    const solData = data.data?.["So11111111111111111111111111111111111111112"];
    if (solData?.price) {
      cachedSolPrice = parseFloat(solData.price);
      lastSolFetch = now;
      return cachedSolPrice;
    }
  } catch {
    // keep cached value
  }

  return cachedSolPrice || 140;
}

export async function GET() {
  try {
    const solPrice = await fetchSolPrice();

    return NextResponse.json({
      solPrice,
      timestamp: Date.now(),
    });
  } catch {
    return NextResponse.json(
      { solPrice: 140, timestamp: Date.now() },
      { status: 200 }
    );
  }
}
