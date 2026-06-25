"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { LazyVideo } from "@/components/ui/LazyVideo";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { CONCERTS, TOUR_NAME, ALL_TICKETS, type Concert } from "@/lib/content";

const EASE = [0.16, 1, 0.3, 1] as const;
const PREVIEWS = [
  "/media/concert-crowd.jpg",
  "/media/concert-festival.jpg",
  "/media/concert-club.jpg",
];

const STATUS_STYLE: Record<Concert["status"], string> = {
  Квитки: "text-bone-dim",
  "Мало місць": "text-amber",
  "Sold out": "text-smoke line-through",
};

export function Concerts() {
  const reduce = useReducedMotion();
  const [hovered, setHovered] = useState(0);

  return (
    <section
      id="concerts"
      className="relative overflow-hidden bg-ink-800 py-24 md:py-36"
    >
      {/* Atmospheric backing */}
      <div className="pointer-events-none absolute inset-0 opacity-25">
        <LazyVideo
          src="/media/team-concert.mp4"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-ink/70" />
      </div>

      <div className="shell relative">
        <SectionHeader
          kicker={TOUR_NAME}
          title="Зустрінемось у залі"
          description="Бумбокс грає для світу й для України. Обери місто — квитки на офіційних майданчиках."
        />

        <div className="mt-16 grid gap-12 lg:grid-cols-[1.15fr_0.85fr]">
          {/* Tour list */}
          <ul className="flex flex-col">
            {CONCERTS.map((c, i) => {
              const soldOut = c.status === "Sold out";
              return (
                <motion.li
                  key={c.id}
                  initial={reduce ? false : { opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10% 0px" }}
                  transition={{ duration: 0.7, ease: EASE, delay: i * 0.06 }}
                  onMouseEnter={() => setHovered(i)}
                  className="group relative border-t border-line last:border-b"
                >
                  <a
                    href={c.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="grid grid-cols-[auto_1fr_auto] items-center gap-4 py-6 md:gap-8 md:py-7"
                    aria-label={`${c.city}, ${c.venue} — ${c.day} ${c.month}`}
                  >
                    {/* Date */}
                    <div className="flex w-16 flex-col items-start md:w-20">
                      <span className="font-display text-3xl font-extrabold leading-none text-bone md:text-4xl">
                        {c.day}
                      </span>
                      <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-smoke">
                        {c.month}
                      </span>
                    </div>

                    {/* City + venue */}
                    <div className="min-w-0 transition-transform duration-500 ease-cinema group-hover:translate-x-2">
                      <h3 className="truncate font-display text-2xl font-bold text-bone md:text-3xl">
                        {c.city}
                      </h3>
                      <p className="truncate font-mono text-xs uppercase tracking-[0.14em] text-smoke">
                        {c.venue} · {c.country}
                      </p>
                    </div>

                    {/* Status + action */}
                    <div className="flex items-center gap-5">
                      <span
                        className={`hidden font-mono text-[0.7rem] uppercase tracking-[0.18em] sm:block ${STATUS_STYLE[c.status]}`}
                      >
                        {c.status}
                      </span>
                      <span
                        className={`flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-500 ease-cinema ${
                          soldOut
                            ? "border-line text-smoke"
                            : "border-bone/25 text-bone group-hover:border-signal group-hover:bg-signal"
                        }`}
                        aria-hidden
                      >
                        →
                      </span>
                    </div>
                  </a>
                </motion.li>
              );
            })}

            <div className="mt-8">
              <MagneticButton
                href={ALL_TICKETS}
                target="_blank"
                variant="ghost"
              >
                Повний розклад
              </MagneticButton>
            </div>
          </ul>

          {/* Hover preview (desktop) */}
          <div className="relative hidden lg:block">
            <div className="sticky top-28 aspect-[4/5] overflow-hidden rounded-2xl ring-1 ring-line">
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={hovered}
                  initial={reduce ? false : { opacity: 0, scale: 1.08 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7, ease: EASE }}
                  className="absolute inset-0"
                >
                  <Image
                    src={PREVIEWS[hovered % PREVIEWS.length]}
                    alt=""
                    fill
                    sizes="40vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
                </motion.div>
              </AnimatePresence>
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6">
                <div>
                  <p className="font-mono text-[0.65rem] uppercase tracking-[0.24em] text-smoke">
                    {CONCERTS[hovered].country}
                  </p>
                  <p className="font-display text-3xl font-extrabold text-bone">
                    {CONCERTS[hovered].city}
                  </p>
                </div>
                <span className="vu" aria-hidden>
                  <i />
                  <i />
                  <i />
                  <i />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
