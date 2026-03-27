"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

const CA = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";

export function Navbar({
  connected,
  isLive,
}: {
  connected: boolean;
  isLive: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(CA);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className="sticky top-0 z-40 glass-card rounded-none border-x-0 border-t-0">
      <div className="mx-auto grid h-14 max-w-[1400px] grid-cols-3 items-center px-4 sm:px-6">
        {/* Left: Logo + LIVE */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold tracking-tight text-foreground">
            Volumescope
          </span>
          {isLive && (
            <div className="flex items-center gap-1.5 rounded-full bg-accent-dim px-2.5 py-0.5 glow-pulse">
              <div className="h-1.5 w-1.5 rounded-full bg-accent live-dot" />
              <span className="text-[11px] font-medium text-accent">LIVE</span>
            </div>
          )}
        </div>

        {/* Center: CA copy button */}
        <div className="flex justify-center">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 rounded-lg border border-accent/20 bg-accent-dim px-3.5 py-1.5 text-xs transition-all hover:border-accent/40 hover:bg-accent/15"
          >
            <span className="font-mono text-accent">
              {CA.slice(0, 6)}...{CA.slice(-4)}
            </span>
            {copied ? (
              <Check size={12} className="text-accent" />
            ) : (
              <Copy size={12} className="text-accent/60" />
            )}
          </button>
        </div>

        {/* Right: Connection status */}
        <div className="flex items-center justify-end gap-1.5">
          <div
            className={`h-1.5 w-1.5 rounded-full ${connected ? "bg-accent" : "bg-negative"}`}
          />
          <span className="text-[11px] text-muted">
            {connected ? "Connected" : "Offline"}
          </span>
        </div>
      </div>
    </header>
  );
}
