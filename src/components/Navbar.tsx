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
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-12 max-w-[1400px] items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold tracking-tight text-foreground">
            Volumescope
          </span>
          {isLive && (
            <div className="flex items-center gap-1.5 rounded-full bg-accent-dim px-2.5 py-0.5">
              <div className="h-1.5 w-1.5 rounded-full bg-accent live-dot" />
              <span className="text-[11px] font-medium text-accent">LIVE</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCopy}
            className="hidden sm:flex items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 py-1 text-[11px] text-muted transition-colors hover:text-foreground hover:border-muted"
          >
            <span className="font-mono">
              {CA.slice(0, 6)}...{CA.slice(-4)}
            </span>
            {copied ? (
              <Check size={11} className="text-accent" />
            ) : (
              <Copy size={11} />
            )}
          </button>

          <div className="flex items-center gap-1.5">
            <div
              className={`h-1.5 w-1.5 rounded-full ${connected ? "bg-accent" : "bg-negative"}`}
            />
            <span className="text-[11px] text-muted">
              {connected ? "Connected" : "Offline"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
