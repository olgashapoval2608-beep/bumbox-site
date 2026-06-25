"use client";

import { useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { LazyVideo } from "@/components/ui/LazyVideo";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { useSmoothScroll } from "@/components/providers/SmoothScroll";
import { BAND, ALL_TICKETS } from "@/lib/content";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const EASE = [0.16, 1, 0.3, 1] as const;

export function Hero({ started }: { started: boolean }) {
  const reduce = useReducedMotion();
  const { scrollTo } = useSmoothScroll();
  const section = useRef<HTMLElement>(null);
  const bg = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);

  // Cinematic departure: as the hero scrolls away it pushes deeper (video zooms
  // in) while the content lifts, fades and blurs — the next section emerges
  // from behind it rather than simply scrolling up.
  useGSAP(
    () => {
      if (reduce) return;
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.6,
        },
      });
      tl.to(bg.current, { scale: 1.28, ease: "none" }, 0).to(
        content.current,
        { yPercent: -14, opacity: 0, filter: "blur(10px)", ease: "none" },
        0,
      );
    },
    { scope: section, dependencies: [reduce] },
  );

  // Subtle pointer parallax on the wordmark layer.
  const onPointer = (e: React.PointerEvent) => {
    if (reduce || !content.current) return;
    const rx = (e.clientX / window.innerWidth - 0.5) * 14;
    const ry = (e.clientY / window.innerHeight - 0.5) * 10;
    content.current.style.setProperty("--px", `${rx}px`);
    content.current.style.setProperty("--py", `${ry}px`);
  };

  const letters = Array.from(BAND.name);

  return (
    <section
      ref={section}
      id="top"
      onPointerMove={onPointer}
      className="vignette relative h-svh min-h-[640px] w-full overflow-hidden"
    >
      {/* Background video layer */}
      <div ref={bg} className="absolute inset-0 will-change-transform">
        <LazyVideo
          src="/media/concert.mp4"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/35 to-ink/60" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-transparent to-transparent" />
      </div>

      {/* Foreground content */}
      <div
        ref={content}
        className="relative z-10 flex h-full flex-col justify-end pb-24 will-change-transform md:pb-28"
        style={{
          transform: "translate3d(var(--px,0),var(--py,0),0)",
        }}
      >
        <div className="shell w-full">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={started ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
            className="mb-5 flex items-center gap-3"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-signal motion-safe:animate-rec-pulse" />
            </span>
            <span className="kicker">
              {BAND.city} · {BAND.latin} · з {BAND.founded}
            </span>
          </motion.div>

          {/* Wordmark */}
          <h1 className="flex flex-wrap leading-[0.82]">
            <span className="sr-only">
              {BAND.name} — {BAND.tagline}
            </span>
            <span aria-hidden className="flex overflow-hidden">
              {letters.map((ch, i) => (
                <motion.span
                  key={i}
                  initial={{ y: "115%" }}
                  animate={started ? { y: 0 } : {}}
                  transition={{
                    duration: 0.95,
                    ease: EASE,
                    delay: 0.25 + i * 0.06,
                  }}
                  className="font-display text-[15vw] font-black tracking-tightest text-bone md:text-[13vw] xl:text-[12rem]"
                >
                  {ch}
                </motion.span>
              ))}
            </span>
          </h1>

          {/* Sub-line + CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={started ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: EASE, delay: 0.7 }}
            className="mt-6 flex flex-col gap-7 md:mt-8 md:flex-row md:items-end md:justify-between"
          >
            <p className="max-w-md text-pretty text-base text-bone-dim md:text-lg">
              {BAND.blurb}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <MagneticButton onClick={() => scrollTo("#music", 0)} variant="solid">
                Слухати
              </MagneticButton>
              <MagneticButton
                href={ALL_TICKETS}
                target="_blank"
                variant="primary"
              >
                Квитки на концерт
              </MagneticButton>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        onClick={() => scrollTo("#music", 0)}
        initial={{ opacity: 0 }}
        animate={started ? { opacity: 1 } : {}}
        transition={{ duration: 1, delay: 1.1 }}
        className="absolute bottom-7 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2"
        aria-label="Гортати далі"
      >
        <span className="font-mono text-[0.62rem] uppercase tracking-[0.3em] text-smoke">
          Гортай
        </span>
        <span className="relative h-10 w-px overflow-hidden bg-line">
          <motion.span
            className="absolute inset-x-0 top-0 h-1/2 bg-signal"
            animate={reduce ? {} : { y: ["-100%", "200%"] }}
            transition={{ duration: 1.8, ease: "easeInOut", repeat: Infinity }}
          />
        </span>
      </motion.button>
    </section>
  );
}
