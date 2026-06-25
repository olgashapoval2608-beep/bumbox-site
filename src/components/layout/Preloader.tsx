"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useSmoothScroll } from "@/components/providers/SmoothScroll";
import { BAND } from "@/lib/content";

const EASE_LIFT = [0.83, 0, 0.17, 1] as const;
const EASE = [0.16, 1, 0.3, 1] as const;

export function Preloader({ onDone }: { onDone: () => void }) {
  const reduce = useReducedMotion();
  const { lenis } = useSmoothScroll();
  const [count, setCount] = useState(0);
  const [lifting, setLifting] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    lenis?.stop();
    document.body.style.overflow = "hidden";
    window.scrollTo(0, 0);

    const duration = reduce ? 350 : 2000;
    const start = performance.now();
    let raf = 0;

    const loop = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.round(eased * 100));
      if (p < 1) {
        raf = requestAnimationFrame(loop);
      } else {
        setLifting(true);
        window.setTimeout(
          () => {
            setGone(true);
            lenis?.start();
            document.body.style.overflow = "";
            onDone();
          },
          reduce ? 0 : 950,
        );
      }
    };

    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis?.start();
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (gone) return null;

  const letters = Array.from(BAND.name);

  return (
    <motion.div
      className="fixed inset-0 z-[90] flex flex-col items-center justify-center overflow-hidden bg-ink"
      animate={lifting ? { clipPath: "inset(0 0 100% 0)" } : {}}
      transition={{ duration: reduce ? 0 : 0.95, ease: EASE_LIFT }}
      aria-hidden
    >
      <div className="flex overflow-hidden">
        {letters.map((ch, i) => (
          <motion.span
            key={i}
            initial={{ y: "110%" }}
            animate={{ y: 0 }}
            transition={{
              duration: reduce ? 0 : 0.8,
              ease: EASE,
              delay: reduce ? 0 : 0.1 + i * 0.05,
            }}
            className="font-display text-[14vw] font-black leading-none tracking-tightest text-bone md:text-[8vw]"
          >
            {ch}
          </motion.span>
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: count / 130 }}
        className="mt-4 font-mono text-[0.7rem] uppercase tracking-[0.4em] text-smoke"
      >
        {BAND.tagline}
      </motion.p>

      {/* Tape-position line + counter */}
      <div className="absolute inset-x-0 bottom-0 px-[var(--gutter)] pb-8">
        <div className="flex items-end justify-between">
          <span className="font-mono text-xs uppercase tracking-widest text-smoke">
            Завантаження сигналу
          </span>
          <span className="font-mono text-sm text-bone">
            {String(count).padStart(3, "0")}
          </span>
        </div>
        <div className="mt-3 h-px w-full bg-line">
          <div
            className="h-full bg-gradient-to-r from-signal to-amber"
            style={{ width: `${count}%` }}
          />
        </div>
      </div>
    </motion.div>
  );
}
