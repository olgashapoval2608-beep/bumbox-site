"use client";

import { useEffect, useRef, useState } from "react";

type LazyVideoProps = {
  src: string;
  poster?: string;
  className?: string;
  /** Decorative background videos autoplay muted; content videos can disable. */
  autoPlay?: boolean;
  loop?: boolean;
  controls?: boolean;
  /** Decorative videos are hidden from assistive tech. */
  decorative?: boolean;
};

/**
 * Defers the network request until the element is near the viewport, then
 * plays/pauses based on visibility. Keeps many heavy clips off the critical
 * path so Lighthouse stays green even with video throughout the page.
 */
export function LazyVideo({
  src,
  poster,
  className,
  autoPlay = true,
  loop = true,
  controls = false,
  decorative = true,
}: LazyVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLoad(true);
          if (autoPlay) el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { rootMargin: "200px 0px", threshold: 0.05 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [autoPlay]);

  // Kick playback the moment the source is attached.
  useEffect(() => {
    if (load && autoPlay) ref.current?.play().catch(() => {});
  }, [load, autoPlay]);

  return (
    <video
      ref={ref}
      className={className}
      src={load ? src : undefined}
      poster={poster}
      muted
      loop={loop}
      playsInline
      controls={controls}
      preload="none"
      aria-hidden={decorative}
      tabIndex={decorative ? -1 : 0}
    />
  );
}
