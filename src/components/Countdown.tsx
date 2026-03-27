"use client";

import { motion, AnimatePresence } from "framer-motion";

interface CountdownProps {
  isLive: boolean;
  countdown: { days: number; hours: number; minutes: number; seconds: number };
  liveRemaining: { hours: number; minutes: number; seconds: number };
}

function DigitBox({ value }: { value: string }) {
  return (
    <motion.div
      key={value}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="w-[42px] sm:w-[56px] md:w-[68px] h-[54px] sm:h-[68px] md:h-[84px] rounded-lg bg-surface border border-border flex items-center justify-center"
    >
      <span className="font-mono text-2xl sm:text-4xl md:text-5xl font-semibold text-foreground tabular-nums leading-none">
        {value}
      </span>
    </motion.div>
  );
}

function TimeUnit({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  const str = String(value).padStart(2, "0");
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex gap-1">
        <DigitBox value={str[0]} />
        <DigitBox value={str[1]} />
      </div>
      <span className="text-[10px] sm:text-[11px] font-medium uppercase tracking-widest text-dim">
        {label}
      </span>
    </div>
  );
}

function Colon() {
  return (
    <div className="flex items-center justify-center pb-6 px-1">
      <span className="text-2xl sm:text-3xl md:text-4xl font-light text-dim select-none">
        :
      </span>
    </div>
  );
}

export function Countdown({
  isLive,
  countdown,
  liveRemaining,
}: CountdownProps) {
  return (
    <section className="flex flex-col items-center py-10 sm:py-14">
      <AnimatePresence mode="wait">
        {isLive ? (
          <motion.div
            key="live"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="flex flex-col items-center gap-6"
          >
            <div className="flex items-center gap-2.5">
              <div className="h-2.5 w-2.5 rounded-full bg-accent live-dot" />
              <span className="text-xl sm:text-2xl font-semibold text-foreground">
                Memescope Monday is live
              </span>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <TimeUnit value={liveRemaining.hours} label="hrs" />
              <Colon />
              <TimeUnit value={liveRemaining.minutes} label="min" />
              <Colon />
              <TimeUnit value={liveRemaining.seconds} label="sec" />
            </div>

            <p className="text-xs text-muted">remaining</p>
          </motion.div>
        ) : (
          <motion.div
            key="countdown"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="flex flex-col items-center gap-6"
          >
            <p className="text-xs sm:text-sm text-muted">
              Next Memescope Monday
            </p>

            <div className="flex items-center gap-2 sm:gap-3">
              <TimeUnit value={countdown.days} label="days" />
              <Colon />
              <TimeUnit value={countdown.hours} label="hrs" />
              <Colon />
              <TimeUnit value={countdown.minutes} label="min" />
              <Colon />
              <TimeUnit value={countdown.seconds} label="sec" />
            </div>

            <p className="text-[11px] text-dim">
              Monday 10:00 AM EST
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
