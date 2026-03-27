import { NextResponse } from "next/server";

const DEXSCREENER_URL = "https://api.dexscreener.com/latest/dex/pairs/solana";

let cachedSolPrice = 0;
let lastSolFetch = 0;

async function fetchSolPrice(): Promise<number> {
  const now = Date.now();
  if (cachedSolPrice > 0 && now - lastSolFetch < 30_000) {
    return cachedSolPrice;
  }

  try {
    const res = await fetch(
      "https://api.dexscreener.com/latest/dex/tokens/So11111111111111111111111111111111111111112",
      { next: { revalidate: 30 } }
    );
    const data = await res.json();
    if (data.pairs && data.pairs.length > 0) {
      cachedSolPrice = parseFloat(data.pairs[0].priceUsd || "0");
      lastSolFetch = now;
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
