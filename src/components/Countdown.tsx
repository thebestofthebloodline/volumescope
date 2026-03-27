"use client";

import { motion, AnimatePresence } from "framer-motion";

interface CountdownProps {
  isLive: boolean;
  countdown: { days: number; hours: number; minutes: number; seconds: number };
  liveRemaining: { hours: number; minutes: number; seconds: number };
}

function Digit({ value, label }: { value: number; label: string }) {
  const str = String(value).padStart(2, "0");
  return (
    <div className="flex flex-col items-center">
      <div className="flex gap-1">
        {str.split("").map((d, i) => (
          <motion.span
            key={`${label}-${i}-${d}`}
            initial={{ rotateX: 90, opacity: 0 }}
            animate={{ rotateX: 0, opacity: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="inline-block w-[40px] sm:w-[56px] md:w-[72px] h-[56px] sm:h-[72px] md:h-[96px] bg-[#0a0a0a] border border-green/20 rounded-md flex items-center justify-center text-3xl sm:text-5xl md:text-7xl font-bold text-green"
            style={{ perspective: "200px" }}
          >
            {d}
          </motion.span>
        ))}
      </div>
      <span className="mt-2 text-[10px] sm:text-xs uppercase tracking-[0.2em] text-green/40">
        {label}
      </span>
    </div>
  );
}

function Separator() {
  return (
    <div className="flex flex-col items-center justify-center pb-6">
      <span className="text-3xl sm:text-5xl md:text-7xl font-bold text-green/30">:</span>
    </div>
  );
}

export function Countdown({ isLive, countdown, liveRemaining }: CountdownProps) {
  return (
    <div className="flex flex-col items-center py-8 sm:py-12">
      <AnimatePresence mode="wait">
        {isLive ? (
          <motion.div
            key="live"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="flex flex-col items-center gap-6"
          >
            <div className="flex items-center gap-3">
              <div className="h-4 w-4 rounded-full bg-red live-dot" />
              <span className="text-2xl sm:text-4xl font-bold tracking-[0.3em] text-red uppercase">
                LIVE NOW
              </span>
              <div className="h-4 w-4 rounded-full bg-red live-dot" />
            </div>

            <p className="text-sm text-green/50 uppercase tracking-wider">
              Memescope Monday in progress
            </p>

            <div className="flex items-center gap-3">
              <span className="text-xs text-foreground/40 uppercase tracking-wider">Ends in</span>
              <div className="flex items-center gap-2">
                <Digit value={liveRemaining.hours} label="hrs" />
                <Separator />
                <Digit value={liveRemaining.minutes} label="min" />
                <Separator />
                <Digit value={liveRemaining.seconds} label="sec" />
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="countdown"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="flex flex-col items-center gap-6"
          >
            <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-green/50">
              Next Memescope Monday
            </p>

            <div className="flex items-center gap-2 sm:gap-3">
              <Digit value={countdown.days} label="days" />
              <Separator />
              <Digit value={countdown.hours} label="hrs" />
              <Separator />
              <Digit value={countdown.minutes} label="min" />
              <Separator />
              <Digit value={countdown.seconds} label="sec" />
            </div>

            <p className="text-[10px] sm:text-xs text-foreground/30 uppercase tracking-wider">
              Monday 10:00 AM EST / 15:00 UTC
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
