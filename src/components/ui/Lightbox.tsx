"use client";

import { useCallback, useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useSmoothScroll } from "@/components/providers/SmoothScroll";
import type { GalleryItem } from "@/lib/content";

const EASE = [0.16, 1, 0.3, 1] as const;

type Props = {
  items: GalleryItem[];
  index: number | null;
  onClose: () => void;
  onIndex: (i: number) => void;
};

export function Lightbox({ items, index, onClose, onIndex }: Props) {
  const reduce = useReducedMotion();
  const { lenis } = useSmoothScroll();
  const open = index !== null;
  const item = open ? items[index] : null;

  const next = useCallback(() => {
    if (index === null) return;
    onIndex((index + 1) % items.length);
  }, [index, items.length, onIndex]);

  const prev = useCallback(() => {
    if (index === null) return;
    onIndex((index - 1 + items.length) % items.length);
  }, [index, items.length, onIndex]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    lenis?.stop();
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      lenis?.start();
      document.body.style.overflow = "";
    };
  }, [open, next, prev, onClose, lenis]);

  return (
    <AnimatePresence>
      {open && item && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/92 p-4 backdrop-blur-xl md:p-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Перегляд медіа"
        >
          {/* Controls */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-10 flex items-center gap-2 rounded-full border border-line bg-bone/[0.04] px-4 py-2 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-bone backdrop-blur transition-colors hover:border-signal"
          >
            Закрити ✕
          </button>

          <span className="absolute left-1/2 top-5 -translate-x-1/2 font-mono text-xs text-smoke">
            {(index ?? 0) + 1} / {items.length}
          </span>

          {items.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                aria-label="Попереднє"
                className="absolute left-3 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-bone/[0.04] text-bone backdrop-blur transition-colors hover:border-signal hover:bg-signal md:left-6"
              >
                ←
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                aria-label="Наступне"
                className="absolute right-3 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-bone/[0.04] text-bone backdrop-blur transition-colors hover:border-signal hover:bg-signal md:right-6"
              >
                →
              </button>
            </>
          )}

          {/* Media */}
          <motion.figure
            key={item.id}
            onClick={(e) => e.stopPropagation()}
            initial={reduce ? false : { scale: 0.92, opacity: 0, y: 24 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="relative flex max-h-[84vh] max-w-[94vw] flex-col items-center gap-3"
          >
            {item.type === "video" ? (
              // eslint-disable-next-line jsx-a11y/media-has-caption
              <video
                src={item.src}
                controls
                autoPlay
                playsInline
                className="max-h-[78vh] max-w-[94vw] rounded-lg"
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.src}
                alt={item.alt}
                className="max-h-[78vh] max-w-[94vw] rounded-lg object-contain"
              />
            )}
            <figcaption className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-smoke">
              {item.tag} · {item.alt}
            </figcaption>
          </motion.figure>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
