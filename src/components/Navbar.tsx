"use client";

import { useState } from "react";
import { Copy, Check, Wifi, WifiOff } from "lucide-react";

const CA = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";

export function Navbar({ connected, isLive }: { connected: boolean; isLive: boolean }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(CA);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-green/10 bg-[#050505]/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-bold tracking-[0.3em] text-green uppercase">
            VOLUMESCOPE
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={handleCopy}
            className="hidden sm:flex items-center gap-2 rounded border border-green/20 bg-green/5 px-3 py-1.5 text-xs text-green/70 transition-all hover:border-green/40 hover:text-green"
          >
            <span className="font-mono">CA: {CA.slice(0, 6)}...{CA.slice(-4)}</span>
            {copied ? <Check size={12} /> : <Copy size={12} />}
          </button>

          <div className="flex items-center gap-2">
            {connected ? (
              <Wifi size={14} className="text-green" />
            ) : (
              <WifiOff size={14} className="text-red" />
            )}
            <span className={`text-xs uppercase tracking-wider ${connected ? "text-green" : "text-red"}`}>
              {connected ? "CONNECTED" : "OFFLINE"}
            </span>
          </div>

          {isLive && (
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-red live-dot" />
              <span className="text-xs font-bold tracking-wider text-red uppercase">
                LIVE
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
