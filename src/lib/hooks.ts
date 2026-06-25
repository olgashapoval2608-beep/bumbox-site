"use client";

import { useEffect, useState } from "react";

/** SSR-safe media-query hook. */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatches(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [query]);

  return matches;
}

export function usePrefersReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

/**
 * Tracks which section currently owns the centre band of the viewport, for
 * navigation highlighting. Uses a single observer band rather than scroll math.
 */
export function useActiveSection(ids: string[]): string {
  const [active, setActive] = useState(ids[0] ?? "");

  useEffect(() => {
    const ratios = new Map<string, number>();
    const observers: IntersectionObserver[] = [];

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const io = new IntersectionObserver(
        ([entry]) => {
          ratios.set(id, entry.isIntersecting ? entry.intersectionRatio : 0);
          let best = "";
          let bestRatio = 0;
          ratios.forEach((r, key) => {
            if (r > bestRatio) {
              bestRatio = r;
              best = key;
            }
          });
          if (best && bestRatio > 0) setActive(best);
        },
        {
          rootMargin: "-44% 0px -44% 0px",
          threshold: [0, 0.2, 0.5, 0.8, 1],
        },
      );
      io.observe(el);
      observers.push(io);
    });

    return () => observers.forEach((o) => o.disconnect());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids.join(",")]);

  return active;
}
