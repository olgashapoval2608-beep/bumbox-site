"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ALBUMS, STREAMING, type Album } from "@/lib/content";

const EASE = [0.16, 1, 0.3, 1] as const;

function AlbumCard({ album, index }: { album: Album; index: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.a
      href={album.listen}
      target="_blank"
      rel="noopener noreferrer"
      initial={reduce ? false : { opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.8, ease: EASE, delay: (index % 4) * 0.07 }}
      className="group block focus:outline-none"
      aria-label={`Слухати «${album.title}» (${album.year})`}
    >
      <div className="relative aspect-square overflow-hidden rounded-xl bg-ink-700 ring-1 ring-line transition-shadow duration-500 group-hover:shadow-[0_30px_70px_-30px_rgba(242,53,39,0.45)]">
        <Image
          src={album.cover}
          alt={`Обкладинка «${album.title}»`}
          fill
          sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 22vw"
          className="object-cover transition-transform duration-[900ms] ease-cinema group-hover:scale-[1.06]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        <span className="absolute left-3 top-3 rounded-full border border-bone/20 bg-ink/40 px-2.5 py-1 font-mono text-[0.58rem] uppercase tracking-[0.18em] text-bone-dim backdrop-blur">
          {album.kind}
        </span>

        <div className="absolute inset-x-0 bottom-0 flex translate-y-3 items-center justify-between p-4 opacity-0 transition-all duration-500 ease-cinema group-hover:translate-y-0 group-hover:opacity-100">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-bone">
            Слухати
          </span>
          <span className="vu" aria-hidden>
            <i />
            <i />
            <i />
            <i />
          </span>
        </div>
      </div>

      <div className="mt-3.5 flex items-baseline justify-between gap-3">
        <h3 className="font-display text-lg font-bold leading-tight text-bone transition-colors duration-300 group-hover:text-signal">
          {album.title}
        </h3>
        <span className="shrink-0 font-mono text-sm text-smoke">
          {album.year}
        </span>
      </div>
      <p className="mt-1 text-sm leading-snug text-bone-dim">{album.note}</p>
    </motion.a>
  );
}

export function Music() {
  return (
    <section id="music" className="relative bg-ink py-24 md:py-36">
      <div className="shell">
        <SectionHeader
          kicker="Дискографія · 2005 — 2021"
          title="Записано на одну плівку"
          description="Дев'ять релізів — від дебюту за 19 годин до концертного «Живого». Обирай платівку й слухай на улюбленому майданчику."
        />

        {/* Streaming row */}
        <div className="mt-10 flex flex-wrap items-center gap-3">
          <span className="font-mono text-[0.7rem] uppercase tracking-[0.22em] text-smoke">
            Слухати на
          </span>
          {STREAMING.map((p) => (
            <a
              key={p.label}
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-line px-4 py-2 font-mono text-xs uppercase tracking-[0.16em] text-bone-dim transition-colors duration-300 hover:border-signal hover:text-bone"
            >
              {p.label}
            </a>
          ))}
        </div>

        {/* Album grid */}
        <div className="mt-14 grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 md:gap-x-7 lg:grid-cols-4">
          {ALBUMS.map((album, i) => (
            <AlbumCard key={album.id} album={album} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
