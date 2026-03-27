"use client";

import { useState, useEffect, useCallback } from "react";
import { getNextMondayEST, getTimeRemaining, isLiveNow, getLiveEndTime } from "@/lib/utils";

export function useCountdown() {
  const [isLive, setIsLive] = useState(false);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 });
  const [liveRemaining, setLiveRemaining] = useState({ hours: 0, minutes: 0, seconds: 0 });

  const tick = useCallback(() => {
    const live = isLiveNow();
    setIsLive(live);

    if (live) {
      const end = getLiveEndTime();
      const diff = end.getTime() - Date.now();
      if (diff > 0) {
        setLiveRemaining({
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / (1000 * 60)) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      }
    } else {
      const target = getNextMondayEST();
      setCountdown(getTimeRemaining(target));
    }
  }, []);

  useEffect(() => {
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [tick]);

  return { isLive, countdown, liveRemaining };
}
