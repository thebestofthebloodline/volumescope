export interface Trade {
  signature: string;
  mint: string;
  sol_amount: number;
  token_amount: number;
  is_buy: boolean;
  user: string;
  timestamp: number;
  name?: string;
  symbol?: string;
}

export interface NewToken {
  signature: string;
  mint: string;
  name: string;
  symbol: string;
  uri?: string;
  timestamp: number;
}

export interface VolumeStats {
  volume24h: number;
  tradesPerMin: number;
  newTokensPerHour: number;
  solPrice: number;
}

export interface HeatmapCell {
  hour: number;
  day: string;
  volume: number;
  intensity: number;
}

export interface TopMover {
  mint: string;
  name: string;
  symbol: string;
  volume: number;
  trades: number;
  priceChange: number;
}

export type VolumeLevel = "dead" | "low" | "medium" | "high" | "extreme";

export function getVolumeLevel(tradesPerMin: number): VolumeLevel {
  if (tradesPerMin < 5) return "dead";
  if (tradesPerMin < 20) return "low";
  if (tradesPerMin < 60) return "medium";
  if (tradesPerMin < 150) return "high";
  return "extreme";
}

export function getGlowIntensity(level: VolumeLevel): number {
  switch (level) {
    case "dead":
      return 0;
    case "low":
      return 0.3;
    case "medium":
      return 0.6;
    case "high":
      return 0.85;
    case "extreme":
      return 1;
  }
}
