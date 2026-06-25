"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { LazyVideo } from "@/components/ui/LazyVideo";
import { Lightbox } from "@/components/ui/Lightbox";
import { GALLERY, GALLERY_FILTERS, type GalleryItem } from "@/lib/content";

const EASE = [0.16, 1, 0.3, 1] as const;

const RATIO: Record<GalleryItem["ratio"], string> = {
  portrait: "aspect-[3/4]",
  square: "aspect-square",
  wide: "aspect-[4/3]",
  cinema: "aspect-video",
  ultra: "aspect-[2/1]",
};

export function Gallery() {
  const reduce = useReducedMotion();
  const [filter, setFilter] =
    useState<(typeof GALLERY_FILTERS)[number]>("Всі");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const items =
    filter === "Всі" ? GALLERY : GALLERY.filter((g) => g.tag === filter);

  return (
    <section id="gallery" className="bg-ink py-24 md:py-36">
      <div className="shell">
        <SectionHeader
          kicker="Архів · фото та відео"
          title="Галерея"
          description="Сцена, гурт і архівні кадри. Натисни, щоб відкрити на повний екран."
        />

        {/* Filters */}
        <div className="mt-10 flex flex-wrap gap-2">
          {GALLERY_FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => {
                setFilter(f);
                setLightbox(null);
              }}
              className={`rounded-full border px-4 py-2 font-mono text-[0.7rem] uppercase tracking-[0.16em] transition-colors duration-300 ${
                filter === f
                  ? "border-signal bg-signal/10 text-bone"
                  : "border-line text-smoke hover:text-bone"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Masonry */}
        <AnimatePresence mode="wait">
          <motion.div
            key={filter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-10 columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4"
          >
            {items.map((item, i) => (
              <motion.button
                key={item.id}
                onClick={() => setLightbox(i)}
                initial={reduce ? false : { opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: EASE, delay: (i % 6) * 0.05 }}
                className={`group relative block w-full break-inside-avoid overflow-hidden rounded-xl ring-1 ring-line ${RATIO[item.ratio]}`}
                aria-label={`Відкрити: ${item.alt}`}
              >
                {item.type === "video" ? (
                  <LazyVideo
                    src={item.src}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-[800ms] ease-cinema group-hover:scale-[1.06]"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <span className="absolute left-3 top-3 rounded-full border border-bone/20 bg-ink/40 px-2.5 py-1 font-mono text-[0.55rem] uppercase tracking-[0.16em] text-bone-dim opacity-0 backdrop-blur transition-opacity duration-300 group-hover:opacity-100">
                  {item.tag}
                </span>
                {item.type === "video" && (
                  <span className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full border border-bone/30 bg-ink/50 text-bone backdrop-blur">
                    ▶
                  </span>
                )}
              </motion.button>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      <Lightbox
        items={items}
        index={lightbox}
        onClose={() => setLightbox(null)}
        onIndex={setLightbox}
      />
    </section>
  );
}
