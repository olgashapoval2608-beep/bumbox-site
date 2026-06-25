"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { LazyVideo } from "@/components/ui/LazyVideo";
import { TIMELINE, type TimelineEntry } from "@/lib/content";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const EASE = [0.16, 1, 0.3, 1] as const;

function PanelMedia({ entry }: { entry: TimelineEntry }) {
  return (
    <div className="relative aspect-[5/4] w-full overflow-hidden rounded-xl ring-1 ring-line">
      {entry.type === "video" ? (
        <LazyVideo src={entry.media} className="h-full w-full object-cover" />
      ) : (
        <Image
          src={entry.media}
          alt={entry.title}
          fill
          sizes="(max-width: 768px) 80vw, 46vw"
          className={`object-cover ${entry.climax ? "" : ""}`}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
      {entry.climax && (
        <span className="absolute right-3 top-3 rounded-full border border-signal/50 bg-signal/15 px-3 py-1 font-mono text-[0.58rem] uppercase tracking-[0.18em] text-bone backdrop-blur">
          Червона калина
        </span>
      )}
    </div>
  );
}

function Panel({
  entry,
  index,
  vertical = false,
}: {
  entry: TimelineEntry;
  index: number;
  vertical?: boolean;
}) {
  return (
    <article
      className={
        vertical
          ? "flex w-full max-w-2xl flex-col gap-6"
          : "flex h-full w-[82vw] shrink-0 flex-col justify-center gap-6 px-[5vw] sm:w-[64vw] md:w-[48vw] lg:w-[40vw]"
      }
    >
      <div className="flex items-baseline gap-4">
        <span
          className={`font-display text-[clamp(2.4rem,5vw,4rem)] font-black leading-none tracking-tightest ${
            entry.climax ? "text-signal" : "text-bone"
          }`}
        >
          {entry.year}
        </span>
        <span className="font-mono text-xs text-smoke">
          {String(index + 1).padStart(2, "0")} / {String(TIMELINE.length).padStart(2, "0")}
        </span>
      </div>
      <PanelMedia entry={entry} />
      <div>
        <h3 className="font-display text-2xl font-bold text-bone md:text-3xl">
          {entry.title}
        </h3>
        <p className="mt-2 max-w-md text-pretty text-sm leading-relaxed text-bone-dim md:text-base">
          {entry.body}
        </p>
      </div>
    </article>
  );
}

export function History() {
  const reduce = useReducedMotion();
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      if (reduce || !track.current) return;

      const getDistance = () =>
        Math.max(0, track.current!.scrollWidth - window.innerWidth);

      gsap.to(track.current, {
        x: () => -getDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: section.current,
          start: "top top",
          end: () => "+=" + getDistance(),
          scrub: 0.8,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            setProgress(self.progress);
            setActive(
              Math.min(
                TIMELINE.length - 1,
                Math.round(self.progress * (TIMELINE.length - 1)),
              ),
            );
          },
        },
      });
    },
    { scope: section, dependencies: [reduce] },
  );

  // Reduced-motion: a clean vertical documentary stack.
  if (reduce) {
    return (
      <section id="history" className="bg-ink py-24">
        <div className="shell">
          <p className="kicker mb-4">Історія · 2004 — зараз</p>
          <h2 className="mb-12 font-display text-5xl font-black tracking-tightest text-bone">
            Одна плівка, двадцять років
          </h2>
          <div className="flex flex-col gap-20">
            {TIMELINE.map((entry, i) => (
              <Panel key={entry.year} entry={entry} index={i} vertical />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="history"
      ref={section}
      className="relative h-svh min-h-[640px] overflow-hidden bg-ink"
    >
      {/* Header overlay (held in place during pin) */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 px-[var(--gutter)] pt-24 md:pt-28">
        <div className="flex items-start justify-between">
          <div>
            <p className="kicker mb-3">Історія · документальна плівка</p>
            <h2 className="font-display text-3xl font-black tracking-tightest text-bone md:text-5xl">
              Одна плівка,
              <br />
              двадцять років
            </h2>
          </div>
          {/* Live year counter */}
          <div className="hidden text-right md:block">
            <AnimatePresence mode="popLayout">
              <motion.span
                key={TIMELINE[active].year}
                initial={{ y: 24, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -24, opacity: 0 }}
                transition={{ duration: 0.5, ease: EASE }}
                className="block font-display text-[clamp(3rem,8vw,7rem)] font-black leading-none tracking-tightest text-bone/15"
              >
                {TIMELINE[active].year}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Horizontal track */}
      <div ref={track} className="flex h-full items-center will-change-transform">
        {TIMELINE.map((entry, i) => (
          <Panel key={entry.year} entry={entry} index={i} />
        ))}
      </div>

      {/* Progress + year ticks */}
      <div className="absolute inset-x-0 bottom-0 z-20 px-[var(--gutter)] pb-7">
        <div className="mb-3 hidden items-center justify-between sm:flex">
          {TIMELINE.map((entry, i) => (
            <span
              key={entry.year}
              className={`font-mono text-[0.62rem] uppercase tracking-[0.14em] transition-colors duration-300 ${
                i === active ? "text-signal" : "text-smoke/60"
              }`}
            >
              {entry.year}
            </span>
          ))}
        </div>
        <div className="h-px w-full bg-line">
          <div
            className="h-full bg-gradient-to-r from-signal to-amber"
            style={{ width: `${Math.max(2, progress * 100)}%` }}
          />
        </div>
      </div>
    </section>
  );
}
