"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { MEDIA, type MediaItem } from "@/lib/content";

const CATS = ["Всі", "Кліпи", "Live", "Інтерв'ю"] as const;

export function Media() {
  const [active, setActive] = useState<MediaItem>(MEDIA[0]);
  const [cat, setCat] = useState<(typeof CATS)[number]>("Всі");

  const list = cat === "Всі" ? MEDIA : MEDIA.filter((m) => m.category === cat);

  return (
    <section id="media" className="bg-ink-800 py-24 md:py-36">
      <div className="shell">
        <SectionHeader
          kicker="Медіа · відео"
          title="Дивитись Бумбокс"
          description="Кліпи, живі виступи та архівні кадри. Обери запис — і він зазвучить."
        />

        <div className="mt-14 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
          {/* Featured player */}
          <div>
            <div className="relative aspect-video overflow-hidden rounded-2xl bg-ink ring-1 ring-line">
              <AnimatePresence mode="wait">
                <motion.video
                  key={active.id}
                  src={active.src}
                  controls
                  autoPlay
                  muted
                  loop
                  playsInline
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="h-full w-full object-cover"
                />
              </AnimatePresence>
            </div>
            <div className="mt-4 flex items-end justify-between">
              <div>
                <p className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-signal">
                  {active.category} · {active.meta}
                </p>
                <h3 className="mt-1 font-display text-2xl font-bold text-bone md:text-3xl">
                  {active.title}
                </h3>
              </div>
              <span className="vu mb-1" aria-hidden>
                <i />
                <i />
                <i />
                <i />
              </span>
            </div>
          </div>

          {/* Playlist */}
          <div>
            <div className="flex flex-wrap gap-2">
              {CATS.map((c) => (
                <button
                  key={c}
                  onClick={() => setCat(c)}
                  className={`rounded-full border px-3.5 py-1.5 font-mono text-[0.66rem] uppercase tracking-[0.16em] transition-colors duration-300 ${
                    cat === c
                      ? "border-signal bg-signal/10 text-bone"
                      : "border-line text-smoke hover:text-bone"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            <ul className="mt-5 flex flex-col">
              {list.map((m, i) => {
                const on = active.id === m.id;
                return (
                  <li key={m.id} className="border-t border-line last:border-b">
                    <button
                      onClick={() => setActive(m)}
                      className="group flex w-full items-center gap-4 py-4 text-left"
                      aria-pressed={on}
                    >
                      <span
                        className={`font-mono text-xs ${on ? "text-signal" : "text-smoke"}`}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span
                          className={`block truncate font-display text-lg font-bold transition-colors ${
                            on ? "text-signal" : "text-bone group-hover:text-bone"
                          }`}
                        >
                          {m.title}
                        </span>
                        <span className="font-mono text-[0.66rem] uppercase tracking-[0.14em] text-smoke">
                          {m.category} · {m.meta}
                        </span>
                      </span>
                      {on ? (
                        <span className="vu" aria-hidden>
                          <i />
                          <i />
                          <i />
                          <i />
                        </span>
                      ) : (
                        <span className="text-smoke transition-colors group-hover:text-bone">
                          ▶
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Press & booking */}
        <div className="mt-16 flex flex-col items-start justify-between gap-6 rounded-2xl border border-line bg-ink/40 p-8 md:flex-row md:items-center md:p-10">
          <div>
            <p className="kicker mb-3">Для преси та букінгу</p>
            <h3 className="font-display text-3xl font-extrabold tracking-tightest text-bone md:text-4xl">
              Запросити Бумбокс
            </h3>
          </div>
          <MagneticButton
            href="mailto:booking@bumbox.band?subject=Booking%20%E2%80%94%20BUMBOX"
            variant="primary"
          >
            Прес-кіт і контакт
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
